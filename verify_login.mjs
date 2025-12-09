import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLogin() {
    console.log('1. Attempting login as Dr. Smith...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'dr.smith@bloom.com',
        password: '123456'
    });

    if (authError) {
        console.error('❌ Login failed:', authError);
        return;
    }

    console.log('✅ Login successful!');
    console.log('User ID:', authData.user.id);

    console.log('\n2. Attempting to fetch profile...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        console.error('❌ Profile fetch failed:', profileError);
    } else {
        console.log('✅ Profile fetched successfully:', profile.full_name);
    }
}

verifyLogin();
