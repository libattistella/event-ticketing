import type { PlanOption } from "@/types";
import { OptionGroup } from "./OptionGroup";
import { SingleOption } from "./SingleOption";
import { formatOptionCode } from "./helpers";
import { AlertTriangle } from "lucide-react";

interface PlanOptionsProps {
  option: PlanOption;
  value: string | undefined;
  onChange: (code: string, value: string) => void;
}

interface UnknownOptionFallbackProps {
  code: string;
  required: boolean;
}

export const UnknownOptionFallback = ({
  code,
  required,
}: UnknownOptionFallbackProps) => (
  <fieldset className="space-y-2">
    <legend className="text-sm font-medium">
      {formatOptionCode(code)}
      {required && (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </legend>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <AlertTriangle className="h-4 w-4" />
      <span>No options available for this configuration.</span>
    </div>
  </fieldset>
);

export const PlanOptions = ({ option, value, onChange }: PlanOptionsProps) => {
  // Single-value option auto-select
  if (option.values.length === 1) {
    return (
      <SingleOption
        code={option.code}
        value={option.values[0]!}
        required={option.required}
        onChange={onChange}
        currentValue={value}
      />
    );
  }

  // Multi-value option radio group
  if (option.values.length > 1) {
    return (
      <OptionGroup
        code={option.code}
        values={option.values}
        required={option.required}
        description={option.description}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <UnknownOptionFallback code={option.code} required={option.required} />
  );
};
