import { 
  DollarSign, 
  Eye, 
  MousePointer, 
  BarChart2, 
  CircleDollarSign, 
  PieChart,
  Users,
  Repeat
} from "lucide-react";
import { MetricCard } from "../MetricCard";

interface MetricsGridProps {
  aggregatedMetrics: {
    impressions: string;
    reach: string;
    clicks: string;
    spend: string;
    ctr: string;
    cpc: string;
    cpm: string;
    frequency:string;
    
  };
  // latestReach: number;
  // latestFrequency: number;
  className?: string;
}

export function MetricsGrid({ 
  aggregatedMetrics, 
  // latestReach, 
  // latestFrequency,
  className = "bg-white dark:from-blue-900/50 dark:to-indigo-800/50 border-blue-200/50 dark:border-blue-700/50"
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Spend"
        value={`$${parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
        description="Total amount spent on the campaign"
        icon={<DollarSign className="h-4 w-4" />}
        variant="spend"
      />
      <MetricCard
        title="Impressions"
        value={parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
        description="Total number of impressions"
        icon={<Eye className="h-4 w-4" />}
        variant="impressions"
      />
      <MetricCard
        title="Clicks"
        value={parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
        description="Total number of clicks"
        icon={<MousePointer className="h-4 w-4" />}
        variant="clicks"
      />
      <MetricCard
        title="CTR"
        value={`${parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
        description="Click-through rate"
        icon={<BarChart2 className="h-4 w-4" />}
        variant="ctr"
      />
      <MetricCard
        title="CPC"
        value={`$${parseFloat(aggregatedMetrics.cpc || "0").toFixed(2)}`}
        description="Cost per click"
        icon={<CircleDollarSign className="h-4 w-4" />}
        variant="cpc"
      />
      <MetricCard
        title="CPM"
        value={`$${parseFloat(aggregatedMetrics.cpm || "0").toFixed(2)}`}
        description="Cost per thousand impressions"
        icon={<CircleDollarSign className="h-4 w-4" />}
        variant="cpm"
      />
      <MetricCard
        title="Reach"
        value={`${parseFloat(aggregatedMetrics.reach || "0").toFixed(2)}`}
        description="Latest unique users reached"
        icon={<Users className="h-4 w-4" />}
        variant="reach"
      />
      <MetricCard
        title="Frequency"
        value={`${parseFloat(aggregatedMetrics.frequency || "0").toFixed(3)}`}
        description="Average impressions per user"
        icon={<Repeat className="h-4 w-4" />}
        variant="frequency"
      />
    </div>
  );
}