import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemographicsChartProps {
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

export function DemographicsChart({ data, title }: DemographicsChartProps) {
  // Process data to aggregate spend by gender only
  const genderTotals = data.reduce((acc, curr) => {
    if (!curr.gender) return acc;
    
    const gender = curr.gender.toLowerCase();
    const spend = parseFloat(curr.spend) || 0;
    
    if (!acc[gender]) {
      acc[gender] = 0;
    }
    
    acc[gender] += spend;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(genderTotals).map(([gender, total]) => ({
    name: gender.charAt(0).toUpperCase() + gender.slice(1),
    value: total
  }));

  const COLORS = {
    Male: "#2563eb",
    Female: "#ec4899",
    Unknown: "#94a3b8"
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {data.name}
          </p>
          {/* <p className="text-gray-600 dark:text-gray-400">
            ${data.value.toFixed(2)}
          </p> */}
        </div>
      );
    }
    return null;
  };

  // If no data or no gender data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="border border-blue-200/50 dark:border-blue-800/50">
        <CardHeader>
          <CardTitle className="">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No gender data available</p>
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
                    fill={COLORS[entry.name as keyof typeof COLORS]}
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