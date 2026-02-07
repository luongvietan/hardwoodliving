import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/isAdmin";
import type { Database } from "@/lib/types/supabase";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
type Trade = Database["public"]["Tables"]["trades"]["Row"];

/** UTF-8 BOM for Excel compatibility with Unicode characters */
const UTF8_BOM = "\uFEFF";

/**
 * Convert an array of objects to CSV string.
 * Handles special characters, commas, and quotes in values.
 * Includes UTF-8 BOM for Excel Unicode support.
 */
function toCSV(headers: string[], rows: string[][]): string {
  const escapeField = (field: string): string => {
    if (
      field.includes(",") ||
      field.includes('"') ||
      field.includes("\n") ||
      field.includes("\r")
    ) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const headerLine = headers.map(escapeField).join(",");
  const dataLines = rows
    .map((row) => row.map(escapeField).join(","))
    .join("\n");

  return `${UTF8_BOM}${headerLine}\n${dataLines}`;
}

function inquiriesToCSV(inquiries: Inquiry[]): string {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Product Interest",
    "Room Type",
    "Area",
    "Budget",
    "Message",
    "Status",
    "Date",
  ];

  const rows = inquiries.map((i) => [
    i.name,
    i.email,
    i.phone || "",
    i.product_interest || "",
    i.room_type || "",
    i.area || "",
    i.budget || "",
    i.message || "",
    i.status,
    new Date(i.created_at).toISOString().split("T")[0],
  ]);

  return toCSV(headers, rows);
}

function tradesToCSV(trades: Trade[]): string {
  const headers = [
    "Name",
    "Company",
    "Email",
    "Phone",
    "Business Type",
    "Status",
    "Date",
  ];

  const rows = trades.map((t) => [
    t.name,
    t.company || "",
    t.email,
    t.phone || "",
    t.business_type,
    t.status,
    new Date(t.created_at).toISOString().split("T")[0],
  ]);

  return toCSV(headers, rows);
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin authorization
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  if (!type || !["inquiries", "trades"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Use ?type=inquiries or ?type=trades" },
      { status: 400 },
    );
  }

  try {
    let csv: string;
    let filename: string;

    if (type === "inquiries") {
      let query = supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;

      csv = inquiriesToCSV((data as Inquiry[]) || []);
      filename = `inquiries-export-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      let query = supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;

      csv = tradesToCSV((data as Trade[]) || []);
      filename = `trades-export-${new Date().toISOString().split("T")[0]}.csv`;
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[Export API] Failed to export data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 },
    );
  }
}
