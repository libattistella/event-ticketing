import type { Pricing } from "./core";

export interface Selections {
  [key: string]: string | string[];
}

export type WizardStep = 1 | 2 | 3 | 4;

export type WizardAction =
  | { type: "SET_OPTION"; code: string; value: string }
  | { type: "SET_ADDONS"; addonIds: string[] }
  | { type: "SWITCH_PLAN"; newPlanId: string; compatibleSelections: Selections }
  | { type: "RESET" };

export interface WizardState {
  currentStep: WizardStep;
  selectedProviderId: string | null;
  selectedPlanId: string | null;
  selections: Selections;
  selectedAddons: string[];
  localPricingSnapshot: Pricing | null;
}