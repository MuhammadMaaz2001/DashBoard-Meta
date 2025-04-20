// import { motion } from "framer-motion";
// import { 
//   DollarSign, 
//   Eye, 
//   MousePointer, 
//   BarChart2, 
//   CircleDollarSign, 
//   Users,
//   Zap
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// interface ActionInsightsProps {
//   data: any[];
//   isLoading: boolean;
// }

// const ActionInsights = ({ data, isLoading }: ActionInsightsProps) => {
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
//       {/* Actions Summary as Cards */}
//       <div className="mb-8">
//         <div className="flex items-center gap-2 mb-4">
//           <Zap className="h-5 w-5 text-teal-500" />
//           <h3 className="text-lg font-medium text-gray-800">Actions Summary</h3>
//           <Badge className="bg-teal-500 text-white border-0 text-xs px-2.5 ml-2">
//             {data?.[0]?.actions?.length || 0} Actions
//           </Badge>
//         </div>
        
//         {data?.map((insight, index) => (
//           <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
//             {/* Impressions */}
//             <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
//                   <Eye className="h-4 w-4 text-blue-700" /> Impressions
//                 </p>
//                 <p className="text-xl font-bold text-blue-900">
//                   {Number.parseInt(insight.impressions || "0").toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Clicks */}
//             <Card className="bg-green-50 border-green-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-green-700 flex items-center gap-1">
//                   <MousePointer className="h-4 w-4 text-green-700" /> Clicks
//                 </p>
//                 <p className="text-xl font-bold text-green-900">
//                   {Number.parseInt(insight.clicks || "0").toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>
            
//             {/* Reach */}
//             <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
//                   <Users className="h-4 w-4 text-blue-700" /> Reach
//                 </p>
//                 <p className="text-xl font-bold text-blue-900">
//                   {Number.parseInt(insight.reach || "0").toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Spend */}
//             <Card className="bg-teal-50 border-teal-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-teal-700 flex items-center gap-1">
//                   <DollarSign className="h-4 w-4 text-teal-700" /> Spend
//                 </p>
//                 <p className="text-xl font-bold text-teal-900">
//                   ${Number.parseFloat(insight.spend || "0").toFixed(2)}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* CTR */}
//             <Card className="bg-amber-50 border-amber-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-amber-700 flex items-center gap-1">
//                   <BarChart2 className="h-4 w-4 text-amber-700" /> CTR
//                 </p>
//                 <p className="text-xl font-bold text-amber-900">
//                   {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
//                 </p>
//               </CardContent>
//             </Card>

//             {/* CPC */}
//             <Card className="bg-purple-50 border-purple-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-purple-700 flex items-center gap-1">
//                   <CircleDollarSign className="h-4 w-4 text-purple-700" /> CPC
//                 </p>
//                 <p className="text-xl font-bold text-purple-900">
//                   ${Number.parseFloat(insight.cpc || "0").toFixed(2)}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* CPM */}
//             <Card className="bg-indigo-50 border-indigo-200 shadow-sm hover:shadow-md transition">
//               <CardContent className="p-4 flex flex-col space-y-2">
//                 <p className="text-xs font-medium text-indigo-700 flex items-center gap-1">
//                   <CircleDollarSign className="h-4 w-4 text-indigo-700" /> CPM
//                 </p>
//                 <p className="text-xl font-bold text-indigo-900">
//                   ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* Action Details */}
//       <Card className="overflow-hidden border-0 rounded-lg shadow-sm">
//         <div className="bg-teal-500 py-3 px-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-2 text-white font-medium">
//               <Zap className="h-5 w-5" />
//               Action Details
//             </div>
//           </div>
//         </div>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table className="w-full max-w-full table-fixed">
//               <TableHeader>
//                 <TableRow className="bg-blue-50">
//                   <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/2">Action Type</TableHead>
//                   <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4 text-center">Value</TableHead>
//                   <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4 text-center">Cost Per Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {data?.[0]?.actions?.map((action, index) => {
//                   const costPerAction = data[0]?.cost_per_action_type?.find(
//                     (item) => item.action_type === action.action_type
//                   );
                  
//                   return (
//                     <TableRow 
//                       key={index}
//                       className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
//                     >
//                       <TableCell className="py-3 px-4 font-medium text-blue-900 dark:text-blue-100 truncate">
//                         {action.action_type.replace(/_/g, ' ')}
//                       </TableCell>
//                       <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 text-center">
//                         {Number.parseInt(action.value || "0").toLocaleString()}
//                       </TableCell>
//                       <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 text-center">
//                         {costPerAction ? `$${Number.parseFloat(costPerAction.value).toFixed(2)}` : "-"}
//                       </TableCell>
//                     </TableRow>
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

// export default ActionInsights;



import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Eye, 
  MousePointer, 
  BarChart2, 
  CircleDollarSign, 
  Users,
  Zap,
  Download,
  CheckCircle2
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionInsightsProps {
  data: any[];
  isLoading: boolean;
}

