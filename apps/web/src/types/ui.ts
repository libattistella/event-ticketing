import type { Pricing, Plan, FinaliseResponse } from "./core";

export interface Selections {
  [key: string]: string | string[];
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardState {
  currentStep: WizardStep;
  selectedProviderId: string | null;
  selectedPlanId: string | null;
  selectedPlan: Plan | null;
  selections: Selections;
  selectedAddons: string[];
  localPricingSnapshot: Pricing | null;
  finaliseResult: FinaliseResponse | null;
}