// import { Line, LineChart, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface CampaignChartProps {
//   data: any[];
//   title: string;
//   metric: string;
// }

// export function CampaignChart({ data, title, metric }: CampaignChartProps) {
//   // Calculate the maximum value for Y-axis scaling
//   const maxValue = Math.max(...data.map(item => parseFloat(item[metric]) || 0));
//   const yAxisDomain = [0, Math.ceil(maxValue * 1.1)]; // Add 10% padding to the top

//   return (
//     <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100/50 dark:border-blue-800/50">
//       <CardHeader>
//         <CardTitle className="text-blue-900/80 dark:text-blue-100/80">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={data}
//               margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" className="stroke-blue-200/20 dark:stroke-blue-700/20" />
              
//               <XAxis 
//                 dataKey="date_start" 
//                 tick={{ fill: 'hsl(var(--muted-foreground))' }}
//                 axisLine={{ stroke: 'hsl(var(--border))' }}
//                 tickLine={{ stroke: 'hsl(var(--border))' }}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString()}
//                 padding={{ left: 10, right: 10 }}
//               />
              
//               <YAxis 
//                 domain={yAxisDomain}
//                 tick={{ fill: 'hsl(var(--muted-foreground))' }}
//                 axisLine={{ stroke: 'hsl(var(--border))' }}
//                 tickLine={{ stroke: 'hsl(var(--border))' }}
//                 tickFormatter={(value) => `$${value}`}
//                 padding={{ top: 20 }}
//               />
              
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: 'hsl(var(--card))',
//                   border: '1px solid hsl(var(--border))',
//                   borderRadius: '8px',
//                 }}
//                 formatter={(value: any) => {
//                   const numValue = parseFloat(value);
//                   return isNaN(numValue) ? ['$0.00', 'Spend'] : [`$${numValue.toFixed(2)}`, 'Spend'];
//                 }}
//                 labelFormatter={(label) => new Date(label).toLocaleDateString()}
//               />

//               {/* Area Chart for shaded effect */}
//               <Area
//                 type="monotone"
//                 dataKey={metric}
//                 stroke="hsl(var(--primary))"
//                 fill="hsl(var(--primary) / 0.2)"
//                 strokeWidth={2}
//               />

//               <Line
//                 type="monotone"
//                 dataKey={metric}
//                 strokeWidth={2}
//                 stroke="hsl(var(--primary))"
//                 dot={false}
//                 activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { 
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Scatter, Area, AreaChart 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CampaignChartProps {
  data: any[];
  title: string;
  metric: string;
  description?: string;
}

export function CampaignChart({ data, title, metric, description }: CampaignChartProps) {
  // Ensure data has numeric values for the specified metric
  const processedData = data.map(item => ({
    ...item,
    [metric]: typeof item[metric] === 'string' ? parseFloat(item[metric] || '0') : (item[metric] || 0)
  }));
  
  const maxValue = Math.max(...processedData.map(item => item[metric] || 0));
  const yAxisDomain = [0, Math.ceil(maxValue * 1.1)];
  
  // Calculate some statistics to display
  const totalValue = processedData.reduce((sum, item) => sum + (item[metric] || 0), 0);
  const averageValue = totalValue / (processedData.length || 1);
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get formatted metric name for display
  const metricLabel = metric.charAt(0).toUpperCase() + metric.slice(1);
  
  return (
    <div className="transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</CardTitle>
            {description && <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</CardDescription>}
          </div>
          {/* <div className="flex flex-col items-end">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total: <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalValue)}</span></div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Avg: <span className="text-blue-600 dark:text-blue-400">{formatCurrency(averageValue)}</span></div>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              {/* Enhanced gradient for smooth area fill */}
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#b3d4ff" stopOpacity={0.2} />
                </linearGradient>
                {/* Add a subtle animation effect */}
                <filter id="shadow" height="130%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                  <feOffset in="blur" dx="0" dy="3" result="offsetBlur" />
                  <feComponentTransfer in="offsetBlur">
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700 opacity-70" 
                vertical={false}
              />
              
              <XAxis 
                dataKey="custom_label" 
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 12,
                  fontWeight: 500
                }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                padding={{ left: 10, right: 10 }}
                label={{
                  value: "Time Period",
                  position: "insideBottom",
                  offset: -15,
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 13,
                  fontWeight: 600
                }}
              />

              <YAxis 
                domain={yAxisDomain}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 12,
                  fontWeight: 500
                }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                label={{
                  value: metricLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: 'middle',
                  },
                  offset: -5,
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 13,
                  fontWeight: 600
                }}
                tickFormatter={(value) => formatCurrency(value)}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  padding: "12px",
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                  fontWeight: 500
                }}
                itemStyle={{ color: "#4f8ef7", fontWeight: "bold" }}
                formatter={(value: any, name: string) => {
                  const numValue = parseFloat(value);
                  const formattedValue = isNaN(numValue) ? '$0.00' : formatCurrency(numValue);
                  return [formattedValue, metricLabel];
                }}
                labelFormatter={(label) => {
                  return <span className="font-semibold text-gray-700 dark:text-gray-200">{label}</span>;
                }}
                cursor={{ stroke: '#4f8ef7', strokeWidth: 1, strokeDasharray: '5 5' }}
              />

              <Area
                type="monotone"
                dataKey={metric}
                strokeWidth={3}
                stroke="#4f8ef7"
                fill="url(#colorArea)"
                fillOpacity={1}
                activeDot={{ 
                  r: 6, 
                  fill: '#4f8ef7', 
                  stroke: "white", 
                  strokeWidth: 2,
                  className: "animate-pulse" 
                }}
                filter="url(#shadow)"
              />

              <Line
                type="monotone"
                dataKey={metric}
                strokeWidth={0}
                dot={{ 
                  r: 5, 
                  fill: '#4f8ef7', 
                  stroke: "white", 
                  strokeWidth: 2,
                  className: "drop-shadow-md" 
                }}
                activeDot={{ 
                  r: 7, 
                  fill: '#4f8ef7', 
                  stroke: "white", 
                  strokeWidth: 2,
                  strokeDasharray: "0",
                  className: "drop-shadow-lg" 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Add subtle details at the bottom of chart */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 px-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>{metricLabel} over time</span>
          </div>
          {/* <div className="text-xs italic">
            Data from {processedData.length} time periods
          </div> */}
        </div>
      </CardContent>
    </div>
  );
}