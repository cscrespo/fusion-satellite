-- Seed financial data for Doctor 'teste 2'
DO $$
DECLARE v_patient_id uuid;
v_org_id uuid;
v_doctor_name text := 'teste 2';
BEGIN -- Get a patient and their organization
SELECT id,
    organization_id INTO v_patient_id,
    v_org_id
FROM public.patients
LIMIT 1;
-- If no patient, do nothing
IF v_patient_id IS NOT NULL
AND v_org_id IS NOT NULL THEN -- Insert mock consultations
INSERT INTO public.patient_consultations (
        patient_id,
        organization_id,
        doctor_name,
        date,
        type,
        specialty,
        rating,
        rating_comment
    )
VALUES (
        v_patient_id,
        v_org_id,
        v_doctor_name,
        NOW() - INTERVAL '40 days',
        'Online',
        'Nutrólogo',
        5,
        'Excelente atendimento!'
    ),
    (
        v_patient_id,
        v_org_id,
        v_doctor_name,
        NOW() - INTERVAL '15 days',
        'Presencial',
        'Nutrólogo',
        4,
        'Muito atencioso.'
    ),
    (
        v_patient_id,
        v_org_id,
        v_doctor_name,
        NOW() - INTERVAL '2 days',
        'Online',
        'Nutrólogo',
        NULL,
        NULL
    );
END IF;
END $$;