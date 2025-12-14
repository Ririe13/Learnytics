import { Card } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend } from "recharts";
import { ScoreTimeCorrelation } from "@/types/learning";

interface ScoreTimeScatterProps {
  data: ScoreTimeCorrelation[];
}

export function ScoreTimeScatter({ data }: ScoreTimeScatterProps) {
  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Score vs. Study Time Correlation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number"
            dataKey="totalMinutes" 
            name="Total Minutes"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: 12 }}
          />
          <YAxis 
            type="number"
            dataKey="avgScore" 
            name="Avg Score"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <ZAxis range={[60, 200]} />
          <Tooltip 
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "Avg Score") return [`${value.toFixed(0)}`, name];
              if (name === "Total Minutes") return [`${value} min`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Scatter 
            name="Students"
            data={data} 
            fill="hsl(var(--secondary))" 
            fillOpacity={0.7}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}
