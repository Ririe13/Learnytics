import { supabase } from "@/integrations/supabase/client";

// Interfaces

// Interfaces
export interface UserWithStats {
    id: number;
    display_name: string;
    name: string;
    email: string;
    created_at: string;
    total_submissions: number;
    completed_journeys: number;
    avg_rating: number;
}

export interface SubmissionTrend {
    date: string;
    count: number;
    avg_rating: number;
}

export interface JourneyProgress {
    journey_name: string;
    total_enrollments: number;
    completions: number;
    completion_rate: number;
}

/**
 * Helper: Get reference date (latest submission date in DB)
 * This ensures filters work correctly even if data is old
 */
let cachedReferenceDate: Date | null = null;

async function getReferenceDate(): Promise<Date> {
    if (cachedReferenceDate) return cachedReferenceDate;

    try {
        const { data, error } = await supabase
            .from('developer_journey_submissions')
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data?.created_at) {
            cachedReferenceDate = new Date(data.created_at);
            console.log('📅 Using reference date from DB:', cachedReferenceDate.toISOString());
            return cachedReferenceDate;
        }
    } catch (e) {
        console.warn('Failed to fetch latest date, using current date', e);
    }

    return new Date(); // Fallback to now
}

/**
 * Helper: Get date range filter
 * Using hardcoded dates based on dataset (2016-2023) to ensure filters works meaningfuly
 */
function getDateRangeFilter(range?: string): Date | null {
    if (!range || range === 'all') return null;

    // Dataset ends around April 2023 based on user feedback
    // So we use fixed dates relative to that for "demo" purposes
    // Or providing year-based filters

    const now = new Date(); // Current date for standard logic

    switch (range) {
        case 'last_year': // "Last Year of Data" -> 2023
            return new Date('2023-01-01');
        case 'last_2_years': // "Last 2 Years" -> 2022
            return new Date('2022-01-01');
        case '7d':
            return new Date(now.setDate(now.getDate() - 7));
        case '30d':
            return new Date(now.setDate(now.getDate() - 30));
        default:
            return null;
    }
}

/**
 * Get all users with their stats (submissions, completions)
 */
/**
 * Get all users with their stats (submissions, completions)
 */
export async function getUsersWithStats(searchQuery?: string): Promise<UserWithStats[]> {
    try {
        console.log('🔍 Fetching users from database...');

        // Get all users - simplified query without type casting
        const usersQuery = supabase
            .from('users')
            .select('id, display_name, name, email, created_at')
            .is('deleted_at', null);

        // Apply search filter if provided
        let finalQuery = usersQuery;

        if (searchQuery) {
            finalQuery = usersQuery.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
        }

        const { data: users, error } = await finalQuery;

        if (error) {
            console.error('❌ Error fetching users:', error);
            throw error;
        }

        if (!users) return [];

        // Get all submissions
        const { data: submissions, error: subError } = await supabase
            .from('developer_journey_submissions')
            .select('submitter_id, rating, created_at');

        if (subError) console.error('Error fetching submissions:', subError);

        // Get all completions
        const { data: completions, error: compError } = await supabase
            .from('developer_journey_completions')
            .select('user_id');

        if (compError) {
            console.error('❌ Error fetching completions:', compError);
        }

        // Aggregate stats per user
        const submissionsByUser = new Map<number, { count: number; totalRating: number }>();
        submissions?.forEach(sub => {
            const existing = submissionsByUser.get(sub.submitter_id) || { count: 0, totalRating: 0 };
            submissionsByUser.set(sub.submitter_id, {
                count: existing.count + 1,
                totalRating: existing.totalRating + (sub.rating || 0)
            });
        });

        const completionsByUser = new Map<number, number>();
        completions?.forEach(comp => {
            completionsByUser.set(comp.user_id, (completionsByUser.get(comp.user_id) || 0) + 1);
        });

        // Combine data
        const usersWithStats: UserWithStats[] = users.map(user => {
            // Safe property access with fallbacks
            const userId = user.id;
            const subStats = submissionsByUser.get(userId) || { count: 0, totalRating: 0 };
            const completedCount = completionsByUser.get(userId) || 0;

            return {
                id: userId,
                display_name: user.display_name || user.name || 'Unknown',
                name: user.name || user.display_name || 'Unknown',
                email: user.email || '',
                created_at: user.created_at,
                total_submissions: subStats.count,
                completed_journeys: completedCount,
                avg_rating: subStats.count > 0 ? subStats.totalRating / subStats.count : 0
            };
        });

        // Sort alphabetically by display_name
        usersWithStats.sort((a, b) => a.display_name.localeCompare(b.display_name));

        console.log(`✅ Fetched ${usersWithStats.length} users with stats`);
        return usersWithStats;

    } catch (error) {
        console.error('❌ Error in getUsersWithStats:', error);
        return [];
    }
}


