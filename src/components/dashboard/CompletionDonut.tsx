import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CompletionStatus } from "@/types/learning";

interface CompletionDonutProps {
  data: CompletionStatus[];
}

const STATUS_COLORS = {
  completed: "hsl(var(--chart-2))",
  "in-progress": "hsl(var(--chart-3))",
  "not-started": "hsl(var(--chart-1))",
};

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
};

export function CompletionDonut({ data }: CompletionDonutProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status],
    value: item.count,
    percentage: Math.round(item.percentage * 100),
  }));

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Completion Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={(entry: any) => `${entry.percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={Object.values(STATUS_COLORS)[index]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string, props: any) => [
              `${value} (${props.payload.percentage}%)`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
