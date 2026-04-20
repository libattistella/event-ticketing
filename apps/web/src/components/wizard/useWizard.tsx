import { useReducer, useCallback } from "react";
import { wizardReducer, initialState } from "./wizardReducer";
import type { Plan, FinaliseResponse, Pricing } from "@/types";
import type { Selections } from "@/types";

export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const setProvider = useCallback((providerId: string) => {
    dispatch({ type: "SET_PROVIDER", providerId });
  }, []);

  const selectPlan = useCallback((plan: Plan) => {
    dispatch({ type: "SELECT_PLAN", plan });
    dispatch({ type: "SET_STEP", step: 2 });
  }, []);

  const setOption = useCallback((code: string, value: string) => {
    dispatch({ type: "SET_OPTION", code, value });
  }, []);

  const setAddons = useCallback((addonIds: string[]) => {
    dispatch({ type: "SET_ADDONS", addonIds });
  }, []);

  const switchPlan = useCallback(
    (plan: Plan, compatibleSelections: Selections) => {
      dispatch({ type: "SWITCH_PLAN", plan, compatibleSelections });
    },
    [],
  );

  const setPricingSnapshot = useCallback((pricing: Pricing | null) => {
    dispatch({ type: "SET_PRICING_SNAPSHOT", pricing });
  }, []);

  const goToReview = useCallback(() => {
    dispatch({ type: "SET_STEP", step: 3 });
  }, []);

  const goToConfig = useCallback(() => {
    dispatch({ type: "SET_STEP", step: 2 });
  }, []);

  const finaliseSuccess = useCallback((result: FinaliseResponse) => {
    dispatch({ type: "SET_FINALISE_RESULT", result });
    dispatch({ type: "SET_STEP", step: 4 });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    setProvider,
    selectPlan,
    setOption,
    setAddons,
    switchPlan,
    setPricingSnapshot,
    goToReview,
    goToConfig,
    finaliseSuccess,
    reset,
  };
}

