import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    console.log('🔍 Checking auth users via RPC...');

    // Login as super admin
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@bloom.com',
        password: 'admin123'
    });

    if (loginError) {
        console.error('❌ Login failed:', loginError.message);
        return;
    }

    const { data, error } = await supabase.rpc('get_auth_users');

    if (error) {
        console.error('❌ Error fetching users:', error.message);
        return;
    }

    console.log(`✅ Found ${data.length} users:`);
    console.table(data);
}

checkUsers();
