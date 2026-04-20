import { apiGet, apiPut, apiPost } from "./client";
import type { Estimate, UpdateEstimateInput, FinaliseResponse } from "@/types";

export function fetchEstimate(): Promise<Estimate> {
  return apiGet<Estimate>("/estimate");
}

export function updateEstimate(input: UpdateEstimateInput): Promise<Estimate> {
  return apiPut<Estimate>("/estimate", input);
}

export function finaliseEstimate(): Promise<FinaliseResponse> {
  return apiPost<FinaliseResponse>("/estimate/finalise");
}
