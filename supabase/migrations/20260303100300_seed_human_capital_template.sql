-- Seed: Transport Division – Human Capital Audit Checklist
-- Total weight: 100

DO $$
DECLARE
  v_template_id UUID;
  v_cat_id UUID;
BEGIN

  -- Create the template
  INSERT INTO public.checklist_templates (name, description, is_active)
  VALUES (
    'Transport Division – Human Capital Audit Checklist',
    'A comprehensive human capital audit checklist for transport divisions covering recruitment, training, licensing, workforce planning, HSE, performance management, disciplinary procedures, compliance, communication, and offboarding.',
    true
  )
  RETURNING id INTO v_template_id;

  -- =========================================================
  -- 1. Recruitment and Onboarding
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Recruitment and Onboarding', 1)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Have all drivers and staff positions been filled according to approved organizational structure?', 2, 0),
    (v_cat_id, 'Are all new hires subject to background, criminal, and reference checks?', 4, 1),
    (v_cat_id, 'Have proof of valid licenses/certifications (e.g., CDL, HGV, medical clearances) been collected and filed?', 4, 2),
    (v_cat_id, 'Has each new hire completed a formal induction and onboarding program?', 4, 3);

  -- =========================================================
  -- 2. Training and Competency
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Training and Competency', 2)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are all drivers trained in defensive driving, safety protocols, and company-specific procedures?', 4, 0),
    (v_cat_id, 'Are staff trained in regulatory requirements (e.g., DOT, OSHA, local transport laws)?', 4, 1),
    (v_cat_id, 'Have all mandatory refresher courses and skills assessments been completed and documented?', 3, 2),
    (v_cat_id, 'Is ongoing professional development encouraged and tracked for all personnel?', 3, 3);

  -- =========================================================
  -- 3. Licensing, Certification, and Medicals
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Licensing, Certification, and Medicals', 3)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are all driver licenses, professional certificates, and medical clearances valid and up to date?', 4, 0),
    (v_cat_id, 'Is there a system to monitor expiry dates and prompt renewals for all required documents?', 2, 1),
    (v_cat_id, 'Are random drug and alcohol tests conducted in accordance with policy and regulations?', 4, 2);

  -- =========================================================
  -- 4. Workforce Planning and Scheduling
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Workforce Planning and Scheduling', 4)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are work schedules compliant with legal limits on driving hours, rest breaks, and overtime?', 3, 0),
    (v_cat_id, 'Is there adequate staffing to cover all shifts and routes without overworking personnel?', 3, 1),
    (v_cat_id, 'Are leave and absence requests managed and documented appropriately?', 3, 2);

  -- =========================================================
  -- 5. Health, Safety, and Wellbeing
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Health, Safety, and Wellbeing', 5)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are regular health and safety briefings or toolbox talks conducted for all staff?', 3, 0),
    (v_cat_id, 'Are employees provided with personal protective equipment (PPE) and safety gear as required?', 3, 1),
    (v_cat_id, 'Is there a documented process for reporting and investigating workplace accidents or incidents?', 3, 2),
    (v_cat_id, 'Are employee wellness programs or support services (e.g., counseling, health checks) available?', 3, 3);

  -- =========================================================
  -- 6. Performance Management
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Performance Management', 6)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are performance evaluations conducted at least annually for all staff?', 3, 0),
    (v_cat_id, 'Are underperformance issues documented and addressed through coaching or corrective action?', 4, 1),
    (v_cat_id, 'Are exceptional performers recognized and rewarded according to company policy?', 3, 2);

  -- =========================================================
  -- 7. Disciplinary and Grievance Procedures
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Disciplinary and Grievance Procedures', 7)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is there a clear, documented disciplinary procedure in place and communicated to all staff?', 4, 0),
    (v_cat_id, 'Are grievances handled promptly, confidentially, and in accordance with policy?', 4, 1),
    (v_cat_id, 'Are all disciplinary and grievance cases recorded and reviewed for trends?', 4, 2);

  -- =========================================================
  -- 8. Compliance and Record-Keeping
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Compliance and Record-Keeping', 8)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are all HR records (personnel files, training logs, contracts) complete and securely stored?', 2, 0),
    (v_cat_id, 'Are all employment practices compliant with labor and transport regulations?', 2, 1),
    (v_cat_id, 'Are workforce diversity and equal opportunity policies in place and monitored?', 2, 2);

  -- =========================================================
  -- 9. Communication and Engagement
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Communication and Engagement', 9)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are regular team meetings, briefings, or communications held with all staff?', 2, 0),
    (v_cat_id, 'Is there a clear channel for employees to provide feedback or suggestions?', 2, 1),
    (v_cat_id, 'Are changes to policies, procedures, or regulations promptly communicated to all relevant staff?', 3, 2);

  -- =========================================================
  -- 10. Exit and Offboarding Procedures
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Exit and Offboarding Procedures', 10)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are exit interviews conducted for departing employees?', 2, 0),
    (v_cat_id, 'Is company property (uniforms, keys, ID cards, devices) retrieved at offboarding?', 2, 1),
    (v_cat_id, 'Are access rights (physical and digital) revoked promptly upon an employee''s departure?', 2, 2);

END $$;
