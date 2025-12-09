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

async function verifyAdminLogin() {
    console.log('1. Attempting login as Super Admin...');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@bloom.com',
        password: 'admin123'
    });

    if (error) {
        console.error('❌ Login failed:', error.message);
        return;
    }

    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('Role:', data.user.role);

    console.log('\n2. Attempting to fetch profile...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
        console.error('❌ Profile fetch failed:', profileError.message);
    } else {
        console.log('✅ Profile fetched successfully:', profile.full_name);
        console.log('Profile Role:', profile.role);
        console.log('Org ID:', profile.organization_id);
    }
}

verifyAdminLogin();
