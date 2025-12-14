import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, BookOpen, CheckCircle, Loader2, Search } from "lucide-react";
import { getInsightSummary, getUserList, getSubmissionTrendsData, getSubmissionStatusData } from "@/services/api";
import { UserWithStats } from "@/services/supabaseService";
import { KPICard } from "@/components/dashboard/KPICard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { SubmissionStatusChart } from "@/components/dashboard/ModuleBarChart";
import { UserList } from "@/components/dashboard/Leaderboard";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  // State
  const [kpiData, setKpiData] = useState<any>(null);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [submissionTrends, setSubmissionTrends] = useState<any[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get user list first
        const userList = await getUserList(searchQuery);
        setUsers(userList);

        // If search returns exactly 1 user, show personalized data
        const userId = userList.length === 1 ? userList[0].id : undefined;

        const [kpi, trends, statusData] = await Promise.all([
          getInsightSummary(userId),
          getSubmissionTrendsData(userId),
          getSubmissionStatusData(userId),
        ]);

        setKpiData(kpi);
        setSubmissionTrends(trends);
        setSubmissionStatus(statusData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, toast]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Search */}
        <motion.div
          id="dashboard"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-black text-foreground">Dashboard</h1>

            {/* Search Bar - Right */}
            <div className="flex gap-2 max-w-md w-full justify-end">
              <Input
                placeholder="Search users by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Users"
            value={kpiData?.totalStudents || 0}
            icon={Users}
            index={0}
          />
          <KPICard
            title="Total Submissions"
            value={kpiData?.totalSubmissions || 0}
            icon={FileText}
            index={1}
          />
          <KPICard
            title="Active Journeys"
            value={kpiData?.activeJourneys || 0}
            icon={BookOpen}
            index={2}
          />
          <KPICard
            title="Completion Rate"
            value={`${kpiData?.completionRate || 0}%`}
            icon={CheckCircle}
            index={3}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart data={submissionTrends} />
          <SubmissionStatusChart data={submissionStatus} />
        </div>

        {/* User List */}
        <div id="user-list">
          <UserList data={users} searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
};

export default Index;
