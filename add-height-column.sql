-- Add height column to patients table (if not exists)
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS height DECIMAL(5,2);

-- Update existing patient with sample height (for testing)
UPDATE patients 
SET height = 175.0 
WHERE height IS NULL;

-- Verify
SELECT id, full_name, height, current_weight FROM patients LIMIT 5;
