
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAdAccounts } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { AD_ACCOUNT_STATUS } from "@/config/constants";
import {CircleUser  } from "lucide-react";


interface AdAccountSelectorProps {
  onAccountSelect: (accountId: string) => void;
  selectedAccount?: string;
  statusFilter?: number;
}

export function AdAccountSelector({ onAccountSelect, selectedAccount, statusFilter }: AdAccountSelectorProps) {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["adAccounts"],
    queryFn: getAdAccounts,
  });

  const filteredAccounts = accounts?.filter(account => 
    statusFilter ? account.account_status === statusFilter : true
  );

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <Select onValueChange={onAccountSelect} value={selectedAccount}>
      <SelectTrigger className="w-[200px]">
      <CircleUser className="h-5 w-5 text-teal-400" />
        <SelectValue placeholder="Select Ad Account" />
      </SelectTrigger>
      <SelectContent>
        {filteredAccounts?.map((account: { id: string; name: string; account_status: number }) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name} ({account.account_status === AD_ACCOUNT_STATUS.ACTIVE ? 'Active' : 'Inactive'})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
