-- Migration 118: Fix Organization Emails
-- Purpose: Sync organization emails with actual auth users to ensure password reset works.
-- 1. Update Bloom Global email
UPDATE organizations
SET email = 'admin@bloom.com'
WHERE slug = 'bloom-global';
-- 2. Update Clínica Demo email (based on check_users_rpc output)
UPDATE organizations
SET email = 'admin@clinicademo.com'
WHERE slug = 'clinica-demo';