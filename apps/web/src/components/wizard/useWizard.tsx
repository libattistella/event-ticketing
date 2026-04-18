import { useReducer, useCallback } from "react";
import type { WizardState, WizardStep } from "@/types";

type InternalAction =
  | { type: "SET_OPTION"; code: string; value: string }
  | { type: "SET_ADDONS"; addonIds: string[] }
  | {
      type: "SWITCH_PLAN";
      newPlanId: string;
      compatibleSelections: Record<string, string | string[]>;
    }
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_PROVIDER"; providerId: string }
  | { type: "SELECT_PLAN"; planId: string }
  | {
      type: "SET_PRICING_SNAPSHOT";
      pricing: WizardState["localPricingSnapshot"];
    }
  | { type: "RESET" };

const initialState: WizardState = {
  currentStep: 1,
  selectedProviderId: null,
  selectedPlanId: null,
  selections: {},
  selectedAddons: [],
  localPricingSnapshot: null,
};

function wizardStateReducer(
  state: WizardState,
  action: InternalAction,
): WizardState {
  switch (action.type) {
    case "SET_OPTION":
      return {
        ...state,
        selections: {
          ...state.selections,
          [action.code]: action.value,
        },
      };
    case "SET_ADDONS":
      return {
        ...state,
        selectedAddons: action.addonIds,
      };
    case "SWITCH_PLAN":
      return {
        ...state,
        selectedPlanId: action.newPlanId,
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
        selections: {},
        selectedAddons: [],
        localPricingSnapshot: null,
      };
    case "SELECT_PLAN":
      return {
        ...state,
        selectedPlanId: action.planId,
        selections: {},
        selectedAddons: [],
        localPricingSnapshot: null,
      };
    case "SET_PRICING_SNAPSHOT":
      return { ...state, localPricingSnapshot: action.pricing };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useWizard() {
  const [state, dispatch] = useReducer(wizardStateReducer, initialState);

  const setStep = useCallback((step: WizardStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const setProvider = useCallback((providerId: string) => {
    dispatch({ type: "SET_PROVIDER", providerId });
  }, []);

  const selectPlan = useCallback((planId: string) => {
    dispatch({ type: "SELECT_PLAN", planId });
  }, []);

  const setOption = useCallback((code: string, value: string) => {
    dispatch({ type: "SET_OPTION", code, value });
  }, []);

  const setAddons = useCallback((addonIds: string[]) => {
    dispatch({ type: "SET_ADDONS", addonIds });
  }, []);

  const switchPlan = useCallback(
    (
      newPlanId: string,
      compatibleSelections: Record<string, string | string[]>,
    ) => {
      dispatch({ type: "SWITCH_PLAN", newPlanId, compatibleSelections });
    },
    [],
  );

  const setPricingSnapshot = useCallback(
    (pricing: WizardState["localPricingSnapshot"]) => {
      dispatch({ type: "SET_PRICING_SNAPSHOT", pricing });
    },
    [],
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    setStep,
    setProvider,
    selectPlan,
    setOption,
    setAddons,
    switchPlan,
    setPricingSnapshot,
    reset,
  };
}
