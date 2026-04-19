import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { PlanAddon } from "@/types";
import { formatCents } from "@/lib/utils";

interface PlanAddonsProps {
  addons: PlanAddon[];
  selectedAddonIds: string[];
  onChange: (addonIds: string[]) => void;
}

export const PlanAddons = ({
  addons,
  selectedAddonIds,
  onChange,
}: PlanAddonsProps) => {
  if (addons.length === 0) return null;

  const handleToggle = (addonId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedAddonIds, addonId]);
    } else {
      onChange(selectedAddonIds.filter((id) => id !== addonId));
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Add-ons</span>
      <div className="space-y-2">
        {addons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          const isFree = addon.price_cents === 0;

          return (
            <div key={addon.id} className="flex items-center space-x-3">
              <Checkbox
                id={`addon-${addon.id}`}
                checked={isSelected}
                onCheckedChange={(checked: boolean) =>
                  handleToggle(addon.id, checked === true)
                }
              />
              <label
                htmlFor={`addon-${addon.id}`}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                {addon.name}
                {isFree ? (
                  <Badge variant="default">Free</Badge>
                ) : (
                  <span className="text-muted-foreground">
                    +{formatCents(addon.price_cents, addon.currency)}
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
