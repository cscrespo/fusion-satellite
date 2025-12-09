-- Migration 105: Seed Financial Test Data
-- Purpose: Insert specific consultations to test financial dashboard (Paid, Available, Pending)
DO $$
DECLARE v_doctor_id UUID := '95c643f7-dc99-4e66-a7f6-c6ba69a7f507';
v_patient_id UUID := '6a64979b-c539-4c0d-9880-186b234e1384';
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
-- 2. Ensure Patient Exists (if not found by ID, try to find any patient or create one)
IF NOT EXISTS (
    SELECT 1
    FROM patients
    WHERE id = v_patient_id
) THEN -- Try to find any patient
SELECT id INTO v_patient_id
FROM patients
LIMIT 1;
IF v_patient_id IS NULL THEN -- Create a dummy patient if absolutely no patients exist
INSERT INTO patients (organization_id, full_name, email, status)
VALUES (
        v_org_id,
        'Patient Zero',
        'zero@test.com',
        'active'
    )
RETURNING id INTO v_patient_id;
END IF;
END IF;
-- 3. Insert Consultations
-- PAGO (> 30 days ago)
INSERT INTO patient_consultations (
        organization_id,
        patient_id,
        doctor_name,
        specialty,
        date,
        type,
        rating,
        rating_comment
    )
VALUES (
        v_org_id,
        v_patient_id,
        v_doctor_name,
        v_specialty,
        NOW() - INTERVAL '40 days',
        'Online',
        5,
        'Excelente (Seeded)'
    );
-- DISPONÍVEL (> 7 days, < 30 days)
INSERT INTO patient_consultations (
        organization_id,
        patient_id,
        doctor_name,
        specialty,
        date,
        type,
        rating,
        rating_comment
    )
VALUES (
        v_org_id,
        v_patient_id,
        v_doctor_name,
        v_specialty,
        NOW() - INTERVAL '15 days',
        'Presencial',
        4,
        'Muito bom (Seeded)'
    );
-- PENDENTE (< 7 days)
INSERT INTO patient_consultations (
        organization_id,
        patient_id,
        doctor_name,
        specialty,
        date,
        type,
        rating,
        rating_comment
    )
VALUES (
        v_org_id,
        v_patient_id,
        v_doctor_name,
        v_specialty,
        NOW() - INTERVAL '2 days',
        'Online',
        NULL,
        NULL
    );
RAISE NOTICE 'Seeded 3 consultations for %',
v_doctor_name;
END $$;