import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/api/plans";

export const usePlans = (providerId: string | null) => {
  return useQuery({
    queryKey: ["plans", providerId],
    queryFn: () => fetchPlans(providerId!),
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000,
    select: (data) => data.items,
  });
};
