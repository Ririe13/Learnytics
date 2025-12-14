-- ============================================
-- SQL View: student_learning_records
-- ============================================
-- This view maps your existing database structure to the format
-- expected by the Learning Vista dashboard
--
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/thpyfwwiryawlyuzduwm/sql
--
-- UPDATED: Now includes ALL users, not just those with submissions
-- Users without submissions will show with default values
-- ============================================

CREATE OR REPLACE VIEW student_learning_records AS
SELECT 
  -- Student info
  CONCAT('s', LPAD(u.id::text, 3, '0')) as student_id,
  COALESCE(u.display_name, u.name, 'Unknown') as student_name,
  
  -- Journey/Cohort info (using journey name as cohort)
  COALESCE(dj.name, 'Not Enrolled') as cohort,
  
  -- Tutorial/Module info
  COALESCE(djt.title, dj.name, 'No Activity') as module,
  
  -- Submission info (use current date if no submission)
  COALESCE(djs.created_at::text, NOW()::text) as date,
  COALESCE(djs.rating::integer, 0) as score,
  
  -- Duration from submission_duration or default
  COALESCE(djs.submission_duration, 0)::integer as duration_minutes,
  
  -- Completion status based on submission status
  CASE 
    WHEN djc.id IS NOT NULL THEN true
    WHEN djs.status = 1 THEN true
    ELSE false
  END as completed

FROM users u
LEFT JOIN developer_journey_submissions djs ON djs.submitter_id = u.id
LEFT JOIN developer_journeys dj ON dj.id = djs.journey_id
LEFT JOIN developer_journey_tutorials djt ON djt.id = djs.quiz_id
LEFT JOIN developer_journey_completions djc 
  ON djc.user_id = u.id AND djc.journey_id = djs.journey_id

WHERE 
  u.deleted_at IS NULL  -- Only active users
  
ORDER BY djs.created_at DESC NULLS LAST;

-- ============================================
-- Test the view
-- ============================================
-- Run this to verify the view works:
-- SELECT * FROM student_learning_records LIMIT 10;

-- Check data quality:
-- SELECT 
--   COUNT(*) as total_records,
--   COUNT(DISTINCT student_id) as unique_students,
--   COUNT(DISTINCT cohort) as unique_cohorts,
--   COUNT(DISTINCT module) as unique_modules,
--   AVG(score) as avg_score,
--   AVG(duration_minutes) as avg_duration
-- FROM student_learning_records;
