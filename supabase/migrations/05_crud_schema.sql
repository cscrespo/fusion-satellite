-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";
-- 1. Patient Consultations
create table if not exists public.patient_consultations (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    patient_id uuid references public.patients(id) on delete cascade,
    doctor_id uuid references auth.users(id),
    doctor_name text,
    specialty text,
    date timestamptz not null default now(),
    type text check (type in ('Online', 'Presencial')),
    transcription text,
    notes text,
    objective jsonb default '{}'::jsonb,
    assessment text,
    plan jsonb default '[]'::jsonb,
    rating integer,
    rating_comment text,
    created_at timestamptz default now()
);
-- 2. Patient Diet Plans
create table if not exists public.patient_diet_plans (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    patient_id uuid references public.patients(id) on delete cascade,
    day_of_week text not null,
    meals jsonb default '[]'::jsonb,
    macros jsonb default '{}'::jsonb,
    updated_at timestamptz default now(),
    unique(patient_id, day_of_week)
);
-- 3. Patient Daily Logs
create table if not exists public.patient_daily_logs (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    patient_id uuid references public.patients(id) on delete cascade,
    date date not null,
    meals jsonb default '[]'::jsonb,
    checklist jsonb default '[]'::jsonb,
    water_intake numeric default 0,
    notes text,
    created_at timestamptz default now(),
    unique(patient_id, date)
);
-- 4. Patient Adherence Logs
create table if not exists public.patient_adherence_logs (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    patient_id uuid references public.patients(id) on delete cascade,
    date date not null,
    item_id uuid not null,
    item_type text check (
        item_type in ('medication', 'supplement', 'habit')
    ),
    status text check (
        status in ('taken', 'skipped', 'late', 'pending')
    ),
    taken_at timestamptz,
    created_at timestamptz default now(),
    unique(patient_id, item_id, date)
);
-- RLS
alter table public.patient_consultations enable row level security;
alter table public.patient_diet_plans enable row level security;
alter table public.patient_daily_logs enable row level security;
alter table public.patient_adherence_logs enable row level security;
-- Policies
create policy "Users can view data from their organization" on public.patient_consultations for
select using (
        auth.uid() in (
            select id
            from profiles
            where organization_id = patient_consultations.organization_id
        )
    );
create policy "Users can insert data for their organization" on public.patient_consultations for
insert with check (
        auth.uid() in (
            select id
            from profiles
            where organization_id = patient_consultations.organization_id
        )
    );
create policy "Users can update data for their organization" on public.patient_consultations for
update using (
        auth.uid() in (
            select id
            from profiles
            where organization_id = patient_consultations.organization_id
        )
    );
create policy "Users can delete data for their organization" on public.patient_consultations for delete using (
    auth.uid() in (
        select id
        from profiles
        where organization_id = patient_consultations.organization_id
    )
);
create policy "Org Select" on public.patient_diet_plans for
select using (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Insert" on public.patient_diet_plans for
insert with check (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Update" on public.patient_diet_plans for
update using (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Delete" on public.patient_diet_plans for delete using (
    organization_id = (
        select organization_id
        from profiles
        where id = auth.uid()
    )
);
create policy "Org Select" on public.patient_daily_logs for
select using (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Insert" on public.patient_daily_logs for
insert with check (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Update" on public.patient_daily_logs for
update using (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Delete" on public.patient_daily_logs for delete using (
    organization_id = (
        select organization_id
        from profiles
        where id = auth.uid()
    )
);
create policy "Org Select" on public.patient_adherence_logs for
select using (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Insert" on public.patient_adherence_logs for
insert with check (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Update" on public.patient_adherence_logs for
update using (
        organization_id = (
            select organization_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Org Delete" on public.patient_adherence_logs for delete using (
    organization_id = (
        select organization_id
        from profiles
        where id = auth.uid()
    )
);