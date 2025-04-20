
import { useState , useEffect} from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdAccountInsights, getCampaignInsights } from "@/services/api";
import { toast } from "sonner";
import type { DateRange, InsightParams } from "@/types/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { useAdAccounts } from "@/hooks/useAdAccounts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Eye, MousePointerClick, DollarSign,ChevronDown } from "lucide-react"
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AD_ACCOUNT_STATUS, CAMPAIGN_STATUS, CAMPAIGN_OBJECTIVES } from "@/config/constants";
const getLast30Days = () => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  return { from: last30Days, to: today };
};

const Index = () => {
  const navigate = useNavigate();
  // const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number>();
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>();
  const [objectiveFilter, setObjectiveFilter] = useState<string>();
  const [showAllRows, setShowAllRows] = useState(false);

  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      from: thirtyDaysAgo,
      to: today
    };
  });

  

  const { accounts } = useAdAccounts(statusFilter);
  const { campaigns } = useCampaigns(selectedAccount, campaignStatusFilter, objectiveFilter);

// Auto-select first account when accounts are loaded
useEffect(() => {
  if (!selectedAccount && accounts && accounts.length > 0) {
    const firstAccount = accounts[0];
    setSelectedAccount(firstAccount.id);
    sessionStorage.setItem("selectedAccount", firstAccount.id);
    toast.success(`Selected account: ${firstAccount.name}`, {
      icon: "🎯",
    });
  }
}, [accounts, selectedAccount])

  // Auto-select first account if none selected
  useEffect(() => {
  if (!selectedAccount) return;

  // If dateRange is undefined, we fetch all data
  const params: InsightParams = {
    time_increment: 1,
    breakdown: true,
  };

  if (dateRange?.from && dateRange?.to) {
    params.since = dateRange.from.toISOString().split('T')[0];
    params.until = dateRange.to.toISOString().split('T')[0];
  }

  // Fetch data with or without date range
  getAdAccountInsights(selectedAccount, params)
    .then(data => {
      // Process data
    })
    .catch(error => {
      toast.error("Failed to fetch insights");
    });
}, [
  
  // selectedAccount, dateRange
]);
  
  // Improved date range handling
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Ensure dates are start and end of day
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999);
      setDateRange({ from, to });
    }
  }, [
    // dateRange?.from, dateRange?.to
  ]);

   // Load selected account from sessionStorage or auto-select first account
   useEffect(() => {
    const storedAccount = sessionStorage.getItem("selectedAccount");
    if (storedAccount) {
      setSelectedAccount(storedAccount);
    } else if (accounts && accounts.length > 0) {
      const firstAccount = accounts[0];
      setSelectedAccount(firstAccount.id);
      sessionStorage.setItem("selectedAccount", firstAccount.id);
    }
  }, []);

  // Fetch insights when account is selected
  useEffect(() => {
    if (!selectedAccount) return;

    const params: InsightParams = {
      time_increment: 1,
      breakdown: true,
    };

    if (dateRange?.from && dateRange?.to) {
      params.since = dateRange.from.toISOString().split('T')[0];
      params.until = dateRange.to.toISOString().split('T')[0];
    }

    getAdAccountInsights(selectedAccount, params)
      .then(data => {
        // Process data
      })
      .catch(error => {
        toast.error("Failed to fetch insights");
      });
  }, [selectedAccount, dateRange]);


