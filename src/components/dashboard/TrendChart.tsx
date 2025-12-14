import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SubmissionTrend } from "@/services/supabaseService";

interface TrendChartProps {
  data: SubmissionTrend[];
}

export function TrendChart({ data }: TrendChartProps) {
  // Format data for chart
  const formattedData = data.map((item) => ({
    date: item.date,
    submissions: item.count,
    avgRating: item.avg_rating
  }));

  return (
    <Card className="p-6 shadow-card border-2 border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">📈 Submissions Over Time</h3>
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
              minTickGap={30} // Prevent overlap
              tickFormatter={(value) => {
                // Shorten date format
                const date = new Date(value);
                return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
              }}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--primary))"
              style={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--chart-2))"
              style={{ fontSize: 12 }}
              domain={[0, 5]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="submissions"
              name="Submissions"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false} // Remove dots for cleaner look on dense data
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgRating"
              name="Avg Rating"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
          No submission data in this period
        </div>
      )}
    </Card>
  );
}
