"use client"

import { useState, useMemo } from "react"
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Treemap,
} from "recharts"
import D3Treemap from './d3chart'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard } from "lucide-react"

// Add TypeScript interfaces at the top of the file
interface DataItem {
  publisher_platform: string
  platform_position: string
  impression_device: string
  impressions: number | string
  clicks: number | string
  spend: number | string
  reach: number | string
  frequency?: number
  ctr?: number
  cpc?: number
  cpm?: number
}

interface ChartProps {
  data: DataItem[]
  chartTab: string
  setChartTab: (tab: string) => void
}

interface MetricItem {
  value: string
  label: string
}

interface PlatformData {
  name: string
  impressions: number
  clicks: number
  spend: number
  reach: number
  frequency: number
  ctr: number
  cpc: number
  cpm: number
}

// Replace the FilteredCharts component with this enhanced version
const FilteredCharts = ({ data, chartTab, setChartTab }: ChartProps) => {
  // State for selected metric
  const [selectedMetric, setSelectedMetric] = useState<string>("impressions")
  // Add toggle state for devices view
  const [showAllDevices, setShowAllDevices] = useState<boolean>(true)

  // Metrics for filter
  const metrics: MetricItem[] = [
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
    { value: "spend", label: "Spend" },
    { value: "reach", label: "Reach" },
    { value: "frequency", label: "Frequency" },
    { value: "ctr", label: "CTR" },
    { value: "cpc", label: "CPC" },
    { value: "cpm", label: "CPM" },
  ]

  // Prepare platform data
  const platformData = useMemo(() => {
    const platforms: Record<string, PlatformData> = {}

    // Group by platform
    data?.forEach((item) => {
      const platform = item.publisher_platform || "unknown"
      if (!platforms[platform]) {
        platforms[platform] = {
          name: platform,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      platforms[platform].impressions += Number(item.impressions || 0)
      platforms[platform].clicks += Number(item.clicks || 0)
      platforms[platform].spend += Number(item.spend || 0)
      platforms[platform].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each platform
    Object.values(platforms).forEach((platform) => {
      // Frequency (reach must be non-zero to calculate)
      platform.frequency = platform.reach > 0 ? platform.impressions / platform.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      platform.ctr = platform.impressions > 0 ? (platform.clicks / platform.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      platform.cpc = platform.clicks > 0 ? platform.spend / platform.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      platform.cpm = platform.impressions > 0 ? (platform.spend / platform.impressions) * 1000 : 0
    })

    return Object.values(platforms)
  }, [data])

  // Prepare position data
  const positionData = useMemo(() => {
    const positions: Record<string, PlatformData> = {}

    // Group by position
    data?.forEach((item) => {
      const position = item.platform_position ? item.platform_position.replace("facebook_", "") : "unknown"
      if (!positions[position]) {
        positions[position] = {
          name: position,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      positions[position].impressions += Number(item.impressions || 0)
      positions[position].clicks += Number(item.clicks || 0)
      positions[position].spend += Number(item.spend || 0)
      positions[position].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each position
    Object.values(positions).forEach((position) => {
      // Frequency (reach must be non-zero to calculate)
      position.frequency = position.reach > 0 ? position.impressions / position.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      position.ctr = position.impressions > 0 ? (position.clicks / position.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      position.cpc = position.clicks > 0 ? position.spend / position.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      position.cpm = position.impressions > 0 ? (position.spend / position.impressions) * 1000 : 0
    })

    return Object.values(positions)
  }, [data])

  // Prepare device data
  const deviceData = useMemo(() => {
    const devices: Record<string, PlatformData> = {}

    // Group by device
    data?.forEach((item) => {
      const device = item.impression_device || "unknown"
      if (!devices[device]) {
        devices[device] = {
          name: device,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      devices[device].impressions += Number(item.impressions || 0)
      devices[device].clicks += Number(item.clicks || 0)
      devices[device].spend += Number(item.spend || 0)
      devices[device].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each device
    Object.values(devices).forEach((device) => {
      // Frequency (reach must be non-zero to calculate)
      device.frequency = device.reach > 0 ? device.impressions / device.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      device.ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      device.cpc = device.clicks > 0 ? device.spend / device.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      device.cpm = device.impressions > 0 ? (device.spend / device.impressions) * 1000 : 0
    })

    return Object.values(devices)
  }, [data])

  // Prepare platform-specific device data (for Facebook and Instagram)
  const platformDeviceData = useMemo(() => {
    const result = {
      facebook: {} as Record<string, PlatformData>,
      instagram: {} as Record<string, PlatformData>,
    }

    // Group by platform and device
    data?.forEach((item) => {
      const platform = item.publisher_platform ? item.publisher_platform.toLowerCase() : "unknown"
      if (platform !== "facebook" && platform !== "instagram") return
      const device = item.impression_device || "unknown"

      // Skip if not Facebook or Instagram
      if (!result[platform as "facebook" | "instagram"][device]) {
        result[platform as "facebook" | "instagram"][device] = {
          name: device,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      result[platform as "facebook" | "instagram"][device].impressions += Number(item.impressions || 0)
      result[platform as "facebook" | "instagram"][device].clicks += Number(item.clicks || 0)
      result[platform as "facebook" | "instagram"][device].spend += Number(item.spend || 0)
      result[platform as "facebook" | "instagram"][device].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each platform-device combo
    ;["facebook", "instagram"].forEach((platform) => {
      Object.values(result[platform as "facebook" | "instagram"]).forEach((device) => {
        // Frequency (reach must be non-zero to calculate)
        device.frequency = device.reach > 0 ? device.impressions / device.reach : 0

        // CTR (click-through rate) - impressions must be non-zero
        device.ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0

        // CPC (cost per click) - clicks must be non-zero
        device.cpc = device.clicks > 0 ? device.spend / device.clicks : 0

        // CPM (cost per thousand impressions) - impressions must be non-zero
        device.cpm = device.impressions > 0 ? (device.spend / device.impressions) * 1000 : 0
      })
    })

    return {
      facebook: Object.values(result.facebook),
      instagram: Object.values(result.instagram),
    }
  }, [data])

  // Prepare platform-position data for horizontal bar chart
  const platformPositionData = useMemo(() => {
    const combinedData: Record<string, PlatformData> = {}

    // Group by platform and position combination
    data?.forEach((item) => {
      const platform = item.publisher_platform || "unknown"
      const position = item.platform_position ? item.platform_position.replace("facebook_", "") : "unknown"
      const key = `${platform} - ${position}`

      if (!combinedData[key]) {
        combinedData[key] = {
          name: key,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      combinedData[key].impressions += Number(item.impressions || 0)
      combinedData[key].clicks += Number(item.clicks || 0)
      combinedData[key].spend += Number(item.spend || 0)
      combinedData[key].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each combination
    Object.values(combinedData).forEach((combo) => {
      // Frequency (reach must be non-zero to calculate)
      combo.frequency = combo.reach > 0 ? combo.impressions / combo.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      combo.ctr = combo.impressions > 0 ? (combo.clicks / combo.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      combo.cpc = combo.clicks > 0 ? combo.spend / combo.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      combo.cpm = combo.impressions > 0 ? (combo.spend / combo.impressions) * 1000 : 0
    })

    return Object.values(combinedData).sort(
      (a, b) =>
        (b[selectedMetric as keyof PlatformData] as number) - (a[selectedMetric as keyof PlatformData] as number),
    )
  }, [data, selectedMetric])

  // Color palette
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#4BC0C0", "#FF6384"]
const COLORS2 = [
  "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", 
  "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
  "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", 
  "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
  "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC", 
  "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399"
];

  // Format metric value for display
  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case "spend":
        return `$${Number(value).toFixed(2)}`
      case "cpc":
        return `$${Number(value).toFixed(2)}`
      case "cpm":
        return `$${Number(value).toFixed(2)}`
      case "ctr":
        return `${Number(value).toFixed(2)}%`
      case "frequency":
        return Number(value).toFixed(2)
      default:
        return Number(value).toLocaleString()
    }
  }

  // Custom name for the metrics
  const getMetricName = (metric: string) => {
    const metricMap: Record<string, string> = {
      impressions: "Impressions",
      clicks: "Clicks",
      spend: "Spend ($)",
      reach: "Reach",
      frequency: "Frequency",
      ctr: "CTR (%)",
      cpc: "CPC ($)",
      cpm: "CPM ($)",
    }
    return metricMap[metric] || metric
  }

  // Toggle device view handler
  const toggleDeviceView = () => {
    setShowAllDevices(!showAllDevices)
  }

  return (
    <Card className="mb-6 border rounded-xl shadow-lg overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 p-6">
        <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
          <LayoutDashboard className="h-6 w-6" />
          Ad Placement Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={chartTab} onValueChange={setChartTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="platforms"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all"
            >
              Platforms
            </TabsTrigger>
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all"
            >
              Positions
            </TabsTrigger>
            {/* <TabsTrigger
              value="devices"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all"
            >
              Devices
            </TabsTrigger> */}
          </TabsList>
          {/* Metric Filter */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm ">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric for Analysis</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full md:w-60 bg-white border-gray-300 hover:border-teal-500 transition-colors">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value} className="hover:bg-teal-50">
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* PLATFORMS TAB */}
          <TabsContent value="platforms" className="space-y-4">
            <Card className="shadow-md border border-gray-100 overflow-hidden">
              <CardHeader className="pb-2 ">
                <CardTitle className="text-lg flex items-center gap-2">
                  {/* <PieChart className="h-4 w-4" /> */}
                  Platform Distribution by {getMetricName(selectedMetric)}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 p-4 flex justify-center items-center">
                {platformData && platformData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey={selectedMetric}
                        nameKey="name"
                        // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        // labelLine={{ stroke: "#666666", strokeWidth: 0.5, strokeDasharray: "2 2" }}
                        labelLine={false}
                        animationDuration={800}
                        animationBegin={0}
                      >
                        {platformData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatMetricValue(value, selectedMetric)}
                        labelFormatter={(name) => `Platform: ${name}`}
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Treemap for Position Distribution (always showing spend) */}
              <D3Treemap 
  positionData={positionData} 
  title="Position Distribution by Spend" 
/>

              {/* Horizontal Bar Chart for Placement Combinations */}
              <Card className="shadow-md border border-gray-100 overflow-hidden">
                <CardHeader className="pb-2 ">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {/* <BarChart className="h-4 w-4" /> */}
                    Platform-Position by {getMetricName(selectedMetric)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-72 p-4 flex items-center justify-center">
                  {platformPositionData && platformPositionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        layout="vertical"
                        data={platformPositionData.slice(0, 5)} // Show top 5 for readability
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        barSize={20}
                        animationDuration={800}
                        animationBegin={0}
                      >
                        <XAxis
                          type="number"
                          dataKey={selectedMetric}
                          tick={false}
                          label={{ value: getMetricName(selectedMetric), position: "insideBottom", offset: 3 }}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={150}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 20)}...` : value)}
                        />
                        <Tooltip
                          formatter={(value: number) => formatMetricValue(value, selectedMetric)}
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar
                          dataKey={selectedMetric}
                          fill="#8884d8"
                          name={getMetricName(selectedMetric)}
                          radius={[0, 4, 4, 0]}
                        >
                          {platformPositionData.slice(0, 5).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </ReBarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  )
}

export default FilteredCharts

