import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Shield,
  Zap,
  Globe,
  BarChart3,
  FileText,
  Lock,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Straight-Through Processing",
    description:
      "Automate end-to-end trade workflows with intelligent routing and exception handling.",
    color: "bg-yellow-500",
  },
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description:
      "Built-in CBN validation, OFAC screening, and sanctions checking for every transaction.",
    color: "bg-green-500",
  },
  {
    icon: Globe,
    title: "SWIFT Integration",
    description:
      "Seamless MT-4xx and MT-7xx message generation with real-time transmission status.",
    color: "bg-blue-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Comprehensive dashboards and reports for transaction monitoring and performance insights.",
    color: "bg-purple-500",
  },
  {
    icon: FileText,
    title: "Document Management",
    description:
      "OCR-powered document processing with secure storage and version control.",
    color: "bg-orange-500",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Bank-grade security with role-based access, audit trails, and data encryption.",
    color: "bg-cyan-500",
  },
];

const products = [
  "Form M Processing",
  "Form A Processing",
  "Import Letter of Credit",
  "Bills for Collection",
  "Form NXP",
  "PAAR Processing",
  "FX Trading",
  "Trade Loans",
  "Inward Payments",
  "Outward Payments",
  "Shipping Documents",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <img
                src="/union-bank-logo.png"
                alt="Union Bank"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">Ascent Trade</span>
              <span className="text-xs text-muted-foreground -mt-1">Union Bank</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Products
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Enterprise Trade
                    <span className="text-primary block">Finance Platform</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                    Streamline your trade operations with Union Bank's integrated solution
                    for Letters of Credit, Form M/A processing, FX trading, and regulatory
                    compliance.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-base" data-testid="button-get-started">
                    <a href="/api/login">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base" data-testid="button-learn-more">
                    Learn More
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>CBN Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>SWIFT Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Bank-Grade Security</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl p-8 border border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
                  <div className="relative space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-card/80 backdrop-blur">
                        <CardContent className="p-4">
                          <p className="text-3xl font-bold text-primary">11</p>
                          <p className="text-sm text-muted-foreground">Trade Products</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/80 backdrop-blur">
                        <CardContent className="p-4">
                          <p className="text-3xl font-bold text-primary">99.9%</p>
                          <p className="text-sm text-muted-foreground">Uptime SLA</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/80 backdrop-blur">
                        <CardContent className="p-4">
                          <p className="text-3xl font-bold text-primary">STP</p>
                          <p className="text-sm text-muted-foreground">Processing</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/80 backdrop-blur">
                        <CardContent className="p-4">
                          <p className="text-3xl font-bold text-primary">24/7</p>
                          <p className="text-sm text-muted-foreground">Support</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex items-center justify-center">
                      <img
                        src="/union-bank-logo.png"
                        alt="Union Bank"
                        className="w-32 h-32 object-contain opacity-80"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                World-Class Trade Finance Capabilities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for enterprise-scale operations with the reliability and compliance
                standards that Nigerian businesses demand.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border border-card-border hover-elevate transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive Trade Product Suite
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete coverage for all your trade finance needs with integrated workflows
                and regulatory compliance.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card key={product} className="border border-card-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{product}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Trade Operations?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join Nigeria's leading enterprises using Ascent Trade to streamline their
              international trade operations.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-base"
              data-testid="button-cta-get-started"
            >
              <a href="/api/login">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer id="about" className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <img
                  src="/union-bank-logo.png"
                  alt="Union Bank"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <p className="font-semibold">Ascent Trade</p>
                <p className="text-xs text-muted-foreground">
                  Powered by Union Bank of Nigeria
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Union Bank of Nigeria Plc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
