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

async function checkOrganizations() {
    console.log('🔍 Checking organizations in database...');

    // We need to sign in as super admin to see all orgs due to RLS
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@bloom.com',
        password: 'admin123'
    });

    if (loginError) {
        console.error('❌ Login failed:', loginError.message);
        return;
    }

    const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug, plan_type, created_at');

    if (error) {
        console.error('❌ Error fetching organizations:', error.message);
        return;
    }

    console.log(`✅ Found ${data.length} organizations:`);
    console.table(data);
}

checkOrganizations();
