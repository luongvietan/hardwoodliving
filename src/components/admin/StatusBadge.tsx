interface StatusBadgeProps {
  status: string;
  /** Map of status values to Tailwind color classes */
  colorMap?: Record<string, string>;
}

const DEFAULT_STYLE = "bg-gray-100 text-gray-800";

/**
 * Reusable status badge component with color-coded pill styling.
 * Supports custom color maps for different entity types.
 */
export default function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  const styles = colorMap?.[status] ?? DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}

/** Color map for inquiry statuses */
export const INQUIRY_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-green-100 text-green-800",
};

/** Color map for trade statuses */
export const TRADE_STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};
