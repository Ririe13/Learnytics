import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardStore } from "@/store/dashboardStore";
import { Calendar, Search, RotateCcw } from "lucide-react";

const modules = [
  "All",
  "Intro to Algorithms",
  "Data Structures",
  "Sorting Algorithms",
  "Graph Theory",
  "Dynamic Programming",
  "Complexity Analysis",
  "Recursion Fundamentals",
  "Tree Traversal",
];

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useDashboardStore();

  return (
    <Card className="p-6 shadow-card">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Date Range */}
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Start Date
          </label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ startDate: e.target.value })}
            className="transition-smooth"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            End Date
          </label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ endDate: e.target.value })}
            className="transition-smooth"
          />
        </div>

        {/* Module Filter */}
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">Module</label>
          <Select
            value={filters.module || "All"}
            onValueChange={(value) => setFilters({ module: value === "All" ? "" : value })}
          >
            <SelectTrigger className="transition-smooth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modules.map((module) => (
                <SelectItem key={module} value={module}>
                  {module}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Student
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Name or ID..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="transition-smooth"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={resetFilters}
              title="Reset Filters"
              className="transition-bounce hover:rotate-180"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
