"use client";

import { useState } from "react";
import StatusBadge, { INQUIRY_STATUS_COLORS } from "./StatusBadge";
import { formatDate } from "@/lib/utils/formatDate";
import type { Database } from "@/lib/types/supabase";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

interface LeadsTableProps {
  inquiries: Inquiry[];
}

export default function LeadsTable({ inquiries }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No inquiries found.</p>
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
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Product Interest
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
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="group">
                <td colSpan={6} className="p-0">
                  <button
                    type="button"
                    className="grid w-full grid-cols-6 text-left hover:bg-gray-50 focus:bg-amber-50 focus:outline-none"
                    onClick={() => toggleRow(inquiry.id)}
                    aria-expanded={expandedId === inquiry.id}
                    aria-label={`View details for ${inquiry.name}`}
                  >
                    <span className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {inquiry.name}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {inquiry.email}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {inquiry.phone || "—"}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {inquiry.product_interest || "—"}
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm">
                      <StatusBadge
                        status={inquiry.status}
                        colorMap={INQUIRY_STATUS_COLORS}
                      />
                    </span>
                    <span className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatDate(inquiry.created_at)}
                    </span>
                  </button>

                  {/* Expanded detail panel */}
                  {expandedId === inquiry.id && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Inquiry Details
                      </h4>
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Room Type
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {inquiry.room_type || "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Area
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {inquiry.area || "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Budget
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {inquiry.budget || "—"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <dt className="text-xs font-medium text-gray-500">
                            Message
                          </dt>
                          <dd className="whitespace-pre-wrap text-sm text-gray-900">
                            {inquiry.message || "—"}
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
