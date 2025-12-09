-- Migration 114: Link Organizations to SaaS Plans
-- Purpose: Add foreign key to organizations table and migrate existing text-based plans.
-- 1. Add plan_id column
ALTER TABLE organizations
ADD COLUMN plan_id UUID REFERENCES saas_plans(id);
-- 2. Migrate existing data (Best effort mapping)
DO $$
DECLARE v_free_id UUID;
v_basic_id UUID;
v_pro_id UUID;
v_ent_id UUID;
BEGIN -- Get Plan IDs
SELECT id INTO v_free_id
FROM saas_plans
WHERE slug = 'free';
SELECT id INTO v_basic_id
FROM saas_plans
WHERE slug = 'basic';
SELECT id INTO v_pro_id
FROM saas_plans
WHERE slug = 'premium';
-- 'premium' slug in DB, 'Pro' name
SELECT id INTO v_ent_id
FROM saas_plans
WHERE slug = 'enterprise';
-- Update organizations based on old string
UPDATE organizations
SET plan_id = v_free_id
WHERE plan_type = 'free';
UPDATE organizations
SET plan_id = v_basic_id
WHERE plan_type = 'basic';
UPDATE organizations
SET plan_id = v_pro_id
WHERE plan_type = 'premium';
UPDATE organizations
SET plan_id = v_ent_id
WHERE plan_type = 'enterprise';
-- Default fallback for any others to Free
UPDATE organizations
SET plan_id = v_free_id
WHERE plan_id IS NULL;
END $$;
-- 3. (Optional) We keep plan_type for now as backup, but plan_id should be the source of truth.