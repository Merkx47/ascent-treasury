import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFxRates } from "@/hooks/use-fx-rates";

export function LiveFxRates() {
  const { rates } = useFxRates();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update date at midnight and on component mount
  useEffect(() => {
    const updateDate = () => setCurrentDate(new Date());

    // Calculate time until midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set timeout for midnight update
    const midnightTimeout = setTimeout(() => {
      updateDate();
      // After midnight, set interval for daily updates
      const dailyInterval = setInterval(updateDate, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []);

  return (
    <Card className="border-2 border-border">
      <CardHeader className="pb-3 border-b-2 border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Today's FX Rates
          </CardTitle>
          <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
            {currentDate.toLocaleDateString("en-NG", { day: "2-digit", month: "short" })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y-2 divide-border">
          {rates.map((rate) => {
            const spread = rate.sellRate - rate.buyRate;
            const spreadPercent = ((spread / rate.buyRate) * 100).toFixed(2);

            return (
              <div
                key={rate.currency}
                className="flex items-center justify-between px-4 py-3 transition-all duration-300 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {rate.currency}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{rate.currency}/NGN</p>
                    <p className="text-xs text-muted-foreground">
                      Spread: ₦{spread.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-base">
                    ₦{rate.buyRate.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 justify-end text-xs font-medium text-muted-foreground">
                    <span>Sell: ₦{rate.sellRate.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
