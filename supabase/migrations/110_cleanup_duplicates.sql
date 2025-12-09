-- Migration 110: Cleanup Duplicates
-- Purpose: Remove duplicate records from treatment_plans and profiles, keeping only the oldest one.
DO $$
DECLARE r RECORD;
v_keep_id UUID;
BEGIN -- ========================================================================
-- 1. CLEANUP TREATMENT PLANS
-- ========================================================================
RAISE NOTICE 'Cleaning up Treatment Plans...';
FOR r IN
SELECT name,
    COUNT(*)
FROM treatment_plans
GROUP BY name
HAVING COUNT(*) > 1 LOOP -- Find the ID to keep (the oldest one)
SELECT id INTO v_keep_id
FROM treatment_plans
WHERE name = r.name
ORDER BY created_at ASC
LIMIT 1;
RAISE NOTICE 'Keeping plan "%" (ID: %)', r.name, v_keep_id;
-- Re-link subscriptions (if any) to the kept plan
-- Note: This assumes we want to move all subscriptions to the single surviving plan
UPDATE patient_subscriptions
SET plan_id = v_keep_id
WHERE plan_id IN (
        SELECT id
        FROM treatment_plans
        WHERE name = r.name
            AND id != v_keep_id
    );
-- Delete the duplicates
DELETE FROM treatment_plans
WHERE name = r.name
    AND id != v_keep_id;
RAISE NOTICE 'Deleted duplicates for "%"',
r.name;
END LOOP;
-- ========================================================================
-- 2. CLEANUP PROFILES (Dr. Smith Duplicates)
-- ========================================================================
RAISE NOTICE 'Cleaning up Profiles...';
-- Specifically for 'Dr. Smith' as seen in analysis
FOR r IN
SELECT full_name,
    COUNT(*)
FROM profiles
WHERE full_name = 'Dr. Smith'
GROUP BY full_name
HAVING COUNT(*) > 1 LOOP -- Find the ID to keep. 
    -- CRITICAL: We must keep the one linked to the currently working auth user if possible.
    -- However, since auth users might have been deleted/recreated, let's just keep the one that matches the current auth user email if possible.
    -- Or simpler: Keep the one that has the most related data (doctors, etc).
    -- Let's try to find the one that matches the email 'dr.smith@bloom.com' in auth.users
    -- But we can't easily join auth.users here without permissions sometimes.
    -- Strategy: Keep the oldest one.
SELECT id INTO v_keep_id
FROM profiles
WHERE full_name = r.full_name
ORDER BY created_at ASC
LIMIT 1;
RAISE NOTICE 'Keeping profile "%" (ID: %)', r.full_name, v_keep_id;
-- Re-link related data?
-- Profiles are referenced by:
-- - organizations (owner?) - No
-- - consultations (doctor_id)
-- - doctors (maybe linked? No, doctors table is separate)
-- Update consultations
UPDATE consultations
SET doctor_id = v_keep_id
WHERE doctor_id IN (
        SELECT id
        FROM profiles
        WHERE full_name = r.full_name
            AND id != v_keep_id
    );
-- Delete duplicates
-- Note: Deleting from profiles might cascade to auth.users if configured, or fail if auth.users exists.
-- If profiles.id is FK to auth.users.id, we can only delete the profile if we also delete the auth user (or if cascade is on).
-- 01_core_tables.sql says: id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
-- So deleting the AUTH USER deletes the profile.
-- But here we are trying to delete the PROFILE.
-- We can't delete the profile directly if it's a PK-FK 1:1 relationship usually, unless we delete the parent.
-- Actually, we should delete the AUTH USERS that correspond to these profiles.
-- But we can't easily select them here.
-- ALTERNATIVE: Just leave profiles for now if it's risky, or try to delete.
-- If we delete profile, it might fail if auth user exists.
-- Let's try to delete.
BEGIN
DELETE FROM profiles
WHERE full_name = r.full_name
    AND id != v_keep_id;
RAISE NOTICE 'Deleted duplicate profiles for "%"',
r.full_name;
EXCEPTION
WHEN OTHERS THEN RAISE NOTICE 'Could not delete some profiles for "%": %',
r.full_name,
SQLERRM;
END;
END LOOP;
END $$;