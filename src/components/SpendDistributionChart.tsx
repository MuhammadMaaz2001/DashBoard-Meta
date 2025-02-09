
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpendDistributionChartProps {
  data: any[];
  title: string;
}

export function SpendDistributionChart({ data, title }: SpendDistributionChartProps) {
  // Process data for pie chart
  const processedData = data.reduce((acc, curr) => {
    const campaignName = curr.campaign_name || 'Unknown Campaign';
    const spend = parseFloat(curr.spend || '0');
    const existingCampaign = acc.find((item: { name: any; }) => item.name === campaignName);
    
    if (existingCampaign) {
      existingCampaign.value += spend;
    } else {
      acc.push({ name: campaignName, value: spend });
    }
    return acc;
  }, []);

  // Sort by spend and take top 5
  const topCampaigns = processedData
    .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value)
    .slice(0, 5);

  const COLORS = [
    'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))'
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={topCampaigns}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {topCampaigns.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spend']}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
