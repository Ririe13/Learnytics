
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJourneys() {
    console.log("🔍 Checking Journey Data...");

    // 1. Check Submissions Journey IDs
    const { data: submissions, error: subError } = await supabase
        .from('developer_journey_submissions')
        .select('journey_id')
        .limit(20);

    if (subError) console.error("Submissions Error:", subError);
    else {
        console.log(`\n📄 Sample Submissions Journey IDs (first 20):`);
        console.log(submissions);

        const distinctIds = [...new Set(submissions?.map(s => s.journey_id))].filter(Boolean);
        console.log(`\n✨ Distinct IDs found in sample: ${distinctIds.join(', ')}`);
    }

    // 2. Check Journeys Table
    const { data: journeys, error: jourError } = await supabase
        .from('developer_journeys')
        .select('id, name')
        .limit(10);

    if (jourError) console.error("Journeys Error:", jourError);
    else {
        console.log(`\n📚 Sample Journeys Table (first 10):`);
        console.table(journeys);
    }
}

checkJourneys();
