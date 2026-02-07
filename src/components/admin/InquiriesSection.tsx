"use client";

import { useState, useMemo } from "react";
import LeadsTable from "./LeadsTable";
import ExportButton from "./ExportButton";
import StatusFilter from "./StatusFilter";
import DateFilter from "./DateFilter";
import type { Database } from "@/lib/types/supabase";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

interface InquiriesSectionProps {
  inquiries: Inquiry[];
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
];

export default function InquiriesSection({
  inquiries,
}: InquiriesSectionProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    let result = inquiries;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((i) => new Date(i.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((i) => new Date(i.created_at) <= end);
    }

    return result;
  }, [inquiries, statusFilter, startDate, endDate]);

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Contact Inquiries
          </h2>
          <span className="text-sm text-gray-500">
            {filtered.length} of {inquiries.length} shown
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
          />
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <ExportButton type="inquiries" status={statusFilter} />
        </div>
      </div>
      <div className="mt-4">
        <LeadsTable inquiries={filtered} />
      </div>
    </section>
  );
}
