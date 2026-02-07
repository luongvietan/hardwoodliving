"use client";

interface ExportButtonProps {
  type: "inquiries" | "trades";
  status?: string;
}

export default function ExportButton({ type, status }: ExportButtonProps) {
  const params = new URLSearchParams({ type });
  if (status && status !== "all") {
    params.set("status", status);
  }

  const filename = `${type}-export.csv`;

  return (
    <a
      href={`/api/export?${params.toString()}`}
      download={filename}
      className="inline-flex items-center gap-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export CSV
    </a>
  );
}
