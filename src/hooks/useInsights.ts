
import { useQuery } from "@tanstack/react-query";
import { getAdAccountInsights, getCampaignInsights, getAdSetInsights } from "@/services/api";
import type { InsightParams } from "@/types/api";

export function useInsights(
  type: "adAccount" | "campaign" | "adSet",
  id?: string,
  params?: InsightParams
) {
  const queryFn = async () => {
    if (!id) return null;
    
    switch (type) {
      case "adAccount":
        return getAdAccountInsights(id, params);
      case "campaign":
        return getCampaignInsights(id, params);
      case "adSet":
        return getAdSetInsights(id, params);
      default:
        return null;
    }
  };

  return useQuery({
    queryKey: ["insights", type, id, params],
    queryFn,
    enabled: !!id,
  });
}
