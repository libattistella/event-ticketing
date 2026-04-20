import { apiGet } from "./client";
import type { ProvidersResponse } from "@/types";

export function fetchProviders(): Promise<ProvidersResponse> {
  return apiGet<ProvidersResponse>("/providers");
}
