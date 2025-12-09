-- Migration 107: Proper Auth Fix for Dr. Smith
-- Purpose: Re-create auth user with CORRECT identities to fix login error
DO $$
DECLARE v_profile_id UUID;
v_email TEXT := 'dr.smith@bloom.com';
v_password TEXT := '123456';
v_encrypted_pw TEXT;
BEGIN -- 1. Get Profile ID
SELECT id INTO v_profile_id
FROM profiles
WHERE email = v_email;
IF v_profile_id IS NULL THEN RAISE NOTICE 'Profile not found for %',
v_email;
RETURN;
END IF;
-- 2. Cleanup (just in case 106 didn't catch it or we are re-running)
DELETE FROM auth.users
WHERE email = v_email;
-- 3. Insert into auth.users
v_encrypted_pw := crypt(v_password, gen_salt('bf'));
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
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_profile_id,
        'authenticated',
        'authenticated',
        v_email,
        v_encrypted_pw,
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', 'Dr. Smith'),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );
-- 4. Insert into auth.identities
-- For email provider, the id is a new UUID, and provider_id is the user_id (usually)
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
        v_profile_id,
        jsonb_build_object('sub', v_profile_id, 'email', v_email),
        'email',
        v_profile_id::text,
        -- provider_id
        NULL,
        NOW(),
        NOW()
    );
RAISE NOTICE 'Re-created auth user and identity for %',
v_email;
END $$;