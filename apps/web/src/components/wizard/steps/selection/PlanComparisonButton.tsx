import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { PlanComparisonDialog } from "./PlanComparison";

interface PlanComparisonButtonProps {
  providerId: string;
}

export const PlanComparisonButton = ({ providerId }: PlanComparisonButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <LayoutGrid className="mr-1 h-4 w-4" />
        Compare Plans
      </Button>
      <PlanComparisonDialog
        providerId={providerId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};
