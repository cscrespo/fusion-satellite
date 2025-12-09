-- Add education and languages columns to doctors table
ALTER TABLE public.doctors
ADD COLUMN IF NOT EXISTS education text,
    ADD COLUMN IF NOT EXISTS languages text [];
-- Array of strings for languages