import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import type { FinaliseResponse } from "@/types";

interface StatusDisplayProps {
  result: FinaliseResponse;
  onStartOver: () => void;
}

export const SelectionStatusStep = ({
  result,
  onStartOver,
}: StatusDisplayProps) => {
  const isFinalised = result.status === "finalised";

  return (
    <div className="flex justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {isFinalised ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          ) : (
            <Clock className="mx-auto h-12 w-12 text-yellow-600" />
          )}
          <CardTitle className="mt-4">
            {isFinalised ? "Event Finalised" : "Pending Approval"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Badge
            // variant={isFinalised ? "success" : "warning"}
            className="text-sm"
          >
            {result.status
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {isFinalised
              ? "Your event has been successfully finalised. No further action is needed."
              : "Your event request has been submitted and is awaiting manager review. You will be notified once a decision is made."}
          </p>
          <p className="text-xs text-muted-foreground">
            Reference: {result.id}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={onStartOver}>
            Start Over
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
