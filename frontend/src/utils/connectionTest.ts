import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection...');
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL);

    try {
        // Test 1: Check if client is initialized
        if (!supabase) {
            console.error('❌ Supabase client not initialized');
            return { success: false, error: 'Client not initialized' };
        }
        console.log('✅ Supabase client initialized');

        // Test 2: Try to get session (auth test)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.warn('⚠️ Session check error:', sessionError.message);
        } else {
            console.log('✅ Auth connection successful. Session:', sessionData.session ? 'Active' : 'No active session');
        }

        // Test 3: Try a simple query to test database connection
        // Query users table to confirm connection works
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .limit(1);

        if (error) {
            // Error might be because table doesn't exist, but connection is working
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.log('✅ Database connection successful (table may not exist yet)');
                console.log('ℹ️ Error:', error.message);
                return {
                    success: true,
                    message: 'Connected to Supabase, but table may not exist',
                    error: error.message
                };
            }
            console.error('❌ Database query error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Database connection successful');
        console.log('📊 Query result:', data);
        return { success: true, data };

    } catch (e) {
        console.error('❌ Connection test failed:', e);
        return { success: false, error: e.message };
    }
}

export async function testBackendConnection() {
    console.log('🔍 Testing Backend API Connection...');

    try {
        // Test health endpoint
        const healthResponse = await fetch('http://localhost:9000/health');
        const healthData = await healthResponse.json();

        if (healthResponse.ok) {
            console.log('✅ Backend health check successful:', healthData);
        } else {
            console.error('❌ Backend health check failed');
            return { success: false, error: 'Health check failed' };
        }

        // Test API endpoint
        const apiResponse = await fetch('http://localhost:9000/api/v1/data/sample');
        const apiData = await apiResponse.json();

        if (apiResponse.ok) {
            console.log('✅ Backend API connection successful');
            console.log('📊 Sample data:', apiData);
            return { success: true, health: healthData, sampleData: apiData };
        } else {
            console.log('⚠️ API endpoint returned error:', apiData);
            return { success: true, health: healthData, apiError: apiData };
        }

    } catch (e) {
        console.error('❌ Backend connection test failed:', e);
        return { success: false, error: e.message };
    }
}

// Run tests automatically when imported
export async function runAllTests() {
    console.log('\n========================================');
    console.log('🚀 Running Connection Tests');
    console.log('========================================\n');

    const supabaseResult = await testSupabaseConnection();
    console.log('\n----------------------------------------\n');
    const backendResult = await testBackendConnection();

    console.log('\n========================================');
    console.log('📋 Test Results Summary');
    console.log('========================================');
    console.log('Supabase:', supabaseResult.success ? '✅ Connected' : '❌ Failed');
    console.log('Backend:', backendResult.success ? '✅ Connected' : '❌ Failed');
    console.log('========================================\n');

    return {
        supabase: supabaseResult,
        backend: backendResult
    };
}
