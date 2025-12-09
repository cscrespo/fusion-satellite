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

async function analyzeDuplicates() {
    console.log('🔐 Authenticating...');
    await supabase.auth.signInWithPassword({
        email: 'dr.smith@bloom.com',
        password: '123456'
    });

    console.log('\n📊 Analyzing Duplicates...');

    // 1. Treatment Plans
    const { data: plans } = await supabase.from('treatment_plans').select('name, id');
    const planCounts = {};
    plans.forEach(p => planCounts[p.name] = (planCounts[p.name] || 0) + 1);
    console.log('\n💊 Treatment Plans Duplicates:');
    Object.entries(planCounts).filter(([_, c]) => c > 1).forEach(([name, count]) => {
        console.log(`   - "${name}": ${count} copies`);
    });

    // 2. Doctors
    const { data: doctors } = await supabase.from('doctors').select('name, id');
    const doctorCounts = {};
    doctors.forEach(d => doctorCounts[d.name] = (doctorCounts[d.name] || 0) + 1);
    console.log('\n👨‍⚕️ Doctors Duplicates:');
    Object.entries(doctorCounts).filter(([_, c]) => c > 1).forEach(([name, count]) => {
        console.log(`   - "${name}": ${count} copies`);
    });

    // 3. Patients
    const { data: patients } = await supabase.from('patients').select('full_name, id');
    const patientCounts = {};
    patients.forEach(p => patientCounts[p.full_name] = (patientCounts[p.full_name] || 0) + 1);
    console.log('\n🤒 Patients Duplicates:');
    Object.entries(patientCounts).filter(([_, c]) => c > 1).forEach(([name, count]) => {
        console.log(`   - "${name}": ${count} copies`);
    });

    // 4. Profiles
    const { data: profiles } = await supabase.from('profiles').select('full_name, id');
    const profileCounts = {};
    profiles.forEach(p => profileCounts[p.full_name] = (profileCounts[p.full_name] || 0) + 1);
    console.log('\n👤 Profiles Duplicates:');
    Object.entries(profileCounts).filter(([_, c]) => c > 1).forEach(([name, count]) => {
        console.log(`   - "${name}": ${count} copies`);
    });
}

analyzeDuplicates();
