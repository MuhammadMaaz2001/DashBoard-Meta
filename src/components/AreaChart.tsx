
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AreaChartProps {
  data: any[];
  title: string;
  dataKey: string;
}

export function AreaChart({ data, title, dataKey }: AreaChartProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:from-green-950/50 dark:to-teal-950/50 border border-green-100/50 dark:border-green-800/50 shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-green-900/80 dark:text-green-100/80">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-green-200/20 dark:stroke-green-700/20" />
              <XAxis 
                dataKey="date_start" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => {
                  const numValue = parseFloat(value);
                  return isNaN(numValue) ? [0, dataKey] : [numValue.toLocaleString(), dataKey];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
