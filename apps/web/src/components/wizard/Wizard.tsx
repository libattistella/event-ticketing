import { useRef } from "react";
import { ErrorBoundary } from "../utils";
import { PlanSelectionStep } from "./steps";
import type { WizardStep, Plan } from "@/types";
import { useWizard } from "./useWizard";
import { getStepTitle } from "./helpers";

export const Wizard = () => {
  const { state, setStep, setProvider, selectPlan } = useWizard();

  const selectedPlanRef = useRef<Plan | null>(null);

  const handleProviderSelect = (providerId: string) => {
    setProvider(providerId);
  };

  const handlePlanSelect = (plan: Plan) => {
    selectPlan(plan.id);
    selectedPlanRef.current = plan;
    setStep(2 as WizardStep);
  };

  const stepTitle = getStepTitle(state.currentStep);

  return (
    <div className="px-4 py-8">
      <h1
        className="text-3xl font-bold text-center mb-2 outline-none"
        tabIndex={-1}
      >
        Event Ticketing
      </h1>

      <h2 className="sr-only">{stepTitle}</h2>

      <ErrorBoundary key={state.currentStep}>
        <PlanSelectionStep
          selectedProviderId={state.selectedProviderId}
          selectedPlanId={state.selectedPlanId}
          onProviderSelect={handleProviderSelect}
          onPlanSelect={handlePlanSelect}
        />
      </ErrorBoundary>
    </div>
  );
};
