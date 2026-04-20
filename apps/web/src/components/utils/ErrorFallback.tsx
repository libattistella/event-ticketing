import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorFallback = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorFallbackProps) => {
  return (
    <Card className="mx-auto max-w-md mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
