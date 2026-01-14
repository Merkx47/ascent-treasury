import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatRelativeTime } from "@/lib/utils";
import { mockNotifications } from "@/lib/mockData";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Check,
  MailOpen,
} from "lucide-react";

const notificationIcons: Record<string, typeof Bell> = {
  approval_required: Clock,
  transaction_completed: CheckCircle2,
  compliance_alert: Shield,
  exception: AlertCircle,
  reminder: Bell,
};

const notificationColors: Record<string, string> = {
  approval_required: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  transaction_completed: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  compliance_alert: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  exception: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  reminder: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const renderNotification = (notification: typeof mockNotifications[0]) => {
    const Icon = notificationIcons[notification.type] || Bell;
    const colorClass = notificationColors[notification.type] || "bg-gray-100 text-gray-600";

    return (
      <div
        key={notification.id}
        className={`flex items-start gap-4 p-4 border-b last:border-b-0 transition-colors ${
          !notification.isRead ? "bg-accent/30" : ""
        }`}
        data-testid={`notification-${notification.id}`}
      >
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{notification.title}</p>
            {!notification.isRead && (
              <Badge variant="default" className="text-xs px-1.5 py-0">
                New
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAsRead(notification.id)}
            data-testid={`button-mark-read-${notification.id}`}
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
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
            <BreadcrumbPage>Notifications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadNotifications.length} unread notifications
            </p>
          </div>
        </div>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead} data-testid="button-mark-all-read">
            <MailOpen className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Card className="border border-card-border">
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" data-testid="tab-unread">
                  Unread ({unreadNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="read" data-testid="tab-read">
                  Read ({readNotifications.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="mt-0">
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(renderNotification)
              )}
            </TabsContent>
            <TabsContent value="unread" className="mt-0">
              {unreadNotifications.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No unread notifications
                </div>
              ) : (
                unreadNotifications.map(renderNotification)
              )}
            </TabsContent>
            <TabsContent value="read" className="mt-0">
              {readNotifications.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No read notifications
                </div>
              ) : (
                readNotifications.map(renderNotification)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
