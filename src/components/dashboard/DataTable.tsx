import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StudentRecord } from "@/types/learning";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useState } from "react";

interface DataTableProps {
  data: StudentRecord[];
  onViewDetails?: (studentId: string) => void;
}

export function DataTable({ data, onViewDetails }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ["Student ID", "Name", "Cohort", "Module", "Date", "Duration (min)", "Score", "Completed"];
    const rows = data.map((record) => [
      record.studentId,
      record.studentName,
      record.cohort,
      record.module,
      format(parseISO(record.date), "yyyy-MM-dd"),
      record.durationMinutes,
      record.score,
      record.completed ? "Yes" : "No",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learning-data-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Learning Records</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="transition-smooth"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Cohort</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((record, index) => (
              <TableRow key={`${record.studentId}-${record.module}-${index}`}>
                <TableCell>
                  <div>
                    <div className="font-medium">{record.studentName}</div>
                    <div className="text-xs text-muted-foreground">{record.studentId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{record.cohort}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{record.module}</TableCell>
                <TableCell>{format(parseISO(record.date), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right">{record.durationMinutes} min</TableCell>
                <TableCell className="text-right">
                  <span className={record.score >= 80 ? "text-secondary-foreground font-semibold" : record.score >= 60 ? "text-muted-foreground" : "text-destructive font-semibold"}>
                    {record.score}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={record.completed ? "default" : "secondary"}>
                    {record.completed ? "Completed" : "In Progress"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(record.studentId)}
                    className="transition-smooth"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
