import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useFxRates } from "@/hooks/use-fx-rates";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Mail,
  Building2,
  Save,
  RefreshCw,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { rates, updateRate } = useFxRates();
  const [fxRateInputs, setFxRateInputs] = useState<Record<string, { buyRate: string; sellRate: string; cbnRate: string }>>({});

  const handleFxRateChange = (currency: string, field: "buyRate" | "sellRate" | "cbnRate", value: string) => {
    setFxRateInputs((prev) => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [field]: value,
      },
    }));
  };

  const saveFxRate = (currency: string) => {
    const inputs = fxRateInputs[currency];
    const currentRate = rates.find((r) => r.currency === currency);

    const buyRate = inputs?.buyRate ? parseFloat(inputs.buyRate) : currentRate?.buyRate || 0;
    const sellRate = inputs?.sellRate ? parseFloat(inputs.sellRate) : currentRate?.sellRate || 0;
    const cbnRate = inputs?.cbnRate ? parseFloat(inputs.cbnRate) : currentRate?.cbnRate || 0;

    if (buyRate > 0 && sellRate > 0) {
      updateRate(currency, buyRate, sellRate, cbnRate);
      toast({
        title: "FX Rate Updated",
        description: `${currency}/NGN rate has been updated successfully.`,
      });
      // Clear the input after saving
      setFxRateInputs((prev) => ({
        ...prev,
        [currency]: { buyRate: "", sellRate: "", cbnRate: "" },
      }));
    } else {
      toast({
        title: "Invalid Rate",
        description: "Please enter valid buy and sell rates.",
        variant: "destructive",
      });
    }
  };

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    transactionUpdates: true,
    complianceAlerts: true,
    marketRates: false,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "Africa/Lagos",
    dateFormat: "DD/MM/YYYY",
    currency: "NGN",
    theme: "system",
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    ipWhitelist: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your preferences and system settings
            </p>
          </div>
        </div>
        <Button onClick={handleSave} data-testid="button-save-settings">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="border-2 border-border">
          <TabsTrigger value="general" className="gap-2" data-testid="tab-general">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="fx-rates" className="gap-2" data-testid="tab-fx-rates">
            <DollarSign className="w-4 h-4" />
            FX Rates
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2" data-testid="tab-notifications">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2" data-testid="tab-security">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2" data-testid="tab-organization">
            <Building2 className="w-4 h-4" />
            Organization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Regional Settings
              </CardTitle>
              <CardDescription>Configure your language and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={preferences.language} onValueChange={(v) => setPreferences({ ...preferences, language: v })}>
                    <SelectTrigger className="border-2 border-border" data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                      <SelectItem value="yo">Yoruba</SelectItem>
                      <SelectItem value="ig">Igbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(v) => setPreferences({ ...preferences, timezone: v })}>
                    <SelectTrigger className="border-2 border-border" data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(v) => setPreferences({ ...preferences, dateFormat: v })}>
                    <SelectTrigger className="border-2 border-border" data-testid="select-date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={preferences.currency} onValueChange={(v) => setPreferences({ ...preferences, currency: v })}>
                    <SelectTrigger className="border-2 border-border" data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={preferences.theme} onValueChange={(v) => setPreferences({ ...preferences, theme: v })}>
                  <SelectTrigger className="w-64 border-2 border-border" data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fx-rates" className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Daily FX Rates Management
              </CardTitle>
              <CardDescription>
                Set today's foreign exchange rates. These rates will be used throughout the application for conversions and displays.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b-2 border-border">
                      <TableHead className="font-semibold border-r border-border">Currency</TableHead>
                      <TableHead className="font-semibold border-r border-border">Buy Rate (₦)</TableHead>
                      <TableHead className="font-semibold border-r border-border">Sell Rate (₦)</TableHead>
                      <TableHead className="font-semibold border-r border-border">CBN Rate (₦)</TableHead>
                      <TableHead className="font-semibold border-r border-border">Last Updated</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.map((rate) => (
                      <TableRow key={rate.currency} className="border-b border-border">
                        <TableCell className="font-medium border-r border-border">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{rate.currency}</span>
                            </div>
                            {rate.currency}/NGN
                          </div>
                        </TableCell>
                        <TableCell className="border-r border-border">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={rate.buyRate.toFixed(2)}
                            value={fxRateInputs[rate.currency]?.buyRate || ""}
                            onChange={(e) => handleFxRateChange(rate.currency, "buyRate", e.target.value)}
                            className="w-32 border-2"
                          />
                        </TableCell>
                        <TableCell className="border-r border-border">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={rate.sellRate.toFixed(2)}
                            value={fxRateInputs[rate.currency]?.sellRate || ""}
                            onChange={(e) => handleFxRateChange(rate.currency, "sellRate", e.target.value)}
                            className="w-32 border-2"
                          />
                        </TableCell>
                        <TableCell className="border-r border-border">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={rate.cbnRate.toFixed(2)}
                            value={fxRateInputs[rate.currency]?.cbnRate || ""}
                            onChange={(e) => handleFxRateChange(rate.currency, "cbnRate", e.target.value)}
                            className="w-32 border-2"
                          />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground border-r border-border">
                          {rate.lastUpdated.toLocaleString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => saveFxRate(rate.currency)}
                            disabled={
                              !fxRateInputs[rate.currency]?.buyRate &&
                              !fxRateInputs[rate.currency]?.sellRate &&
                              !fxRateInputs[rate.currency]?.cbnRate
                            }
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Enter new rates in the fields above and click Update to save. Leave fields empty to keep current rates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(v) => setNotifications({ ...notifications, emailAlerts: v })}
                    data-testid="switch-email-alerts"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(v) => setNotifications({ ...notifications, pushNotifications: v })}
                    data-testid="switch-push-notifications"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Transaction Updates</p>
                      <p className="text-sm text-muted-foreground">Updates on transaction status changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.transactionUpdates}
                    onCheckedChange={(v) => setNotifications({ ...notifications, transactionUpdates: v })}
                    data-testid="switch-transaction-updates"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Compliance Alerts</p>
                      <p className="text-sm text-muted-foreground">Critical compliance and regulatory alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.complianceAlerts}
                    onCheckedChange={(v) => setNotifications({ ...notifications, complianceAlerts: v })}
                    data-testid="switch-compliance-alerts"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(v) => setSecurity({ ...security, twoFactorAuth: v })}
                  data-testid="switch-2fa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity({ ...security, sessionTimeout: v })}>
                  <SelectTrigger className="w-64 border-2 border-border" data-testid="select-session-timeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                <div>
                  <p className="font-medium">IP Whitelist</p>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  checked={security.ipWhitelist}
                  onCheckedChange={(v) => setSecurity({ ...security, ipWhitelist: v })}
                  data-testid="switch-ip-whitelist"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Details
              </CardTitle>
              <CardDescription>Your organization's information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value="Union Bank of Nigeria Plc"
                    disabled
                    className="border-2 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rcNumber">RC Number</Label>
                  <Input
                    id="rcNumber"
                    value="RC 2457"
                    disabled
                    className="border-2 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Banking License</Label>
                  <Input
                    id="licenseNumber"
                    value="CBN/DMB/001"
                    disabled
                    className="border-2 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT Code</Label>
                  <Input
                    id="swiftCode"
                    value="ABORNGLA"
                    disabled
                    className="border-2 border-border"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="address">Head Office Address</Label>
                <Input
                  id="address"
                  value="36 Marina, Lagos Island, Lagos, Nigeria"
                  disabled
                  className="border-2 border-border"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
