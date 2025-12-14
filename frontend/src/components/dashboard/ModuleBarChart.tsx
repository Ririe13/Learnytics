import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SubmissionStatusData {
  status: string;
  count: number;
  percentage: number;
}

interface SubmissionStatusChartProps {
  data: SubmissionStatusData[];
}

// Status mapping based on database schema
const STATUS_LABELS: Record<number, string> = {
  0: "Pending Review",
  1: "Approved",
  2: "Rejected",
  3: "Needs Revision",
  4: "In Review"
};

const STATUS_COLORS = [
  "#FFA500", // Pending - Orange
  "#10B981", // Approved - Green
  "#EF4444", // Rejected - Red
  "#F59E0B", // Needs Revision - Amber
  "#3B82F6", // In Review - Blue
];

export function SubmissionStatusChart({ data }: SubmissionStatusChartProps) {
  // Format data for display
  const formattedData = data.map((item, index) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
    color: STATUS_COLORS[index % STATUS_COLORS.length]
  }));

  const totalSubmissions = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6 shadow-card border-2 border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">📊 Submission Status Breakdown</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Total Submissions: {totalSubmissions}
          </p>
        </div>

        {totalSubmissions > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} submissions (${props.payload.percentage.toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No submission data available</p>
          </div>
        )}

        {/* Status Legend with counts */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {formattedData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">
                {item.name}: <span className="font-semibold text-foreground">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Keep old exports for backward compatibility
export const ModuleBarChart = SubmissionStatusChart;
export const JourneyDistributionChart = SubmissionStatusChart;
export const UserActivityChart = SubmissionStatusChart;
