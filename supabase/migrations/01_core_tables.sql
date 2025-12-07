-- =====================================================
-- Migration 01: Core Tables (Organizations & Profiles)
-- =====================================================
-- Description: Creates the foundation for multi-tenant architecture
-- Dependencies: None (first migration)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: organizations (Tenants)
-- =====================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    -- Branding
    logo_internal_url TEXT,
    logo_auth_url TEXT,
    platform_name VARCHAR(100) DEFAULT 'Bloom',
    tagline TEXT,
    browser_title VARCHAR(200),
    favicon_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    accent_color VARCHAR(7) DEFAULT '#8b5cf6',
    success_color VARCHAR(7) DEFAULT '#10b981',
    
    -- Subscription
    plan_type VARCHAR(50) DEFAULT 'free', -- free, basic, premium, enterprise
    max_users INTEGER DEFAULT 5,
    max_patients INTEGER DEFAULT 50,
    max_storage_gb INTEGER DEFAULT 10,
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'BR',
    postal_code VARCHAR(20),
    
    -- Constraints
    CONSTRAINT organizations_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT organizations_plan_type_check CHECK (plan_type IN ('free', 'basic', 'premium', 'enterprise')),
    CONSTRAINT organizations_status_check CHECK (status IN ('active', 'suspended', 'cancelled'))
);

-- Indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_organizations_plan_type ON organizations(plan_type);

-- Comments
COMMENT ON TABLE organizations IS 'Multi-tenant organizations (clinics/practices)';
COMMENT ON COLUMN organizations.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN organizations.plan_type IS 'Subscription tier';

-- =====================================================
-- TABLE: profiles (Extends auth.users)
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Personal Info
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    
    -- Professional Info
    role VARCHAR(50) NOT NULL, -- admin, doctor, nutritionist, assistant, receptionist
    specialty VARCHAR(100),
    crm VARCHAR(50), -- Professional registration number
    rqe VARCHAR(50),
    bio TEXT,
    
    -- Settings
    language VARCHAR(10) DEFAULT 'pt-BR',
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'doctor', 'nutritionist', 'assistant', 'receptionist')),
    CONSTRAINT profiles_language_check CHECK (language IN ('pt-BR', 'en-US', 'es-ES'))
);

-- Indexes
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_organization_role ON profiles(organization_id, role);

-- Comments
COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth';
COMMENT ON COLUMN profiles.role IS 'User role within the organization';
COMMENT ON COLUMN profiles.crm IS 'Medical registration number (CRM, CRN, etc)';

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to organizations
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to profiles
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Handle new user signup
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- This will be called by Edge Function
    -- Just a placeholder for now
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS: Enable Row Level Security
-- =====================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: organizations
-- =====================================================

-- Users can view their own organization
CREATE POLICY "Users can view own organization"
ON organizations FOR SELECT
USING (
    id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid()
    )
);

-- Only admins can update organization
CREATE POLICY "Admins can update organization"
ON organizations FOR UPDATE
USING (
    id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- RLS POLICIES: profiles
-- =====================================================

-- Users can view all profiles in their organization
CREATE POLICY "View organization profiles"
ON profiles FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid()
    )
);

-- Users can update only their own profile
CREATE POLICY "Update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- Admins can insert new users in their organization
CREATE POLICY "Admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can delete users in their organization
CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (
    organization_id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- SEED DATA: Demo Organization
-- =====================================================
-- Insert demo organization for testing
INSERT INTO organizations (
    id,
    name,
    slug,
    platform_name,
    email,
    plan_type,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Clínica Demo',
    'clinica-demo',
    'Bloom',
    'demo@bloom.health',
    'premium',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- END OF MIGRATION 01
-- =====================================================
