-- Migration 112: Fix Super Admin Auth
-- Purpose: Re-create super admin auth user with CORRECT identities to fix login error
-- Pattern matched from 107_proper_auth_fix.sql
DO $$
DECLARE v_profile_id UUID := '00000000-0000-0000-0000-000000000000';
-- The special ID we used
v_email TEXT := 'admin@bloom.com';
v_password TEXT := 'admin123';
v_encrypted_pw TEXT;
BEGIN -- 1. Cleanup existing auth user (if any)
DELETE FROM auth.users
WHERE email = v_email;
-- 2. Insert into auth.users
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
        jsonb_build_object('full_name', 'Super Admin'),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );
-- 3. Insert into auth.identities
-- CRITICAL: provider_id must match the user_id for email provider in some setups, or be unique.
-- In 107 we used v_profile_id::text as provider_id.
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
RAISE NOTICE 'Re-created Super Admin auth user and identity for %',
v_email;
END $$;