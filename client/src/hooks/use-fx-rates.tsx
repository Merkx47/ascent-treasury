import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FxRate {
  currency: string;
  buyRate: number;
  sellRate: number;
  cbnRate: number;
  lastUpdated: Date;
}

interface FxRatesContextType {
  rates: FxRate[];
  updateRate: (currency: string, buyRate: number, sellRate: number, cbnRate: number) => void;
  getRate: (currency: string) => FxRate | undefined;
  lastUpdatedDate: Date | null;
  isLoading: boolean;
}

const defaultRates: FxRate[] = [
  { currency: "USD", buyRate: 1580.50, sellRate: 1582.00, cbnRate: 1550.00, lastUpdated: new Date() },
  { currency: "EUR", buyRate: 1720.30, sellRate: 1722.50, cbnRate: 1690.00, lastUpdated: new Date() },
  { currency: "GBP", buyRate: 2010.75, sellRate: 2013.25, cbnRate: 1980.00, lastUpdated: new Date() },
  { currency: "CNY", buyRate: 218.45, sellRate: 219.20, cbnRate: 215.00, lastUpdated: new Date() },
];

const FxRatesContext = createContext<FxRatesContextType | null>(null);

const FX_RATES_STORAGE_KEY = "ascent_trade_fx_rates";

export function FxRatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<FxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load rates from localStorage on mount
    const storedRates = localStorage.getItem(FX_RATES_STORAGE_KEY);
    if (storedRates) {
      try {
        const parsed = JSON.parse(storedRates);
        // Convert stored dates back to Date objects
        const ratesWithDates = parsed.map((rate: FxRate) => ({
          ...rate,
          lastUpdated: new Date(rate.lastUpdated),
        }));
        setRates(ratesWithDates);
      } catch {
        setRates(defaultRates);
      }
    } else {
      setRates(defaultRates);
    }
    setIsLoading(false);
  }, []);

  // Save rates to localStorage whenever they change
  useEffect(() => {
    if (rates.length > 0 && !isLoading) {
      localStorage.setItem(FX_RATES_STORAGE_KEY, JSON.stringify(rates));
    }
  }, [rates, isLoading]);

  const updateRate = (currency: string, buyRate: number, sellRate: number, cbnRate: number) => {
    setRates((prevRates) => {
      const existingIndex = prevRates.findIndex((r) => r.currency === currency);
      const newRate: FxRate = {
        currency,
        buyRate,
        sellRate,
        cbnRate,
        lastUpdated: new Date(),
      };

      if (existingIndex >= 0) {
        const updated = [...prevRates];
        updated[existingIndex] = newRate;
        return updated;
      }
      return [...prevRates, newRate];
    });
  };

  const getRate = (currency: string) => {
    return rates.find((r) => r.currency === currency);
  };

  const lastUpdatedDate = rates.length > 0
    ? new Date(Math.max(...rates.map(r => r.lastUpdated.getTime())))
    : null;

  return (
    <FxRatesContext.Provider value={{ rates, updateRate, getRate, lastUpdatedDate, isLoading }}>
      {children}
    </FxRatesContext.Provider>
  );
}

export function useFxRates() {
  const context = useContext(FxRatesContext);
  if (!context) {
    throw new Error("useFxRates must be used within a FxRatesProvider");
  }
  return context;
}
