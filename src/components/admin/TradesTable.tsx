"use client";

import { useState } from "react";
import StatusBadge, { TRADE_STATUS_COLORS } from "./StatusBadge";
import { formatDate } from "@/lib/utils/formatDate";
import type { Database } from "@/lib/types/supabase";

type Trade = Database["public"]["Tables"]["trades"]["Row"];

interface TradesTableProps {
  trades: Trade[];
}

export default function TradesTable({ trades }: TradesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (trades.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No trade registrations found.</p>
      </div>
    );
  }

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Business Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trades.map((trade) => (
              <tr key={trade.id} className="group">
                <td colSpan={6} className="p-0">
                  <button
                    type="button"
                    className="grid w-full grid-cols-6 text-left hover:bg-gray-50 focus:bg-amber-50 focus:outline-none"
                    onClick={() => toggleRow(trade.id)}
                    aria-expanded={expandedId === trade.id}
                    aria-label={`View details for ${trade.name}`}
                  >
                    <span className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {trade.name}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {trade.company || "—"}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {trade.email}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {trade.business_type}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm">
                      <StatusBadge
                        status={trade.status}
                        colorMap={TRADE_STATUS_COLORS}
                      />
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatDate(trade.created_at)}
                    </span>
                  </button>

                  {/* Expanded detail panel */}
                  {expandedId === trade.id && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Trade Registration Details
                      </h4>
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Full Name
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {trade.name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Company
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {trade.company || "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Business Type
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {trade.business_type}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Email
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {trade.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Phone
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {trade.phone || "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Registered
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {formatDate(trade.created_at)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
