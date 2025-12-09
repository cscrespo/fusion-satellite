-- Migration 111: Setup Super Admin
-- Purpose: Create "Bloom Global" organization, update role constraints, and create super admin user.
DO $$
DECLARE v_org_id UUID := '00000000-0000-0000-0000-000000000000';
-- Special ID for Super Admin Org
v_admin_id UUID := '00000000-0000-0000-0000-000000000000';
-- Special ID for Super Admin User
v_email TEXT := 'admin@bloom.com';
v_password TEXT := 'admin123';
v_encrypted_pw TEXT;
BEGIN -- 1. Update Profiles Role Constraint to include 'super_admin'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check CHECK (
        role IN (
            'super_admin',
            'admin',
            'doctor',
            'nutritionist',
            'assistant',
            'receptionist'
        )
    );
RAISE NOTICE 'Updated profiles role constraint.';
-- 2. Create "Bloom Global" Organization
INSERT INTO organizations (
        id,
        name,
        slug,
        platform_name,
        email,
        plan_type,
        status
    )
VALUES (
        v_org_id,
        'Bloom Global',
        'bloom-global',
        'Bloom Admin',
        'contact@bloom.com',
        'enterprise',
        'active'
    ) ON CONFLICT (id) DO
UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug;
RAISE NOTICE 'Created/Updated Bloom Global Organization.';
-- 3. Create Super Admin User (Auth + Profile)
-- 3a. Auth User
v_encrypted_pw := crypt(v_password, gen_salt('bf'));
-- Delete if exists to ensure clean slate (optional, but good for dev)
DELETE FROM auth.users
WHERE email = v_email;
INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_admin_id,
        'authenticated',
        'authenticated',
        v_email,
        v_encrypted_pw,
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', 'Super Admin'),
        NOW(),
        NOW()
    );
-- 3b. Auth Identity
INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    )
VALUES (
        uuid_generate_v4(),
        v_admin_id,
        jsonb_build_object('sub', v_admin_id, 'email', v_email),
        'email',
        v_admin_id::text,
        NULL,
        NOW(),
        NOW()
    );
-- 3c. Profile
INSERT INTO profiles (
        id,
        organization_id,
        full_name,
        role,
        email_notifications
    )
VALUES (
        v_admin_id,
        v_org_id,
        'Super Admin',
        'super_admin',
        true
    ) ON CONFLICT (id) DO
UPDATE
SET role = 'super_admin',
    organization_id = v_org_id;
RAISE NOTICE 'Created Super Admin User: %',
v_email;
-- 4. Update RLS Policies for Super Admin Access
-- We need to allow super_admin to see ALL organizations
DROP POLICY IF EXISTS "Super Admin view all organizations" ON organizations;
CREATE POLICY "Super Admin view all organizations" ON organizations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'super_admin'
        )
    );
DROP POLICY IF EXISTS "Super Admin update all organizations" ON organizations;
CREATE POLICY "Super Admin update all organizations" ON organizations FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'super_admin'
        )
    );
DROP POLICY IF EXISTS "Super Admin insert organizations" ON organizations;
CREATE POLICY "Super Admin insert organizations" ON organizations FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'super_admin'
        )
    );
-- Also allow viewing all profiles
DROP POLICY IF EXISTS "Super Admin view all profiles" ON profiles;
CREATE POLICY "Super Admin view all profiles" ON profiles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'super_admin'
        )
    );
RAISE NOTICE 'Updated RLS policies for Super Admin.';
END $$;