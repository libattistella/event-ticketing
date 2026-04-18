import { useState } from "react";
import { ErrorBoundary } from "../utils";
import { PlanConfigurationStep, PlanSelectionStep } from "./steps";
import type { WizardStep, Plan } from "@/types";
import { useWizard } from "./useWizard";
import { getStepTitle } from "./helpers";

export const Wizard = () => {
  const {
    state,
    setStep,
    setProvider,
    selectPlan,
    setOption,
    setAddons,
    setPricingSnapshot,
    switchPlan
  } = useWizard();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleProviderSelect = (providerId: string) => {
    setProvider(providerId);
  };

  const handlePlanSelect = (plan: Plan) => {
    selectPlan(plan.id);
    setSelectedPlan(plan);
    setStep(2 as WizardStep);
  };

  const handlePlanSwitch = (
    plan: Plan,
    compatibleSelections: Record<string, string | string[]>,
  ) => {
    switchPlan(plan.id, compatibleSelections);
    setSelectedPlan(plan);
  };

  const handleConfigComplete = () => {
    setStep(3 as WizardStep);
  };

  const stepTitle = getStepTitle(state.currentStep);

  return (
    <div className="px-4 py-8 min-h-full">
      <h1
        className="text-3xl font-bold text-center mb-2 outline-none"
        tabIndex={-1}
      >
        Event Ticketing
      </h1>

      <h2 className="sr-only">{stepTitle}</h2>

      <ErrorBoundary key={state.currentStep}>
        {state.currentStep === 1 && (
          <PlanSelectionStep
            selectedProviderId={state.selectedProviderId}
            selectedPlanId={state.selectedPlanId}
            onProviderSelect={handleProviderSelect}
            onPlanSelect={handlePlanSelect}
          />
        )}
        {state.currentStep === 2 && state.selectedPlanId && selectedPlan && (
          <PlanConfigurationStep
            plan={selectedPlan}
            selections={state.selections}
            selectedAddons={state.selectedAddons}
            onOptionChange={setOption}
            onAddonsChange={setAddons}
            onContinue={handleConfigComplete}
            onPlanSwitch={handlePlanSwitch}
            localPricingSnapshot={state.localPricingSnapshot}
            onPricingSnapshot={setPricingSnapshot}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};
