// import { useState } from "react";
// import { ProviderSelector } from "./provider-selector";
// import { PlanList } from "./plan-list";
// import { PlanComparisonDialog } from "./plan-comparison-dialog";
import { LayoutGrid } from "lucide-react";
import type { Plan } from "@/types";
import { Button } from "@/components/ui/button";
import { ProviderSelector } from "@/components/provider";
import { PlanList } from "@/components/plan";

interface PlanSelectionStepProps {
  selectedProviderId: string | null;
  selectedPlanId: string | null;
  onProviderSelect: (providerId: string) => void;
  onPlanSelect: (plan: Plan) => void;
}

export const PlanSelectionStep = ({
  selectedProviderId,
  selectedPlanId,
  onProviderSelect,
  onPlanSelect,
}: PlanSelectionStepProps) => {
  // const [compareOpen, setCompareOpen] = useState(false);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Choose a Provider</h2>
        <ProviderSelector
          selectedProviderId={selectedProviderId}
          onSelect={onProviderSelect}
        />
      </section>

      {selectedProviderId && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Choose a Plan</h2>
            <Button
              variant="ghost"
              size="sm"
              // onClick={() => setCompareOpen(true)}
            >
              <LayoutGrid className="mr-1 h-4 w-4" />
              Compare Plans
            </Button>
          </div>
          <PlanList
            providerId={selectedProviderId}
            selectedPlanId={selectedPlanId}
            onPlanSelect={onPlanSelect}
          />
          {/* <PlanComparisonDialog
            providerId={selectedProviderId}
            open={compareOpen}
            onOpenChange={setCompareOpen}
          /> */}
        </section>
      )}
    </div>
  );
};
