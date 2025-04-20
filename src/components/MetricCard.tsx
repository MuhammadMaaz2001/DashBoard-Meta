import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type MetricVariant = 'default' | 'spend' | 'impressions' | 'clicks' | 'ctr' | 'cpc' | 'cpm' | 'reach' | 'frequency';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
    timeFrame?: string;
  };
  variant?: MetricVariant;
}

export function MetricCard({
  title,
  value,
  description,
  className,
  icon,
  isLoading = false,
  trend,
  variant = 'default'
}: MetricCardProps) {
  // Color configurations for different variants
  const variantStyles: Record<MetricVariant, {
    gradient: string;
    iconBg: string;
    iconColor: string;
    darkGradient: string;
    darkIconBg: string;
    border: string;
    darkBorder: string;
  }> = {
    default: {
      gradient: "from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      darkGradient: "dark:from-gray-900/20 dark:to-gray-800/10",
      darkIconBg: "dark:bg-gray-800/30",
      border: "border-gray-200/50",
      darkBorder: "dark:border-gray-800/50"
    },
    spend: {
      gradient: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      darkGradient: "dark:from-emerald-900/20 dark:to-emerald-800/10",
      darkIconBg: "dark:bg-emerald-800/30",
      border: "border-emerald-200/50",
      darkBorder: "dark:border-emerald-800/50"
    },
    impressions: {
      gradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      darkGradient: "dark:from-blue-900/20 dark:to-blue-800/10",
      darkIconBg: "dark:bg-blue-800/30",
      border: "border-blue-200/50",
      darkBorder: "dark:border-blue-800/50"
    },
    clicks: {
      gradient: "from-indigo-50 to-indigo-100/50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      darkGradient: "dark:from-indigo-900/20 dark:to-indigo-800/10",
      darkIconBg: "dark:bg-indigo-800/30",
      border: "border-indigo-200/50",
      darkBorder: "dark:border-indigo-800/50"
    },
    ctr: {
      gradient: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      darkGradient: "dark:from-purple-900/20 dark:to-purple-800/10",
      darkIconBg: "dark:bg-purple-800/30",
      border: "border-purple-200/50",
      darkBorder: "dark:border-purple-800/50"
    },
    cpc: {
      gradient: "from-amber-50 to-amber-100/50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      darkGradient: "dark:from-amber-900/20 dark:to-amber-800/10",
      darkIconBg: "dark:bg-amber-800/30",
      border: "border-amber-200/50",
      darkBorder: "dark:border-amber-800/50"
    },
    cpm: {
      gradient: "from-rose-50 to-rose-100/50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      darkGradient: "dark:from-rose-900/20 dark:to-rose-800/10",
      darkIconBg: "dark:bg-rose-800/30",
      border: "border-rose-200/50",
      darkBorder: "dark:border-rose-800/50"
    },
    reach: {
      gradient: "from-teal-50 to-teal-100/50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      darkGradient: "dark:from-teal-900/20 dark:to-teal-800/10",
      darkIconBg: "dark:bg-teal-800/30",
      border: "border-teal-200/50",
      darkBorder: "dark:border-teal-800/50"
    },
    frequency: {
      gradient: "from-cyan-50 to-cyan-100/50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      darkGradient: "dark:from-cyan-900/20 dark:to-cyan-800/10",
      darkIconBg: "dark:bg-cyan-800/30",
      border: "border-cyan-200/50",
      darkBorder: "dark:border-cyan-800/50"
    }
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn(
      "group relative overflow-hidden font-sans",
      "bg-gradient-to-br",
      styles.gradient,
      styles.darkGradient,
      "border",
      styles.border,
      styles.darkBorder,
      "transition-all duration-300 ease-in-out",
      "hover:shadow-lg hover:scale-[1.02]",
      "backdrop-blur-lg",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              "flex items-center justify-center",
              styles.iconBg,
              styles.iconColor,
              "w-8 h-8 rounded-lg",
              "transition-transform duration-300 group-hover:scale-110",
              "p-1.5",
              styles.darkIconBg
            )}>
              {icon}
            </div>
          )}
          <CardTitle className={cn(
            "text-sm font-display font-medium tracking-wide",
            "transition-colors duration-200"
          )}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
  
      <CardContent>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <div className={cn(
                "text-3xl font-display font-bold tracking-tight",
                "transition-colors duration-200"
              )}>
                {value}
              </div>
              
              {description && (
                <p className={cn(
                  "text-sm font-body text-muted-foreground",
                  "leading-relaxed"
                )}>
                  {description}
                </p>
              )}
  
              {trend && (
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full",
                    "text-xs font-body font-medium",
                    trend.isPositive 
                      ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                      : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
                    "transition-colors duration-200"
                  )}>
                    <span className="text-lg font-display">
                      {trend.isPositive ? "↑" : "↓"}
                    </span>
                    <span className="font-display">
                      {trend.value}%
                    </span>
                    {trend.timeFrame && (
                      <span className="text-xs font-body opacity-75 ml-1">
                        vs {trend.timeFrame}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}