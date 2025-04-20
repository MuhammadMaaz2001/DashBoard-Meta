import { useState, useEffect } from "react";
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface MultiMetricChartProps {
  data: any[];
  title: string;
  description?: string;
  metrics: {
    key: string;
    name: string;
    color: string;
  }[];
}

export function MultiMetricChart({ data, title, description, metrics }: MultiMetricChartProps) {
  // Main states
  const [activeMetrics, setActiveMetrics] = useState<string[]>(metrics.map(m => m.key));
  const [chartType, setChartType] = useState<"line" | "area" | "combo">("line");
  const [timeRange, setTimeRange] = useState<"all" | "quarter" | "month">("all");
  const [maxValue, setMaxValue] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  
  // Simple controls - no extra features
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(false);

  // Filter data based on time range
  const filteredData = (() => {
    if (timeRange === "all") return data;
    if (timeRange === "quarter") return data.slice(-Math.min(90, data.length));
    return data.slice(-Math.min(30, data.length));
  })();

  // Calculate max value for dynamic Y-axis
  useEffect(() => {
    if (!filteredData.length) return;
    
    const activeMetricsSet = new Set(activeMetrics);
    const max = Math.max(
      ...filteredData.flatMap((item) => 
        metrics
          .filter(m => activeMetricsSet.has(m.key))
          .map((metric) => Number(item[metric.key]) || 0)
      )
    );
    setMaxValue(max * 1.15); // Add 15% padding to the top
  }, [filteredData, metrics, activeMetrics]);

  // Format values for display
  const formatValue = (value: number, key: string) => {
    if (value === undefined || value === null || isNaN(value)) return '—';
    
    switch (key) {
      case "frequency":
        return value.toFixed(2);
      case "cpc":
      case "cpm":
        return `$${value.toFixed(2)}`;
      case "ctr":
        return `${(value * 100).toFixed(2)}%`;
      case "impressions":
      case "reach":
        return value >= 1000000
          ? `${(value / 1000000).toFixed(1)}M`
          : value >= 1000
          ? `${(value / 1000).toFixed(1)}K`
          : value.toLocaleString("en-US");
      default:
        return value.toLocaleString();
    }
  };

  // Vibrant color palette with good contrast
  const colorPalette = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#ec4899", // Pink
  ];

  // Determine if a metric should be a bar, area, or line based on metric key and chart type
  const getChartElementType = (key: string) => {
    // Override for combo chart based on metric type
    if (chartType === "combo") {
      if (key.includes("impressions") || key.includes("reach")) {
        return "area";
      }
      if (key.includes("spend") || key.includes("revenue") || key.includes("cost")) {
        return "bar";
      }
      if (key.includes("ctr") || key.includes("cpc") || key.includes("cpm") || key.includes("frequency")) {
        return "line";
      }
      
      // Default for metrics without a specific pattern
      const index = metrics.findIndex(m => m.key === key);
      // Assign different chart types based on index
      return index % 3 === 0 ? "bar" : index % 3 === 1 ? "area" : "line";
    }
    
    // For non-combo chart types
    return chartType === "area" ? "area" : "line";
  };

  // Toggle a metric's visibility
  const toggleMetric = (key: string) => {
    if (activeMetrics.includes(key)) {
      setActiveMetrics(activeMetrics.filter(m => m !== key));
    } else {
      setActiveMetrics([...activeMetrics, key]);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with simplified controls */}
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</CardTitle>
            
            <div className="flex items-center gap-2">
              <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as any)}>
                <ToggleGroupItem value="line" size="sm" className="h-7 px-3 text-xs">
                  Line
                </ToggleGroupItem>
                <ToggleGroupItem value="area" size="sm" className="h-7 px-3 text-xs">
                  Area
                </ToggleGroupItem>
                {/* <ToggleGroupItem value="combo" size="sm" className="h-7 px-3 text-xs">
                  Combo
                </ToggleGroupItem> */}
              </ToggleGroup>
            </div>
          </div>
          
          {description && (
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{description}</CardDescription>
          )}
          
          {/* Simple time range selection */}
          <div className="flex items-center gap-2">
            <div className="ml-auto flex items-center gap-2">
              {/* <button 
                onClick={() => setShowGrid(!showGrid)}
                className="text-xs px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Grid {showGrid ? "On" : "Off"}
              </button> */}
              <button 
                onClick={() => setShowPoints(!showPoints)}
                className="text-xs px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Points {showPoints ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Metrics Selection - With chart type indicators for combo mode */}
        <div className="mb-4 flex flex-wrap gap-3">
          {metrics.map((metric, index) => {
            const isActive = activeMetrics.includes(metric.key);
            const color = metric.color || colorPalette[index % colorPalette.length];
            const elementType = getChartElementType(metric.key);
            
            return (
              <div
                key={metric.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
                  ${isActive ? 'bg-gray-100 dark:bg-gray-700' : 'bg-transparent opacity-60'}`}
                onClick={() => toggleMetric(metric.key)}
                onMouseEnter={() => setHoveredMetric(metric.key)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {metric.name}
                  </span>
                  {chartType === "combo" && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {elementType === "bar" ? "Bar" : elementType === "area" ? "Area" : "Line"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Chart - Now with properly working combo mode */}
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  vertical={false}
                  opacity={0.5}
                />
              )}

              <XAxis
                dataKey="custom_label"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                interval="preserveStartEnd"
                padding={{ left: 10, right: 10 }}
              />

              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => {
                  const activeKey = activeMetrics.length > 0 ? 
                    metrics.find(m => m.key === activeMetrics[0])?.key : 
                    metrics[0]?.key;
                  return formatValue(value, activeKey || '');
                }}
                domain={[0, maxValue]}
                width={60}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value: any, name: string) => {
                  const metric = metrics.find((m) => m.name === name);
                  return [formatValue(value, metric?.key || ""), name];
                }}
              />

              {/* Logic to determine chart element order for proper rendering in combo mode */}
              {/* First render all bars to ensure they appear in the background */}
              {chartType === "combo" && activeMetrics
                .filter(key => getChartElementType(key) === "bar")
                .map(key => {
                  const metric = metrics.find(m => m.key === key)!;
                  const index = metrics.findIndex(m => m.key === key);
                  const color = metric.color || colorPalette[index % colorPalette.length];
                  const isHighlighted = hoveredMetric === key;
                  
                  return (
                    <Bar
                      key={`bar-${key}`}
                      dataKey={key}
                      name={metric.name}
                      fill={color}
                      stroke={color}
                      opacity={hoveredMetric && !isHighlighted ? 0.5 : 1}
                      barSize={20}
                      fillOpacity={0.7}
                    />
                  );
                })
              }
              
              {/* Then render all areas */}
              {chartType === "combo" && activeMetrics
                .filter(key => getChartElementType(key) === "area")
                .map(key => {
                  const metric = metrics.find(m => m.key === key)!;
                  const index = metrics.findIndex(m => m.key === key);
                  const color = metric.color || colorPalette[index % colorPalette.length];
                  const isHighlighted = hoveredMetric === key;
                  
                  return (
                    <Area
                      key={`area-${key}`}
                      dataKey={key}
                      name={metric.name}
                      fill={color}
                      stroke={color}
                      opacity={hoveredMetric && !isHighlighted ? 0.5 : 1}
                      type="monotone"
                      fillOpacity={0.4}
                      strokeWidth={2}
                      dot={showPoints ? { r: 3 } : false}
                      activeDot={{ r: 5 }}
                    />
                  );
                })
              }
              
              {/* Finally render all lines to ensure they appear on top */}
              {chartType === "combo" && activeMetrics
                .filter(key => getChartElementType(key) === "line")
                .map(key => {
                  const metric = metrics.find(m => m.key === key)!;
                  const index = metrics.findIndex(m => m.key === key);
                  const color = metric.color || colorPalette[index % colorPalette.length];
                  const isHighlighted = hoveredMetric === key;
                  
                  return (
                    <Line
                      key={`line-${key}`}
                      dataKey={key}
                      name={metric.name}
                      stroke={color}
                      fill="none"
                      opacity={hoveredMetric && !isHighlighted ? 0.5 : 1}
                      type="monotone"
                      strokeWidth={isHighlighted ? 3 : 2}
                      dot={showPoints ? { r: 3 } : false}
                      activeDot={{ r: 5 }}
                      connectNulls={true}
                    />
                  );
                })
              }
              
              {/* For non-combo charts, use a simpler rendering approach */}
              {chartType !== "combo" && metrics.map((metric, index) => {
                // Skip if not active
                if (!activeMetrics.includes(metric.key)) return null;
                
                const color = metric.color || colorPalette[index % colorPalette.length];
                const isHighlighted = hoveredMetric === metric.key;
                
                const commonProps = {
                  key: metric.key,
                  dataKey: metric.key,
                  name: metric.name,
                  fill: color,
                  stroke: color,
                  opacity: hoveredMetric && !isHighlighted ? 0.5 : 1,
                };
                
                if (chartType === "area") {
                  return (
                    <Area
                      {...commonProps}
                      type="monotone"
                      fillOpacity={0.4}
                      strokeWidth={2}
                      dot={showPoints ? { r: 3 } : false}
                      activeDot={{ r: 5 }}
                    />
                  );
                } else {
                  return (
                    <Line
                      {...commonProps}
                      type="monotone"
                      strokeWidth={isHighlighted ? 3 : 2}
                      dot={showPoints ? { r: 3 } : false}
                      activeDot={{ r: 5 }}
                      connectNulls={true}
                    />
                  );
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}