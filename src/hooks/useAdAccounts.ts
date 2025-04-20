
import { useQuery } from "@tanstack/react-query";
import { getAdAccounts } from "@/services/api";
import { AD_ACCOUNT_STATUS } from "@/config/constants";
import type { AdAccount } from "@/types/api";

export function useAdAccounts(statusFilter?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adAccounts"],
    queryFn: getAdAccounts,
  });

  const filteredAccounts = data?.filter((account: AdAccount) => 
    statusFilter ? account.account_status === statusFilter : true
  );

  const activeAccounts = data?.filter((account: AdAccount) => 
    account.account_status === AD_ACCOUNT_STATUS.ACTIVE
  );

  const inactiveAccounts = data?.filter((account: AdAccount) => 
    account.account_status === AD_ACCOUNT_STATUS.INACTIVE
  );

  return {
    accounts: filteredAccounts || [],
    activeAccounts: activeAccounts || [],
    inactiveAccounts: inactiveAccounts || [],
    isLoading,
    error,
  };
}
