import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  format?: "number" | "currency" | "percentage";
  currency?: string;
  description?: string;
  delay?: number;
}

export function AnimatedStatsCard({
  title,
  value,
  previousValue,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  format = "number",
  currency = "NGN",
  description,
  delay = 0,
}: AnimatedStatsCardProps) {
  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const formatValue = (val: number) => {
    if (format === "currency") {
      if (currency === "NGN") {
        if (val >= 1000000000) return `₦${(val / 1000000000).toFixed(1)}B`;
        if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
        return `₦${val.toLocaleString()}`;
      }
      if (currency === "USD") {
        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        return `$${val.toLocaleString()}`;
      }
    }
    if (format === "percentage") {
      return `${val.toFixed(1)}%`;
    }
    return val.toLocaleString();
  };

  return (
    <Card className="border-2 border-border hover:border-primary/30 transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {formatValue(value)}
              </span>
            </div>
            {previousValue !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded",
                    trend === "up" && "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
                    trend === "down" && "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
                    trend === "neutral" && "text-muted-foreground bg-muted"
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{trend === "up" ? "+" : ""}{change.toFixed(1)}%</span>
                </div>
                {description && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl transition-transform hover:scale-110", iconBgColor)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
