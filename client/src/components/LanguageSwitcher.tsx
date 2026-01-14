import { useState, createContext, useContext, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "EN" },
  { code: "ha", name: "Hausa", flag: "HA" },
  { code: "yo", name: "Yoruba", flag: "YO" },
  { code: "ig", name: "Igbo", flag: "IG" },
];

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    overview: "Overview",
    totalTransactions: "Total Transactions",
    pendingApprovals: "Pending Approvals",
    exceptions: "Exceptions",
    completedToday: "Completed Today",
    fxVolume: "FX Volume",
    feeRevenue: "Fee Revenue",
    transactionTrend: "Transaction Trend",
    budgetStatus: "Budget Status",
    liveFxRates: "Live FX Rates",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    lastUpdated: "Last updated",
    spent: "Spent",
    budget: "Budget",
    remaining: "Remaining",
  },
  ha: {
    dashboard: "Allon Kallo",
    overview: "Dubawa",
    totalTransactions: "Jimlar Kasuwanci",
    pendingApprovals: "Jiran Amincewa",
    exceptions: "Bambance-bambance",
    completedToday: "An Kammala Yau",
    fxVolume: "Girman Musayar Kudi",
    feeRevenue: "Kudin Shiga",
    transactionTrend: "Yanayin Kasuwanci",
    budgetStatus: "Matsayin Kasafin Kudi",
    liveFxRates: "Farashin Musayar Kudi",
    recentTransactions: "Kasuwancin Kwanan Nan",
    viewAll: "Duba Duka",
    lastUpdated: "An sabunta",
    spent: "An Kashe",
    budget: "Kasafin Kudi",
    remaining: "Sauran",
  },
  yo: {
    dashboard: "Igbimọ Akoso",
    overview: "Akopọ",
    totalTransactions: "Lapapọ Iṣowo",
    pendingApprovals: "Nduro Ifọwọsi",
    exceptions: "Iyato",
    completedToday: "Ti Pari Loni",
    fxVolume: "Iwọn Paarọ Owo",
    feeRevenue: "Ere Owo-ori",
    transactionTrend: "Asa Iṣowo",
    budgetStatus: "Ipo Isuna",
    liveFxRates: "Oṣuwọn Paarọ Laaye",
    recentTransactions: "Iṣowo Laipe",
    viewAll: "Wo Gbogbo",
    lastUpdated: "Ti ṣe imudojuiwọn",
    spent: "Lo",
    budget: "Isuna",
    remaining: "Ku",
  },
  ig: {
    dashboard: "Ogwe Njikwa",
    overview: "Nkọwa",
    totalTransactions: "Ngụkọta Azụmahịa",
    pendingApprovals: "Na-echere Nkwado",
    exceptions: "Ihe Dị Iche",
    completedToday: "Emechara Taa",
    fxVolume: "Oke Mgbanwe Ego",
    feeRevenue: "Ego Uru",
    transactionTrend: "Ụdị Azụmahịa",
    budgetStatus: "Ọnọdụ Mmefu",
    liveFxRates: "Ọnụego Mgbanwe",
    recentTransactions: "Azụmahịa Ọhụrụ",
    viewAll: "Lee Ihe Niile",
    lastUpdated: "Emelitere",
    spent: "Eji",
    budget: "Mmefu",
    remaining: "Fọdụrụ",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-2 border-border"
          data-testid="button-language-switcher"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{lang.name}</span>
            {language === lang.code && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
