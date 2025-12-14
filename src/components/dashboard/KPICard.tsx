import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  index?: number;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, index = 0 }: KPICardProps) {
  const trendColors = {
    up: "text-secondary-foreground",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="card-gradient shadow-card transition-smooth hover:shadow-soft p-6 border-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <motion.h3
              className="text-3xl font-bold text-foreground mb-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.h3>
            {subtitle && (
              <p className={`text-xs ${trend ? trendColors[trend] : "text-muted-foreground"}`}>
                {subtitle}
              </p>
            )}
          </div>
          <motion.div
            className="p-3 rounded-xl bg-primary"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-6 w-6 text-primary-foreground" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
