import { supabase } from '@/integrations/supabase/client';

/**
 * Test script to inspect Supabase database schema
 * This will help us understand what tables exist and their structure
 */

export async function inspectDatabase() {
    console.log('🔍 Inspecting Supabase Database Schema...\n');

    // List of tables to check based on actual database schema
    const tablesToCheck = [
        'users',
        'developer_journey_submissions',
        'developer_journeys',
        'developer_journey_tutorials',
        'developer_journey_completions',
        'student_learning_records' // This is a view
    ];

    const foundTables: string[] = [];
    const tableSchemas: Record<string, any> = {};

    for (const tableName of tablesToCheck) {
        try {
            console.log(`Checking table: ${tableName}...`);

            // Try to fetch one record to see if table exists
            const { data, error } = await (supabase as any)
                .from(tableName)
                .select('*')
                .limit(1);

            if (!error) {
                foundTables.push(tableName);
                console.log(`✅ Found table: ${tableName}`);

                if (data && data.length > 0) {
                    tableSchemas[tableName] = {
                        sampleData: data[0],
                        columns: Object.keys(data[0])
                    };
                    console.log(`   Columns:`, Object.keys(data[0]).join(', '));
                    console.log(`   Sample:`, data[0]);
                } else {
                    console.log(`   Table exists but is empty`);
                }
            } else {
                console.log(`❌ Table ${tableName} not found or error:`, error.message);
            }
        } catch (e: any) {
            console.log(`❌ Error checking ${tableName}:`, e.message);
        }
        console.log('');
    }

    console.log('\n========================================');
    console.log('📊 Database Inspection Summary');
    console.log('========================================');
    console.log(`Found ${foundTables.length} tables:`, foundTables.join(', '));
    console.log('\nTable Schemas:');
    console.log(JSON.stringify(tableSchemas, null, 2));
    console.log('========================================\n');

    return {
        foundTables,
        tableSchemas
    };
}

// Auto-run when imported in dev mode
if (import.meta.env.DEV) {
    // Wait a bit for the app to initialize
    setTimeout(() => {
        inspectDatabase().then(result => {
            console.log('Database inspection complete!');
            // Store in window for easy access
            (window as any).dbSchema = result;
            console.log('Access results via: window.dbSchema');
        });
    }, 2000);
}
