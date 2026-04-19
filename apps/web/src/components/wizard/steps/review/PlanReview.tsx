import { useState } from "react";
// import { SelectionSummary } from "./selection-summary";
// import { BlockerList } from "./blocker-list";

import { AlertCircle, Loader2, Pencil } from "lucide-react";
import { useEstimate, useFinaliseEstimate } from "@/hooks/useEstimate";
import type { Plan, Selections, FinaliseResponse } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlanPricing } from "../configuration/PlanPricing";
import { SelectionSummary } from "./SelectionSummary";
import { BlockerList } from "./BlockerList";

interface PlanReviewStepProps {
  planId: string;
  plan: Plan | null;
  selections: Selections;
  selectedAddons: string[];
  onEdit: () => void;
  onSubmitSuccess: (result: FinaliseResponse) => void;
}

export const PlanReviewStep = ({
  plan,
  selections,
  selectedAddons,
  onEdit,
  onSubmitSuccess,
}: PlanReviewStepProps) => {
  const { data: estimate, isLoading } = useEstimate();
  const finalise = useFinaliseEstimate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const blockers = estimate?.blocking_reasons ?? [];
  const hasBlockers = blockers.length > 0;

  const handleSubmit = () => {
    setSubmitError(null);
    finalise.mutate(undefined, {
      onSuccess: (result: FinaliseResponse) => {
        onSubmitSuccess(result);
      },
      onError: (error: unknown) => {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Submission failed. Please try again.",
        );
      },
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Review Your Selection</h2>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit Configuration
          </Button>
        </div>

        <SelectionSummary
          plan={plan}
          selections={selections}
          selectedAddons={selectedAddons}
        />

        <BlockerList blockers={blockers} />

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={hasBlockers || finalise.isPending || isLoading}
            size="lg"
          >
            {finalise.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>

      <aside>
        <PlanPricing
          pricing={estimate?.pricing ?? null}
          isLoading={isLoading}
          isPriceStale={false}
        />
      </aside>
    </div>
  );
}