const ActionInsights = ({ data, isLoading }: ActionInsightsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Prepare action data for download
  const actionTableData = useMemo(() => {
    if (!data || data.length === 0 || !data[0]?.actions) return [];
    
    return data[0].actions.map(action => {
      const costPerAction = data[0]?.cost_per_action_type?.find(
        item => item.action_type === action.action_type
      );
      
      return {
        action_type: action.action_type.replace(/_/g, ' '),
        value: action.value,
        cost_per_action: costPerAction ? costPerAction.value : ''
      };
    });
  }, [data]);

  // Download action data as CSV
  const downloadActionCSV = () => {
    if (!actionTableData || actionTableData.length === 0) return;
    setIsDownloading(true);
    
    // Define columns
    const columns = ['action_type', 'value', 'cost_per_action'];
    
    // Create header row
    const headers = ['Action Type', 'Value', 'Cost Per Action'].join(',');
    
    // Create data rows
    const rows = actionTableData.map(item => {
      return columns.map(col => {
        let value = item[col];
        
        // Format specific columns
        if (col === 'value') {
          value = Number.parseInt(value || 0).toLocaleString();
        } else if (col === 'cost_per_action' && value) {
          value = `$${Number.parseFloat(value).toFixed(2)}`;
        }
        
        // Escape values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    }).join('\n');
    
    // Create CSV content
    const csvContent = `${headers}\n${rows}`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `action_details_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Add a small delay for better UX
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 800);
  };

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
      {/* Actions Summary as Cards */}
      {/* <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-medium text-gray-800">Actions Summary</h3>
          <Badge className="bg-teal-500 text-white border-0 text-xs px-2.5 ml-2">
            {data?.[0]?.actions?.length || 0} Actions
          </Badge>
        </div>
        
        {data?.map((insight, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          
            <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
                  <Eye className="h-4 w-4 text-blue-700" /> Impressions
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {Number.parseInt(insight.impressions || "0").toLocaleString()}
                </p>
              </CardContent>
            </Card>

          
            <Card className="bg-green-50 border-green-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-green-700 flex items-center gap-1">
                  <MousePointer className="h-4 w-4 text-green-700" /> Clicks
                </p>
                <p className="text-xl font-bold text-green-900">
                  {Number.parseInt(insight.clicks || "0").toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
          
            <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-700" /> Reach
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {Number.parseInt(insight.reach || "0").toLocaleString()}
                </p>
              </CardContent>
            </Card>

          
            <Card className="bg-teal-50 border-teal-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-teal-700 flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-teal-700" /> Spend
                </p>
                <p className="text-xl font-bold text-teal-900">
                  ${Number.parseFloat(insight.spend || "0").toFixed(2)}
                </p>
              </CardContent>
            </Card>

          
            <Card className="bg-amber-50 border-amber-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-amber-700 flex items-center gap-1">
                  <BarChart2 className="h-4 w-4 text-amber-700" /> CTR
                </p>
                <p className="text-xl font-bold text-amber-900">
                  {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
                </p>
              </CardContent>
            </Card>

          
            <Card className="bg-purple-50 border-purple-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-purple-700 flex items-center gap-1">
                  <CircleDollarSign className="h-4 w-4 text-purple-700" /> CPC
                </p>
                <p className="text-xl font-bold text-purple-900">
                  ${Number.parseFloat(insight.cpc || "0").toFixed(2)}
                </p>
              </CardContent>
            </Card>

          
            <Card className="bg-indigo-50 border-indigo-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 flex flex-col space-y-2">
                <p className="text-xs font-medium text-indigo-700 flex items-center gap-1">
                  <CircleDollarSign className="h-4 w-4 text-indigo-700" /> CPM
                </p>
                <p className="text-xl font-bold text-indigo-900">
                  ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div> */}

      {/* Action Details */}
      <Card className="overflow-hidden border-0 rounded-lg shadow-sm">
        <div className="bg-teal-500 py-3 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-medium">
            <div className="bg-white/20 p-2 rounded-lg">
              <Zap className="h-5 w-5" />
              </div>
              Action Details
            </div>
            
            {/* Download Action Details Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={downloadActionCSV}
                    disabled={!actionTableData.length || isDownloading}
                    className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2"
                  >
                    {!isDownloading && !showSuccess && <Download className="h-4 w-4" />}
                    {isDownloading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {showSuccess && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-teal-600 text-white border-teal-400">
                  <p>Download as CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full max-w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/2">Action Type</TableHead>
                  <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4 text-center">Value</TableHead>
                  <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4 text-center">Cost Per Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.[0]?.actions?.map((action, index) => {
                  const costPerAction = data[0]?.cost_per_action_type?.find(
                    (item) => item.action_type === action.action_type
                  );
                  
                  return (
                    <TableRow 
                      key={index}
                      className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                    >
                      <TableCell className="py-3 px-4 font-medium text-blue-900 dark:text-blue-100 truncate">
                        {action.action_type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 text-center">
                        {Number.parseInt(action.value || "0").toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 text-center">
                        {costPerAction ? `$${Number.parseFloat(costPerAction.value).toFixed(2)}` : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActionInsights;