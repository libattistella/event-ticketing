import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCents } from "@/lib/utils";
import { Users, Clock, ShieldCheck } from "lucide-react";
import type { Plan } from "@/types";

interface PlanItemProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

export const PlanItem = ({ plan, isSelected, onSelect }: PlanItemProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {plan.approval_type === "manager_review" && (
            <Badge variant="secondary">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Approval Required
            </Badge>
          )}
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-2xl font-bold">
          {formatCents(plan.base_price_cents, plan.currency)}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            base
          </span>
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Min {plan.min_participants} participants
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {plan.lead_time_days} days lead time
          </span>
        </div>
        {plan.options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {plan.options.map((opt) => (
              <Badge key={opt.code} variant="secondary" className="text-xs">
                {opt.code.replace(/_/g, " ")}
                {opt.required && " *"}
              </Badge>
            ))}
          </div>
        )}
        {plan.addons.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {plan.addons.length} add-on{plan.addons.length > 1 ? "s" : ""}{" "}
            available
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t-primary/20">
        <Button
          onClick={onSelect}
          variant={isSelected ? "default" : "outline"}
          className="w-full"
        >
          {isSelected ? "Selected" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
};
