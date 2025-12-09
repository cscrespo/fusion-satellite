-- Create Doctors Table
CREATE TABLE IF NOT EXISTS public.doctors (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    specialty text NOT NULL,
    crm text,
    rqe text,
    bio text,
    price numeric,
    rating numeric DEFAULT 5.0,
    reviews integer DEFAULT 0,
    status text DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
    next_available text,
    avatar_url text,
    created_at timestamptz DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Users can view doctors from their organization" ON public.doctors FOR
SELECT USING (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    );
CREATE POLICY "Users can insert doctors for their organization" ON public.doctors FOR
INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    );
CREATE POLICY "Users can update doctors for their organization" ON public.doctors FOR
UPDATE USING (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    );
CREATE POLICY "Users can delete doctors for their organization" ON public.doctors FOR DELETE USING (
    organization_id IN (
        SELECT organization_id
        FROM profiles
        WHERE id = auth.uid()
    )
);