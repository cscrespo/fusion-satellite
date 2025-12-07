-- Enable RLS just in case it wasn't
ALTER TABLE IF EXISTS public.patient_measurements ENABLE ROW LEVEL SECURITY;
-- Delete Policy for Measurements
DROP POLICY IF EXISTS "Users can delete data for their organization" ON public.patient_measurements;
CREATE POLICY "Users can delete data for their organization" ON public.patient_measurements FOR DELETE USING (
    organization_id IN (
        SELECT organization_id
        FROM profiles
        WHERE id = auth.uid()
    )
);
-- Update Policy for Measurements (Reviewing this too)
DROP POLICY IF EXISTS "Users can update data for their organization" ON public.patient_measurements;
CREATE POLICY "Users can update data for their organization" ON public.patient_measurements FOR
UPDATE USING (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    );