-- Migration 109: Seed Full Patient Flow (Consultations + Invoices)
-- Purpose: Create a realistic scenario with a specific patient, consultations, and linked financial records.
DO $$
DECLARE v_doctor_id UUID := '95c643f7-dc99-4e66-a7f6-c6ba69a7f507';
v_org_id UUID;
v_doctor_name TEXT;
v_specialty TEXT;
v_patient_id UUID;
v_invoice_id UUID;
BEGIN -- 1. Get Doctor & Org Info
SELECT organization_id,
    name,
    specialty INTO v_org_id,
    v_doctor_name,
    v_specialty
FROM doctors
WHERE id = v_doctor_id;
IF v_doctor_name IS NULL THEN RAISE NOTICE 'Doctor not found, skipping.';
RETURN;
END IF;
-- 2. Get or Create a Specific "Realistic" Patient
-- Let's try to find "Maria Silva" or create her
SELECT id INTO v_patient_id
FROM patients
WHERE full_name = 'Maria Silva'
LIMIT 1;
IF v_patient_id IS NULL THEN
INSERT INTO patients (
        organization_id,
        full_name,
        email,
        phone,
        gender,
        status,
        start_weight,
        height
    )
VALUES (
        v_org_id,
        'Maria Silva',
        'maria.silva@exemplo.com',
        '+55 11 99999-8888',
        'female',
        'active',
        70.5,
        165
    )
RETURNING id INTO v_patient_id;
RAISE NOTICE 'Created new patient: Maria Silva';
ELSE RAISE NOTICE 'Using existing patient: Maria Silva';
END IF;
-- ========================================================================
-- SCENARIO A: Completed Consultation (Last Month) -> PAID Invoice
-- ========================================================================
-- 1. Consultation (Removed 'status' column as it doesn't exist)
INSERT INTO patient_consultations (
        organization_id,
        patient_id,
        doctor_name,
        specialty,
        date,
        type,
        notes,
        rating,
        rating_comment
    )
VALUES (
        v_org_id,
        v_patient_id,
        v_doctor_name,
        v_specialty,
        NOW() - INTERVAL '1 month',
        'Presencial',
        'Consulta inicial. Queixa de ganho de peso.',
        5,
        'Doutor muito atencioso!'
    );
-- 2. Invoice (Paid)
INSERT INTO invoices (
        organization_id,
        patient_id,
        invoice_number,
        issue_date,
        due_date,
        subtotal,
        total,
        status,
        paid_at,
        service_description
    )
VALUES (
        v_org_id,
        v_patient_id,
        'INV-' || floor(random() * 100000)::text,
        (NOW() - INTERVAL '1 month')::date,
        (NOW() - INTERVAL '1 month' + INTERVAL '5 days')::date,
        350.00,
        350.00,
        'paid',
        NOW() - INTERVAL '28 days',
        'Consulta Presencial - Dr. ' || v_doctor_name
    )
RETURNING id INTO v_invoice_id;
-- 3. Payment
INSERT INTO payments (
        organization_id,
        invoice_id,
        amount,
        payment_method,
        payment_date,
        notes
    )
VALUES (
        v_org_id,
        v_invoice_id,
        350.00,
        'credit_card',
        NOW() - INTERVAL '28 days',
        'Pagamento via Cartão'
    );
-- ========================================================================
-- SCENARIO B: Recent Consultation (Yesterday) -> PENDING Invoice
-- ========================================================================
-- 1. Consultation
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
        NOW() - INTERVAL '1 day',
        'Online',
        'Retorno para verificar exames.'
    );
-- 2. Invoice (Pending)
INSERT INTO invoices (
        organization_id,
        patient_id,
        invoice_number,
        issue_date,
        due_date,
        subtotal,
        total,
        status,
        service_description
    )
VALUES (
        v_org_id,
        v_patient_id,
        'INV-' || floor(random() * 100000)::text,
        (NOW() - INTERVAL '1 day')::date,
        (NOW() + INTERVAL '5 days')::date,
        -- Due in future
        350.00,
        350.00,
        'pending',
        'Teleconsulta (Retorno) - Dr. ' || v_doctor_name
    );
RAISE NOTICE 'Seeded full flow for Maria Silva';
END $$;