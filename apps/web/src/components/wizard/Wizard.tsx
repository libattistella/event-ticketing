import { ErrorBoundary } from "../utils";
import {
  PlanConfigurationStep,
  PlanReviewStep,
  PlanSelectionStep,
  SelectionStatusStep,
} from "./steps";
import { useWizard } from "./useWizard";
import { getStepTitle } from "./helpers";
import { StepIndicator } from "./StepIndicator";

export const Wizard = () => {
  const {
    state,
    setProvider,
    selectPlan,
    setOption,
    setAddons,
    setPricingSnapshot,
    switchPlan,
    goToReview,
    goToConfig,
    finaliseSuccess,
    reset,
  } = useWizard();

  const stepTitle = getStepTitle(state.currentStep);

  return (
    <div className="px-4 py-8 min-h-full">
      <h1
        className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8 outline-none"
        tabIndex={-1}
      >
        Event Ticketing
      </h1>
      <StepIndicator currentStep={state.currentStep} />
      <h2 className="sr-only">{stepTitle}</h2>
      <ErrorBoundary key={state.currentStep}>
        {state.currentStep === 1 && (
          <PlanSelectionStep
            selectedProviderId={state.selectedProviderId}
            selectedPlanId={state.selectedPlanId}
            onProviderSelect={setProvider}
            onPlanSelect={selectPlan}
          />
        )}
        {state.currentStep === 2 && state.selectedPlanId && state.selectedPlan && (
          <PlanConfigurationStep
            plan={state.selectedPlan}
            selections={state.selections}
            selectedAddons={state.selectedAddons}
            onOptionChange={setOption}
            onAddonsChange={setAddons}
            onContinue={goToReview}
            onPlanSwitch={switchPlan}
            localPricingSnapshot={state.localPricingSnapshot}
            onPricingSnapshot={setPricingSnapshot}
          />
        )}
        {state.currentStep === 3 && state.selectedPlanId && state.selectedPlan && (
          <PlanReviewStep
            planId={state.selectedPlanId}
            plan={state.selectedPlan}
            selections={state.selections}
            selectedAddons={state.selectedAddons}
            onEdit={goToConfig}
            onSubmitSuccess={finaliseSuccess}
          />
        )}
        {state.currentStep === 4 && state.finaliseResult && (
          <SelectionStatusStep
            result={state.finaliseResult}
            onStartOver={reset}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

