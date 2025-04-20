import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface BarChartProps {
  data: any[];
  title: string;
  dataKey: string;
}

export function BarChartVertical({ data, title, dataKey }: BarChartProps) {
  return (
    <Card className="  bg-white dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-100/50 dark:border-purple-700/50 shadow-xl rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-purple-900 dark:text-purple-100 text-lg font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="h-[350px]" >
          <ResponsiveContainer width="95%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 20, bottom: 10 }} 
              barGap={6} // Spacing between bars
              barCategoryGap={14} // Spacing between bar categories
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-purple-300/30 dark:stroke-purple-600/30" />
              
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              
              <YAxis 
                dataKey="date_start" 
                type="category" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px',
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value) => value.toLocaleString()} 
              />
              
              <Bar
                dataKey={dataKey}
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                barSize={18} // Adjusted for better visibility
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
