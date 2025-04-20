import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Share2, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  BarChart, 
  CircleDollarSign, 
  Users,
  Download,
  Filter,
  ChevronDown
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EnhancedCharts from "@/components/insights/EnhancedPlacementChartsSection";
import { useQuery } from "@tanstack/react-query";
import { getEnhancedInsights } from "@/services/api";

interface PlacementInsightsProps {
  data: any[];
  isLoading: boolean;
  adAccountId?: string;
  dateRange?: { 
    from: Date;
    to: Date;
  };
}

const PlacementInsights = ({ data, isLoading, adAccountId, dateRange }: PlacementInsightsProps) => {
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [chartTab, setChartTab] = useState<string>("platforms");
  const [showAllRows, setShowAllRows] = useState(false);

  // Fetch device data for the chart component - only when devices tab is activated
  const { data: deviceData, isLoading: devicesLoading } = useQuery({
    queryKey: ["deviceInsights", adAccountId, dateRange, chartTab],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        since: dateRange.from.toISOString().split('T')[0],
        until: dateRange.to.toISOString().split('T')[0],
        include_devices: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching device insights:', error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    // Only fetch devices data when the devices tab is active in the chart
    enabled: chartTab === "devices" && !!adAccountId && !!dateRange?.from && !!dateRange?.to
  });

  // The placement data is now directly from the API
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => {
      // Parse numeric values
      return {
        ...item,
        impressions: parseFloat(item.impressions || "0"),
        clicks: parseFloat(item.clicks || "0"),
        spend: parseFloat(item.spend || "0"),
        reach: parseFloat(item.reach || "0"),
        ctr: parseFloat(item.ctr || "0"),
        cpc: item.cpc ? parseFloat(item.cpc) : 0,
        cpm: parseFloat(item.cpm || "0"),
        frequency: parseFloat(item.frequency || "0")
      };
    });
  }, [data]);

  // Get unique positions from formatted data
  const uniquePositions = useMemo(() => {
    if (!formattedData || formattedData.length === 0) return [];
    
    const positions = new Set<string>();
    formattedData.forEach(item => {
      if (item.platform_position) {
        const position = item.platform_position.replace('facebook_', '');
        positions.add(position);
      }
    });
    
    return Array.from(positions).sort();
  }, [formattedData]);

  // Filter data based on selected platform and position
  const filteredData = useMemo(() => {
    if (!formattedData) return [];
    
    return formattedData.filter(insight => 
      (platformFilter === "all" || insight.publisher_platform === platformFilter) &&
      (positionFilter === "all" || 
        (insight.platform_position && 
         insight.platform_position.replace('facebook_', '') === positionFilter))
    );
  }, [formattedData, platformFilter, positionFilter]);

  // Function to download data as CSV
  const downloadCSV = () => {
    if (!filteredData || filteredData.length === 0) return;
    
    // Define the columns to include in the CSV
    const columns = [
      'publisher_platform',
      'platform_position',
      'impressions',
      'clicks',
      'spend',
      'ctr',
      'cpc',
      'cpm'
    ];
    
    // Create CSV header row
    const headers = columns.map(col => {
      if (col === 'platform_position') return 'position';
      if (col === 'publisher_platform') return 'platform';
      return col;
    }).join(',');
    
    // Create CSV rows from filtered data
    const rows = filteredData.map(item => {
      return columns.map(col => {
        let value = item[col];
        
        // Format specific columns
        if (col === 'platform_position' && value) {
          value = value.replace('facebook_', '');
        } else if (col === 'impressions' || col === 'clicks') {
          // For whole numbers, don't use decimals
          value = Math.round(value).toString();
        } else if (col === 'spend') {
          // Format spend with 3 decimal places
          value = value.toFixed(3);
        } else if (col === 'ctr') {
          // Format percentage with 3 decimal places
          value = value.toFixed(3) + '%';
        } else if (col === 'cpc') {
          // Format CPC with 3 decimal places, handle cases with no clicks
          value = item.clicks > 0 ? value.toFixed(3) : '-';
        } else if (col === 'cpm') {
          // Format CPM with 3 decimal places
          value = value.toFixed(3);
        }
        
        // Escape commas and double quotes for CSV format
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    }).join('\n');
    
    // Create the full CSV content
    const csvContent = `${headers}\n${rows}`;
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `placement_insights_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    
    // Append, click, and remove link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayData = showAllRows ? filteredData : filteredData.slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 rounded-xl shadow-lg bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
        <div className="bg-teal-500 py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="text-lg font-medium text-white">Placement Breakdown</h5>
                <p className="text-xs text-white/70">Metrics by platform and position</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Platform Filter */}
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <Filter className="h-4 w-4 text-white" />
                <label htmlFor="platform-filter" className="text-white text-sm font-medium">Platform:</label>
                <select
                  id="platform-filter"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="bg-white/30 text-teal-800 text-sm rounded px-2 py-1 border-0 focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              
              {/* Position Filter */}
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <Filter className="h-4 w-4 text-white" />
                <label htmlFor="position-filter" className="text-white text-sm font-medium">Position:</label>
                <select
                  id="position-filter"
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="bg-white/30 text-teal-800 text-sm rounded px-2 py-1 border-0 focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Positions</option>
                  {uniquePositions.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Download Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={downloadCSV}
                      className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2"
                      disabled={filteredData.length === 0}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Entry Badge */}
              <Badge className="bg-teal-600/70 hover:bg-teal-600 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
                {filteredData.length} Entries
              </Badge>
            </div>
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    Platform
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    Position
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span>Impressions</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-green-600" />
                      <span>Clicks</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>Spend</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-indigo-600" />
                      <span>CTR</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-pink-600" />
                      <span>CPC</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-red-600" />
                      <span>CPM</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.length > 0 ? (
                  displayData.map((insight, index) => {
                    return (
                      <motion.tr
                        key={index}
                        className="border-b border-blue-100 dark:border-blue-700 hover:bg-blue-50/70 dark:hover:bg-blue-800/50 transition-colors duration-200"
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
                      >
                        <TableCell className="py-4 px-2 font-medium text-blue-900 dark:text-blue-100">
                          {insight.publisher_platform}
                        </TableCell>
                        <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
                          {insight.platform_position ? insight.platform_position.replace('facebook_', '') : 'N/A'}
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-blue-700">
                              {Math.round(insight.impressions).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                            <MousePointerClick className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-green-700">
                              {Math.round(insight.clicks).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold text-emerald-700">
                              ${parseFloat(insight.spend).toFixed(3)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
                            <BarChart className="w-4 h-4 text-indigo-500" />
                            <span className="font-semibold text-indigo-700">
                              {parseFloat(insight.ctr).toFixed(3)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
                            <CircleDollarSign className="w-4 h-4 text-pink-500" />
                            <span className="font-semibold text-pink-700">
                              ${insight.clicks > 0 ? parseFloat(insight.cpc).toFixed(3) : '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                            <Users className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-red-700">
                              ${parseFloat(insight.cpm).toFixed(3)}
                            </span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                      No data available for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Show More Button - only display if there are more rows to show */}
            {!showAllRows && filteredData.length > 10 && (
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
                    <span className="font-medium">View All {filteredData.length} Entries</span>
                    <div className="bg-teal-500 rounded-full p-1 group-hover:bg-teal-600 transition-colors duration-200">
                      <ChevronDown className="h-3 w-3 text-white" />
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Show Less Button - only display if showing all rows and there are more than 10 */}
            {showAllRows && filteredData.length > 10 && (
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

      {/* Charts Section */}
      <div className="w-full mt-12">
        <EnhancedCharts 
          // Use the device data when on the devices tab, otherwise use the placement data
          data={chartTab === "devices" && deviceData ? deviceData : data}
          chartTab={chartTab}
          setChartTab={setChartTab}
        />
      </div>
    </motion.div>
  );
};

export default PlacementInsights;

// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { 
//   Share2, 
//   MonitorSmartphone, 
//   Eye, 
//   MousePointerClick, 
//   DollarSign, 
//   BarChart, 
//   CircleDollarSign, 
//   Users,
//   Smartphone,
//   Tablet,
//   Monitor,
//   PieChart,
//   Activity
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import EnhancedCharts from "@/components/insights/EnhancedPlacementChartsSection";


// interface PlacementInsightsProps {
//   data: any[];
//   isLoading: boolean;
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4BC0C0', '#FF6384'];

// const PlacementInsights = ({ data, isLoading }: PlacementInsightsProps) => {
//   const [platformFilter, setPlatformFilter] = useState<string>("all");
//   const [chartTab, setChartTab] = useState<string>("platforms");

//   // Calculate stats for summary cards
//   const totalSpend = useMemo(() => 
//     data?.reduce((sum, item) => sum + Number(item.spend || 0), 0).toFixed(2) || "0", 
//     [data]
//   );
  
//   // Filter data based on selected platform - do this in a useMemo to avoid recalculation
//   const filteredData = useMemo(() => 
//     data?.filter(insight => platformFilter === "all" || insight.publisher_platform === platformFilter) || [],
//     [data, platformFilter]
//   );

//   // Prepare chart data - ensure these don't change between renders
//   const platformChartData = useMemo(() => {
//     const platforms = {};
//     data?.forEach(item => {
//       const platform = item.publisher_platform;
//       platforms[platform] = (platforms[platform] || 0) + Number(item.impressions || 0);
//     });
    
//     return Object.keys(platforms).map(name => ({
//       name,
//       value: platforms[name]
//     }));
//   }, [data]);

//   const positionChartData = useMemo(() => {
//     const positions = {};
//     data?.forEach(item => {
//       const position = item.platform_position.replace('facebook_', '');
//       positions[position] = (positions[position] || 0) + Number(item.impressions || 0);
//     });
    
//     return Object.keys(positions).map(name => ({
//       name,
//       value: positions[name]
//     }));
//   }, [data]);

//   const deviceChartData = useMemo(() => {
//     const devices = {};
//     data?.forEach(item => {
//       const device = item.impression_device;
//       devices[device] = (devices[device] || 0) + Number(item.impressions || 0);
//     });
    
//     return Object.keys(devices).map(name => ({
//       name,
//       value: devices[name]
//     }));
//   }, [data]);

//   // Spending by platform bar chart data
//   const spendByPlatformData = useMemo(() => {
//     const platforms = {};
//     data?.forEach(item => {
//       const platform = item.publisher_platform;
//       platforms[platform] = (platforms[platform] || 0) + Number(item.spend || 0);
//     });
    
//     return Object.keys(platforms).map(name => ({
//       name,
//       spend: parseFloat(platforms[name].toFixed(2))
//     }));
//   }, [data]);

//   // Position by clicks chart data
//   const clicksByPositionData = useMemo(() => {
//     return positionChartData.map(pos => ({
//       name: pos.name,
//       clicks: data.filter(item => 
//         item.platform_position.replace('facebook_', '') === pos.name
//       ).reduce((sum, item) => sum + Number(item.clicks || 0), 0)
//     }));
//   }, [data, positionChartData]);

//   // Device performance chart data
//   const devicePerformanceData = useMemo(() => {
//     return deviceChartData.map(device => {
//       const filteredItems = data.filter(item => item.impression_device === device.name);
//       const totalImpressions = filteredItems.reduce((sum, item) => sum + Number(item.impressions || 0), 0);
//       const totalClicks = filteredItems.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
//       const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
//       return {
//         name: device.name,
//         ctr: parseFloat(ctr.toFixed(2))
//       };
//     });
//   }, [data, deviceChartData]);
  
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-10">
//         <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
//       </div>
//     );
//   }
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Charts Section */}
//       <EnhancedCharts 
//         data={data} 
//         chartTab={chartTab}
//         setChartTab={setChartTab}
//       />
      
//       {/* Table Section */}
//       <Card className="overflow-hidden border-0 rounded-xl shadow-lg bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
//         <div className="bg-teal-500 py-4 px-6">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <div className="flex items-center gap-2">
//               <div className="bg-white/20 p-2 rounded-lg">
//                 <Share2 className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-white">Placement Breakdown</h3>
//                 <p className="text-xs text-white/70">Detailed analytics by platform, position and device</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
//                 <label htmlFor="platform-filter" className="text-white text-sm font-medium">Platform:</label>
//                 <select
//                   id="platform-filter"
//                   value={platformFilter}
//                   onChange={(e) => setPlatformFilter(e.target.value)}
//                   className="bg-white/30 text-teal-800 text-sm rounded px-2 py-1 border-0 focus:ring-2 focus:ring-white/50"
//                 >
//                   <option value="all">All Platforms</option>
//                   <option value="facebook">Facebook</option>
//                   <option value="instagram">Instagram</option>
//                 </select>
//               </div>
//               <Badge className="bg-teal-600/70 hover:bg-teal-600 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
//                 {filteredData.length} Entries
//               </Badge>
//             </div>
//           </div>
//         </div>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-blue-50">
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     Platform
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     Position
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <MonitorSmartphone className="h-4 w-4 text-amber-600" />
//                       <span>Device</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <Eye className="h-4 w-4 text-blue-600" />
//                       <span>Impressions</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <MousePointerClick className="h-4 w-4 text-green-600" />
//                       <span>Clicks</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="h-4 w-4 text-emerald-600" />
//                       <span>Spend</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <BarChart className="h-4 w-4 text-indigo-600" />
//                       <span>CTR</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <CircleDollarSign className="h-4 w-4 text-pink-600" />
//                       <span>CPC</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4 text-red-600" />
//                       <span>CPM</span>
//                     </div>
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredData.map((insight, index) => {
//                   // Determine device icon
//                   let DeviceIcon = MonitorSmartphone;
//                   let deviceColor = "text-gray-500";
                  
//                   if (insight.impression_device.includes('iphone')) {
//                     DeviceIcon = Smartphone;
//                     deviceColor = "text-blue-500";
//                   } else if (insight.impression_device.includes('android')) {
//                     DeviceIcon = Smartphone;
//                     deviceColor = "text-green-500";
//                   } else if (insight.impression_device.includes('ipad')) {
//                     DeviceIcon = Tablet;
//                     deviceColor = "text-purple-500";
//                   } else if (insight.impression_device.includes('desktop')) {
//                     DeviceIcon = Monitor;
//                     deviceColor = "text-gray-600";
//                   }
                  
//                   // For interactive rows with animation
//                   return (
//                     <motion.tr
//                       key={index}
//                       className="border-b border-blue-100 dark:border-blue-700 hover:bg-blue-50/70 dark:hover:bg-blue-800/50 transition-colors duration-200"
//                       whileHover={{ scale: 1.01 }}
//                       transition={{ type: "spring", stiffness: 300 }}
//                     >
//                       <TableCell className="py-4 px-2 font-medium text-blue-900 dark:text-blue-100">
//                         {insight.publisher_platform}
//                       </TableCell>
//                       <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
//                         {insight.platform_position.replace('facebook_', '')}
//                       </TableCell>
//                       <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
//                         <div className="flex items-center gap-2">
//                           <div className={`bg-gray-100 p-1.5 rounded-md`}>
//                             <DeviceIcon className={`w-4 h-4 ${deviceColor}`} />
//                           </div>
//                           <span>{insight.impression_device}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
//                           <Eye className="w-4 h-4 text-blue-500" />
//                           <span className="font-semibold text-blue-700">
//                             {Number.parseInt(insight.impressions || "0").toLocaleString()}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
//                           <MousePointerClick className="w-4 h-4 text-green-500" />
//                           <span className="font-semibold text-green-700">
//                             {Number.parseInt(insight.clicks || "0").toLocaleString()}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
//                           <DollarSign className="w-4 h-4 text-emerald-500" />
//                           <span className="font-semibold text-emerald-700">
//                             ${Number.parseFloat(insight.spend || "0").toFixed(2)}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
//                           <BarChart className="w-4 h-4 text-indigo-500" />
//                           <span className="font-semibold text-indigo-700">
//                             {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
//                           <CircleDollarSign className="w-4 h-4 text-pink-500" />
//                           <span className="font-semibold text-pink-700">
//                             {insight.cpc ? `$${Number.parseFloat(insight.cpc).toFixed(2)}` : "-"}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
//                           <Users className="w-4 h-4 text-red-500" />
//                           <span className="font-semibold text-red-700">
//                             ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
//                           </span>
//                         </div>
//                       </TableCell>
//                     </motion.tr>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default PlacementInsights;