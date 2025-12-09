-- Migration 113: SaaS Management
-- Purpose: Create tables for SaaS plans and feature flags management.
-- 1. SaaS Features (The catalog of controllable features)
CREATE TABLE saas_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL,
    -- e.g., 'financial', 'telemedicine'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'module',
    -- module, limit, setting
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. SaaS Plans (The products sold)
CREATE TABLE saas_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    -- free, basic, pro, enterprise
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    interval VARCHAR(20) DEFAULT 'monthly',
    -- monthly, yearly
    -- Hard limits
    max_users INTEGER DEFAULT 1,
    max_patients INTEGER DEFAULT 10,
    max_storage_gb INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. SaaS Plan Features (Linking plans to features)
CREATE TABLE saas_plan_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES saas_plans(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES saas_features(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT true,
    limit_value INTEGER,
    -- Optional override for numeric limits
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plan_id, feature_id)
);
-- 4. RLS Policies
-- Enable RLS
ALTER TABLE saas_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_plan_features ENABLE ROW LEVEL SECURITY;
-- Policies
-- Everyone (authenticated) can view active plans and features (needed for UI)
CREATE POLICY "View active plans" ON saas_plans FOR
SELECT USING (true);
CREATE POLICY "View features" ON saas_features FOR
SELECT USING (true);
CREATE POLICY "View plan features" ON saas_plan_features FOR
SELECT USING (true);
-- Only Super Admin can edit
CREATE POLICY "Super Admin manage plans" ON saas_plans FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'super_admin'
    )
);
CREATE POLICY "Super Admin manage features" ON saas_features FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'super_admin'
    )
);
CREATE POLICY "Super Admin manage plan features" ON saas_plan_features FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'super_admin'
    )
);
-- 5. Seed Data
-- Features
INSERT INTO saas_features (key, name, description, category)
VALUES (
        'financial',
        'Módulo Financeiro',
        'Acesso a faturas, pagamentos e relatórios financeiros.',
        'module'
    ),
    (
        'telemedicine',
        'Telemedicina',
        'Realização de consultas online via vídeo.',
        'module'
    ),
    (
        'multi_user',
        'Múltiplos Usuários',
        'Permite cadastrar mais de um usuário na clínica.',
        'setting'
    ),
    (
        'custom_branding',
        'Personalização',
        'Logo e cores personalizadas.',
        'setting'
    ),
    (
        'api_access',
        'Acesso API',
        'Acesso à API para integrações.',
        'module'
    );
-- Plans
DO $$
DECLARE v_free_id UUID;
v_basic_id UUID;
v_pro_id UUID;
v_ent_id UUID;
f_financial UUID;
f_telemed UUID;
f_multi UUID;
f_brand UUID;
f_api UUID;
BEGIN -- Get Feature IDs
SELECT id INTO f_financial
FROM saas_features
WHERE key = 'financial';
SELECT id INTO f_telemed
FROM saas_features
WHERE key = 'telemedicine';
SELECT id INTO f_multi
FROM saas_features
WHERE key = 'multi_user';
SELECT id INTO f_brand
FROM saas_features
WHERE key = 'custom_branding';
SELECT id INTO f_api
FROM saas_features
WHERE key = 'api_access';
-- 1. Free Plan
INSERT INTO saas_plans (name, slug, price, max_users, max_patients)
VALUES ('Free', 'free', 0, 1, 50)
RETURNING id INTO v_free_id;
-- Free features (None of the premium modules)
-- 2. Basic Plan
INSERT INTO saas_plans (name, slug, price, max_users, max_patients)
VALUES ('Basic', 'basic', 99.00, 3, 200)
RETURNING id INTO v_basic_id;
INSERT INTO saas_plan_features (plan_id, feature_id)
VALUES (v_basic_id, f_financial);
-- Has Financial
-- 3. Pro Plan
INSERT INTO saas_plans (name, slug, price, max_users, max_patients)
VALUES ('Pro', 'premium', 299.00, 10, 1000)
RETURNING id INTO v_pro_id;
INSERT INTO saas_plan_features (plan_id, feature_id)
VALUES (v_pro_id, f_financial),
    (v_pro_id, f_telemed),
    (v_pro_id, f_multi),
    (v_pro_id, f_brand);
-- 4. Enterprise Plan
INSERT INTO saas_plans (name, slug, price, max_users, max_patients)
VALUES ('Enterprise', 'enterprise', 999.00, 999, 99999)
RETURNING id INTO v_ent_id;
INSERT INTO saas_plan_features (plan_id, feature_id)
VALUES (v_ent_id, f_financial),
    (v_ent_id, f_telemed),
    (v_ent_id, f_multi),
    (v_ent_id, f_brand),
    (v_ent_id, f_api);
END $$;