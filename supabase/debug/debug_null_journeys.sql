
-- Check specific rows where journey_id is likely null
SELECT id, submitter_id, journey_id, created_at, status
FROM developer_journey_submissions
WHERE journey_id IS NULL
LIMIT 5;

-- Check total count vs null count
SELECT 
    COUNT(*) as total_rows,
    COUNT(journey_id) as non_null_journey_ids,
    COUNT(*) - COUNT(journey_id) as null_journey_ids
FROM developer_journey_submissions;

-- Check what other columns exist that might give a clue
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'developer_journey_submissions';
