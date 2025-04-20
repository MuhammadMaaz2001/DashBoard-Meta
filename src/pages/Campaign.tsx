"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getCampaignInsights, getAdSets } from "@/services/api"
import { toast } from "sonner"
import { MetricsGrid } from "@/components/dashboard/MetricsGrid"
import { ChartsGrid } from "@/components/dashboard/ChartsGrid"
import type { DateRange } from "@/types/api"
import { DateRangeFilter } from "@/components/DateRangeFilter"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Sparkles, TrendingUp, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

// Helper function to get the last 30 days
const getLast30Days = (): DateRange => {
  const today = new Date()
  const past = new Date()
  past.setDate(today.getDate() - 30)
  return { from: past, to: today }
}

const Campaign = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Initialize dateRange state from sessionStorage (if exists) or default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const stored = sessionStorage.getItem("campaignDateRange")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return { from: new Date(parsed.from), to: new Date(parsed.to) }
      } catch (error) {
        return getLast30Days()
      }
    }
    return getLast30Days()
  })

  // Persist dateRange changes to sessionStorage
  useEffect(() => {
    if (dateRange) {
      sessionStorage.setItem("campaignDateRange", JSON.stringify(dateRange))
    }
  }, [dateRange])

  // Initialize and persist the showDemographics filter similarly if needed
  const [showDemographics, setShowDemographics] = useState<boolean>(() => {
    const stored = sessionStorage.getItem("campaignShowDemographics")
    return stored ? JSON.parse(stored) : false
  })

  useEffect(() => {
    sessionStorage.setItem("campaignShowDemographics", JSON.stringify(showDemographics))
  }, [showDemographics])

  // Get campaign insights (time series)
  const { data: timeSeriesInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ["campaignInsights", id, dateRange, "timeSeries", showDemographics],
    queryFn: async () => {
      if (!id || !dateRange?.from || !dateRange?.to) return []
      return getCampaignInsights(id, {
        since: dateRange.from.toISOString().split("T")[0],
        until: dateRange.to.toISOString().split("T")[0],
        time_increment: 1,
        // breakdown: showDemographics,
        breakdown: true,
      })
    },
    meta: {
      onError: () => {
        toast.error("Failed to fetch campaign insights")
      },
    },
  })

  // Get aggregated insights
  const { data: aggregatedInsights } = useQuery({
    queryKey: ["campaignInsights", id, dateRange, "aggregated"],
    queryFn: async () => {
      if (!id || !dateRange?.from || !dateRange?.to) return []
      return getCampaignInsights(id, {
        since: dateRange.from.toISOString().split("T")[0],
        until: dateRange.to.toISOString().split("T")[0],
      })
    },
  })

  // Get ad sets
  const {
    data: adSets = [],
    isLoading: adSetsLoading,
    isError: adSetsError,
  } = useQuery({
    queryKey: ["adSets", id],
    queryFn: () => getAdSets(id!),
    enabled: !!id,
    meta: {
      onError: (error: any) => {
        console.error("Ad Sets Error:", error)
        toast.error("Failed to fetch ad sets")
      },
    },
  })

  const aggregatedMetrics = aggregatedInsights?.[0] || {}
  const latestData = timeSeriesInsights?.[timeSeriesInsights.length - 1] || {}

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header Section */}
        <Card className="mb-8 overflow-hidden bg-blue-100 dark:bg-blue-900 shadow-md rounded-3xl shadow-xl">
          <CardHeader className="p-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="relative">
                  <div className="absolute inset-0 bg-blue-300 rounded-2xl blur opacity-50" />
                  <div className="relative bg-teal-500 p-3 rounded-lg shadow-md p-3 rounded-2xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Meta Campaign Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-blue-200">Live Analytics</span>
              </div>
            </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
                <DateRangeFilter date={dateRange} onRangeChange={(range) => setDateRange(range as DateRange)} />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/index")}
                  className="group transition-all duration-300 ease-in-out"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Metrics and Insights Section */}
        {dateRange && (
          <>
            <MetricsGrid
              aggregatedMetrics={aggregatedMetrics}
              // latestReach={Number.parseInt(latestData.reach || "0")}
              // latestFrequency={latestData.frequency || "0"}
            />
            <ChartsGrid timeSeriesInsights={timeSeriesInsights || []} 
              title="Campaign Analytics" 

            />

            {/* Enhanced Ad Sets Section */}
            {/* <Card className="mt-8 overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
              <CardHeader className="bg-teal-400 dark:bg-teal-900 p-6">
                <CardTitle className="text-xl font-semibold text-white  flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ad Sets
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {adSetsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                ) : adSetsError ? (
                  <div className="text-center p-8 text-red-500">Failed to load ad sets. Please try again later.</div>
                ) : adSets.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">No ad sets found for this campaign.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-teal-50 dark:bg-teal-800/50">
                          <TableHead className="py-4 px-6 text-left text-sm font-semibold text-teal-800 dark:text-teal-100">
                            Name
                          </TableHead>
                          <TableHead className="py-4 px-6 text-left text-sm font-semibold text-teal-800 dark:text-teal-100">
                            Optimization Goal
                          </TableHead>
                          <TableHead className="py-4 px-6 text-left text-sm font-semibold text-teal-800 dark:text-teal-100">
                            Budget Remaining
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adSets.map((adSet) => (
                          <motion.tr
                            key={adSet.id}
                            className="border-b border-teal-100 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-800/30 transition-colors duration-200"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <TableCell className="py-4 px-6 text-teal-700 dark:text-teal-200">{adSet.name}</TableCell>
                            <TableCell className="py-4 px-6 text-teal-600 dark:text-teal-300">
                              {adSet.optimization_goal}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-teal-600 dark:text-teal-300">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="font-medium">
                                  {Number.parseFloat(adSet.budget_remaining || "0").toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </>
        )}

        {/* Loading Spinner */}
        {insightsLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Campaign

