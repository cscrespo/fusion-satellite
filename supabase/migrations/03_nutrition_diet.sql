-- =====================================================
-- Migration 03: Nutrition & Diet
-- =====================================================
-- Description: Creates diet plans, meals, and food logs
-- Dependencies: 02_patient_management.sql
-- =====================================================

-- =====================================================
-- TABLE: diet_plans
-- =====================================================
CREATE TABLE diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Plan Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Nutrition Goals
    target_calories INTEGER,
    target_protein INTEGER, -- gramas
    target_carbs INTEGER,
    target_fat INTEGER,
    target_water INTEGER, -- ml
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, paused, archived
    start_date DATE,
    end_date DATE,
    
    -- Assignment
    created_by UUID REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT diet_plans_status_check CHECK (status IN ('active', 'paused', 'archived'))
);

-- Indexes
CREATE INDEX idx_diet_plans_patient ON diet_plans(patient_id, status);
CREATE INDEX idx_diet_plans_organization ON diet_plans(organization_id);

-- Trigger
CREATE TRIGGER update_diet_plans_updated_at 
    BEFORE UPDATE ON diet_plans
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: diet_meals
-- =====================================================
CREATE TABLE diet_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    diet_plan_id UUID NOT NULL REFERENCES diet_plans(id) ON DELETE CASCADE,
    
    -- Meal Info
    day_of_week INTEGER, -- 0=Sunday, 6=Saturday, NULL=all days
    meal_time TIME NOT NULL,
    meal_name VARCHAR(100) NOT NULL, -- Café da Manhã, Almoço, Jantar, etc
    
    -- Content
    description TEXT,
    
    -- Nutrition
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    
    -- Metadata
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT diet_meals_day_of_week_check CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6))
);

-- Indexes
CREATE INDEX idx_diet_meals_plan ON diet_meals(diet_plan_id, day_of_week, meal_time);
CREATE INDEX idx_diet_meals_organization ON diet_meals(organization_id);

-- Trigger
CREATE TRIGGER update_diet_meals_updated_at 
    BEFORE UPDATE ON diet_meals
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: diet_meal_items
-- =====================================================
CREATE TABLE diet_meal_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    diet_meal_id UUID NOT NULL REFERENCES diet_meals(id) ON DELETE CASCADE,
    
    -- Food Info
    food_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100), -- "2 un", "150g", "1 xícara"
    
    -- Nutrition (optional, per item)
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    
    -- Metadata
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_meal_items_meal ON diet_meal_items(diet_meal_id);

-- =====================================================
-- TABLE: daily_food_logs
-- =====================================================
CREATE TABLE daily_food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Log Info
    log_date DATE NOT NULL,
    meal_time TIME NOT NULL,
    meal_type VARCHAR(100), -- Café da Manhã, Lanche, Almoço, etc
    meal_name VARCHAR(255) NOT NULL,
    
    -- Nutrition
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    
    -- Media
    photo_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(patient_id, log_date, meal_time)
);

-- Indexes
CREATE INDEX idx_food_logs_patient_date ON daily_food_logs(patient_id, log_date DESC);
CREATE INDEX idx_food_logs_organization ON daily_food_logs(organization_id);

-- =====================================================
-- TABLE: daily_water_logs
-- =====================================================
CREATE TABLE daily_water_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Water Intake
    log_date DATE NOT NULL,
    amount_ml INTEGER NOT NULL,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_water_logs_patient_date ON daily_water_logs(patient_id, log_date DESC);
CREATE INDEX idx_water_logs_organization ON daily_water_logs(organization_id);

-- =====================================================
-- RLS: Enable Row Level Security
-- =====================================================
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_water_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: Standard organization-based access
-- =====================================================
-- diet_plans
CREATE POLICY "View org diet_plans" ON diet_plans FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org diet_plans" ON diet_plans FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org diet_plans" ON diet_plans FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org diet_plans" ON diet_plans FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- diet_meals
CREATE POLICY "View org diet_meals" ON diet_meals FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org diet_meals" ON diet_meals FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org diet_meals" ON diet_meals FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org diet_meals" ON diet_meals FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- diet_meal_items
CREATE POLICY "View org diet_meal_items" ON diet_meal_items FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org diet_meal_items" ON diet_meal_items FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org diet_meal_items" ON diet_meal_items FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org diet_meal_items" ON diet_meal_items FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- daily_food_logs
CREATE POLICY "View org daily_food_logs" ON daily_food_logs FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org daily_food_logs" ON daily_food_logs FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org daily_food_logs" ON daily_food_logs FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org daily_food_logs" ON daily_food_logs FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- daily_water_logs
CREATE POLICY "View org daily_water_logs" ON daily_water_logs FOR SELECT
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Insert org daily_water_logs" ON daily_water_logs FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Update org daily_water_logs" ON daily_water_logs FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Delete org daily_water_logs" ON daily_water_logs FOR DELETE
USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =====================================================
-- END OF MIGRATION 03
-- =====================================================
