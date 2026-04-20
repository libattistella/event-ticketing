import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Pricing } from "@/types";
import { formatCents } from "@/lib/utils";

interface PlanPricingProps {
  pricing: Pricing | null;
  isLoading: boolean;
  isPriceStale: boolean;
  stalePricing?: Pricing | null;
}

export const PlanPricing = ({
  pricing,
  isLoading,
  isPriceStale,
  stalePricing,
}: PlanPricingProps) => {
  if (isLoading && !pricing) {
    return (
      <div className="space-y-3 rounded-lg border p-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (!pricing) return null;

  return (
    <div className="flex flex-col lg:flex-col-reverse gap-4">
      {isPriceStale && stalePricing && (
        <div aria-live="polite">
          <Alert variant="default" className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Price Updated</AlertTitle>
            <AlertDescription>
              The total changed from{" "}
              {formatCents(stalePricing.total, stalePricing.currency)} to{" "}
              {formatCents(pricing.total, pricing.currency)}.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold">Price Breakdown</h3>

        <div aria-live="polite" className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base price</span>
            <span>{formatCents(pricing.base, pricing.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Add-ons</span>
            <span>{formatCents(pricing.addons, pricing.currency)}</span>
          </div>
          {pricing.total - pricing.base - pricing.addons !== 0 && (
            <div className="flex justify-between text-sm">
              <span>Options</span>
              <span>
                {formatCents(
                  pricing.total - pricing.base - pricing.addons,
                  pricing.currency,
                )}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCents(pricing.total, pricing.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
