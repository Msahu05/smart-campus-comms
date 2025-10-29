-- Add college and department fields if not already present
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subject TEXT;

-- Update queries table to include college context
ALTER TABLE queries ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE queries ADD COLUMN IF NOT EXISTS department TEXT;

-- Update appointments table to include college context
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS department TEXT;

-- Update office_hours table to include college context
ALTER TABLE office_hours ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE office_hours ADD COLUMN IF NOT EXISTS department TEXT;