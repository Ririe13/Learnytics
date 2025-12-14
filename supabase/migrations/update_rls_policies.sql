-- Enable RLS on tables (ensures policies are active)
ALTER TABLE developer_journey_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_journey_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 1. Policies for developer_journey_submissions
DROP POLICY IF EXISTS "Enable read access for all users" ON developer_journey_submissions;
DROP POLICY IF EXISTS "Public select" ON developer_journey_submissions;

CREATE POLICY "Enable read access for all users"
ON developer_journey_submissions
FOR SELECT
USING (true); -- Allow everyone (public/anon) to read

-- 2. Policies for developer_journey_completions
DROP POLICY IF EXISTS "Enable read access for all users" ON developer_journey_completions;
DROP POLICY IF EXISTS "Public select" ON developer_journey_completions;

CREATE POLICY "Enable read access for all users"
ON developer_journey_completions
FOR SELECT
USING (true);

-- 3. Policies for developer_journeys
DROP POLICY IF EXISTS "Enable read access for all users" ON developer_journeys;
DROP POLICY IF EXISTS "Public select" ON developer_journeys;

CREATE POLICY "Enable read access for all users"
ON developer_journeys
FOR SELECT
USING (true);

-- 4. Policies for users (Already working but good to enforce)
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Public select" ON users;

CREATE POLICY "Enable read access for all users"
ON users
FOR SELECT
USING (true);

-- Optional: Grant usage on schema just in case
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
