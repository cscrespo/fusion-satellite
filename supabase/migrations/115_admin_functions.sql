-- Migration 115: Admin Functions
-- Purpose: Allow Super Admin to manage user passwords and create users securely.
-- 1. Function to update any user's password (Super Admin only)
CREATE OR REPLACE FUNCTION admin_update_password(
        target_email TEXT,
        new_password TEXT
    ) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER -- Runs with privileges of the creator (postgres)
SET search_path = public,
    auth,
    extensions -- Secure search path
    AS $$ BEGIN -- Check if the caller is a super_admin
    IF NOT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'super_admin'
    ) THEN RAISE EXCEPTION 'Access denied: Only Super Admins can reset passwords.';
END IF;
-- Update the password in auth.users
UPDATE auth.users
SET encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = NOW()
WHERE email = target_email;
-- Raise error if user not found
IF NOT FOUND THEN RAISE EXCEPTION 'User with email % not found.',
target_email;
END IF;
END;
$$;
-- 2. Grant execute permission to authenticated users (RLS inside function handles security)
GRANT EXECUTE ON FUNCTION admin_update_password TO authenticated;