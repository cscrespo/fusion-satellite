-- Migration 116: List Users RPC
-- Purpose: Allow Super Admin to view all registered users (auth.users)
CREATE OR REPLACE FUNCTION get_auth_users() RETURNS TABLE (
        id UUID,
        email VARCHAR,
        created_at TIMESTAMPTZ,
        last_sign_in_at TIMESTAMPTZ
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
SELECT au.id,
    au.email::VARCHAR,
    au.created_at,
    au.last_sign_in_at
FROM auth.users au;
END;
$$;
GRANT EXECUTE ON FUNCTION get_auth_users TO authenticated;