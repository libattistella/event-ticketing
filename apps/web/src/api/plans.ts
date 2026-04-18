import { apiGet } from "./client";
import type { PlansResponse } from "@/types";

export function fetchPlans(providerId: string): Promise<PlansResponse> {
  return apiGet<PlansResponse>(
    `/plans?provider_id=${encodeURIComponent(providerId)}`,
  );
}
