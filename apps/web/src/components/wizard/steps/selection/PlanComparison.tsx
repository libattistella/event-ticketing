import { usePlans } from "@/hooks/usePlans";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "../../../ui/badge";
import { Skeleton } from "../../../ui/skeleton";
import { Check, X } from "lucide-react";
import { formatCents } from "@/lib/utils";

interface PlanComparisonDialogProps {
  providerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlanComparisonDialog = ({
  providerId,
  open,
  onOpenChange,
}: PlanComparisonDialogProps) => {
  const { data: plans = [], isLoading } = usePlans(providerId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Compare Plans</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of available plans
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-3 text-left font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Base Price</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="p-3 font-semibold">
                      {formatCents(plan.base_price_cents, plan.currency)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Approval</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="p-3">
                      {plan.approval_type === "manager_review" ? (
                        <Badge variant="default">Required</Badge>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Min Participants</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="p-3">
                      {plan.min_participants}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Lead Time</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="p-3">
                      {plan.lead_time_days} days
                    </td>
                  ))}
                </tr>
                {getAllOptionCodes(plans).map((code) => (
                  <tr key={code} className="border-b">
                    <td className="p-3 font-medium capitalize">
                      {code.replace(/_/g, " ")}
                    </td>
                    {plans.map((plan) => {
                      const option = plan.options.find(
                        (o) => o.code === code,
                      );
                      return (
                        <td key={plan.id} className="p-3">
                          {option ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                              {option.values.length} option
                              {option.values.length > 1 ? "s" : ""}
                              {option.required && (
                                <span className="text-xs text-muted-foreground">
                                  (required)
                                </span>
                              )}
                            </span>
                          ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-b">
                  <td className="p-3 font-medium">Add-ons</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="p-3">
                      {plan.addons.length > 0
                        ? `${plan.addons.length} available`
                        : "None"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No plans to compare.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getAllOptionCodes(
  plans: { options: { code: string }[] }[],
): string[] {
  const codes = new Set<string>();
  for (const plan of plans) {
    for (const option of plan.options) {
      codes.add(option.code);
    }
  }
  return Array.from(codes);
}
