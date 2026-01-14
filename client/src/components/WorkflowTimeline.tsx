import { cn } from "@/lib/utils";
import { Check, Clock, AlertCircle, Circle } from "lucide-react";

interface WorkflowStep {
  id: string;
  stepNumber: number;
  stepName: string;
  status: "completed" | "current" | "pending" | "error";
  assignedTo?: string;
  completedAt?: string;
  comments?: string;
}

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
  orientation?: "vertical" | "horizontal";
}

export function WorkflowTimeline({ steps, orientation = "vertical" }: WorkflowTimelineProps) {
  const getStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "current":
        return <Clock className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const getStatusStyles = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "current":
        return "bg-primary text-primary-foreground border-primary animate-pulse";
      case "error":
        return "bg-red-500 text-white border-red-500";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getLineStyles = (status: WorkflowStep["status"]) => {
    return status === "completed" ? "bg-green-500" : "bg-muted";
  };

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center w-full">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  getStatusStyles(step.status)
                )}
              >
                {getStatusIcon(step.status)}
              </div>
              <span className="text-xs mt-2 text-center max-w-[80px] text-muted-foreground">
                {step.stepName}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("h-0.5 flex-1 mx-2", getLineStyles(step.status))}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10",
                getStatusStyles(step.status)
              )}
            >
              {getStatusIcon(step.status)}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("w-0.5 flex-1 min-h-[40px]", getLineStyles(step.status))}
              />
            )}
          </div>
          <div className="flex-1 pb-6">
            <p className="font-medium text-sm">{step.stepName}</p>
            {step.assignedTo && (
              <p className="text-xs text-muted-foreground mt-1">
                Assigned to: {step.assignedTo}
              </p>
            )}
            {step.completedAt && (
              <p className="text-xs text-muted-foreground">
                Completed: {step.completedAt}
              </p>
            )}
            {step.comments && (
              <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                {step.comments}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
