import type { Provider } from "@/types";
import { ErrorFallback } from "../utils";
import { Skeleton } from "../ui/skeleton";
import { useProviders } from "@/hooks/useProviders";
import { ProviderItem } from "./ProviderItem";

interface ProviderSelectorProps {
  selectedProviderId: string | null;
  onSelect: (providerId: string) => void;
}

export const ProviderSelector = ({
  selectedProviderId,
  onSelect,
}: ProviderSelectorProps) => {
  const { data: providers, isLoading, isError, refetch } = useProviders();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorFallback
        title="Couldn't load providers"
        message="We were unable to fetch the provider list. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!providers || providers.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No providers available.
      </p>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Select a provider"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {providers.map((provider: Provider) => (
        <ProviderItem
          key={provider.id}
          provider={provider}
          isSelected={provider.id === selectedProviderId}
          onSelect={() => onSelect(provider.id)}
        />
      ))}
    </div>
  );
};
