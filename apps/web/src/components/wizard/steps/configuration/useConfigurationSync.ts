import { useEffect, useRef, useCallback } from "react";
import { useUpdateEstimate } from "@/hooks/useEstimate";
import type { Selections } from "@/types";

interface UseConfigurationSyncParams {
  planId: string;
  selections: Selections;
  selectedAddons: string[];
}

export function useConfigurationSync({
  planId,
  selections,
  selectedAddons,
}: UseConfigurationSyncParams) {
  const updateEstimate = useUpdateEstimate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialSyncRef = useRef(false);

  const buildApiSelections = useCallback(() => {
    const result: Record<string, string | string[]> = { addons: selectedAddons };
    for (const [key, value] of Object.entries(selections)) {
      if (key !== "addons") result[key] = value;
    }
    return result;
  }, [selections, selectedAddons]);

  const syncEstimate = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateEstimate.mutate({
        plan_id: planId,
        selections: {
          addons: selectedAddons,
          ...Object.fromEntries(
            Object.entries(selections).filter(([k]) => k !== "addons"),
          ),
        },
      });
    }, 300);
  }, [planId, selections, selectedAddons, updateEstimate]);

  // Fire initial sync once when entering the configuration step
  useEffect(() => {
    if (!hasInitialSyncRef.current) {
      hasInitialSyncRef.current = true;
      updateEstimate.mutate({
        plan_id: planId,
        selections: {
          addons: selectedAddons,
          ...Object.fromEntries(
            Object.entries(selections).filter(([k]) => k !== "addons"),
          ),
        },
      });
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-sync whenever selections change after initial sync
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

  return { isPending: updateEstimate.isPending };
}
