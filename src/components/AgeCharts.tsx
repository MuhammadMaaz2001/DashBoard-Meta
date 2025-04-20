import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgeChartProps {
  data: Array<{
    impressions: string;
    clicks: string;
    spend: string;
    reach: string;
    frequency: string;
    ctr: string;
    cpm: string;
    date_start: string;
    date_stop: string;
    age?: string;
    gender?: string;
  }>;
  title: string;
}

export function AgeChart({ data, title }: AgeChartProps) {
  // Process data to aggregate spend by age group
  const ageTotals = data.reduce((acc, curr) => {
    if (!curr.age) return acc;
    
    const age = curr.age;
    const spend = parseFloat(curr.spend) || 0;
    
    if (!acc[age]) {
      acc[age] = 0;
    }
    
    acc[age] += spend;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format and sort by age
  const chartData = Object.entries(ageTotals)
    .map(([age, total]) => ({
      name: age,
      value: total
    }))
    .sort((a, b) => {
      const ageA = parseInt(a.name.split('-')[0]);
      const ageB = parseInt(b.name.split('-')[0]);
      return ageA - ageB;
    });

    const COLORS = [
      "#2563eb", // Primary blue - professional and trustworthy
      "#0ea5e9", // Sky blue - clean and modern
      "#0d9488", // Teal - sophisticated and balanced
      "#0891b2", // Cyan - tech-focused and precise
      "#6366f1", // Indigo - professional with personality
      "#7c3aed"  // Purple - innovative and premium
    ];
    
    // For metrics-specific colors (if needed)
    const METRIC_COLORS = {
      revenue: "#2563eb",    // Primary blue for revenue/main metrics
      conversion: "#0d9488", // Teal for conversion metrics
      engagement: "#0ea5e9", // Sky blue for engagement metrics
      cost: "#6366f1"       // Indigo for cost metrics
    };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            Age {data.name}
          </p>
          {/* <p className="text-gray-600 dark:text-gray-400">
            ${data.value.toFixed(2)}
          </p> */}
        </div>
      );
    }
    return null;
  };

  // If no data or no age data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="border border-blue-200/50 dark:border-blue-800/50">
        <CardHeader>
          <CardTitle className="">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No age data available</p>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="">
      <CardHeader>
        <CardTitle className="">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  name
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="currentColor"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </div>
  );
}