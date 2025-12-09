-- Migration 119: SaaS App Structure & Advanced Plans
-- Purpose: Support Web/Mobile feature distinction and advanced plan configuration.
-- 1. Update saas_features with platform categorization
ALTER TABLE saas_features
ADD COLUMN platform TEXT CHECK (platform IN ('web', 'mobile', 'both')) DEFAULT 'web';
-- Update existing features
UPDATE saas_features
SET platform = 'web'
WHERE key IN ('financial', 'multi_user');
UPDATE saas_features
SET platform = 'both'
WHERE key IN ('telemedicine');
-- Example: Telemed might be on both
-- Insert Mobile Features
INSERT INTO saas_features (key, name, description, category, platform)
VALUES (
        'food_diary',
        'Diário Alimentar',
        'Permite ao paciente registrar refeições',
        'module',
        'mobile'
    ),
    (
        'water_tracker',
        'Rastreador de Água',
        'Permite ao paciente registrar consumo de água',
        'module',
        'mobile'
    ),
    (
        'chat',
        'Chat com Nutricionista',
        'Canal de comunicação direta',
        'module',
        'mobile'
    ),
    (
        'appointments_app',
        'Agendamento pelo App',
        'Paciente pode agendar consultas pelo app',
        'module',
        'mobile'
    ),
    (
        'medication_tracker',
        'Lembrete de Medicamentos',
        'Alertas e registro de medicamentos',
        'module',
        'mobile'
    ),
    (
        'measurements_history',
        'Histórico de Medidas',
        'Visualização de gráficos de evolução',
        'module',
        'mobile'
    ) ON CONFLICT (key) DO NOTHING;
-- 2. Enhance saas_plans
ALTER TABLE saas_plans
ADD COLUMN description TEXT,
    ADD COLUMN price_monthly DECIMAL(10, 2),
    ADD COLUMN price_yearly DECIMAL(10, 2),
    ADD COLUMN limits JSONB DEFAULT '{}'::jsonb;
-- Migrate existing price to price_monthly
UPDATE saas_plans
SET price_monthly = price,
    price_yearly = price * 10;
-- 2 months off for yearly
-- Update Descriptions
UPDATE saas_plans
SET description = 'Para nutricionistas que estão começando.'
WHERE slug = 'free';
UPDATE saas_plans
SET description = 'Recursos essenciais para pequenas clínicas.'
WHERE slug = 'basic';
UPDATE saas_plans
SET description = 'Tudo o que você precisa para crescer.'
WHERE slug = 'premium';
UPDATE saas_plans
SET description = 'Para grandes redes e hospitais.'
WHERE slug = 'enterprise';
-- 3. Update Plan Features (Seed default mobile features for plans)
-- Free: Food Diary, Water
-- Basic: + Measurements
-- Premium: + Chat, Appointments
-- Enterprise: All
DO $$
DECLARE v_free_id UUID;
v_basic_id UUID;
v_pro_id UUID;
v_ent_id UUID;
v_feat_food UUID;
v_feat_water UUID;
v_feat_meas UUID;
v_feat_chat UUID;
v_feat_appt UUID;
v_feat_meds UUID;
BEGIN
SELECT id INTO v_free_id
FROM saas_plans
WHERE slug = 'free';
SELECT id INTO v_basic_id
FROM saas_plans
WHERE slug = 'basic';
SELECT id INTO v_pro_id
FROM saas_plans
WHERE slug = 'premium';
SELECT id INTO v_ent_id
FROM saas_plans
WHERE slug = 'enterprise';
SELECT id INTO v_feat_food
FROM saas_features
WHERE key = 'food_diary';
SELECT id INTO v_feat_water
FROM saas_features
WHERE key = 'water_tracker';
SELECT id INTO v_feat_meas
FROM saas_features
WHERE key = 'measurements_history';
SELECT id INTO v_feat_chat
FROM saas_features
WHERE key = 'chat';
SELECT id INTO v_feat_appt
FROM saas_features
WHERE key = 'appointments_app';
SELECT id INTO v_feat_meds
FROM saas_features
WHERE key = 'medication_tracker';
-- Free
INSERT INTO saas_plan_features (plan_id, feature_id, enabled)
VALUES (v_free_id, v_feat_food, true),
    (v_free_id, v_feat_water, true) ON CONFLICT DO NOTHING;
-- Basic
INSERT INTO saas_plan_features (plan_id, feature_id, enabled)
VALUES (v_basic_id, v_feat_food, true),
    (v_basic_id, v_feat_water, true),
    (v_basic_id, v_feat_meas, true) ON CONFLICT DO NOTHING;
-- Premium
INSERT INTO saas_plan_features (plan_id, feature_id, enabled)
VALUES (v_pro_id, v_feat_food, true),
    (v_pro_id, v_feat_water, true),
    (v_pro_id, v_feat_meas, true),
    (v_pro_id, v_feat_chat, true),
    (v_pro_id, v_feat_appt, true),
    (v_pro_id, v_feat_meds, true) ON CONFLICT DO NOTHING;
-- Enterprise (All)
INSERT INTO saas_plan_features (plan_id, feature_id, enabled)
VALUES (v_ent_id, v_feat_food, true),
    (v_ent_id, v_feat_water, true),
    (v_ent_id, v_feat_meas, true),
    (v_ent_id, v_feat_chat, true),
    (v_ent_id, v_feat_appt, true),
    (v_ent_id, v_feat_meds, true) ON CONFLICT DO NOTHING;
END $$;