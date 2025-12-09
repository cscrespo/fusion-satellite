-- Migration 108: Seed More Consultations for History
-- Purpose: Add diverse consultations to verify the Doctor History page
DO $$
DECLARE v_doctor_id UUID := '95c643f7-dc99-4e66-a7f6-c6ba69a7f507';
v_patient_id UUID;
v_doctor_name TEXT;
v_specialty TEXT;
v_org_id UUID;
BEGIN -- 1. Get Doctor Info
SELECT name,
    specialty,
    organization_id INTO v_doctor_name,
    v_specialty,
    v_org_id
FROM doctors
WHERE id = v_doctor_id;
IF v_doctor_name IS NULL THEN RAISE NOTICE 'Doctor not found, skipping seed.';
RETURN;
END IF;
-- 2. Get Patient (reuse existing or find one)
SELECT id INTO v_patient_id
FROM patients
LIMIT 1;
-- 3. Insert More Consultations
-- FUTURE (Agendada)
INSERT INTO patient_consultations (
        organization_id,
        patient_id,
        doctor_name,
        specialty,
        date,
        type,
        notes
    )
VALUES (
        v_org_id,
        v_patient_id,
        v_doctor_name,
        v_specialty,
        NOW() + INTERVAL '5 days',
        'Online',
        'Retorno agendado para verificação de exames.'
    );
-- PAST (Concluída without rating)
INSERT INTO patient_consultations (
        organization_id,
        patient_id,
        doctor_name,
        specialty,
        date,
        type,
        notes
    )
VALUES (
        v_org_id,
        v_patient_id,
        v_doctor_name,
        v_specialty,
        NOW() - INTERVAL '2 months',
        'Presencial',
        'Primeira consulta. Queixa de cansaço.'
    );
RAISE NOTICE 'Seeded additional consultations for %',
v_doctor_name;
END $$;