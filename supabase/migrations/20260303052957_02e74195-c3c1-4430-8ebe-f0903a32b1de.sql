
ALTER TABLE public.submissions DROP CONSTRAINT submissions_template_id_fkey;
ALTER TABLE public.submissions ADD CONSTRAINT submissions_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.checklist_templates(id) ON DELETE CASCADE;

ALTER TABLE public.submission_items DROP CONSTRAINT submission_items_submission_id_fkey;
ALTER TABLE public.submission_items ADD CONSTRAINT submission_items_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;

ALTER TABLE public.template_categories DROP CONSTRAINT template_categories_template_id_fkey;
ALTER TABLE public.template_categories ADD CONSTRAINT template_categories_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.checklist_templates(id) ON DELETE CASCADE;

ALTER TABLE public.category_items DROP CONSTRAINT category_items_category_id_fkey;
ALTER TABLE public.category_items ADD CONSTRAINT category_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.template_categories(id) ON DELETE CASCADE;
