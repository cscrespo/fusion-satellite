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

async function checkPlans() {
    try {
        console.log('🔐 Authenticating as Dr. Smith...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'dr.smith@bloom.com',
            password: '123456'
        });

        if (authError) {
            console.error('❌ Authentication failed:', authError.message);
            return;
        }
        console.log('✅ Authenticated.');

        console.log('🔍 Checking treatment_plans table...');

        const { data: orgs, error: orgError } = await supabase.from('organizations').select('*');
        console.log(`🏢 Found ${orgs?.length || 0} organizations.`);

        const { data: plans, error } = await supabase
            .from('treatment_plans')
            .select('*');

        if (error) {
            console.error('❌ Error fetching plans:', error);
            return;
        }

        console.log(`✅ Found ${plans.length} plans.`);
        plans.forEach(p => console.log(`   - ${p.name} (${p.status})`));

    } catch (err) {
        console.error('Error:', err);
    }
}

checkPlans();
