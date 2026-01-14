import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { transactionStatuses } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = transactionStatuses[status as keyof typeof transactionStatuses] || {
    label: status,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium text-xs px-2 py-0.5 border-0",
        statusConfig.color,
        className
      )}
    >
      {statusConfig.label}
    </Badge>
  );
}
