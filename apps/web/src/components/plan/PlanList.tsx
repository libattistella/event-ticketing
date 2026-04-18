import { usePlans } from "@/hooks/usePlans";
import { PlanItem } from "./PlanItem";
import { Skeleton } from "../ui/skeleton";
import { ErrorFallback } from "../utils";
import type { Plan } from "@/types";

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
  );
};
