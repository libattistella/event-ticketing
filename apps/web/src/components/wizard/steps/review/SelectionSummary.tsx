import { Separator } from "@/components/ui/separator";
import type { Selections, Plan } from "@/types";
import { formatOptionCode, formatOptionLabel } from "../configuration/helpers";

interface SelectionSummaryProps {
  plan: Plan | null;
  selections: Selections;
  selectedAddons: string[];
}

export const SelectionSummary = ({
  plan,
  selections,
  selectedAddons,
}: SelectionSummaryProps) => {
  if (!plan) return null;

  const optionEntries = Object.entries(selections).filter(
    ([key]) => key !== "addons",
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Your Selections</h3>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium">{plan.name}</span>
        </div>

        {optionEntries.length > 0 && (
          <>
            <Separator />
            {optionEntries.map(([code, value]) => (
              <div key={code} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatOptionCode(code)}
                </span>
                <span className="font-medium">
                  {typeof value === "string"
                    ? formatOptionLabel(code, value)
                    : String(value)}
                </span>
              </div>
            ))}
          </>
        )}

        {selectedAddons.length > 0 && (
          <>
            <Separator />
            <div className="text-sm">
              <span className="text-muted-foreground">Add-ons</span>
              <ul className="mt-1 space-y-1">
                {selectedAddons.map((addonId) => {
                  const addon = plan.addons.find((a) => a.id === addonId);
                  return (
                    <li key={addonId} className="font-medium">
                      {addon?.name ?? addonId}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
