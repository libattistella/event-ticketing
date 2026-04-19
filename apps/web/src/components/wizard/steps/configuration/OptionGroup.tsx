import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatOptionCode, formatOptionLabel } from "./helpers";

interface OptionGroupProps {
  code: string;
  values: string[];
  required: boolean;
  description: string | null;
  value: string | undefined;
  onChange: (code: string, value: string) => void;
}

export const OptionGroup = ({
  code,
  values,
  required,
  description,
  value,
  onChange,
}: OptionGroupProps) => {
  const groupId = `option-${code}`;
  const errorId = `${groupId}-error`;
  const showError = required && !value;

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">
        {formatOptionCode(code)}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <RadioGroup
        value={value ?? ""}
        onValueChange={(val) => onChange(code, val)}
        aria-required={required}
        aria-describedby={showError ? errorId : undefined}
      >
        {values.map((v) => (
          <div key={v} className="flex items-center space-x-2">
            <RadioGroupItem value={v} id={`${groupId}-${v}`} />
            <label
              htmlFor={`${groupId}-${v}`}
              className="text-sm cursor-pointer"
            >
              {formatOptionLabel(code, v)}
            </label>
          </div>
        ))}
      </RadioGroup>
      {showError && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          This option is required.
        </p>
      )}
    </div>
  );
};
