
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, CheckCircle2, RotateCcw, BookOpen } from "lucide-react";

interface RecentActivity {
    courseName: string;
    date: string;
    rating: number;
    status: string;
}

export interface StudentDetails {
    id: string; // e.g., 's002'
    name: string;
    email: string;
    completionRate: number;
    totalTimeMinutes: number;
    learningStyle: string;
    recommendation: string;
    recentActivity: RecentActivity[]; // Replaced reviews
}

interface StudentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: StudentDetails | null;
    loading?: boolean;
}

export const StudentDetailsModal = ({ isOpen, onClose, student, loading }: StudentDetailsModalProps) => {
    if (!student) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold mb-1">Student Details</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 -mr-6 pr-6 w-[calc(100%+1.5rem)]" type="always">
                        <div className="space-y-6 pb-6 pt-1">
                            {/* Header Info */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">{student.name}</h2>
                                    <p className="text-muted-foreground text-sm">{student.email}</p>
                                </div>
                                {/* Removed Average Score & Batch as requested */}
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                    <span className="text-xs text-muted-foreground mb-1">Completion Rate</span>
                                    <div className="text-2xl font-bold flex items-center gap-2">
                                        {student.completionRate}%
                                    </div>
                                </div>
                                <div className="bg-white border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                    <span className="text-xs text-muted-foreground mb-1">Total Time</span>
                                    <div className="text-2xl font-bold flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        {student.totalTimeMinutes} min
                                    </div>
                                </div>
                            </div>

                            {/* Learning Style */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <RotateCcw className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm text-muted-foreground mb-1">Tipe Gaya Belajar</h3>
                                    <p className="font-bold text-slate-900">{student.learningStyle}</p>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-4">
                                <div className="mt-1">
                                    <BookOpen className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">Rekomendasi Belajar</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {student.recommendation}
                                    </p>
                                </div>
                            </div>

                            {/* Recent Activity Section Removed as per request due to incomplete data */}
                            {/* 
                            <div>
                                <h3 className="font-bold text-lg mb-3">Recent Activity</h3>
                                ...
                            </div> 
                            */}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
};
