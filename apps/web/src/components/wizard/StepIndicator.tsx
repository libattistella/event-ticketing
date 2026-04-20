import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types";
import { Check } from "lucide-react";

const STEPS = [
  { step: 1 as const, label: "Select Plan" },
  { step: 2 as const, label: "Configure" },
  { step: 3 as const, label: "Review" },
  { step: 4 as const, label: "Status" },
];

interface StepIndicatorProps {
  currentStep: WizardStep;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map(({ step, label }, index) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <li key={step} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    isCompleted &&
                      "bg-primary text-primary-foreground",
                    isActive &&
                      "border-2 border-primary bg-background text-primary",
                    !isActive &&
                      !isCompleted &&
                      "border-2 border-muted-foreground/30 text-muted-foreground",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-sm font-medium sm:inline",
                    isActive && "text-foreground",
                    !isActive && "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-12",
                    step < currentStep ? "bg-primary" : "bg-muted",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
