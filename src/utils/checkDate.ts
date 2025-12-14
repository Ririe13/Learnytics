
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestDate() {
    console.log("Checking latest submission date...");
    const { data, error } = await supabase
        .from('developer_journey_submissions')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Latest submission:", data);
        if (data && data.length > 0) {
            console.log("Latest date:", new Date(data[0].created_at).toLocaleString());
        }
    }
}

checkLatestDate();
