import { useEffect } from "react";
import { Badge } from "../ui/badge";
import { formatOptionCode, formatOptionLabel } from "./helpers";

interface SingleOptionProps {
  code: string;
  value: string;
  required: boolean;
  currentValue: string | undefined;
  onChange: (code: string, value: string) => void;
}

export const SingleOption = ({
  code,
  value,
  required,
  currentValue,
  onChange,
}: SingleOptionProps) => {
  // Auto select the single value
  useEffect(() => {
    if (currentValue !== value) {
      onChange(code, value);
    }
  }, [code, value, currentValue, onChange]);

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-medium">
        {formatOptionCode(code)}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <div className="flex justify-center items-center gap-2">
        <Badge variant="secondary">{formatOptionLabel(code, value)}</Badge>
        <span className="text-xs text-muted-foreground">(auto-selected)</span>
      </div>
    </div>
  );
};
