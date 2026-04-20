import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEstimate, finaliseEstimate, updateEstimate } from "@/api/estimates";
import type { Estimate, UpdateEstimateInput } from "@/types/core";

export const useEstimate = () => {
  return useQuery({
    queryKey: ["estimate"],
    queryFn: fetchEstimate,
    staleTime: 30 * 1000,
  });
}

export const useUpdateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEstimate,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMutate: async (_newInput: UpdateEstimateInput) => {
      await queryClient.cancelQueries({ queryKey: ["estimate"] });
      const previous = queryClient.getQueryData<Estimate>(["estimate"]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["estimate"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["estimate"] });
    },
  });
}

export const useFinaliseEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finaliseEstimate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimate"] });
    },
  });
}
