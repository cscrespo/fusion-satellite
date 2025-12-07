-- =====================================================
-- Migration 02: Patient Management
-- =====================================================
-- Description: Creates all patient-related tables
-- Dependencies: 01_core_tables.sql
-- =====================================================

-- =====================================================
-- TABLE: patients
-- =====================================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Personal Info
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20), -- male, female, other, prefer_not_to_say
    avatar_url TEXT,
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    
    -- Medical Info
    start_weight DECIMAL(5,2),
    current_weight DECIMAL(5,2),
    goal_weight DECIMAL(5,2),
    height DECIMAL(5,2), -- em cm
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, archived
    assigned_doctor_id UUID REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Search
    search_vector TSVECTOR,
    
    -- Constraints
    CONSTRAINT patients_gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    CONSTRAINT patients_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes
CREATE INDEX idx_patients_organization ON patients(organization_id);
CREATE INDEX idx_patients_status ON patients(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_patients_doctor ON patients(assigned_doctor_id);
CREATE INDEX idx_patients_search ON patients USING GIN(search_vector);
CREATE INDEX idx_patients_email ON patients(organization_id, email) WHERE email IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: patient_measurements
-- =====================================================
CREATE TABLE patient_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Weight & Composition
    weight DECIMAL(5,2),
    fat_mass DECIMAL(5,2), -- kg
    lean_mass DECIMAL(5,2), -- kg
    body_fat_percentage DECIMAL(4,2), -- %
    muscle_mass DECIMAL(5,2), -- kg
    bone_mass DECIMAL(5,2), -- kg
    water_percentage DECIMAL(4,2), -- %
    
    -- Circumferences (cm)
    waist DECIMAL(5,2),
    hip DECIMAL(5,2),
    chest DECIMAL(5,2),
    arm_left DECIMAL(5,2),
    arm_right DECIMAL(5,2),
    thigh_left DECIMAL(5,2),
    thigh_right DECIMAL(5,2),
    calf_left DECIMAL(5,2),
    calf_right DECIMAL(5,2),
    
    -- Vitals
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    
    -- Metadata
    measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    measured_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_measurements_patient ON patient_measurements(patient_id, measured_at DESC);
CREATE INDEX idx_measurements_organization ON patient_measurements(organization_id);

-- =====================================================
-- TABLE: patient_tasks
-- =====================================================
CREATE TABLE patient_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Task Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    
    -- Scheduling
    due_date DATE,
    due_time TIME,
    completed_at TIMESTAMPTZ,
    
    -- Assignment
    assigned_by UUID REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT patient_tasks_status_check CHECK (status IN ('pending', 'completed', 'cancelled')),
    CONSTRAINT patient_tasks_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Indexes
CREATE INDEX idx_tasks_patient ON patient_tasks(patient_id, status);
CREATE INDEX idx_tasks_due_date ON patient_tasks(due_date) WHERE status = 'pending';
CREATE INDEX idx_tasks_organization ON patient_tasks(organization_id);

-- Trigger
CREATE TRIGGER update_patient_tasks_updated_at 
    BEFORE UPDATE ON patient_tasks
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: patient_medications
-- =====================================================
CREATE TABLE patient_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Medication Info
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100), -- daily, twice_daily, weekly, as_needed
    time_of_day VARCHAR(50), -- morning, afternoon, evening, night
    
    -- Instructions
    instructions TEXT,
    notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, paused, discontinued
    start_date DATE,
    end_date DATE,
    
    -- Prescription
    prescribed_by UUID REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT patient_medications_status_check CHECK (status IN ('active', 'paused', 'discontinued'))
);

-- Indexes
CREATE INDEX idx_medications_patient ON patient_medications(patient_id, status);
CREATE INDEX idx_medications_organization ON patient_medications(organization_id);

-- Trigger
CREATE TRIGGER update_patient_medications_updated_at 
    BEFORE UPDATE ON patient_medications
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: patient_supplements
-- =====================================================
CREATE TABLE patient_supplements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Supplement Info
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    time_of_day VARCHAR(50),
    
    -- Instructions
    instructions TEXT,
    notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    
    -- Recommendation
    recommended_by UUID REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT patient_supplements_status_check CHECK (status IN ('active', 'paused', 'discontinued'))
);

-- Indexes
CREATE INDEX idx_supplements_patient ON patient_supplements(patient_id, status);
CREATE INDEX idx_supplements_organization ON patient_supplements(organization_id);

-- Trigger
CREATE TRIGGER update_patient_supplements_updated_at 
    BEFORE UPDATE ON patient_supplements
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: adherence_logs
-- =====================================================
CREATE TABLE adherence_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Reference
    item_type VARCHAR(20) NOT NULL, -- medication, supplement
    item_id UUID NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    
    -- Schedule
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    
    -- Adherence
    status VARCHAR(20) DEFAULT 'pending', -- pending, taken, skipped, late
    taken_at TIMESTAMPTZ,
    
    -- Notes
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT adherence_logs_item_type_check CHECK (item_type IN ('medication', 'supplement')),
    CONSTRAINT adherence_logs_status_check CHECK (status IN ('pending', 'taken', 'skipped', 'late'))
);

-- Indexes
CREATE INDEX idx_adherence_patient_date ON adherence_logs(patient_id, scheduled_date DESC);
CREATE INDEX idx_adherence_organization ON adherence_logs(organization_id);
CREATE INDEX idx_adherence_status ON adherence_logs(status, scheduled_date);

-- =====================================================
-- FUNCTION: Update patient search vector
-- =====================================================
CREATE OR REPLACE FUNCTION update_patient_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('portuguese', COALESCE(NEW.full_name, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.phone, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patient_search
BEFORE INSERT OR UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_patient_search_vector();

-- =====================================================
-- RLS: Enable Row Level Security
-- =====================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: patients
-- =====================================================
CREATE POLICY "Users view organization patients"
ON patients FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert organization patients"
ON patients FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users update organization patients"
ON patients FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins delete patients"
ON patients FOR DELETE
USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
));

-- =====================================================
-- RLS POLICIES: patient_measurements (same pattern)
-- =====================================================
CREATE POLICY "View org measurements" ON patient_measurements FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Insert org measurements" ON patient_measurements FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Update org measurements" ON patient_measurements FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Delete org measurements" ON patient_measurements FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =====================================================
-- RLS POLICIES: Apply same pattern to all tables
-- =====================================================
-- patient_tasks
CREATE POLICY "View org tasks" ON patient_tasks FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org tasks" ON patient_tasks FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org tasks" ON patient_tasks FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org tasks" ON patient_tasks FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- patient_medications
CREATE POLICY "View org medications" ON patient_medications FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org medications" ON patient_medications FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org medications" ON patient_medications FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org medications" ON patient_medications FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- patient_supplements
CREATE POLICY "View org supplements" ON patient_supplements FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org supplements" ON patient_supplements FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org supplements" ON patient_supplements FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org supplements" ON patient_supplements FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- adherence_logs
CREATE POLICY "View org adherence" ON adherence_logs FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org adherence" ON adherence_logs FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org adherence" ON adherence_logs FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org adherence" ON adherence_logs FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =====================================================
-- END OF MIGRATION 02
-- =====================================================
