import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentDetail } from "@/types/learning";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Target, BookOpen, Zap, RefreshCw, TrendingUp } from "lucide-react";

type LearningStyleType = "consistent" | "fast" | "reflective";

interface LearningStyle {
  type: LearningStyleType;
  label: string;
  icon: React.ReactNode;
  recommendation: string;
}

const learningStyles: Record<LearningStyleType, LearningStyle> = {
  consistent: {
    type: "consistent",
    label: "Consistent Learner",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    recommendation: "Pertahankan ritme belajar Anda yang konsisten! Cobalah untuk meningkatkan target materi harian secara bertahap untuk mencapai hasil yang lebih optimal.",
  },
  fast: {
    type: "fast",
    label: "Fast Learner",
    icon: <Zap className="h-5 w-5 text-primary" />,
    recommendation: "Kemampuan Anda menyerap materi dengan cepat sangat luar biasa! Pastikan untuk tetap melakukan review berkala agar pemahaman Anda semakin mendalam.",
  },
  reflective: {
    type: "reflective",
    label: "Reflective Learner",
    icon: <RefreshCw className="h-5 w-5 text-primary" />,
    recommendation: "Pendekatan reflektif Anda sangat baik untuk pemahaman mendalam! Teruslah mengulas materi dan buatlah catatan ringkasan untuk memperkuat ingatan Anda.",
  },
};

// Simple logic to determine learning style based on student data
function determineLearningStyle(studentDetail: StudentDetail): LearningStyleType {
  const avgTimePerModule = studentDetail.totalTimeSpent / studentDetail.moduleScores.length;
  const completionRate = studentDetail.completionRate;

  // If high time spent per module, likely reflective
  if (avgTimePerModule > 30) {
    return "reflective";
  }
  // If high completion with low time, likely fast learner
  if (completionRate > 0.7 && avgTimePerModule < 20) {
    return "fast";
  }
  // Default to consistent
  return "consistent";
}

interface StudentDetailModalProps {
  open: boolean;
  onClose: () => void;
  studentDetail: StudentDetail | null;
}

export function StudentDetailModal({
  open,
  onClose,
  studentDetail,
}: StudentDetailModalProps) {
  if (!studentDetail) return null;

  const learningStyleType = determineLearningStyle(studentDetail);
  const currentStyle = learningStyles[learningStyleType];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">{studentDetail.studentName}</h3>
              <p className="text-sm text-muted-foreground">ID: {studentDetail.studentId}</p>
              <Badge variant="outline" className="mt-2">
                {studentDetail.cohort}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{studentDetail.avgScore}</div>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-secondary-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{Math.round(studentDetail.completionRate * 100)}%</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-accent-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold">{studentDetail.totalTimeSpent} min</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tipe Gaya Belajar */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                {currentStyle.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipe Gaya Belajar</p>
                <p className="text-xl font-bold text-foreground">{currentStyle.label}</p>
              </div>
            </div>
          </Card>

          {/* Learning Style Recommendation */}
          <Card className="p-4 border-secondary/30 bg-secondary/5">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-secondary-foreground mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Rekomendasi Belajar</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentStyle.recommendation}
                </p>
              </div>
            </div>
          </Card>

          {/* Performance Review */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Performance Review</h4>
            
            {/* Module Performance Cards */}
            <div className="space-y-3">
              {studentDetail.moduleScores.map((module, index) => {
                const isHighPerformance = module.score >= 80;
                const badgeType = isHighPerformance ? "Review" : "Focus";
                const description = isHighPerformance
                  ? `High performance (${module.score}/100) - ready for advanced topics`
                  : `Low average score (${module.score}/100)`;
                
                return (
                  <Card key={index} className="p-4 bg-muted/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-muted-foreground/30 text-muted-foreground"
                      >
                        {badgeType}
                      </Badge>
                      <span className="font-semibold text-foreground">{module.module}</span>
                    </div>
                    <p className={`text-sm ${isHighPerformance ? "text-primary" : "text-primary"}`}>
                      {description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
