const supabase = require('../config/supabase');
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Indonesian Recommendations for each learning style
const RECOMMENDATIONS = {
  fast_learner: [
    'Kecepatan Anda luar biasa! Tantang diri Anda dengan proyek "Capstone" yang lebih kompleks untuk menguji kedalaman pemahaman Anda, bukan hanya kecepatan penyelesaian.',
    'Anda belajar dengan sangat cepat! Cobalah mengajarkan materi kepada orang lain untuk memperdalam pemahaman Anda.',
    'Kecepatan belajar Anda tinggi! Coba tantang diri dengan materi lanjutan atau proyek yang lebih kompleks.'
  ],
  consistent_learner: [
    'Konsistensi adalah kunci penguasaan skill jangka panjang. Cobalah tingkatkan sedikit demi sedikit kesulitan materi harian Anda (Progressive Overload) agar tidak stagnan.',
    'Kedisiplinan Anda sangat baik! Pertahankan ritme belajar dan naikkan target 10% setiap minggu.',
    'Pola belajar Anda sangat teratur! Ini adalah fondasi yang kuat untuk penguasaan jangka panjang.'
  ],
  reflective_learner: [
    'Pendekatan mendalam Anda sangat bagus untuk konsep sulit. Buatlah "Dev Log" atau blog teknis untuk mendokumentasikan pemahaman Anda, ini akan sangat memperkuat ingatan jangka panjang.',
    'Anda menghabiskan waktu yang cukup untuk memahami materi dengan mendalam. Cobalah membuat catatan atau mind map untuk memperkuat pemahaman.',
    'Pendekatan reflektif Anda sangat baik untuk pemahaman mendalam. Pertimbangkan untuk membuat dokumentasi atau tutorial dari apa yang Anda pelajari.'
  ]
};


// Helper: Fetch data from Supabase
const fetchData = async (filters = {}) => {
  let query = supabase.from('student_learning_records').select('*');

  // Note: View already handles most joins. 
  // We can add server-side filtering here if needed, but for now fetching all for consistency with previous logic
  // Optimally, we should filter by studentId or date on the DB side.

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

  // Basic mapping to ensure camelCase if view returns snake_case (view uses aliases but let's be safe)
  return data.map(r => ({
    studentId: r.student_id,
    studentName: r.student_name,
    cohort: r.cohort,
    module: r.module,
    date: r.date,
    durationMinutes: r.duration_minutes,
    score: r.score,
    completed: r.completed
  }));
};