/**
 * Get submission trends over time (with optional user filter)
 */
/**
 * Get submission trends over time (with optional user filter)
 * LIMITED TO LAST 6 MONTHS for chart readability
 */
export async function getSubmissionTrends(userId?: number): Promise<SubmissionTrend[]> {
    try {
        let query = supabase
            .from('developer_journey_submissions')
            .select('created_at, rating');

        // Filter by user if provided
        if (userId) {
            query = query.eq('submitter_id', userId);
        }

        query = query.order('created_at', { ascending: true });

        const { data, error } = await query;

        if (error) throw error;
        if (!data || data.length === 0) return [];

        // 1. Group by date first
        const trendMap = new Map<string, { count: number; totalRating: number }>();

        data.forEach(sub => {
            const date = sub.created_at.split('T')[0]; // Get date part only
            const existing = trendMap.get(date) || { count: 0, totalRating: 0 };
            trendMap.set(date, {
                count: existing.count + 1,
                totalRating: existing.totalRating + (sub.rating || 0)
            });
        });

        // 2. Convert to sorted array
        const allTrends: SubmissionTrend[] = Array.from(trendMap.entries()).map(([date, stats]) => ({
            date,
            count: stats.count,
            avg_rating: stats.count > 0 ? stats.totalRating / stats.count : 0
        }));

        allTrends.sort((a, b) => a.date.localeCompare(b.date));

        // 3. Filter for Last 6 Months (approx 180 days)
        // We use the LATEST available date in the dataset as the reference point ("now")
        // because the dataset might stop in 2023.
        const latestDateStr = allTrends[allTrends.length - 1].date;
        const latestDate = new Date(latestDateStr);

        // Calculate cutoff date (6 months ago from latest data)
        const cutoffDate = new Date(latestDate);
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

        console.log(`📅 Chart Range: ${cutoffDateStr} to ${latestDateStr}`);

        const recentTrends = allTrends.filter(t => t.date >= cutoffDateStr);

        return recentTrends;

    } catch (error) {
        console.error('Error fetching submission trends:', error);
        return [];
    }
}

/**
 * Get submission status breakdown (with optional user filter)
 */
export async function getSubmissionStatusBreakdown(userId?: number): Promise<{ status: string; count: number; percentage: number }[]> {
    try {
        // Status mapping based on schema
        const statusLabels: Record<number, string> = {
            0: "Pending Review",
            1: "Approved",
            2: "Rejected",
            3: "Needs Revision",
            4: "In Review"
        };

        // Get counts for each status using aggregation
        const statusCounts: { status: number; count: number }[] = [];
        let totalCount = 0;

        // Query each status separately with count
        for (const statusCode of [0, 1, 2, 3, 4]) {
            let query = supabase
                .from('developer_journey_submissions')
                .select('id', { count: 'exact', head: true })
                .eq('status', statusCode);

            if (userId) {
                query = query.eq('submitter_id', userId);
            }

            const { count } = await query;

            if (count && count > 0) {
                statusCounts.push({ status: statusCode, count });
                totalCount += count;
            }
        }

        if (totalCount === 0) return [];

        // Convert to array with percentages
        const breakdown = statusCounts
            .map(({ status, count }) => ({
                status: statusLabels[status] || `Status ${status}`,
                count,
                percentage: (count / totalCount) * 100
            }))
            .sort((a, b) => b.count - a.count); // Sort by count descending

        console.log(`✅ [STATUS BREAKDOWN] Total: ${totalCount}, Breakdown:`, breakdown);

        return breakdown;

    } catch (error) {
        console.error('Error fetching submission status breakdown:', error);
        return [];
    }
}

/**
 * Get KPI summary stats (with optional user filter)
 */
