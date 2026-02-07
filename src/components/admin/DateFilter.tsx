"use client";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

/**
 * Date range filter with start and end date inputs.
 */
export default function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="date-from" className="sr-only">
        From date
      </label>
      <input
        id="date-from"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        aria-label="Filter from date"
      />
      <span className="text-sm text-gray-500">to</span>
      <label htmlFor="date-to" className="sr-only">
        To date
      </label>
      <input
        id="date-to"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        aria-label="Filter to date"
      />
    </div>
  );
}
