// hooks/useCampaignObjectives.ts

import { useQuery } from "@tanstack/react-query";
import { getCampaignObjectives } from "@/services/api";

export function useCampaignObjectives() {
  return useQuery({
    queryKey: ["campaignObjectives"],
    queryFn: getCampaignObjectives,
  });
}