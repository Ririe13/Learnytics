import { Card } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { EngagementData } from "@/types/learning";
import { format, parseISO, getDay } from "date-fns";

interface EngagementHeatmapProps {
  data: EngagementData[];
}

export function EngagementHeatmap({ data }: EngagementHeatmapProps) {
  // Transform data for heatmap visualization
  const heatmapData = data.map((item) => {
    const date = parseISO(item.date);
    return {
      day: getDay(date), // 0 = Sunday, 6 = Saturday
      hour: Math.floor(item.studyMinutes / 60) % 24, // Simulate hour distribution
      value: item.studyMinutes,
      dateFormatted: format(date, "MMM dd"),
    };
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Daily Engagement (Total Minutes)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="category" 
            dataKey="day" 
            name="Day"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: 12 }}
            tickFormatter={(value) => dayNames[value]}
          />
          <YAxis 
            type="number"
            dataKey="value" 
            name="Minutes"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: 12 }}
          />
          <ZAxis range={[50, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value} min`, "Study Time"]}
          />
          <Scatter 
            data={heatmapData} 
            fill="hsl(var(--accent))" 
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}
