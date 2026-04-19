import { OPTION_CODE_LABELS, OPTION_LABELS } from "./constants";

export function formatOptionLabel(code: string, value: string): string {
  const label = OPTION_LABELS[code]?.[value];
  if (label) return label;
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatOptionCode(code: string): string {
  const label = OPTION_CODE_LABELS[code];
  if (label) return label;
  return code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

import type { Selections, Plan } from "@/types";

/**
 * Given old selections and a new plan, returns only the selections
 * whose option codes exist in the new plan and whose values are valid.
 */
export function findCompatibleSelections(
  oldSelections: Selections,
  newPlan: Plan,
): Selections {
  const compatible: Selections = {};

  for (const option of newPlan.options) {
    const oldValue = oldSelections[option.code];
    if (typeof oldValue === "string" && option.values.includes(oldValue)) {
      compatible[option.code] = oldValue;
    }
  }

  // Filter addons to only those that exist in the new plan
  const oldAddons = oldSelections["addons"];
  if (Array.isArray(oldAddons)) {
    const validAddonIds = new Set(newPlan.addons.map((a) => a.id));
    const compatibleAddons = oldAddons.filter((id) => validAddonIds.has(id));
    compatible["addons"] = compatibleAddons;
  }

  return compatible;
}

/**
 * Returns the list of selections that would be lost when switching plans.
 */
export function findLostSelections(
  oldSelections: Selections,
  newPlan: Plan,
): string[] {
  const lost: string[] = [];
  const newOptionCodes = new Set(newPlan.options.map((o) => o.code));
  const newAddonIds = new Set(newPlan.addons.map((a) => a.id));

  for (const [key, value] of Object.entries(oldSelections)) {
    if (key === "addons") {
      if (Array.isArray(value)) {
        for (const addonId of value) {
          if (!newAddonIds.has(addonId)) {
            lost.push(`Addon: ${addonId}`);
          }
        }
      }
      continue;
    }
    if (!newOptionCodes.has(key)) {
      lost.push(`Option: ${key} = ${String(value)}`);
    } else {
      const option = newPlan.options.find((o) => o.code === key);
      if (
        option &&
        typeof value === "string" &&
        !option.values.includes(value)
      ) {
        lost.push(`Option: ${key} = ${value} (not available)`);
      }
    }
  }

  return lost;
}
