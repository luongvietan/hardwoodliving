"use client";

interface StatusFilterProps {
  value: string;
  onChange: (status: string) => void;
  options: { value: string; label: string }[];
}

export default function StatusFilter({
  value,
  onChange,
  options,
}: StatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      aria-label="Filter by status"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
