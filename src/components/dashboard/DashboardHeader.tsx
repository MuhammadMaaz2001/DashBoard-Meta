"use client"

import * as React from "react"
import { DateRangeFilter } from "@/components/DateRangeFilter"
import { AdAccountSelector } from "@/components/AdAccountSelector"
import { toast } from "sonner"
import type { DateRange } from "@/types/api"
import { BarChart3 } from 'lucide-react'
import { motion } from "framer-motion"

interface DashboardHeaderProps {
  selectedAccount?: string
  dateRange?: DateRange
  onAccountSelect: (id: string) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  statusFilter?: number
}

export function DashboardHeader({
  selectedAccount,
  dateRange,
  onAccountSelect,
  onDateRangeChange,
  statusFilter,
}: DashboardHeaderProps) {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left side - Title and Logo */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-teal-500 p-3 rounded-lg shadow-md"
            >
              <BarChart3 className="h-5 w-5 text-white" />
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

          {/* Right side - Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex gap-4 items-center flex-wrap w-full md:w-auto">
              <AdAccountSelector
                onAccountSelect={(id) => {
                  onAccountSelect(id)
                  toast.success("Ad Account selected successfully", {
                    icon: "🎯",
                  })
                }}
                selectedAccount={selectedAccount}
                statusFilter={statusFilter}
              />
              <DateRangeFilter date={dateRange} onRangeChange={onDateRangeChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}