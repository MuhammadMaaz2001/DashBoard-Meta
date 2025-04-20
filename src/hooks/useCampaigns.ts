
import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/services/api";
import { CAMPAIGN_STATUS } from "@/config/constants";
import type { Campaign } from "@/types/api";

export function useCampaigns(adAccountId?: string, statusFilter?: string, objectiveFilter?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaigns", adAccountId],
    queryFn: () => getCampaigns(adAccountId!),
    enabled: !!adAccountId,
  });

  const filteredCampaigns = data?.filter((campaign: Campaign) => {
    const matchesStatus = statusFilter ? campaign.status === statusFilter : true;
    const matchesObjective = objectiveFilter ? campaign.objective === objectiveFilter : true;
    return matchesStatus && matchesObjective;
  });

  const activeCampaigns = data?.filter((campaign: Campaign) => 
    campaign.status === CAMPAIGN_STATUS.ACTIVE
  );

  const pausedCampaigns = data?.filter((campaign: Campaign) => 
    campaign.status === CAMPAIGN_STATUS.PAUSED
  );

  return {
    campaigns: filteredCampaigns || [],
    activeCampaigns: activeCampaigns || [],
    pausedCampaigns: pausedCampaigns || [],
    isLoading,
    error,
  };
}