// Load selected account and filters from sessionStorage on page load
useEffect(() => {
  const storedAccount = sessionStorage.getItem("selectedAccount");
  if (storedAccount) {
    setSelectedAccount(storedAccount);
  }
}, []);

  
// Get insights with time increment for time series
const { data: timeSeriesInsights, isLoading: timeSeriesLoading } = useQuery({
  queryKey: ["insights", selectedAccount, dateRange, "timeSeries"],
  queryFn: async () => {
    if (!dateRange?.from || !dateRange?.to || !selectedAccount) return [];
    
    const params = {
      since: dateRange.from.toISOString().split('T')[0],
      until: dateRange.to.toISOString().split('T')[0],
      time_increment: 1,
      breakdown: true,
    };

    try {
      const response = await getAdAccountInsights(selectedAccount, params);
      return response;
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  },
  refetchOnWindowFocus: false
});


  // Get campaign insights for the table
  const { data: campaignInsights = {} } = useQuery({
    queryKey: ["campaignInsights", campaigns, dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return {};
      
      const insights = {};
      for (const campaign of campaigns) {
        const data = await getCampaignInsights(campaign.id, {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
        });
        insights[campaign.id] = data[0] || null;
      }
      return insights;
    },
    enabled: !!campaigns.length && !!dateRange?.from && !!dateRange?.to
  });

  // Get aggregated insights for metrics
  const { data: aggregatedInsights, isLoading: aggregatedLoading } = useQuery({
    queryKey: ["insights", selectedAccount, dateRange, "aggregated"],
    queryFn: async () => {
      if (dateRange?.from && dateRange?.to) {
        const params = {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
          breakdown: false,
        };
        
        if (selectedAccount) {
          return getAdAccountInsights(selectedAccount, params);
        }
      }
      return [];
    },
    meta: {
      onError: () => {
        toast.error("Failed to fetch aggregated insights");
      }
    }
  });

  const aggregatedMetrics = aggregatedInsights?.[0] || {
    impressions: "0",
    reach: "0",
    clicks: "0",
    spend: "0",
    ctr: "0",
    cpm:"0",
cpc:"0"
  };

  // Calculate latest reach and frequency
  const latestReach = timeSeriesInsights?.length 
    ? parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].reach)
    : 0;

  const latestFrequency = timeSeriesInsights?.length 
    ? (parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].frequency) || 0).toFixed(2)
    : "0";
    
    // console.log("Campaign Objectives:", CAMPAIGN_OBJECTIVES);

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case "ACTIVE":
          return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
        case "PAUSED":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
        default:
          return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      }
    }

    const displayCampaigns = showAllRows ? campaigns : campaigns.slice(0, 10);

  return (
    <div className="min-h-screen bg-white">
  <DashboardHeader
      selectedAccount={selectedAccount}
      dateRange={dateRange}
      onAccountSelect={setSelectedAccount}
      onDateRangeChange={setDateRange}
      statusFilter={statusFilter}
  />

  <div className="container mx-auto px-6 py-10">
    {/* Filters Section */}
    <div className="flex flex-wrap items-center gap-6 mb-8">
    <div className="flex flex-col sm:flex-row items-center justify-between w-full">
  {/* Left Section: Account Status + Dropdown */}
  <div className="flex items-center gap-2 sm:gap-4">
    <Label
      htmlFor="account-filter"
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Account Status:
    </Label>
    <div className="relative w-full sm:w-auto">
      <select
        id="account-filter"
        className="w-full sm:w-[200px] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none pr-8"
        value={statusFilter?.toString() || ""}
        onChange={(e) => {
          setStatusFilter(e.target.value ? Number(e.target.value) : undefined);
          setSelectedAccount(undefined);
        }}
      >
        <option value="">All</option>
        <option value={AD_ACCOUNT_STATUS.ACTIVE}>Active</option>
        <option value={AD_ACCOUNT_STATUS.INACTIVE}>Inactive</option>
      </select>
      {/* Custom arrow styling */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 dark:text-gray-200" viewBox="0 0 16 16">
          <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"/>
        </svg>
      </div>
    </div>
  </div>

  {/* Right Section: Enhanced Insights Button */}
  {selectedAccount && (
    <Button 
      variant="outline" 
      className="bg-teal-500 hover:bg-teal-600 text-white border-none flex items-center gap-2 shadow-sm"
      onClick={() => navigate(`/enhanced-insights/${selectedAccount}`)}
    >
      {/* <Sparkles className="h-4 w-4" /> */}
      Placement/Actions
    </Button>
  )}
</div>

    </div>

    {selectedAccount && (
      <>
        <MetricsGrid aggregatedMetrics={aggregatedMetrics} latestReach={latestReach} latestFrequency={latestFrequency} />


        {/* Campaign Filters */}
        <div className="mt-8 space-y-6">
  {/* Filter Section */}
  <div className="flex flex-wrap items-center gap-6">
    
    {/* Campaign Status */}
    <div className="flex items-center space-x-2 relative">
      <Label htmlFor="campaign-status" className="text-gray-700 dark:text-gray-300 font-medium">
        Campaign Status:
      </Label>
      <div className="relative w-full sm:w-[220px]">
        <select
          id="campaign-status"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none pr-8 transition ease-in-out duration-200"
          value={campaignStatusFilter}
          onChange={(e) => setCampaignStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value={CAMPAIGN_STATUS.ACTIVE}>Active</option>
          <option value={CAMPAIGN_STATUS.PAUSED}>Paused</option>
        </select>
        {/* Custom arrow styling */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 dark:text-gray-200" viewBox="0 0 16 16">
            <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"/>
          </svg>
        </div>
      </div>
    </div>

    {/* Campaign Objective */}
    <div className="flex items-center space-x-2 relative">
      <Label htmlFor="campaign-objective" className="text-gray-700 dark:text-gray-300 font-medium">
        Campaign Objective:
      </Label>
      <div className="relative w-full sm:w-[220px]">
      <select
  id="campaign-objective"
  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none pr-8 transition ease-in-out duration-200"
  value={objectiveFilter}
  onChange={(e) => {
    console.log("Selected Filter:", e.target.value);
    setObjectiveFilter(e.target.value);
  }}
>
  <option value="">All</option>
  {CAMPAIGN_OBJECTIVES.map((objective, index) => {
    console.log(`Rendering: ${objective}`);
    return (
      <option key={index} value={objective}>
        {objective.replace("OUTCOME_", "")}
      </option>
    );
  })}
</select>
        {/* Custom arrow styling */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 dark:text-gray-200" viewBox="0 0 16 16">
            <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"/>
          </svg>
        </div>
      </div>
    </div>

  </div>

  {/* Campaigns Table Section */}
  
<Card className="overflow-hidden border-0 rounded-lg shadow-sm">
      <div className="bg-teal-500 py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-medium">
            <Sparkles className="h-5 w-5" />
            Campaigns Overview
          </div>
          <Badge className="bg-teal-600 text-white border-0 text-xs px-2.5">
            {campaigns.length} Campaigns
          </Badge>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">
                  Name
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">
                  Status
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">
                  Objective
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">
                  Spend
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">
                  Impressions
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">
                  Clicks
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCampaigns.map((campaign, index) => {
                const insights = campaignInsights[campaign.id] || {};
                return (
                  <motion.tr
                    key={campaign.id}
                    className="group cursor-pointer border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                    onClick={() => navigate && navigate(`/campaign/${campaign.id}`)}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-blue-900 dark:text-blue-100">{campaign.name}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="outline" className={`text-xs ${getStatusBadgeClass(campaign.status)}`}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {campaign.objective.replace("OUTCOME_", "")}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">${Number.parseFloat(insights.spend || "0").toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {Number.parseInt(insights.impressions || "0").toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4" />
                        {Number.parseInt(insights.clicks || "0").toLocaleString()}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
          
          {/* Show More Button - only display if there are more rows to show */}
          {!showAllRows && campaigns.length > 10 && (
            <motion.div 
              initial={{ opacity: 0.8 }} 
              animate={{ opacity: 1 }}
              className="bg-gradient-to-b from-blue-50/80 to-blue-100/80 border-t border-blue-100"
            >
              <div className="flex justify-center items-center py-3">
                <Button 
                  onClick={() => setShowAllRows(true)}
                  className="bg-white hover:bg-blue-50 text-teal-700 border border-teal-200 shadow-sm group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow"
                >
                  <span className="font-medium">View All {campaigns.length} Campaigns</span>
                  <div className="bg-teal-500 rounded-full p-1 group-hover:bg-teal-600 transition-colors duration-200">
                    <ChevronDown className="h-3 w-3 text-white" />
                  </div>
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Show Less Button - only display if showing all rows and there are more than 10 */}
          {showAllRows && campaigns.length > 10 && (
            <motion.div 
              initial={{ opacity: 0.8 }} 
              animate={{ opacity: 1 }}
              className="bg-gradient-to-t from-blue-50/80 to-blue-100/80 border-t border-blue-100"
            >
              <div className="flex justify-center items-center py-3">
                <Button 
                  onClick={() => setShowAllRows(false)}
                  className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-sm group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow"
                >
                  <span className="font-medium">Show Less</span>
                  <div className="bg-blue-500 rounded-full p-1 group-hover:bg-blue-600 transition-colors duration-200">
                    <ChevronDown className="h-3 w-3 text-white rotate-180" />
                  </div>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>

</div>
<div className="mt-16 gap-y-12">
<ChartsGrid timeSeriesInsights={timeSeriesInsights || []} 
        title="Ad Account Analytics" 
        />
</div>
    </>
    )}

    {/* Loading State */}
    {(timeSeriesLoading || aggregatedLoading) && (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary"></div>
      </div>
    )}
  </div>
</div>

  );
};
export default Index;
