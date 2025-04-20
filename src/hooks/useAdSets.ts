
import { useQuery } from "@tanstack/react-query";
import { getAdSets } from "@/services/api";
import { toast } from "sonner";

export function useAdSets(campaignId?: string) {
  return useQuery({
    queryKey: ["adSets", campaignId],
    queryFn: () => getAdSets(campaignId!),
    enabled: !!campaignId,
    meta: {
      onError: (error: any) => {
        console.error('Ad Sets Error:', error);
        toast.error("Failed to fetch ad sets");
      }
    },
    retry: false // Don't retry on failure
  });
}
