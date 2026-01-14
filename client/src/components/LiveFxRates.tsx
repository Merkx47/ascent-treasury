import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface FxRate {
  pair: string;
  bid: number;
  ask: number;
  change: number;
  lastUpdate: Date;
}

const baseFxRates: FxRate[] = [
  { pair: "USD/NGN", bid: 1580.50, ask: 1582.00, change: 0.25, lastUpdate: new Date() },
  { pair: "EUR/NGN", bid: 1720.30, ask: 1722.50, change: -0.15, lastUpdate: new Date() },
  { pair: "GBP/NGN", bid: 2010.75, ask: 2013.25, change: 0.42, lastUpdate: new Date() },
  { pair: "CNY/NGN", bid: 218.45, ask: 219.20, change: -0.08, lastUpdate: new Date() },
];

export function LiveFxRates() {
  const [rates, setRates] = useState<FxRate[]>(baseFxRates);
  const [flashingPair, setFlashingPair] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates((prevRates) => {
        const randomIndex = Math.floor(Math.random() * prevRates.length);
        const randomPair = prevRates[randomIndex];
        
        const fluctuation = (Math.random() - 0.5) * 2;
        const newBid = randomPair.bid + fluctuation;
        const newChange = ((newBid - baseFxRates[randomIndex].bid) / baseFxRates[randomIndex].bid) * 100;
        
        setFlashingPair(randomPair.pair);
        setTimeout(() => setFlashingPair(null), 500);
        
        return prevRates.map((rate, index) =>
          index === randomIndex
            ? {
                ...rate,
                bid: Math.round(newBid * 100) / 100,
                ask: Math.round((newBid + (rate.ask - rate.bid)) * 100) / 100,
                change: Math.round(newChange * 100) / 100,
                lastUpdate: new Date(),
              }
            : rate
        );
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-2 border-border">
      <CardHeader className="pb-3 border-b-2 border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            Live FX Rates
          </CardTitle>
          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y-2 divide-border">
          {rates.map((rate) => (
            <div
              key={rate.pair}
              className={cn(
                "flex items-center justify-between px-4 py-3 transition-all duration-300",
                flashingPair === rate.pair && "bg-primary/10 scale-[1.01]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {rate.pair.split("/")[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{rate.pair}</p>
                  <p className="text-xs text-muted-foreground">
                    Spread: {(rate.ask - rate.bid).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-mono font-bold text-base transition-all duration-300",
                  flashingPair === rate.pair && "text-primary"
                )}>
                  ₦{rate.bid.toLocaleString()}
                </p>
                <div className={cn(
                  "flex items-center gap-1 justify-end text-xs font-medium",
                  rate.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {rate.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{rate.change >= 0 ? "+" : ""}{rate.change.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
