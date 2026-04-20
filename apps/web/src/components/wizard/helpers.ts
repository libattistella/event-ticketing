import type { WizardStep } from "@/types";

export function getStepTitle(step: WizardStep): string {
  switch (step) {
    case 1:
      return "Select a Plan";
    case 2:
      return "Configure Your Event";
    case 3:
      return "Review & Submit";
    case 4:
      return "Status";
  }
}
