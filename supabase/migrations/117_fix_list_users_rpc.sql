-- Migration 117: Fix List Users RPC
-- Purpose: Fix ambiguous column error in get_auth_users
DROP FUNCTION IF EXISTS get_auth_users();
CREATE OR REPLACE FUNCTION get_auth_users() RETURNS TABLE (
        user_id UUID,
        user_email VARCHAR,
        user_created_at TIMESTAMPTZ,
        user_last_sign_in_at TIMESTAMPTZ
    ) LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public,
    auth,
    extensions AS $$ BEGIN -- Check if the caller is a super_admin
    IF NOT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'super_admin'
    ) THEN RAISE EXCEPTION 'Access denied: Only Super Admins can list users.';
END IF;
RETURN QUERY
SELECT au.id AS user_id,
    au.email::VARCHAR AS user_email,
    au.created_at AS user_created_at,
    au.last_sign_in_at AS user_last_sign_in_at
FROM auth.users au;
END;
$$;
GRANT EXECUTE ON FUNCTION get_auth_users TO authenticated;