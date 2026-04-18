import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/api/providers";

export const useProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.items,
  });
}
