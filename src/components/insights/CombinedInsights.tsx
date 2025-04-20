import { motion } from "framer-motion";
import { 
  Share2, 
  Zap, 
  MonitorSmartphone,
  BarChart,
  DollarSign,
  PieChart,
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CombinedInsightsProps {
  data: any[];
  isLoading: boolean;
}

const CombinedInsights = ({ data, isLoading }: CombinedInsightsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  // Calculate total metrics
  const totalImpressions = data?.reduce((sum, item) => sum + Number(item.impressions || 0), 0);
  const totalClicks = data?.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
  const totalSpend = data?.[0]?.spend ? Number.parseFloat(data[0].spend).toFixed(2) : "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 rounded-lg shadow-lg bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 mb-8">
        <div className="bg-teal-500 py-3 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-medium">
              <BarChart className="h-5 w-5" />
              Combined Insights Summary
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-gray-700 mb-4">
            This view combines placement data with action metrics for comprehensive analysis.
          </p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Placements</p>
                    <p className="text-2xl font-bold">{data?.length || 0}</p>
                  </div>
                  <Share2 className="h-8 w-8 text-blue-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Actions</p>
                    <p className="text-2xl font-bold">{data?.[0]?.actions?.length || 0}</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Unique Devices</p>
                    <p className="text-2xl font-bold">
                      {new Set(data?.map(i => i.impression_device)).size || 0}
                    </p>
                  </div>
                  <MonitorSmartphone className="h-8 w-8 text-purple-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Total Spend</p>
                    <p className="text-2xl font-bold">
                      ${totalSpend}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-amber-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Activity className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-indigo-700">Performance Overview</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-indigo-500 font-medium">Impressions</p>
                    <p className="text-lg font-bold text-indigo-900">{totalImpressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-500 font-medium">Clicks</p>
                    <p className="text-lg font-bold text-indigo-900">{totalClicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-500 font-medium">CTR</p>
                    <p className="text-lg font-bold text-indigo-900">
                      {totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-500 font-medium">CPC</p>
                    <p className="text-lg font-bold text-indigo-900">
                      ${totalClicks > 0 ? (Number(totalSpend) / totalClicks).toFixed(2) : "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-emerald-700">Top Platform</h3>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-emerald-500 font-medium">Most Popular Platform</p>
                  <p className="text-lg font-bold text-emerald-900 mb-1">{getMostCommonValue(data, 'publisher_platform')}</p>
                  
                  <p className="text-xs text-emerald-500 font-medium mt-3">Top Position</p>
                  <p className="text-lg font-bold text-emerald-900">{getMostCommonValue(data, 'platform_position')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-100 rounded-full">
                    <PieChart className="h-5 w-5 text-rose-600" />
                  </div>
                  <h3 className="font-medium text-rose-700">Audience Insights</h3>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-rose-500 font-medium">Primary Device</p>
                  <p className="text-lg font-bold text-rose-900 mb-1">{getMostCommonValue(data, 'impression_device')}</p>
                  
                  {data?.[0]?.actions && (
                    <>
                      <p className="text-xs text-rose-500 font-medium mt-3">Top Action</p>
                      <p className="text-lg font-bold text-rose-900">{getMostCommonAction(data?.[0]?.actions)}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-teal-500" />
              Key Insights
            </h3>
            
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-blue-100 p-1 rounded-full">
                  <Share2 className="h-3 w-3 text-blue-600" />
                </div>
                <span>Most impressions come from {getMostCommonValue(data, 'platform_position')} on {getMostCommonValue(data, 'publisher_platform')}</span>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-green-100 p-1 rounded-full">
                  <MonitorSmartphone className="h-3 w-3 text-green-600" />
                </div>
                <span>{getMostCommonValue(data, 'impression_device')} is the most common device used by your audience</span>
              </li>
              
              {data?.[0]?.actions && (
                <li className="flex items-start gap-2">
                  <div className="mt-1 bg-purple-100 p-1 rounded-full">
                    <Zap className="h-3 w-3 text-purple-600" />
                  </div>
                  <span>
                    The most common action type is {getMostCommonAction(data?.[0]?.actions)}
                  </span>
                </li>
              )}
              
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-amber-100 p-1 rounded-full">
                  <DollarSign className="h-3 w-3 text-amber-600" />
                </div>
                <span>
                  Your average cost per click (CPC) is ${totalClicks > 0 ? (Number(totalSpend) / totalClicks).toFixed(2) : "0.00"}
                </span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-lg mt-4 border border-blue-100">
              <p className="text-sm text-blue-700 italic flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>Use the Placements and Actions tabs for detailed breakdowns of each metric category.</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to get the most common value in an array of objects
function getMostCommonValue(data, key) {
  if (!data || data.length === 0) return "N/A";
  
  const counts = {};
  data.forEach(item => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
  });
  
  let maxCount = 0;
  let mostCommon = "N/A";
  
  Object.keys(counts).forEach(value => {
    if (counts[value] > maxCount) {
      maxCount = counts[value];
      mostCommon = value;
    }
  });
  
  return mostCommon.replace('facebook_', '');
}

function getMostCommonAction(actions) {
  if (!actions || actions.length === 0) return "N/A";
  
  // Sort actions by value (highest to lowest)
  const sortedActions = [...actions].sort((a, b) => 
    Number(b.value) - Number(a.value)
  );
  
  // Return the action type with highest value
  return sortedActions[0].action_type.replace(/_/g, ' ');
}

export default CombinedInsights;