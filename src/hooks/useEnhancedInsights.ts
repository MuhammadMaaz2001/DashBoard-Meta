// hooks/useEnhancedInsights.ts
import { useQuery } from "@tanstack/react-query";
import { getEnhancedInsights } from "@/services/api";
import type { DateRange, InsightParams } from "@/types/api";

export function useEnhancedInsights(
  adAccountId?: string,
  dateRange?: DateRange,
  includePlacements: boolean = false,
  includeActions: boolean = false
) {
  const params: InsightParams & { include_placements?: boolean; include_actions?: boolean } = {};
  
  if (dateRange?.from && dateRange?.to) {
    params.since = dateRange.from.toISOString().split('T')[0];
    params.until = dateRange.to.toISOString().split('T')[0];
  }
  
  params.include_placements = includePlacements;
  params.include_actions = includeActions;

  return useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, includePlacements, includeActions],
    queryFn: () => getEnhancedInsights(adAccountId!, params),
    enabled: !!adAccountId && !!dateRange?.from && !!dateRange?.to,
  });
}