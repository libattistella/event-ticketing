import type { Plan, Selections } from "@/types";

export const checkRequiredFields = (
  plan: Plan,
  selections: Selections,
): boolean =>
  plan.options
    ?.filter((opt) => opt.required)
    .every((opt) => {
      const val = selections[opt.code];
      return typeof val === "string" && val.length > 0;
    }) ?? true;
