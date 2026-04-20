import { usePlans } from "@/hooks/usePlans";
import { PlanItem } from "./PlanItem";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorFallback } from "@/components/utils";
import type { Plan } from "@/types";
import { PlanComparisonButton } from "./PlanComparisonButton";

interface PlanListProps {
  providerId: string;
  selectedPlanId: string | null;
  onPlanSelect: (plan: Plan) => void;
}

export const PlanList = ({
  providerId,
  selectedPlanId,
  onPlanSelect,
}: PlanListProps) => {
  const { data: plans, isLoading, isError, refetch } = usePlans(providerId);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorFallback
        title="Couldn't load plans"
        message="We were unable to fetch plans for this provider."
        onRetry={() => refetch()}
      />
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No plans available for this provider. Please select another provider.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Choose a Plan</h2>
        {plans.length > 1 && <PlanComparisonButton providerId={providerId} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <PlanItem
            key={plan.id}
            plan={plan}
            isSelected={plan.id === selectedPlanId}
            onSelect={() => onPlanSelect(plan)}
          />
        ))}
      </div>
    </div>
  );
};

