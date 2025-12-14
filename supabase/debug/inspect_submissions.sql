
-- 1. Get all columns for the table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'developer_journey_submissions';

-- 2. Inspect a few rows with null journey_id to see content
SELECT * 
FROM developer_journey_submissions 
WHERE journey_id IS NULL 
LIMIT 3;
