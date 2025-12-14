
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://thpyfwwiryawlyuzduwm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocHlmd3dpcnlhd2x5dXpkdXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTUyMjIsImV4cCI6MjA4MDc5MTIyMn0.K-hYgIT0BJRyXrzSP74DUisZe_fl7FmnOz-lieL0ZiI";

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName: string) {
    console.log(`\n--- Inspecting ${tableName} ---`);

    // Check count
    const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error(`Error counting ${tableName}:`, countError.message);
    } else {
        console.log(`Total rows in ${tableName}: ${count}`);
    }

    // Check first 3 rows to see data structure
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

    if (error) {
        console.error(`Error fetching data from ${tableName}:`, error.message);
    } else {
        console.log(`Sample data (${data?.length} rows):`);
        if (data && data.length > 0) {
            console.log(JSON.stringify(data[0], null, 2));
        }
    }
}

async function main() {
    console.log('Starting simplified database inspection...');
    await inspectTable('users');
    await inspectTable('developer_journey_submissions');
    await inspectTable('developer_journey_completions');
}

main().catch(console.error);
