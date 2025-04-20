"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CampaignChart } from "@/components/CampaignChart"
import { DemographicsChart } from "@/components/DemographicsChart"
import { AgeChart } from "@/components/AgeCharts"
import { MultiMetricChart } from "@/components/MultiMatricCharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChartIcon as ChartIcon } from "lucide-react"

interface ChartsGridProps {
  timeSeriesInsights: any[] ,
  title?: string 
}

export function ChartsGrid({ timeSeriesInsights,title }: ChartsGridProps) {
  const [activeTab, setActiveTab] = useState("demographics")

  // Sort data chronologically
  const sortedData = [...timeSeriesInsights].sort(
    (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
  )

  const processedData = sortedData.map((item) => ({
    ...item,
    date_start: new Date(item.date_start).toISOString(),
    frequency: Number.parseFloat(item.frequency || "0"),
    clicks: Number.parseInt(item.clicks || "0"),
    reach: Number.parseInt(item.reach || "0"),
    cpc: Number.parseFloat(item.cpc || "0"),
    cpm: Number.parseFloat(item.cpm || "0"),
    impressions: Number.parseFloat(item.impressions || "0"),
  }))

  const reachMetrics = [
    { key: "impressions", name: "Impressions", color: "#ec4899" },
    { key: "reach", name: "Reach", color: "#10b981" },
  ]

  const costMetrics = [
    { key: "cpc", name: "CPC", color: "#f59e0b" },
    { key: "cpm", name: "CPM", color: "#6366f1" },
  ]

  return (
    // <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-3xl shadow-xl overflow-hidden">
    //   <CardHeader className="bg-blue-500 dark:bg-blue-700 p-6">
    //     <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
    //       <ChartIcon className="h-6 w-6" />
    //       <span>{title}</span>
    //     </CardTitle>
    //   </CardHeader>
    //   <CardContent className="p-6">
    //     <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
    //       <TabsList className="grid w-full grid-cols-3 rounded-xl bg-blue-100 dark:bg-blue-800 p-1">
    //         <TabsTrigger value="overview" className="rounded-lg">
    //           Overview
    //         </TabsTrigger>
    //         <TabsTrigger value="demographics" className="rounded-lg">
    //           Demographics
    //         </TabsTrigger>
    //         <TabsTrigger value="metrics" className="rounded-lg">
    //           Metrics
    //         </TabsTrigger>
    //       </TabsList>
    //       <TabsContent value="overview" className="space-y-4">
    //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    //           <Card className="">
    //             <CardContent className="p-4">
    //               <CampaignChart data={processedData} title="Daily Ad Spend" metric="spend" />
    //             </CardContent>
    //           </Card>
    //         </motion.div>
    //       </TabsContent>
    //       <TabsContent value="demographics" className="space-y-4">
    //         <motion.div
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5 }}
    //           className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //         >
    //           <Card className="">
    //             <CardContent className="p-4">
    //               <DemographicsChart data={timeSeriesInsights} title="Spend by Gender" />
    //             </CardContent>
    //           </Card>
    //           <Card className="">
    //             <CardContent className="p-4">
    //               <AgeChart data={timeSeriesInsights} title="Spend by Age Group" />
    //             </CardContent>
    //           </Card>
    //         </motion.div>
    //       </TabsContent>
    //       <TabsContent value="metrics" className="space-y-4">
    //         <motion.div
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5 }}
    //           className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //         >
    //           <Card className="">
    //             <CardContent className="p-4">
    //               <MultiMetricChart data={processedData} title="Reach Metrics" metrics={reachMetrics} />
    //             </CardContent>
    //           </Card>
    //           <Card className="">
    //             <CardContent className="p-4">
    //               <MultiMetricChart data={processedData} title="Cost Metrics" metrics={costMetrics} />
    //             </CardContent>
    //           </Card>
    //         </motion.div>
    //       </TabsContent>
    //     </Tabs>
    //   </CardContent>
    // </Card>
  
  
  
<Card className=" dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
      <CardHeader className="bg-teal-500 py-3  px-4 ">
        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
          <ChartIcon className="h-6 w-6" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-white dark:bg-gray-800 p-1 shadow-inner">
            
            <TabsTrigger 
              value="demographics" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
            >
              Demographics
            </TabsTrigger>

            <TabsTrigger 
              value="overview" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
            >
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-4">
                  <CampaignChart data={processedData} title="Daily Ad Spend" metric="spend" />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-4">
                  <DemographicsChart data={timeSeriesInsights} title="Spend by Gender" />
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-4">
                  <AgeChart data={timeSeriesInsights} title="Spend by Age Group" />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-4">
                  <MultiMetricChart data={processedData} title="Reach Metrics" metrics={reachMetrics} />
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-4">
                  <MultiMetricChart data={processedData} title="Cost Metrics" metrics={costMetrics} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

