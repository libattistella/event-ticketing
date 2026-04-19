import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { PlanAddon } from "@/types";
import { formatCents } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

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
    <div className="space-y-4">
      <span className="block text-sm font-medium text-center md:text-left">Add-ons</span>
      <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {addons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          const isFree = addon.price_cents === 0;

          return (
            <Field orientation="horizontal" key={addon.id}>
              <Checkbox
                id={`addon-${addon.id}`}
                checked={isSelected}
                onCheckedChange={(checked: boolean) =>
                  handleToggle(addon.id, checked === true)
                }
              />
              <FieldContent>
                <FieldLabel htmlFor={`addon-${addon.id}`}>
                  {addon.name}
                </FieldLabel>
                <FieldDescription>
                  {isFree ? (
                    <Badge variant="default">Free</Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      +{formatCents(addon.price_cents, addon.currency)}
                    </span>
                  )}
                </FieldDescription>
              </FieldContent>
            </Field>
          );
        })}
      </FieldGroup>
    </div>
  );
};
