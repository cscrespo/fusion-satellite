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

async function debug() {
    try {
        const doctorId = '95c643f7-dc99-4e66-a7f6-c6ba69a7f507';

        // 1. Fetch Doctor
        console.log(`Fetching doctor with ID: ${doctorId}`);
        const { data: doctors, error: doctorError } = await supabase
            .from('doctors')
            .select('*')
            .eq('id', doctorId);

        if (doctorError) {
            console.error('Error fetching doctor:', doctorError);
            return;
        }

        if (!doctors || doctors.length === 0) {
            console.error('Doctor not found');
            return;
        }

        const doctor = doctors[0];
        console.log(`Found Doctor: ${doctor.name}`);

        // 2. Fetch Consultations (Frontend Logic)
        console.log(`Fetching consultations for doctor_name: '${doctor.name}'`);
        const { data: consultations, error: consultError } = await supabase
            .from('patient_consultations')
            .select('*, patients(full_name)')
            .eq('doctor_name', doctor.name)
            .order('date', { ascending: false });

        if (consultError) {
            console.error('Error fetching consultations:', consultError);
        } else {
            console.log(`Found ${consultations.length} consultations.`);
            if (consultations.length > 0) {
                console.log('Sample consultation:', consultations[0]);
            } else {
                console.log('No consultations found. Check strict equality of doctor_name.');
                // Debug strict equality
                const { data: allConsults } = await supabase
                    .from('patient_consultations')
                    .select('doctor_name')
                    .limit(5);
                console.log('Existing doctor_names in DB:', allConsults);
            }
        }

    } catch (err) {
        console.error('Debug error:', err);
    }
}

debug();