export async function getKPIStats(userId?: number) {
    try {
        // Get total users (Active in this journey if filtered)
        let usersQuery = supabase
            .from('users')
            .select('id', { count: 'exact' })
            .is('deleted_at', null);

        if (userId) {
            usersQuery = usersQuery.eq('id', userId);
        }

        const { count: totalUsers } = await usersQuery;

        // Get total submissions
        let submissionsQuery = supabase
            .from('developer_journey_submissions')
            .select('id', { count: 'exact' });

        if (userId) {
            submissionsQuery = submissionsQuery.eq('submitter_id', userId);
        }

        const { count: totalSubmissions } = await submissionsQuery;

        // Get total completions
        let completionsQuery = supabase
            .from('developer_journey_completions')
            .select('id', { count: 'exact' });

        if (userId) {
            completionsQuery = completionsQuery.eq('user_id', userId);
        }

        const { count: totalCompletions } = await completionsQuery;

        // Get active journeys (journeys with at least one submission)
        let activeJourneysQuery = supabase
            .from('developer_journey_submissions')
            .select('journey_id');

        if (userId) {
            activeJourneysQuery = activeJourneysQuery.eq('submitter_id', userId);
        }

        const { data: journeyData } = await activeJourneysQuery;
        const activeJourneys = new Set(journeyData?.map(j => j.journey_id)).size;

        // Calculate completion rate
        const rawRate = totalSubmissions && totalSubmissions > 0
            ? ((totalCompletions || 0) / totalSubmissions) * 100
            : 0;

        // Round to 1 decimal place
        const completionRate = Math.round(rawRate * 10) / 10;

        return {
            totalUsers: totalUsers || 0,
            totalSubmissions: totalSubmissions || 0,
            activeJourneys,
            completionRate
        };

    } catch (error) {
        console.error('Error fetching KPI stats:', error);
        return {
            totalUsers: 0,
            totalSubmissions: 0,
            activeJourneys: 0,
            completionRate: 0
        };
    }
}

/**
 * Get journey progress data
 */
export async function getJourneyProgress(): Promise<JourneyProgress[]> {
    try {
        // Get all journeys
        const { data: journeys } = await supabase
            .from('developer_journeys')
            .select('id, name');

        if (!journeys) return [];

        // Get submissions per journey
        const { data: submissions } = await supabase
            .from('developer_journey_submissions')
            .select('journey_id, submitter_id');

        // Get completions per journey
        const { data: completions } = await supabase
            .from('developer_journey_completions')
            .select('journey_id, user_id');

        const progress = journeys.map(journey => {
            const enrolledUsers = new Set(
                submissions?.filter(s => s.journey_id === journey.id).map(s => s.submitter_id)
            );
            const completedUsers = completions?.filter(c => c.journey_id === journey.id).length || 0;

            return {
                journey_name: journey.name,
                total_enrollments: enrolledUsers.size,
                completions: completedUsers,
                completion_rate: enrolledUsers.size > 0 ? (completedUsers / enrolledUsers.size) * 100 : 0
            };
        });

        console.log(`📊 Journey progress: ${progress.length} journeys`);
        return progress;

    } catch (error) {
        console.error('Error fetching journey progress:', error);
        return [];
    }
}

/**
 * Get list of journeys
 */
export async function getJourneyList() {
    try {
        console.log("🔍 Fetching all journeys...");
        const { data, error } = await supabase
            .from('developer_journeys')
            .select('id, name')
            .order('name');

        if (error) {
            console.error('Error fetching journeys:', error);
            return [];
        }

        console.log(`✅ Loaded ${data?.length || 0} journeys`);
        return data || [];

    } catch (error) {
        console.error('Error in getJourneyList:', error);
        return [];
    }
}

/**
 * Get recent submissions for activity timeline
 */
export async function getRecentSubmissions(userId: number, limit = 5) {
    try {
        const { data, error } = await supabase
            .from('developer_journey_submissions')
            .select(`
                id,
                rating,
                created_at,
                status,
                journey_id,
                quiz_id
            `) // We refrain from joining purely to avoid type hassle, we'll fetch journey names separately or if possible
            .eq('submitter_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (!data) return [];

        // 1. Fetch journey names
        const journeyIds = Array.from(new Set(data.map(s => s.journey_id).filter(id => id !== null)));
        const { data: journeys } = await supabase
            .from('developer_journeys')
            .select('id, name')
            .in('id', journeyIds);

        // 2. Fetch tutorial/quiz titles (for when journey_id is null)
        const quizIds = Array.from(new Set(data.map(s => s.quiz_id).filter(id => id !== null)));
        const { data: tutorials } = await supabase
            .from('developer_journey_tutorials')
            .select('id, title')
            .in('id', quizIds);

        const journeyMap = new Map<number, string>();
        journeys?.forEach(j => journeyMap.set(j.id, j.name));

        const tutorialMap = new Map<number, string>();
        tutorials?.forEach(t => tutorialMap.set(t.id, t.title));

        return data.map(sub => {
            // Priority: Journey Name -> Tutorial Title -> Generic
            let activityName = 'General Activity';

            if (sub.journey_id && journeyMap.has(sub.journey_id)) {
                activityName = journeyMap.get(sub.journey_id) || '';
            } else if (sub.quiz_id && tutorialMap.has(sub.quiz_id)) {
                activityName = tutorialMap.get(sub.quiz_id) || '';
            }

            return {
                id: sub.id,
                journeyName: activityName || 'Unknown Activity',
                date: sub.created_at,
                rating: sub.rating,
                status: sub.status
            };
        });

    } catch (error) {
        console.error('Error fetching recent submissions:', error);
        return [];
    }
}
