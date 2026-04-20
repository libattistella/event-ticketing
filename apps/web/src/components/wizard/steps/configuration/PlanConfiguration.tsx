import { useCallback } from "react";
import type { Plan, Pricing, Selections } from "@/types";
import { useEstimate } from "@/hooks/useEstimate";
import { Button } from "@/components/ui/button";
import { checkRequiredFields } from "../helpers";
import { PlanOptions } from "./PlanOptions";
import { PlanAddons } from "./PlanAddons";
import { PlanPricing } from "./PlanPricing";
import { PlanSwitchDialog } from "./PlanSwitchDialog";
import { useConfigurationSync } from "./useConfigurationSync";

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
  const { isPending: syncPending } = useConfigurationSync({
    planId: plan.id,
    selections,
    selectedAddons,
  });

  const estimatePricing = estimate?.pricing ?? null;
  const isPriceStale =
    localPricingSnapshot !== null &&
    estimatePricing !== null &&
    localPricingSnapshot.total !== estimatePricing.total;

  const handleOptionChange = useCallback(
    (code: string, value: string) => {
      onOptionChange(code, value);
      if (estimatePricing && !isPriceStale) {
        onPricingSnapshot(estimatePricing);
      }
    },
    [onOptionChange, estimatePricing, isPriceStale, onPricingSnapshot],
  );

  const handleAddonsChange = useCallback(
    (addonIds: string[]) => {
      onAddonsChange(addonIds);
      if (estimatePricing && !isPriceStale) {
        onPricingSnapshot(estimatePricing);
      }
    },
    [onAddonsChange, estimatePricing, isPriceStale, onPricingSnapshot],
  );

  const allRequiredFilled = checkRequiredFields(plan, selections);

  return (
    <div className="gap-8 flex-1 flex flex-col lg:flex-row">
      <div className="flex-1 space-y-6 w-full md:w-[600px] mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <PlanSwitchDialog
            plan={plan}
            selections={selections}
            selectedAddons={selectedAddons}
            onPlanSwitch={onPlanSwitch}
          />
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>

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
          isLoading={estimateLoading || syncPending}
          isPriceStale={isPriceStale}
          stalePricing={localPricingSnapshot}
        />
      </div>
    </div>
  );
};
