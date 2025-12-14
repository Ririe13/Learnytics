-- Test query to check how many unique students we have
-- Run this in Supabase SQL Editor to diagnose the issue

-- Query 1: Check total records in view
SELECT COUNT(*) as total_records
FROM student_learning_records;

-- Query 2: Check unique students
SELECT COUNT(DISTINCT student_id) as unique_students
FROM student_learning_records;

-- Query 3: Check distribution - how many records per student
SELECT 
  student_id,
  student_name,
  COUNT(*) as record_count
FROM student_learning_records
GROUP BY student_id, student_name
ORDER BY record_count DESC
LIMIT 10;

-- Query 4: Check all users from users table
SELECT COUNT(*) as total_users
FROM users
WHERE deleted_at IS NULL;

-- Query 5: Sample data from view
SELECT *
FROM student_learning_records
LIMIT 5;
