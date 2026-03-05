-- Add a start date for recurring schedules
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS schedule_start date;

-- Optional: set schedule_start to next_due for existing recurring submissions
UPDATE public.submissions
SET schedule_start = next_due
WHERE schedule_start IS NULL
  AND schedule IS NOT NULL
  AND schedule <> 'once'
  AND next_due IS NOT NULL;
