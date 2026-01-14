import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  Send,
  type LucideIcon,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "created" | "approved" | "rejected" | "updated" | "submitted" | "transferred";
  title: string;
  description: string;
  user: string;
  timestamp: string;
  reference?: string;
  link?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const activityIcons: Record<ActivityItem["type"], LucideIcon> = {
  created: FileText,
  approved: CheckCircle2,
  rejected: AlertCircle,
  updated: Clock,
  submitted: Send,
  transferred: ArrowRightLeft,
};

const activityColors: Record<ActivityItem["type"], string> = {
  created: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  updated: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  submitted: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  transferred: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card className="border border-card-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Link href="/notifications">
            <Badge variant="secondary" className="cursor-pointer">
              View All
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {displayedActivities.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No recent activity
              </div>
            ) : (
              displayedActivities.map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${activityColors[activity.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        {activity.reference && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {activity.reference}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-[10px] bg-muted">
                            {getInitials(activity.user)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {activity.user}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
