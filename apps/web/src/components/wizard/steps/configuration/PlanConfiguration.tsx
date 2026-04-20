import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import type { Plan, Pricing, Selections } from "@/types";
import { useEstimate, useUpdateEstimate } from "@/hooks/useEstimate";
import { Button } from "@/components/ui/button";
import { checkRequiredFields } from "../helpers";
import { PlanOptions } from "./PlanOptions";
import { PlanAddons } from "./PlanAddons";
import { PlanPricing } from "./PlanPricing";
import { usePlans } from "@/hooks/usePlans";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanItem } from "../selection/PlanItem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { findCompatibleSelections, findLostSelections } from "./helpers";

interface ConfigurationStepProps {
  plan: Plan;
  selections: Selections;
  selectedAddons: string[];
  localPricingSnapshot: Pricing | null;
  onOptionChange: (code: string, value: string) => void;
  onAddonsChange: (addonIds: string[]) => void;
  onContinue: () => void;
  onPlanSwitch: (plan: Plan, compatibleSelections: Selections) => void;
  onPricingSnapshot: (pricing: Pricing | null) => void;
}

export const PlanConfigurationStep = ({
  plan,
  selections,
  selectedAddons,
  localPricingSnapshot,
  onOptionChange,
  onAddonsChange,
  onContinue,
  onPlanSwitch,
  onPricingSnapshot,
}: ConfigurationStepProps) => {
  const { data: estimate, isLoading: estimateLoading } = useEstimate();
  const updateEstimate = useUpdateEstimate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialSyncRef = useRef(false);

  const [switchDialogOpen, setSwitchDialogOpen] = useState<boolean>(false);

  const { data: allPlans, isLoading: plansLoading } = usePlans(
    plan.provider_id,
  );

  const otherPlans = useMemo(
    () => allPlans?.filter((p) => p.id !== plan.id) ?? [],
    [allPlans, plan.id],
  );

  // Build full selections object for API
  const buildApiSelections = useCallback(() => {
    const apiSelections: Record<string, string | string[]> = {
      addons: selectedAddons,
    };
    for (const [key, value] of Object.entries(selections)) {
      if (key !== "addons") {
        apiSelections[key] = value;
      }
    }
    return apiSelections;
  }, [selections, selectedAddons]);

  // Sync with API (debounced)
  const syncEstimate = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateEstimate.mutate({
        plan_id: plan.id,
        selections: {
          addons: selectedAddons,
          ...Object.fromEntries(
            Object.entries(selections).filter(([k]) => k !== "addons"),
          ),
        },
      });
    }, 300);
  }, [plan.id, selections, selectedAddons, updateEstimate]);

  // Initial sync when entering step 2
  useEffect(() => {
    if (!hasInitialSyncRef.current) {
      hasInitialSyncRef.current = true;
      updateEstimate.mutate({
        plan_id: plan.id,
        selections: {
          addons: selectedAddons,
          ...Object.fromEntries(
            Object.entries(selections).filter(([k]) => k !== "addons"),
          ),
        },
      });
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect price drift
  const estimatePricing = estimate?.pricing ?? null;
  const isPriceStale =
    localPricingSnapshot !== null &&
    estimatePricing !== null &&
    localPricingSnapshot.total !== estimatePricing.total;

  const handleOptionChange = (code: string, value: string) => {
    onOptionChange(code, value);
    if (estimatePricing && !isPriceStale) {
      onPricingSnapshot(estimatePricing);
    }
  };

  const handleAddonsChange = (addonIds: string[]) => {
    onAddonsChange(addonIds);
    if (estimatePricing && !isPriceStale) {
      onPricingSnapshot(estimatePricing);
    }
  };

  // Sync on selection changes
  const selectionsKey = JSON.stringify(buildApiSelections());
  const prevSelectionsRef = useRef(selectionsKey);

  useEffect(() => {
    if (
      prevSelectionsRef.current !== selectionsKey &&
      hasInitialSyncRef.current
    ) {
      prevSelectionsRef.current = selectionsKey;
      syncEstimate();
    }
  }, [selectionsKey, syncEstimate]);

  // Check all required options are filled
  const allRequiredFilled = checkRequiredFields(plan, selections);

  return (
    <div className="gap-8 flex-1 flex flex-col lg:flex-row">
      <div className="flex-1 space-y-6 w-full md:w-[600px] mx-auto">
        <h2 className="text-xl font-semibold">{plan.name}</h2>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSwitchDialogOpen(true)}
          >
            Switch Plan
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>

        <Dialog open={switchDialogOpen} onOpenChange={setSwitchDialogOpen}>
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
                  const currentSelections = {
                    ...selections,
                    addons: selectedAddons,
                  };
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
                          setSwitchDialogOpen(false);
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

        {plan.options.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center md:text-left">
              Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {plan.options.map((option) => (
                <PlanOptions
                  key={option.code}
                  option={option}
                  value={
                    typeof selections[option.code] === "string"
                      ? (selections[option.code] as string)
                      : undefined
                  }
                  onChange={handleOptionChange}
                />
              ))}
            </div>
          </div>
        )}

        <PlanAddons
          addons={plan.addons}
          selectedAddonIds={selectedAddons}
          onChange={handleAddonsChange}
        />

        <div className="flex justify-center lg:justify-end pt-4">
          <Button onClick={onContinue} disabled={!allRequiredFilled} size="lg">
            Continue to Review
          </Button>
        </div>
      </div>

      <div className="w-full md:w-[400px] lg:w-[320px] shrink-0 mx-auto">
        <PlanPricing
          pricing={estimatePricing}
          isLoading={estimateLoading || updateEstimate.isPending}
          isPriceStale={isPriceStale}
          stalePricing={localPricingSnapshot}
        />
      </div>
    </div>
  );
};
