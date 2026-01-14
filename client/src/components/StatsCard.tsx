import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber, calculatePercentageChange } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  currentValue?: number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
}

export function StatsCard({
  title,
  value,
  previousValue,
  currentValue,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  trendValue,
  description,
}: StatsCardProps) {
  let calculatedTrend = trend;
  let calculatedTrendValue = trendValue;

  if (previousValue !== undefined && currentValue !== undefined) {
    const change = calculatePercentageChange(currentValue, previousValue);
    calculatedTrend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
    calculatedTrendValue = `${Math.abs(change).toFixed(1)}%`;
  }

  const TrendIcon = calculatedTrend === "up" ? TrendingUp : calculatedTrend === "down" ? TrendingDown : Minus;

  return (
    <Card className="border border-card-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold mt-2 text-foreground">
              {typeof value === "number" ? formatNumber(value) : value}
            </p>
            {(calculatedTrend || description) && (
              <div className="flex items-center gap-2 mt-2">
                {calculatedTrend && calculatedTrendValue && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      calculatedTrend === "up" && "text-green-600 dark:text-green-400",
                      calculatedTrend === "down" && "text-red-600 dark:text-red-400",
                      calculatedTrend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    <TrendIcon className="w-3 h-3" />
                    <span>{calculatedTrendValue}</span>
                  </div>
                )}
                {description && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg bg-accent", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