// Helper: Calculate insights from data (Client-side aggregation style kept for compatibility)
const calculateInsights = (data, filters = {}) => {
  let filtered = [...data];

  // Apply filters
  if (filters.start) {
    filtered = filtered.filter(r => new Date(r.date) >= new Date(filters.start));
  }
  if (filters.end) {
    filtered = filtered.filter(r => new Date(r.date) <= new Date(filters.end));
  }
  if (filters.module) {
    filtered = filtered.filter(r => r.module === filters.module);
  }

  // Calculate KPIs
  const uniqueStudents = [...new Set(filtered.map(r => r.studentId))];
  const totalStudents = uniqueStudents.length;
  const avgScore = filtered.reduce((sum, r) => sum + r.score, 0) / filtered.length || 0;
  const completionRate = filtered.filter(r => r.completed).length / filtered.length || 0;
  const avgTimeSpent = filtered.reduce((sum, r) => sum + r.durationMinutes, 0) / filtered.length || 0;

  // Trend data (group by date)
  const trendMap = {};
  filtered.forEach(r => {
    const date = r.date.split('T')[0];
    if (!trendMap[date]) trendMap[date] = { sum: 0, count: 0 };
    trendMap[date].sum += r.score;
    trendMap[date].count += 1;
  });
  const trend = Object.entries(trendMap).map(([date, { sum, count }]) => ({
    date,
    avgScore: sum / count
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Module performance
  const moduleMap = {};
  filtered.forEach(r => {
    if (!moduleMap[r.module]) moduleMap[r.module] = { sum: 0, count: 0 };
    moduleMap[r.module].sum += r.score;
    moduleMap[r.module].count += 1;
  });
  const modulePerformance = Object.entries(moduleMap).map(([module, { sum, count }]) => ({
    module,
    avgScore: sum / count,
    count
  }));

  // Completion status
  const completionStatus = [
    { status: 'completed', count: filtered.filter(r => r.completed).length, percentage: 0 },
    { status: 'in-progress', count: Math.floor(filtered.filter(r => !r.completed).length * 0.6), percentage: 0 },
    { status: 'not-started', count: Math.floor(filtered.filter(r => !r.completed).length * 0.4), percentage: 0 }
  ];
  const statusTotal = completionStatus.reduce((sum, s) => sum + s.count, 0);
  completionStatus.forEach(s => s.percentage = statusTotal ? s.count / statusTotal : 0);

  return {
    kpi: {
      totalStudents,
      avgScore: Math.round(avgScore),
      completionRate,
      avgTimeSpent: Math.round(avgTimeSpent)
    },
    trend,
    modulePerformance,
    completionStatus
  };
};

// GET /api/v1/insights/summary
exports.getSummary = async (req, res) => {
  try {
    const data = await fetchData();
    const insights = calculateInsights(data, req.query);
    res.json(insights);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// GET /api/v1/insights/student/:studentId
exports.getStudentDetail = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch specific student data from DB
    const { data: records, error } = await supabase
      .from('student_learning_records')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw error;

    if (!records || records.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Map to App format
    const studentRecords = records.map(r => ({
      studentId: r.student_id,
      studentName: r.student_name,
      cohort: r.cohort,
      module: r.module,
      date: r.date,
      durationMinutes: r.duration_minutes,
      score: r.score,
      completed: r.completed
    }));

    const modules = {};
    studentRecords.forEach(r => {
      if (!modules[r.module]) {
        modules[r.module] = { scores: [], times: [], completed: 0, total: 0 };
      }
      modules[r.module].scores.push(r.score);
      modules[r.module].times.push(r.durationMinutes);
      modules[r.module].total += 1;
      if (r.completed) modules[r.module].completed += 1;
    });

    const moduleProgress = Object.entries(modules).map(([module, data]) => ({
      module,
      avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      totalTime: data.times.reduce((a, b) => a + b, 0),
      completionRate: data.completed / data.total,
      sessionsCount: data.total
    }));

    const moduleScores = studentRecords.map(r => ({
      module: r.module,
      score: r.score,
      completed: r.completed
    }));

    res.json({
      studentId,
      studentName: studentRecords[0].studentName,
      cohort: studentRecords[0].cohort,
      totalSessions: studentRecords.length,
      avgScore: Math.round(studentRecords.reduce((sum, r) => sum + r.score, 0) / studentRecords.length),
      totalTimeSpent: studentRecords.reduce((sum, r) => sum + r.durationMinutes, 0),
      completionRate: studentRecords.filter(r => r.completed).length / studentRecords.length,
      moduleProgress,
      moduleScores,
      recentActivity: studentRecords.slice(0, 5) // Already sorted DESC in view
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// GET /api/v1/insights/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const data = await fetchData();
    const { limit, module } = req.query;

    // Apply filters
    let filtered = [...data];
    if (module) {
      filtered = filtered.filter(r => r.module === module);
    }

    // Group by student
    const studentMap = {};
    filtered.forEach(r => {
      if (!studentMap[r.studentId]) {
        studentMap[r.studentId] = {
          studentId: r.studentId,
          studentName: r.studentName,
          cohort: r.cohort,
          scores: [],
          completedCount: 0,
          totalCount: 0,
          totalMinutes: 0
        };
      }
      studentMap[r.studentId].scores.push(r.score);
      studentMap[r.studentId].totalCount += 1;
      studentMap[r.studentId].totalMinutes += r.durationMinutes;
      if (r.completed) studentMap[r.studentId].completedCount += 1;
    });

    // Calculate metrics and rank
    const leaderboard = Object.values(studentMap).map(student => ({
      studentId: student.studentId,
      studentName: student.studentName,
      cohort: student.cohort,
      avgScore: Math.round(student.scores.reduce((a, b) => a + b, 0) / student.scores.length),
      completionRate: Math.round((student.completedCount / student.totalCount) * 100),
      totalTimeSpent: student.totalMinutes,
      totalActivities: student.totalCount
    }));

    // Sort by avgScore (desc), then completionRate (desc), then totalTimeSpent (desc)
    leaderboard.sort((a, b) => {
      if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
      if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate;
      return b.totalTimeSpent - a.totalTimeSpent;
    });

    // Add rank
    leaderboard.forEach((student, index) => {
      student.rank = index + 1;
    });

    // Limit results if specified
    const limitedLeaderboard = limit ? leaderboard.slice(0, parseInt(limit)) : leaderboard;

    res.json({
      leaderboard: limitedLeaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// GET /api/v1/ml/recommendation/:studentId
exports.getRecommendation = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Convert numeric user ID to student_id format used in view
    // Format: 's' + first 3 digits after padding (e.g., 494342 -> 's494', 102 -> 's102')
    const paddedId = studentId.toString().padStart(3, '0');
    const formattedStudentId = `s${paddedId.substring(0, 3)}`;

    console.log(`🔍 Looking for student: ${studentId} -> ${formattedStudentId}`);

    // Fetch from real DB
    const { data: records, error } = await supabase
      .from('student_learning_records')
      .select('*')
      .eq('student_id', formattedStudentId);

    if (error) throw error;

    if (!records || records.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found or has no activity'
      });
    }

    // Map DB records to Application format
    const studentRecords = records.map(r => ({
      module: r.module,
      score: r.score,
      durationMinutes: r.duration_minutes,
      completed: r.completed,
      date: r.date
    }));

    console.log(`📊 Fetched ${studentRecords.length} records for student ${studentId}`);

    // Try to call ML service first
    try {
      console.log('Sending to ML Service:', JSON.stringify(studentRecords[0])); // Log sample

      const mlRecords = studentRecords.map(r => ({
        module: r.module,
        score: r.score,
        // Scale duration to match model training data magnitude
        duration_minutes: r.durationMinutes * 50,
        completed: r.completed,
        date: r.date.split('T')[0]
      }));

      const mlResponse = await fetch(`${ML_SERVICE_URL}/ml/insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: studentId,
          records: mlRecords
        })
      });

      if (mlResponse.ok) {
        const mlResult = await mlResponse.json();
        console.log('ML Service Response:', mlResult);

        // Backend Logic: Select recommendation based on insight
        const insight = mlResult.insight || 'consistent_learner';
        const recommendationList = RECOMMENDATIONS[insight] || RECOMMENDATIONS['consistent_learner'];
        const recommendation = recommendationList[Math.floor(Math.random() * recommendationList.length)];

        return res.json({
          studentId,
          insight: insight,
          recommendation: recommendation,
          metrics: mlResult.metrics,
          modelVersion: mlResult.model_version + "_backend_logic",
          source: 'ml-service-db'
        });
      }
    } catch (mlError) {
      console.error('❌ ML Service Error:', mlError.message);
      console.error('Stack:', mlError.stack);
    }

    console.log('⚠️ Using FALLBACK logic (ML Service did not respond)');

    // Fallback: Simple rule-based recommendation
    const modules = {};
    studentRecords.forEach(r => {
      if (!modules[r.module]) {
        modules[r.module] = { scores: [], times: [] };
      }
      modules[r.module].scores.push(r.score);
      modules[r.module].times.push(r.durationMinutes);
    });

    const totalTime = studentRecords.reduce((sum, r) => sum + r.durationMinutes, 0);
    const avgTimePerModule = totalTime / studentRecords.length;
    const completionRate = studentRecords.filter(r => r.completed).length / studentRecords.length;
    const modulesPerDay = studentRecords.length;

    let insight = 'consistent_learner';
    let recommendation = 'Pertahankan ritme belajar, naikkan target 10%';

    if (modulesPerDay >= 5) {
      insight = 'fast_learner';
      recommendation = 'Kecepatan belajar Anda tinggi! Coba tantang diri dengan materi lanjutan';
    } else if (avgTimePerModule >= 60) {
      insight = 'reflective_learner';
      recommendation = 'Pendekatan mendalam Anda sangat baik untuk pemahaman jangka panjang';
    }

    const recommendations = [];
    Object.entries(modules).forEach(([module, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      if (avgScore < 75) {
        recommendations.push({
          type: 'practice',
          module,
          reason: 'Need more practice to improve',
          priority: 'medium'
        });
      }
    });

    res.json({
      studentId,
      insight,
      recommendation,
      metrics: {
        consistency_score: Math.min(completionRate + 0.2, 1),
        learning_speed: avgTimePerModule < 40 ? 0.8 : 0.5,
        avg_module_time: Math.round(avgTimePerModule)
      },
      moduleRecommendations: recommendations,
      source: 'fallback-db'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
