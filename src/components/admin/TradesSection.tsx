"use client";

import { useState, useMemo } from "react";
import TradesTable from "./TradesTable";
import ExportButton from "./ExportButton";
import StatusFilter from "./StatusFilter";
import DateFilter from "./DateFilter";
import type { Database } from "@/lib/types/supabase";

type Trade = Database["public"]["Tables"]["trades"]["Row"];

interface TradesSectionProps {
  trades: Trade[];
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function TradesSection({ trades }: TradesSectionProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    let result = trades;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((t) => new Date(t.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((t) => new Date(t.created_at) <= end);
    }

    return result;
  }, [trades, statusFilter, startDate, endDate]);

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Trade Registrations
          </h2>
          <span className="text-sm text-gray-500">
            {filtered.length} of {trades.length} shown
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
          <ExportButton type="trades" status={statusFilter} />
        </div>
      </div>
      <div className="mt-4">
        <TradesTable trades={filtered} />
      </div>
    </section>
  );
}
