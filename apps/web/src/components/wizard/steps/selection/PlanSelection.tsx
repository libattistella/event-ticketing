import type { Plan } from "@/types";

import { PlanList } from "./PlanList";
import { ProviderSelector } from "./ProviderSelector";

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
}: PlanSelectionStepProps) => (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-semibold mb-4">Choose a Provider</h2>
      <ProviderSelector
        selectedProviderId={selectedProviderId}
        onSelect={onProviderSelect}
      />
    </section>

    {selectedProviderId && (
      <PlanList
        providerId={selectedProviderId}
        selectedPlanId={selectedPlanId}
        onPlanSelect={onPlanSelect}
      />
    )}
  </div>
);
