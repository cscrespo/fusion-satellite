-- Migration 104: Create Auth User for Dr. Smith
-- Purpose: Enable login for the seeded "Dr. Smith" profile
DO $$
DECLARE v_profile_id UUID;
v_email TEXT := 'dr.smith@bloom.com';
v_password TEXT := '123456';
v_encrypted_pw TEXT;
BEGIN -- 1. Find the profile ID for Dr. Smith
SELECT id INTO v_profile_id
FROM profiles
WHERE email = v_email
LIMIT 1;
IF v_profile_id IS NULL THEN RAISE NOTICE 'Profile for % not found. Skipping auth creation.',
v_email;
RETURN;
END IF;
-- 2. Check if auth user already exists
IF EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = v_email
) THEN RAISE NOTICE 'Auth user for % already exists.',
v_email;
-- Optional: Update password if needed?
-- UPDATE auth.users SET encrypted_password = crypt(v_password, gen_salt('bf')) WHERE email = v_email;
RETURN;
END IF;
-- 3. Create Auth User with SAME ID as Profile
v_encrypted_pw := crypt(v_password, gen_salt('bf'));
INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        created_at,
        updated_at
    )
VALUES (
        v_profile_id,
        -- MUST MATCH PROFILE ID
        '00000000-0000-0000-0000-000000000000',
        v_email,
        v_encrypted_pw,
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', 'Dr. Smith'),
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );
RAISE NOTICE 'Created auth user for % with ID %',
v_email,
v_profile_id;
END $$;