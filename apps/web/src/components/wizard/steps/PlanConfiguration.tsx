import { useEffect, useRef, useCallback } from "react";
import type { Plan, Pricing, Selections } from "@/types";
import { useEstimate, useUpdateEstimate } from "@/hooks/useEstimate";
import { Button } from "@/components/ui/button";
import { PlanAddons, PlanOptions, PlanPricing } from "@/components/plan";
import { checkRequiredFields } from "./helpers";

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
  onPricingSnapshot,
}: ConfigurationStepProps) => {
  const { data: estimate, isLoading: estimateLoading } = useEstimate();
  const updateEstimate = useUpdateEstimate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialSyncRef = useRef(false);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect price drift
  const estimatePricing = estimate?.pricing ?? null;
  const isPriceStale =
    localPricingSnapshot !== null &&
    estimatePricing !== null &&
    localPricingSnapshot.total !== estimatePricing.total;

  // Update snapshot when pricing comes back
  useEffect(() => {
    if (estimatePricing && !localPricingSnapshot) {
      onPricingSnapshot(estimatePricing);
    }
  }, [estimatePricing, localPricingSnapshot, onPricingSnapshot]);

  const handleOptionChange = (code: string, value: string) => {
    onOptionChange(code, value);
    // Save current pricing as snapshot before syncing
    if (estimatePricing) {
      onPricingSnapshot(estimatePricing);
    }
    // Debounced sync will fire via the effect below
  };

  const handleAddonsChange = (addonIds: string[]) => {
    onAddonsChange(addonIds);
    if (estimatePricing) {
      onPricingSnapshot(estimatePricing);
    }
  };

  // Sync on selection changes (after initial)
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
        <p className="text-sm text-muted-foreground">{plan.description}</p>

        {plan.options.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Options</h3>
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
        )}

        <PlanAddons
          addons={plan.addons}
          selectedAddonIds={selectedAddons}
          onChange={handleAddonsChange}
        />

        <div className="flex justify-center lg:justify-end pt-4">
          <Button
            onClick={onContinue}
            disabled={!allRequiredFilled || updateEstimate.isPending}
            size="lg"
          >
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
