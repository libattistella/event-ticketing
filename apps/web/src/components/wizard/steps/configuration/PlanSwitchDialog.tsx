import { useState, useMemo } from "react";
import type { Plan, Selections } from "@/types";
import { usePlans } from "@/hooks/usePlans";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PlanItem } from "../selection/PlanItem";
import { findCompatibleSelections, findLostSelections } from "./helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlanSwitchDialogProps {
  plan: Plan;
  selections: Selections;
  selectedAddons: string[];
  onPlanSwitch: (plan: Plan, compatibleSelections: Selections) => void;
}

export const PlanSwitchDialog = ({
  plan,
  selections,
  selectedAddons,
  onPlanSwitch,
}: PlanSwitchDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: allPlans, isLoading: plansLoading } = usePlans(plan.provider_id);

  const otherPlans = useMemo(
    () => allPlans?.filter((p) => p.id !== plan.id) ?? [],
    [allPlans, plan.id],
  );

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Switch Plan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Switch Plan</DialogTitle>
          </DialogHeader>

          {plansLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : otherPlans.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No other plans available for this provider.
            </p>
          ) : (
            <div
              className={`${otherPlans.length > 1 ? "grid gap-4 sm:grid-cols-2" : ""}`}
            >
              {otherPlans.map((p) => {
                const currentSelections = { ...selections, addons: selectedAddons };
                const lost = findLostSelections(currentSelections, p);
                return (
                  <div key={p.id} className="flex flex-col gap-2">
                    <PlanItem
                      plan={p}
                      isSelected={false}
                      onSelect={() => {
                        const compatible = findCompatibleSelections(
                          currentSelections,
                          p,
                        );
                        onPlanSwitch(p, compatible);
                        setOpen(false);
                      }}
                    />
                    {lost.length > 0 && (
                      <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {lost.length === 1
                            ? "1 of your current selections is not available in this plan and will be cleared."
                            : `${lost.length} of your current selections are not available in this plan and will be cleared.`}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
