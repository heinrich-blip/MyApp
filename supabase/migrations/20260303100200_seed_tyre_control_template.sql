-- Seed: Transport Tyre Control – QA Audit Checklist template
-- Total weight: 100

DO $$
DECLARE
  v_template_id UUID;
  v_cat_id UUID;
BEGIN

  -- Create the template
  INSERT INTO public.checklist_templates (name, description, is_active)
  VALUES (
    'Transport Tyre Control – QA Audit Checklist',
    'A comprehensive QA audit checklist for transport tyre management covering condition assessment, tread depth, pressure verification, wheel/rim condition, rotation, alignment, replacement criteria, documentation, regulatory compliance, and training.',
    true
  )
  RETURNING id INTO v_template_id;

  -- =========================================================
  -- 1. Tyre Condition Assessment
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Tyre Condition Assessment', 1)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Has a full visual inspection for cuts, cracks, bulges, sidewall damage, and embedded objects been completed?', 5, 0),
    (v_cat_id, 'Have valve caps been checked and confirmed present and undamaged?', 5, 1),
    (v_cat_id, 'Has the tyre age (manufacture date) been checked and recorded, and is it within acceptable limits?', 5, 2),
    (v_cat_id, 'Are tyre types, sizes, and load ratings correctly matched on each axle?', 5, 3);

  -- =========================================================
  -- 2. Tread Depth Measurement
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Tread Depth Measurement', 2)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Has tread depth been measured across inner, center, and outer tread using a calibrated gauge?', 5, 0),
    (v_cat_id, 'Are all tyres above legal and company minimum tread depth?', 5, 1),
    (v_cat_id, 'Have irregular or uneven wear patterns been identified and documented?', 5, 2);

  -- =========================================================
  -- 3. Tyre Pressure Verification
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Tyre Pressure Verification', 3)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Has cold tyre pressure been checked with a calibrated gauge and compared to recommended levels?', 5, 0),
    (v_cat_id, 'Have any pressure adjustments been made and confirmed?', 5, 1),
    (v_cat_id, 'Have all tyres been checked for leaks (including valve stems)?', 5, 2);

  -- =========================================================
  -- 4. Wheel and Rim Condition
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Wheel and Rim Condition', 4)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Have wheels and rims been inspected for cracks, corrosion, dents, or other damage?', 5, 0),
    (v_cat_id, 'Are all wheel nuts/bolts present, undamaged, and properly torqued?', 5, 1),
    (v_cat_id, 'Are valve stems intact and free from damage or leaks?', 4, 2);

  -- =========================================================
  -- 5. Tyre Rotation and Balancing
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Tyre Rotation and Balancing', 5)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Has tyre rotation been performed according to schedule and documented?', 3, 0),
    (v_cat_id, 'Have all wheels been checked for proper balance?', 3, 1);

  -- =========================================================
  -- 6. Alignment and Suspension
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Alignment and Suspension', 6)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Has axle/wheel alignment been verified as per schedule?', 3, 0),
    (v_cat_id, 'Has the suspension system been inspected for worn or damaged parts?', 3, 1);

  -- =========================================================
  -- 7. Tyre Replacement Criteria
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Tyre Replacement Criteria', 7)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are tyres that are below tread depth, age, or with visible defects removed from service?', 3, 0),
    (v_cat_id, 'For retreaded tyres: Have only eligible casings been retreaded and quality checked?', 3, 1);

  -- =========================================================
  -- 8. Documentation and Record-Keeping
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Documentation and Record-Keeping', 8)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is there an up-to-date tyre inventory record (serial numbers, installation dates, positions)?', 3, 0),
    (v_cat_id, 'Are all inspection and maintenance actions logged with dates, findings, and personnel signatures?', 3, 1),
    (v_cat_id, 'Are non-conformance reports completed for any tyres failing inspection, with corrective actions documented?', 3, 2),
    (v_cat_id, 'Are compliance certificates and records of regulatory adherence properly filed?', 3, 3);

  -- =========================================================
  -- 9. Regulatory and Environmental Compliance
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Regulatory and Environmental Compliance', 9)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are all tyre management activities compliant with relevant regulations (e.g., DOT, ECE, ADR)?', 3, 0),
    (v_cat_id, 'Are scrap tyres disposed of or recycled according to legal and environmental requirements?', 3, 1);

  -- =========================================================
  -- 10. Training and Awareness
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Training and Awareness', 10)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Have all relevant staff received current training in tyre inspection and maintenance?', 2, 0),
    (v_cat_id, 'Have staff been updated on recent regulatory or process changes?', 3, 1);

END $$;
