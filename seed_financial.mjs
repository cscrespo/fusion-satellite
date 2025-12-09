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

async function seed() {
    try {
        console.log('Authenticating as Dr. Smith...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'dr.smith@bloom.com',
            password: '123456'
        });

        if (authError) {
            console.error('Authentication failed:', authError.message);
            // Fallback: Try to proceed without auth if using service role (not the case here usually)
            // But let's stop here because RLS will likely block us.
            return;
        }

        console.log('Authenticated successfully.');
        const userId = authData.user.id;

        // 0. Get Organization ID
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('organization_id, full_name')
            .eq('id', userId)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
        }

        const organizationId = profile.organization_id;
        console.log(`Organization ID: ${organizationId}`);

        const doctorId = '95c643f7-dc99-4e66-a7f6-c6ba69a7f507';

        // 1. Get Doctor Info (from doctors table, which might be different from profiles)
        // Note: The doctorId hardcoded above might not match Dr. Smith's profile ID if they are different tables/concepts.
        // Let's check if we should use the profile name or the doctors table.
        // The original script used a specific UUID for doctorId. Let's keep using it but check if it exists.

        const { data: doctors, error: doctorError } = await supabase
            .from('doctors')
            .select('*')
            .eq('id', doctorId);

        if (doctorError) throw doctorError;

        let doctorName;
        let doctorSpecialty;

        if (!doctors || doctors.length === 0) {
            console.warn(`Doctor with ID ${doctorId} not found. Using Dr. Smith's profile info.`);
            doctorName = profile.full_name;
            doctorSpecialty = 'Nutrólogo'; // Default
        } else {
            doctorName = doctors[0].name;
            doctorSpecialty = doctors[0].specialty;
        }

        console.log(`Seeding data for Dr. ${doctorName} (${doctorSpecialty})`);

        // 2. Get a Patient
        const { data: patients, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .limit(1);

        if (patientError) throw patientError;

        let patient;
        if (!patients || patients.length === 0) {
            console.log('No patients found. Creating a test patient...');
            const { data: newPatient, error: createError } = await supabase
                .from('patients')
                .insert({
                    organization_id: organizationId,
                    full_name: 'Paciente Teste',
                    email: 'paciente@teste.com',
                    status: 'active'
                })
                .select()
                .single();

            if (createError) {
                console.error('Error creating patient:', createError);
                return;
            }
            patient = newPatient;
            console.log('Created patient:', patient.full_name);
        } else {
            patient = patients[0];
            console.log('Using existing patient:', patient.full_name);
        }

        // 3. Insert Consultations
        const consultations = [
            {
                // PAGO (> 30 days)
                date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                rating: 5,
                comment: 'Excelente atendimento!',
                type: 'Teleconsulta',
                doctor_name: doctorName
            },
            {
                // DISPONÍVEL (> 7 days, < 30 days)
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                rating: 4,
                comment: 'Muito atencioso.',
                type: 'Consulta Presencial',
                doctor_name: doctorName
            },
            {
                // PENDENTE (< 7 days)
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                rating: null,
                comment: null,
                type: 'Teleconsulta',
                doctor_name: doctorName
            }
        ];

        // Insert individually to handle potential errors better
        for (const c of consultations) {
            const { error: insertError } = await supabase
                .from('patient_consultations')
                .insert({
                    patient_id: patient.id,
                    doctor_name: c.doctor_name,
                    date: c.date,
                    type: c.type,
                    specialty: doctorSpecialty,
                    rating: c.rating,
                    rating_comment: c.comment
                });

            if (insertError) {
                console.error('Error inserting consultation:', insertError);
            } else {
                console.log(`Inserted consultation for date: ${c.date}`);
            }
        }

        console.log('Successfully seeded financial records via Supabase JS!');

    } catch (err) {
        console.error('Error seeding:', err);
    }
}

seed();
