-- Migration: Seed Financial Data for Plans
DO $$
DECLARE v_org_id UUID;
BEGIN -- Get the first organization
SELECT id INTO v_org_id
FROM organizations
LIMIT 1;
-- If no organization exists, we can't seed
IF v_org_id IS NULL THEN RAISE NOTICE 'No organization found. Skipping plans seeding.';
RETURN;
END IF;
-- Insert Protocolo Mounjaro
INSERT INTO treatment_plans (
        organization_id,
        name,
        description,
        category,
        price,
        duration_months,
        billing_cycle,
        status,
        icon,
        max_patients,
        current_patients,
        features,
        contraindications,
        requirements
    )
VALUES (
        v_org_id,
        'Protocolo Mounjaro',
        'Tratamento completo com Mounjaro (Tirzepatida) para controle de peso e diabetes tipo 2',
        'medication',
        890.00,
        3,
        'monthly',
        'active',
        '💊',
        50,
        32,
        '["Consultas mensais", "Medicação incluída", "Acompanhamento nutricional", "Suporte 24/7", "Exames laboratoriais"]'::jsonb,
        '["Gravidez", "Histórico de pancreatite", "Diabetes tipo 1", "Insuficiência renal grave"]'::jsonb,
        '["IMC > 27", "Exames laboratoriais recentes", "Avaliação médica completa"]'::jsonb
    );
-- Insert Plano Nutricional Premium
INSERT INTO treatment_plans (
        organization_id,
        name,
        description,
        category,
        price,
        duration_months,
        billing_cycle,
        status,
        icon,
        max_patients,
        current_patients,
        features,
        contraindications,
        requirements
    )
VALUES (
        v_org_id,
        'Plano Nutricional Premium',
        'Acompanhamento nutricional completo com dieta personalizada e suporte contínuo',
        'nutrition',
        450.00,
        6,
        'monthly',
        'active',
        '🥗',
        100,
        67,
        '["Consultas quinzenais", "Plano alimentar personalizado", "Receitas exclusivas", "Grupo de suporte", "App de acompanhamento"]'::jsonb,
        '["Transtornos alimentares graves"]'::jsonb,
        '["Avaliação nutricional inicial", "Comprometimento com o plano"]'::jsonb
    );
-- Insert Programa Emagrecimento 90 Dias
INSERT INTO treatment_plans (
        organization_id,
        name,
        description,
        category,
        price,
        duration_months,
        billing_cycle,
        status,
        icon,
        max_patients,
        current_patients,
        features,
        contraindications,
        requirements
    )
VALUES (
        v_org_id,
        'Programa Emagrecimento 90 Dias',
        'Programa intensivo de emagrecimento com acompanhamento multidisciplinar',
        'fitness',
        350.00,
        3,
        'monthly',
        'active',
        '🏃',
        30,
        24,
        '["Treinos personalizados", "Nutrição esportiva", "Acompanhamento semanal", "Grupo motivacional", "Desafios mensais"]'::jsonb,
        '["Problemas cardíacos graves", "Lesões não tratadas"]'::jsonb,
        '["Atestado médico", "Avaliação física inicial"]'::jsonb
    );
-- Insert Protocolo Tirzepatida
INSERT INTO treatment_plans (
        organization_id,
        name,
        description,
        category,
        price,
        duration_months,
        billing_cycle,
        status,
        icon,
        max_patients,
        current_patients,
        features,
        contraindications,
        requirements
    )
VALUES (
        v_org_id,
        'Protocolo Tirzepatida',
        'Tratamento com Tirzepatida para perda de peso e controle glicêmico',
        'medication',
        920.00,
        6,
        'monthly',
        'active',
        '💉',
        40,
        18,
        '["Medicação de última geração", "Monitoramento contínuo", "Ajustes de dosagem", "Suporte nutricional", "Acompanhamento médico semanal"]'::jsonb,
        '["Gravidez e lactação", "Histórico de câncer medular de tireoide", "Pancreatite"]'::jsonb,
        '["IMC > 30 ou IMC > 27 com comorbidades", "Exames completos", "Consulta de triagem"]'::jsonb
    );
-- Insert Bem-Estar Integral
INSERT INTO treatment_plans (
        organization_id,
        name,
        description,
        category,
        price,
        duration_months,
        billing_cycle,
        status,
        icon,
        max_patients,
        current_patients,
        features,
        contraindications,
        requirements
    )
VALUES (
        v_org_id,
        'Bem-Estar Integral',
        'Programa holístico de saúde mental e física com práticas integrativas',
        'wellness',
        280.00,
        12,
        'monthly',
        'inactive',
        '🧘',
        60,
        0,
        '["Sessões de meditação", "Yoga terapêutico", "Orientação nutricional", "Coaching de saúde", "Workshops mensais"]'::jsonb,
        '[]'::jsonb,
        '["Questionário de saúde", "Entrevista inicial"]'::jsonb
    );
END $$;