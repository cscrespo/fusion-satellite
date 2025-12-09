-- Migration 102: Setup Users CRUD (Add email, Relax FK, Seed Data)
-- 1. Add email and status columns to profiles if they don't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'email'
) THEN
ALTER TABLE profiles
ADD COLUMN email VARCHAR(255);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'status'
) THEN
ALTER TABLE profiles
ADD COLUMN status VARCHAR(20) DEFAULT 'active';
END IF;
END $$;
-- 2. Drop Foreign Key constraint to auth.users to allow "inviting" users (creating profiles before auth)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
-- 3. Update RLS Policies to allow full Admin control
-- Drop existing restrictive policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update organization profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
-- Re-create policies with broader permissions for Admins
-- ALLOW INSERT: Admins can insert any profile within their organization
CREATE POLICY "Admins can insert profiles" ON profiles FOR
INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- ALLOW UPDATE: Admins can update any profile in their organization (including themselves)
CREATE POLICY "Admins can update organization profiles" ON profiles FOR
UPDATE USING (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Note: We also need to keep "Update own profile" for non-admins if they want to update their own bio/etc?
-- For now, let's allow users to update themselves OR admins to update them.
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (id = auth.uid());
-- ALLOW DELETE: Admins can delete any profile in their organization
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (
    organization_id IN (
        SELECT organization_id
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- 4. Seed Mock Users
DO $$
DECLARE v_org_id UUID;
BEGIN -- Get the first organization
SELECT id INTO v_org_id
FROM organizations
LIMIT 1;
-- If no organization exists, we can't seed
IF v_org_id IS NULL THEN RAISE NOTICE 'No organization found. Skipping users seeding.';
RETURN;
END IF;
-- Insert DUMMY Data (using generated UUIDs)
-- Dr. Smith
INSERT INTO profiles (
        id,
        organization_id,
        full_name,
        email,
        role,
        specialty,
        phone,
        status,
        created_at
    )
VALUES (
        uuid_generate_v4(),
        v_org_id,
        'Dr. Smith',
        'dr.smith@bloom.com',
        'admin',
        'Nutricionista',
        '+55 11 98765-4321',
        'active',
        '2023-01-15 10:00:00+00'
    ) ON CONFLICT DO NOTHING;
-- Check if other users exist by email and insert if missing
-- Dra. Ana Clara
IF NOT EXISTS (
    SELECT 1
    FROM profiles
    WHERE email = 'ana.clara@bloom.com'
) THEN
INSERT INTO profiles (
        id,
        organization_id,
        full_name,
        email,
        role,
        specialty,
        phone,
        status,
        created_at
    )
VALUES (
        uuid_generate_v4(),
        v_org_id,
        'Dra. Ana Clara',
        'ana.clara@bloom.com',
        'doctor',
        'Nutróloga',
        '+55 11 91234-5678',
        'active',
        '2023-02-20 10:00:00+00'
    );
END IF;
-- Carlos Eduardo
IF NOT EXISTS (
    SELECT 1
    FROM profiles
    WHERE email = 'carlos@bloom.com'
) THEN
INSERT INTO profiles (
        id,
        organization_id,
        full_name,
        email,
        role,
        specialty,
        phone,
        status,
        created_at
    )
VALUES (
        uuid_generate_v4(),
        v_org_id,
        'Carlos Eduardo',
        'carlos@bloom.com',
        'assistant',
        NULL,
        '+55 11 99876-5432',
        'active',
        '2023-03-10 10:00:00+00'
    );
END IF;
-- Maria Santos
IF NOT EXISTS (
    SELECT 1
    FROM profiles
    WHERE email = 'maria@bloom.com'
) THEN
INSERT INTO profiles (
        id,
        organization_id,
        full_name,
        email,
        role,
        specialty,
        phone,
        status,
        created_at
    )
VALUES (
        uuid_generate_v4(),
        v_org_id,
        'Maria Santos',
        'maria@bloom.com',
        'receptionist',
        NULL,
        '+55 11 97654-3210',
        'inactive',
        '2023-04-05 10:00:00+00'
    );
END IF;
END $$;