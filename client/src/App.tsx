import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import FormM from "@/pages/FormM";
import FxTrading from "@/pages/FxTrading";
import ProductPage from "@/pages/ProductPage";
import Notifications from "@/pages/Notifications";
import Customers from "@/pages/Customers";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

function AppLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-y-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { isAuthenticated, login } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated) {
    if (location === "/") {
      return <Landing />;
    }
    login();
    return <Landing />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/form-m" component={FormM} />
        <Route path="/form-a">
          <ProductPage productCode="FORMA" />
        </Route>
        <Route path="/form-nxp">
          <ProductPage productCode="FORMNXP" />
        </Route>
        <Route path="/paar">
          <ProductPage productCode="PAAR" />
        </Route>
        <Route path="/import-lc">
          <ProductPage productCode="IMPORTLC" />
        </Route>
        <Route path="/bfc">
          <ProductPage productCode="BFC" />
        </Route>
        <Route path="/shipping-docs">
          <ProductPage productCode="SHIPPINGDOC" />
        </Route>
        <Route path="/fx-trading" component={FxTrading} />
        <Route path="/trade-loans">
          <ProductPage productCode="LOAN" />
        </Route>
        <Route path="/inward-payments">
          <ProductPage productCode="INWCP" />
        </Route>
        <Route path="/outward-payments">
          <ProductPage productCode="DOMOUTAC" />
        </Route>
        <Route path="/customers" component={Customers} />
        <Route path="/reports" component={Reports} />
        <Route path="/compliance">
          <div className="p-6">
            <h1 className="text-2xl font-semibold">Compliance</h1>
            <p className="text-muted-foreground mt-2">Compliance module coming soon</p>
          </div>
        </Route>
        <Route path="/settings">
          <div className="p-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground mt-2">Settings module coming soon</p>
          </div>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ascent-trade-theme">
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
