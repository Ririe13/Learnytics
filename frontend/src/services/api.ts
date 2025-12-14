/**
 * API Service - User List Dashboard
 * 
 * Simplified API layer that uses Supabase queries directly
 */

import {
  getUsersWithStats,
  getKPIStats,
  getSubmissionTrends,
  getRecentSubmissions, // Added new function
  getJourneyProgress,
  getSubmissionStatusBreakdown,
  getJourneyList as getSupabaseJourneyList,
  UserWithStats
} from "@/services/supabaseService";

// Cache
let usersCache: UserWithStats[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5000; // 5 seconds

/**
 * Clear cache
 */
export function clearCache() {
  console.log('🗑️ Clearing cache');
  usersCache = null;
  cacheTimestamp = 0;
}

/**
 * Get users with caching
 */

/**
 * Get users with caching
 */
async function loadUsers(searchQuery?: string): Promise<UserWithStats[]> {
  const now = Date.now();

  // Return cached if valid and no search/filter
  if (!searchQuery && usersCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Using cached users:', usersCache.length);
    return usersCache;
  }

  console.log('🔄 Fetching users from Supabase...');
  const users = await getUsersWithStats(searchQuery);

  if (!searchQuery) {
    usersCache = users;
    cacheTimestamp = now;
  }

  console.log(`✅ Fetched ${users.length} users`);
  return users;
}

/**
 * Get KPI summary (with optional user filter)
 */
export async function getInsightSummary(userId?: number) {
  const stats = await getKPIStats(userId);

  return {
    totalStudents: stats.totalUsers,
    avgScore: 0, // Not applicable for this dashboard
    completionRate: stats.completionRate,
    avgTimeSpent: 0, // Not applicable
    totalSubmissions: stats.totalSubmissions,
    activeJourneys: stats.activeJourneys
  };
}

/**
 * Get user list (replaces getLeaderboard)
 */
export async function getUserList(searchQuery?: string) {
  return await loadUsers(searchQuery);
}

/**
 * Get submission trends for chart (with optional user filter)
 */
export async function getSubmissionTrendsData(userId?: number) {
  return await getSubmissionTrends(userId);
}

/**
 * Get journey progress for chart
 */
export async function getJourneyProgressData() {
  return await getJourneyProgress();
}

/**
 * Get submission status breakdown for chart (with optional user filter)
 */
export async function getSubmissionStatusData(userId?: number) {
  return await getSubmissionStatusBreakdown(userId);
}

/**
 * Get journey list for filter
 */
export async function getJourneyList() {
  const journeys = await getSupabaseJourneyList();
  return journeys;
}

/**
 * Get user detail by ID
 */
export async function getUserDetail(userId: number) {
  const users = await loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return {
    studentId: user.id.toString(),
    studentName: user.display_name,
    email: user.email,
    totalSubmissions: user.total_submissions,
    completedJourneys: user.completed_journeys,
    avgRating: user.avg_rating,
    joinedDate: user.created_at
  };
}

// Export types
export type { UserWithStats };

import { StudentDetails } from "@/components/StudentDetailsModal";

/**
 * Get detailed student profile with AI insights (Mocked for now as per requirements)
 */
export async function getStudentDetails(userId: number): Promise<StudentDetails> {
  // 1. Get basic user info
  const users = await loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Get real activity data & Official KPI Stats & Recent Activity
  const [trends, kpiStats, recentSubs] = await Promise.all([
    getSubmissionTrends(userId),
    getKPIStats(userId),
    getRecentSubmissions(userId) // Now actually fetching the data
  ]);

  // Use OFFICIAL metrics from getKPIStats to ensure consistency with Dashboard
  const completionRate = kpiStats.completionRate;
  // const totalSubmissions matches kpiStats.totalSubmissions usually, but let's trust trends for the *analysis* part 

  // --- CALL BACKEND ML SERVICE FOR LEARNING STYLE ---
  let learningStyleType = "Consistent Learner"; // Default fallback
  let learningStyleDesc = "Memiliki pola belajar yang teratur.";
  let recommendation = "Pertahankan ritme belajar Anda.";

  try {
    // Call backend endpoint for ML-based recommendation
    const mlResponse = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/ml/recommendation/${userId}`);

    if (mlResponse.ok) {
      const mlData = await mlResponse.json();

      // Map insight to display format
      const styleMap: Record<string, { type: string; desc: string }> = {
        'fast_learner': {
          type: 'Fast Learner',
          desc: 'Menyelesaikan banyak materi dalam waktu singkat. Anda memiliki kemampuan penyerapan informasi yang sangat cepat.'
        },
        'consistent_learner': {
          type: 'Consistent Learner',
          desc: 'Memiliki jumlah materi yang konsisten diselesaikan setiap hari atau minggunya. Kedisiplinan adalah kekuatan utama Anda.'
        },
        'reflective_learner': {
          type: 'Reflective Learner',
          desc: 'Menghabiskan banyak waktu untuk mempelajari suatu materi atau mengulas kembali materi yang telah dipelajari.'
        }
      };

      const styleInfo = styleMap[mlData.insight] || styleMap['consistent_learner'];
      learningStyleType = styleInfo.type;
      learningStyleDesc = styleInfo.desc;
      recommendation = mlData.recommendation || recommendation;

      console.log('✅ ML Service Response:', mlData);
    } else {
      console.warn('⚠️ ML Service returned error, using fallback');
    }
  } catch (error) {
    console.error('❌ Failed to fetch ML recommendation:', error);
    // Use fallback values already set above
  }

  // Mock course reviews (varied based on real stats)
  const normalizedScore = Math.round(user.avg_rating * 20); // 5 -> 100
  const reviews = [
    {
      courseName: "Web Development Basics",
      score: normalizedScore + (Math.random() * 5 - 2.5),
      status: normalizedScore > 80 ? "High performance" : "Needs Review",
      insight: normalizedScore > 80 ? "Solid foundation shown" : "Focus on basic box-model concepts"
    },
    {
      courseName: "React Fundamentals",
      score: Math.min(100, normalizedScore + (Math.random() * 10 - 2)),
      status: "In Progress",
      insight: "Active participation recorded"
    }
  ];

  return {
    id: `S${user.id.toString().padStart(3, '0')}`,
    name: user.display_name,
    email: user.email,
    completionRate: completionRate, // USES KPI STATS (MATCHES DASHBOARD)
    totalTimeMinutes: kpiStats.totalSubmissions * 45, // Uses total submissions for time
    learningStyle: learningStyleType,
    recommendation: learningStyleDesc + " " + recommendation,
    recentActivity: (recentSubs || []).map(sub => ({ // Safety check
      courseName: sub.journeyName || 'Unknown Module',
      date: sub.date,
      rating: sub.rating || 0,
      status: String(sub.status)
    }))
  };
}
