-- Add schedule and next_due columns to submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS schedule TEXT DEFAULT 'once'
    CHECK (schedule IN ('once', 'weekly', 'biweekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS next_due DATE;
