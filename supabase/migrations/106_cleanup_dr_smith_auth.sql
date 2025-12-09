-- Migration 106: Cleanup Dr. Smith Auth
-- Purpose: Delete the manually created auth user to allow clean registration via API
DO $$
DECLARE v_email TEXT := 'dr.smith@bloom.com';
BEGIN -- Delete from auth.users (cascades to identities usually, but let's be safe)
DELETE FROM auth.users
WHERE email = v_email;
RAISE NOTICE 'Deleted auth user for %',
v_email;
END $$;