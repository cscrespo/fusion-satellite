-- Allow public read access for demo purposes
-- Doctors
CREATE POLICY "Public read doctors" ON public.doctors FOR
SELECT USING (true);
-- Consultations
CREATE POLICY "Public read consultations" ON public.patient_consultations FOR
SELECT USING (true);
-- Patients (for join)
CREATE POLICY "Public read patients" ON public.patients FOR
SELECT USING (true);