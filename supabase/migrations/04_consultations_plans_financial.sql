-- =====================================================
-- Migration 04: Consultations & Treatment Plans
-- =====================================================
-- Description: Consultations, treatment plans, subscriptions, invoices
-- Dependencies: 02_patient_management.sql
-- =====================================================

-- =====================================================
-- TABLE: consultations
-- =====================================================
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Consultation Info
    consultation_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    type VARCHAR(50) DEFAULT 'in_person', -- in_person, online, phone
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    
    -- SOAP Notes
    subjective TEXT, -- Patient's complaints/history
    objective TEXT, -- Physical exam, vitals, measurements
    assessment TEXT, -- Diagnosis/evaluation
    plan TEXT, -- Treatment plan
    
    -- Additional Notes
    transcription TEXT,
    notes TEXT,
    
    -- Follow-up
    next_consultation_date DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT consultations_type_check CHECK (type IN ('in_person', 'online', 'phone')),
    CONSTRAINT consultations_status_check CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show'))
);

-- Indexes
CREATE INDEX idx_consultations_patient ON consultations(patient_id, consultation_date DESC);
CREATE INDEX idx_consultations_doctor ON consultations(doctor_id, consultation_date DESC);
CREATE INDEX idx_consultations_organization ON consultations(organization_id);
CREATE INDEX idx_consultations_status_date ON consultations(status, consultation_date);

-- Trigger
CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: treatment_plans
-- =====================================================
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Plan Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '📋',
    category VARCHAR(50) NOT NULL, -- medication, nutrition, fitness, wellness, other
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, quarterly, yearly, one_time
    duration_months INTEGER, -- NULL = indefinido
    
    -- Capacity
    max_patients INTEGER,
    current_patients INTEGER DEFAULT 0,
    
    -- Features
    features JSONB DEFAULT '[]', -- Array de strings
    contraindications JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, archived
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT treatment_plans_category_check CHECK (category IN ('medication', 'nutrition', 'fitness', 'wellness', 'other')),
    CONSTRAINT treatment_plans_billing_cycle_check CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly', 'one_time')),
    CONSTRAINT treatment_plans_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes
CREATE INDEX idx_treatment_plans_organization ON treatment_plans(organization_id);
CREATE INDEX idx_treatment_plans_status ON treatment_plans(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_treatment_plans_category ON treatment_plans(category);

-- Trigger
CREATE TRIGGER update_treatment_plans_updated_at 
    BEFORE UPDATE ON treatment_plans
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: patient_subscriptions
-- =====================================================
CREATE TABLE patient_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES treatment_plans(id),
    
    -- Subscription Info
    status VARCHAR(20) DEFAULT 'active', -- active, paused, cancelled, expired
    start_date DATE NOT NULL,
    end_date DATE,
    next_billing_date DATE,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- Constraints
    CONSTRAINT patient_subscriptions_status_check CHECK (status IN ('active', 'paused', 'cancelled', 'expired'))
);

-- Indexes
CREATE INDEX idx_subscriptions_patient ON patient_subscriptions(patient_id, status);
CREATE INDEX idx_subscriptions_plan ON patient_subscriptions(plan_id);
CREATE INDEX idx_subscriptions_billing_date ON patient_subscriptions(next_billing_date) WHERE status = 'active';

-- Trigger
CREATE TRIGGER update_patient_subscriptions_updated_at 
    BEFORE UPDATE ON patient_subscriptions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: invoices
-- =====================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Invoice Info
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    -- Amount
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    paid_at TIMESTAMPTZ,
    
    -- Service
    service_description TEXT,
    subscription_id UUID REFERENCES patient_subscriptions(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT invoices_status_check CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled'))
);

-- Indexes
CREATE INDEX idx_invoices_patient ON invoices(patient_id, issue_date DESC);
CREATE INDEX idx_invoices_organization ON invoices(organization_id);
CREATE INDEX idx_invoices_status ON invoices(status, due_date);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- Trigger
CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: payments
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    
    -- Payment Info
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- credit_card, debit_card, pix, cash, transfer
    payment_date TIMESTAMPTZ NOT NULL,
    
    -- Transaction
    transaction_id VARCHAR(255),
    gateway VARCHAR(50), -- stripe, mercadopago, pagseguro
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_organization ON payments(organization_id);

-- =====================================================
-- FUNCTION: Update plan patient count
-- =====================================================
CREATE OR REPLACE FUNCTION update_plan_patient_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE treatment_plans
        SET current_patients = current_patients + 1
        WHERE id = NEW.plan_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE treatment_plans
        SET current_patients = current_patients - 1
        WHERE id = OLD.plan_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.plan_id != OLD.plan_id THEN
        UPDATE treatment_plans
        SET current_patients = current_patients - 1
        WHERE id = OLD.plan_id;
        UPDATE treatment_plans
        SET current_patients = current_patients + 1
        WHERE id = NEW.plan_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plan_count
AFTER INSERT OR UPDATE OR DELETE ON patient_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_plan_patient_count();

-- =====================================================
-- RLS: Enable Row Level Security
-- =====================================================
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: Standard organization-based access
-- =====================================================
-- consultations
CREATE POLICY "View org consultations" ON consultations FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org consultations" ON consultations FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org consultations" ON consultations FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org consultations" ON consultations FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- treatment_plans
CREATE POLICY "View org treatment_plans" ON treatment_plans FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org treatment_plans" ON treatment_plans FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org treatment_plans" ON treatment_plans FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org treatment_plans" ON treatment_plans FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- patient_subscriptions
CREATE POLICY "View org patient_subscriptions" ON patient_subscriptions FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org patient_subscriptions" ON patient_subscriptions FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org patient_subscriptions" ON patient_subscriptions FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org patient_subscriptions" ON patient_subscriptions FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- invoices
CREATE POLICY "View org invoices" ON invoices FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org invoices" ON invoices FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org invoices" ON invoices FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org invoices" ON invoices FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- payments
CREATE POLICY "View org payments" ON payments FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org payments" ON payments FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org payments" ON payments FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org payments" ON payments FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- END OF MIGRATION 04
-- =====================================================
