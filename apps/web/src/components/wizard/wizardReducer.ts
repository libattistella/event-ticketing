import type { WizardState, WizardStep, Selections } from "@/types";
import type { Plan, FinaliseResponse, Pricing } from "@/types";

export type WizardReducerAction =
  | { type: "SET_OPTION"; code: string; value: string }
  | { type: "SET_ADDONS"; addonIds: string[] }
  | { type: "SWITCH_PLAN"; plan: Plan; compatibleSelections: Selections }
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_PROVIDER"; providerId: string }
  | { type: "SELECT_PLAN"; plan: Plan }
  | { type: "SET_PRICING_SNAPSHOT"; pricing: Pricing | null }
  | { type: "SET_FINALISE_RESULT"; result: FinaliseResponse }
  | { type: "RESET" };

export const initialState: WizardState = {
  currentStep: 1,
  selectedProviderId: null,
  selectedPlanId: null,
  selectedPlan: null,
  selections: {},
  selectedAddons: [],
  localPricingSnapshot: null,
  finaliseResult: null,
};

export function wizardReducer(
  state: WizardState,
  action: WizardReducerAction,
): WizardState {
  switch (action.type) {
    case "SET_OPTION":
      return {
        ...state,
        selections: { ...state.selections, [action.code]: action.value },
      };
    case "SET_ADDONS":
      return { ...state, selectedAddons: action.addonIds };
    case "SWITCH_PLAN":
      return {
        ...state,
        selectedPlanId: action.plan.id,
        selectedPlan: action.plan,
        selections: action.compatibleSelections,
        selectedAddons: Array.isArray(action.compatibleSelections["addons"])
          ? (action.compatibleSelections["addons"] as string[])
          : [],
        localPricingSnapshot: null,
      };
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "SET_PROVIDER":
      return {
        ...state,
        selectedProviderId: action.providerId,
        selectedPlanId: null,
        selectedPlan: null,
        selections: {},
        selectedAddons: [],
        localPricingSnapshot: null,
      };
    case "SELECT_PLAN":
      return {
        ...state,
        selectedPlanId: action.plan.id,
        selectedPlan: action.plan,
        selections: {},
        selectedAddons: [],
        localPricingSnapshot: null,
      };
    case "SET_PRICING_SNAPSHOT":
      return { ...state, localPricingSnapshot: action.pricing };
    case "SET_FINALISE_RESULT":
      return { ...state, finaliseResult: action.result };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
