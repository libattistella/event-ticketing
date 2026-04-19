import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BlockerListProps {
  blockers: string[];
}

export const BlockerList = ({ blockers }: BlockerListProps) => {
  if (blockers.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Cannot Submit</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 list-disc pl-4 space-y-1">
          {blockers.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
