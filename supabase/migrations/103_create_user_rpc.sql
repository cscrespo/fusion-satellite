-- Migration 103: Create User RPC
-- Purpose: Allow admins to create fully functional users (Auth + Profile) from the frontend
-- Note: This requires pgcrypto for password hashing
-- 1. Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- 2. Create the RPC function
-- This function runs with SECURITY DEFINER to bypass RLS and Auth restrictions
CREATE OR REPLACE FUNCTION create_user_with_password(
        email TEXT,
        password TEXT,
        full_name TEXT,
        role TEXT,
        organization_id UUID,
        specialty TEXT DEFAULT NULL,
        phone TEXT DEFAULT NULL,
        avatar_url TEXT DEFAULT NULL
    ) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public,
    auth -- Secure search path
    AS $$
DECLARE new_user_id UUID;
encrypted_pw TEXT;
BEGIN -- Generates a new UUID
new_user_id := uuid_generate_v4();
-- Hash the password properly (matches Supabase Auth hashing)
encrypted_pw := crypt(password, gen_salt('bf'));
-- 1. Insert into auth.users
-- We set confirmed_at to NOW() so the user can login immediately (skip email verification for this prototype)
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
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        -- Default instance ID
        email,
        encrypted_pw,
        NOW(),
        -- Auto-confirm
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object(
            'full_name',
            full_name,
            'organization_id',
            organization_id
        ),
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );
-- 2. Insert into public.profiles
-- We can just do a standard insert here. The triggers will handle updated_at.
INSERT INTO public.profiles (
        id,
        organization_id,
        full_name,
        email,
        role,
        specialty,
        phone,
        avatar_url,
        status,
        created_at
    )
VALUES (
        new_user_id,
        organization_id,
        full_name,
        email,
        role,
        specialty,
        phone,
        avatar_url,
        'active',
        NOW()
    );
RETURN new_user_id;
EXCEPTION
WHEN OTHERS THEN -- If anything fails, rollback transaction (implicit in function call)
RAISE EXCEPTION 'Failed to create user: %',
SQLERRM;
END;
$$;