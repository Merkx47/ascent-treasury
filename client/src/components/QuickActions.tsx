import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileCheck,
  Ship,
  CreditCard,
  Repeat,
  ArrowUpFromLine,
  Plus,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: "New Form M",
    description: "Create import documentation",
    href: "/form-m/new",
    icon: FileText,
    color: "bg-indigo-500",
  },
  {
    title: "New Form A",
    description: "Process invisible payment",
    href: "/form-a/new",
    icon: FileCheck,
    color: "bg-green-500",
  },
  {
    title: "New Import LC",
    description: "Issue letter of credit",
    href: "/import-lc/new",
    icon: Ship,
    color: "bg-cyan-500",
  },
  {
    title: "New BFC",
    description: "Lodge bills for collection",
    href: "/bfc/new",
    icon: CreditCard,
    color: "bg-blue-500",
  },
  {
    title: "FX Trade",
    description: "Execute FX transaction",
    href: "/fx-trading/new",
    icon: Repeat,
    color: "bg-pink-500",
  },
  {
    title: "Outward Payment",
    description: "Process domiciliary payment",
    href: "/outward-payments/new",
    icon: ArrowUpFromLine,
    color: "bg-rose-500",
  },
];

export function QuickActions() {
  return (
    <Card className="border border-card-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex-col items-start p-4 gap-2 hover-elevate"
                data-testid={`quick-action-${action.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
