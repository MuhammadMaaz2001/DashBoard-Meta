import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEnhancedInsights, getDeviceInsights } from "@/services/api";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Share2, Zap, BarChart, Smartphone } from "lucide-react";
import type { DateRange } from "@/types/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Import our components
import PlacementInsights from "@/components/insights/PlacementInsights";
import ActionInsights from "@/components/insights/ActionInsights";
import CombinedInsights from "@/components/insights/CombinedInsights";
import DeviceInsights from "@/components/insights/DevicesInsights";

const getLast30Days = () => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  return { from: last30Days, to: today };
};

const EnhancedInsights = () => {
  const { adAccountId } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(getLast30Days());
  const [activeTab, setActiveTab] = useState("placements");

  useEffect(() => {
    if (!adAccountId) {
      toast.error("No ad account selected");
      navigate("/");
    }
  }, [adAccountId, navigate]);

  // Common params for all queries
  const getCommonParams = () => ({
    since: dateRange.from?.toISOString().split('T')[0],
    until: dateRange.to?.toISOString().split('T')[0],
  });

  // Get placement insights
  const { data: placementInsights, isLoading: placementsLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "placements"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        ...getCommonParams(),
        include_placements: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching placement insights:', error);
        toast.error("Failed to fetch placement insights");
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Get device insights - using the specialized function with the correct parameter
  const { data: deviceInsights, isLoading: devicesLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "devices"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      try {
        // Using the specialized function that has the correct parameter name
        const response = await getDeviceInsights(adAccountId, dateRange);
        return response;
      } catch (error) {
        console.error('Error fetching device insights:', error);
        toast.error("Failed to fetch device insights");
        return [];
      }
    },
    refetchOnWindowFocus: false,
    enabled: activeTab === "devices" // Only fetch when devices tab is active
  });

  // Get action insights
  const { data: actionInsights, isLoading: actionsLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "actions"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        ...getCommonParams(),
        include_actions: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching action insights:', error);
        toast.error("Failed to fetch action insights");
        return [];
      }
    },
    refetchOnWindowFocus: false,
    enabled: activeTab === "actions" // Only fetch when actions tab is active
  });

  // Get combined insights
  const { data: combinedInsights, isLoading: combinedLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "combined"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        ...getCommonParams(),
        include_placements: true,
        include_actions: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching combined insights:', error);
        toast.error("Failed to fetch combined insights");
        return [];
      }
    },
    refetchOnWindowFocus: false,
    enabled: activeTab === "combined" // Only fetch when combined tab is active
  });

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        selectedAccount={adAccountId}
        dateRange={dateRange}
        onAccountSelect={(id) => navigate(`/enhanced-insights/${id}`)}
        onDateRangeChange={setDateRange}
      />

      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-teal-500" />
              Enhanced Insights
            </h1>
            <p className="text-gray-600">
              Detailed analytics breakdown for your ad account with advanced metrics
            </p>
          </div>
          {/* Back button */}
          <Button 
            variant="outline" 
            className="mb-6 px-4 py-2 border-teal-500 text-white bg-teal-600 flex items-center gap-2 transition-all duration-200"
            onClick={() => navigate("/index")}
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 rounded-xl bg-white dark:bg-gray-800 p-1 border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="placements" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Placements</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="devices" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Devices</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Actions</span>
              </div>
            </TabsTrigger>
            {/* <TabsTrigger 
              value="combined" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Combined</span>
              </div>
            </TabsTrigger> */}
          </TabsList>

          {/* Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            <PlacementInsights 
              data={placementInsights || []} 
              isLoading={placementsLoading}
              adAccountId={adAccountId}
              dateRange={dateRange}
            />
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <DeviceInsights 
              data={deviceInsights || []} 
              isLoading={devicesLoading} 
            />
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <ActionInsights 
              data={actionInsights || []} 
              isLoading={actionsLoading} 
            />
          </TabsContent>

          {/* Combined Tab */}
          {/* <TabsContent value="combined" className="space-y-6">
            <CombinedInsights 
              data={combinedInsights || []} 
              isLoading={combinedLoading} 
            />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedInsights;