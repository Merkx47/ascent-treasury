import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  BarChart3,
  FileText,
  ArrowRight,
} from "lucide-react";
import unionBankLogo from "@assets/image_1768418399016.png";

const quickAccessItems = [
  { icon: FileText, label: "Trade Finance", description: "Form M, LC, BFC" },
  { icon: BarChart3, label: "Analytics", description: "Reports & Insights" },
  { icon: Shield, label: "Compliance", description: "Screening & Audit" },
];

const features = [
  "CBN-compliant trade processing",
  "Real-time FX trading execution",
  "Automated sanctions screening",
  "SWIFT message integration",
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    login();
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 bg-background animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-primary rounded-xl p-3">
              <img
                src={unionBankLogo}
                alt="Union Bank"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">ASCENT TRADE</h1>
              <p className="text-xs text-primary font-semibold tracking-wider">Trade Finance Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to access your trade finance dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@unionbank.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 border-border focus:border-primary transition-colors"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-2 border-border focus:border-primary transition-colors"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
              data-testid="button-sign-in"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign in to Dashboard
                </>
              )}
            </Button>
          </form>

          <div className="mt-10">
            <p className="text-xs text-muted-foreground mb-4 uppercase font-medium tracking-wider">Quick Access</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAccessItems.map((item) => (
                <Card 
                  key={item.label}
                  className="border-2 border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary transition-colors">
                      <item.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Authorized personnel access only
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary to-cyan-600 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="relative mb-12">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-2xl rotate-12" />
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Enterprise Platform</h3>
                  <p className="text-white/70 text-sm">Trade finance excellence</p>
                </div>
              </div>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                Comprehensive trade finance management with CBN compliance, real-time processing, and intelligent analytics.
              </p>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-sm text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="secondary" className="mt-6 w-full font-semibold" data-testid="button-learn-more">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 justify-center">
            <span className="w-8 h-1 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Union Bank of Nigeria Plc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
