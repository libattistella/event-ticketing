import { useQueryClient } from "@tanstack/react-query";
import { fetchPlans } from "@/api/plans";
import { Card, CardContent } from "../../../ui/card";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import type { Provider } from "@/types";

interface ProviderItemProps {
  provider: Provider;
  isSelected: boolean;
  onSelect: () => void;
}

export const ProviderItem = ({
  provider,
  isSelected,
  onSelect,
}: ProviderItemProps) => {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["plans", provider.id],
      queryFn: () => fetchPlans(provider.id),
      staleTime: 2 * 60 * 1000,
    });
  };

  const initials = provider.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md outline-none py-0 md:py-2 border-1 border-background",
        isSelected && "border-1 border-primary",
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      <CardContent className="flex items-center gap-4 p-4">
        {provider.logo_url ? (
          <img
            src={provider.logo_url}
            alt={provider.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold truncate">{provider.name}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {provider.location || "Location not specified"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
