-- Add awarded_score column to submission_items table
ALTER TABLE submission_items 
ADD COLUMN awarded_score NUMERIC DEFAULT NULL;

-- Migrate existing data: if compliance is true, set awarded_score to weight_at_submission, else 0 if false
UPDATE submission_items 
SET awarded_score = CASE 
    WHEN compliance = true THEN weight_at_submission 
    WHEN compliance = false THEN 0 
    ELSE NULL 
END 
WHERE awarded_score IS NULL;
