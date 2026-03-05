-- Seed: Transport Workshop & Maintenance Audit Checklist
-- Each section totals 100 points

DO $$
DECLARE
  v_template_id UUID;
  v_cat_id UUID;
BEGIN

  INSERT INTO public.checklist_templates (name, description, is_active)
  VALUES (
    'Transport Workshop & Maintenance Audit Checklist',
    'A comprehensive workshop and maintenance audit checklist covering preventative maintenance, work order control, breakdown analysis, spare parts & inventory, workshop productivity, technical competence & training, cost control, safety & housekeeping, vehicle release & QC, and workshop infrastructure.',
    true
  )
  RETURNING id INTO v_template_id;

  -- =========================================================
  -- 1. Preventative Maintenance Control (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Preventative Maintenance Control', 1)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is there a documented service schedule for each asset type based on manufacturer guidelines?', 10, 0),
    (v_cat_id, 'Are service intervals determined by kilometres, operating hours, or manufacturer specifications?', 10, 1),
    (v_cat_id, 'Is preventative maintenance consistently completed on time?', 10, 2),
    (v_cat_id, 'Is there a tracking system in place for upcoming scheduled services?', 5, 3),
    (v_cat_id, 'Does the tracking system provide automated alerts (30/15/7 days out) to allow for workshop capacity planning?', 10, 4),
    (v_cat_id, 'Is there a Non-Conformance Report (NCR) process for services exceeding the tolerance limit, and who is the designated authority for sign-off?', 10, 5),
    (v_cat_id, 'On a random sample of 5 job cards, are all mandatory fields completed, and is the technician''s/supervisor''s signature present?', 10, 6),
    (v_cat_id, 'Is service compliance consistently above the required target (e.g., >95%)?', 10, 7),
    (v_cat_id, 'Are service checklists fully completed and signed off for every service?', 5, 8),
    (v_cat_id, 'Is there documented evidence of management review of service compliance?', 10, 9),
    (v_cat_id, 'Are missed or overdue services escalated formally and promptly?', 10, 10);

  -- =========================================================
  -- 2. Maintenance Planning & Work Order Control (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Maintenance Planning & Work Order Control', 2)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Does a physical or digital Job Card exist for 100% of vehicles currently on the floor, including "quick-fix" repairs?', 15, 0),
    (v_cat_id, 'Are job cards sequentially numbered, controlled, and stored correctly?', 10, 1),
    (v_cat_id, 'Are labour hours recorded accurately for each job card?', 15, 2),
    (v_cat_id, 'Are all parts issued linked to a specific job card?', 10, 3),
    (v_cat_id, 'Is there a job-card approval process before work begins?', 10, 4),
    (v_cat_id, 'For "Roadside/Emergency" repairs, is a job card generated within 24 hours and reconciled with external vendor invoices?', 10, 5),
    (v_cat_id, 'Is there a Repeat Repair (Rework) Report, and is it linked to specific technicians for training or disciplinary review?', 10, 6),
    (v_cat_id, 'Is the Workshop Backlog reviewed daily, and are "Waiting for Parts" vs. "Waiting for Labour" items clearly categorized?', 10, 7),
    (v_cat_id, 'Are all job cards signed off by the manager at end of job?', 10, 8);

  -- =========================================================
  -- 3. Breakdown Analysis & Reliability Management (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Breakdown Analysis & Reliability Management', 3)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is there a Centralized Breakdown Log (digital or manual) that records the date, time, location, and initial fault report within 1 hour of notification?', 10, 0),
    (v_cat_id, 'Is a Root Cause Analysis (RCA) performed for all "Major" or "Safety-Critical" failures using a standard method (e.g., The 5 Whys)?', 20, 1),
    (v_cat_id, 'Are recurring breakdowns tracked, flagged, and investigated?', 10, 2),
    (v_cat_id, 'Is MTBF reported by vehicle model or age to identify assets that have become uneconomical to maintain?', 10, 3),
    (v_cat_id, 'Are breakdown trends presented in Monthly Management Reviews, and do they lead to specific "Maintenance Plan" adjustments?', 10, 4),
    (v_cat_id, 'Is there a corrective action plan for high-failure or problem vehicles?', 15, 5),
    (v_cat_id, 'Are vehicles with >2 breakdowns per month flagged as "High Risk" and prioritized for a deep-dive technical inspection?', 15, 6),
    (v_cat_id, 'Is roadside repair response time measured and tracked?', 10, 7);

  -- =========================================================
  -- 4. Spare Parts & Inventory Control (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Spare Parts & Inventory Control', 4)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is a Computerized Maintenance Management System (CMMS) or dedicated ERP module used to manage stock levels and part movements?', 15, 0),
    (v_cat_id, 'Are minimum and maximum stock levels defined for each part?', 10, 1),
    (v_cat_id, 'Are all critical spare parts always kept in stock?', 10, 2),
    (v_cat_id, 'Are parts electronically "issued" to a specific Work Order to ensure 1:1 traceability between stock and the asset?', 15, 3),
    (v_cat_id, 'Are stock counts performed regularly (e.g., cycle counts)?', 15, 4),
    (v_cat_id, 'Are high-value/pilferable items (e.g., injectors, turbos, batteries) kept in a restricted-access "Cage" with signed-out logs?', 10, 5),
    (v_cat_id, 'Are obsolete or damaged parts identified and removed from inventory?', 10, 6),
    (v_cat_id, 'Is there clear segregation between used parts and new parts?', 15, 7);

  -- =========================================================
  -- 5. Workshop Productivity & Performance (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Workshop Productivity & Performance', 5)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is there a monthly report comparing Labor Utilization (hours at work) vs. Productivity (hours billed to job cards)?', 15, 0),
    (v_cat_id, 'Are Turnaround Times (TAT) tracked against targets for specific job types (e.g., A-Service vs. Engine Overhaul)?', 15, 1),
    (v_cat_id, 'Are daily job allocation plans created and followed?', 10, 2),
    (v_cat_id, 'Are mechanics assigned clear responsibilities and tasks?', 15, 3),
    (v_cat_id, 'Is overtime monitored, approved, and controlled?', 10, 4),
    (v_cat_id, 'Is there KPI reporting in place for workshop performance?', 10, 5),
    (v_cat_id, 'Is supervisor sign-off completed on all finished jobs?', 15, 6),
    (v_cat_id, 'Are customer (transport manager) satisfaction reviews conducted regularly?', 10, 7);

  -- =========================================================
  -- 6. Technical Competence & Training (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Technical Competence & Training', 6)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are mechanics appropriately qualified for heavy-vehicle maintenance?', 10, 0),
    (v_cat_id, 'Does each employee have a Training File that includes a 12-month history of attended courses and upcoming renewals?', 15, 1),
    (v_cat_id, 'Is there an Annual Training Matrix based on new fleet technology (e.g., Euro 6 engines, EV systems) and identified rework trends?', 15, 2),
    (v_cat_id, 'Are specialised systems (e.g., refrigeration units) serviced only by qualified technicians?', 15, 3),
    (v_cat_id, 'Is there a documented Induction & Skills Assessment (practical and theoretical) completed within the first 30 days of employment?', 10, 4),
    (v_cat_id, 'Are workshop safety procedures understood and followed by all staff?', 10, 5),
    (v_cat_id, 'Is there a Toolbox Talk Log showing weekly frequency, specific safety/technical topics, and signed attendance sheets?', 15, 6),
    (v_cat_id, 'Is there a succession plan in place for critical technical roles?', 10, 7);

  -- =========================================================
  -- 7. Maintenance Cost Control (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Maintenance Cost Control', 7)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is there a Monthly Cost-per-Asset Report that breaks down labor, parts, and external spend for every vehicle in the fleet?', 15, 0),
    (v_cat_id, 'Is cost per kilometre calculated and reviewed?', 15, 1),
    (v_cat_id, 'Are repair-vs-replace decisions documented with justification?', 10, 2),
    (v_cat_id, 'Are major repair approvals controlled by authorised personnel?', 10, 3),
    (v_cat_id, 'Is budget vs actual maintenance cost compared regularly?', 10, 4),
    (v_cat_id, 'Does the tyre management system track Cost-per-mm of wear and include a "Scrap Tyre" audit to prevent premature disposal?', 15, 5),
    (v_cat_id, 'Is there a Warranty Claim Log for parts and labor, and is recovery performance tracked against potential claims?', 10, 6),
    (v_cat_id, 'Are all 3rd-Party Invoices reconciled against the original Purchase Order (PO) and inspected for quality before payment is authorized?', 15, 7);

  -- =========================================================
  -- 8. Workshop Safety & Housekeeping (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Workshop Safety & Housekeeping', 8)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are floors free of oil spills/trip hazards, and is the "5S" or Housekeeping Standard visibly maintained in all bays?', 10, 0),
    (v_cat_id, 'Are technician toolboxes and communal specialty tools (e.g., torque wrenches) stored in designated shadows/locations and free of visible damage?', 10, 1),
    (v_cat_id, 'Is there a Calibration Register for compressors, jacks, and torque wrenches with valid certificates dated within the last 12 months?', 10, 2),
    (v_cat_id, 'Are lifting equipment inspections current and documented?', 10, 3),
    (v_cat_id, 'Is PPE worn correctly and at all times by all staff?', 10, 4),
    (v_cat_id, 'Is the SANS/Hazardous Substance Register up to date, and are all chemicals stored in bunded, fire-rated cabinets?', 10, 5),
    (v_cat_id, 'Are spill kits fully stocked (absorbent granules, pads, disposal bags) and located within 10 meters of high-risk fluid transfer areas?', 10, 6),
    (v_cat_id, 'Are fire extinguishers unobstructed, and is the Service Date on the tag within the legal 12-month requirement?', 10, 7),
    (v_cat_id, 'Are Emergency Exit Paths painted on the floor and kept 100% clear of tires, parts, or waste bins at all times?', 10, 8),
    (v_cat_id, 'Is there a Safety Incident/Near-Miss Log, and is there evidence of "Lessons Learned" being shared in the next Toolbox Talk?', 10, 9);

  -- =========================================================
  -- 9. Vehicle Release & Quality Control (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Vehicle Release & Quality Control', 9)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Is a final inspection completed before releasing each vehicle from the workshop?', 15, 0),
    (v_cat_id, 'Is a Post-Repair Road Test logged for all major drivetrain or steering repairs, and does it follow a specific testing route/protocol?', 10, 1),
    (v_cat_id, 'Is a sign-off checklist completed before vehicle dispatch?', 15, 2),
    (v_cat_id, 'Is QA verification performed periodically on workshop outputs?', 10, 3),
    (v_cat_id, 'Is there a Post-Service Defect Log to capture faults reported within 48 hours of release, and are these linked to "Root Cause" analysis?', 10, 4),
    (v_cat_id, 'Is the vehicle inspected for Workshop debris (grease on seats/steering, old parts in the cab, tools left in engine bay) prior to handover?', 15, 5),
    (v_cat_id, 'Are digital and physical Asset Files updated with the completed Job Card and Statutory Certificates within 24 hours of release?', 10, 6),
    (v_cat_id, 'Is the Total Downtime (from ''Gate-In'' to ''Ready-for-Work'') recorded and analyzed to identify process bottlenecks?', 15, 7);

  -- =========================================================
  -- 10. Workshop Infrastructure & Equipment (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Workshop Infrastructure & Equipment', 10)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are the number of workshop bays adequate for the fleet size?', 10, 0),
    (v_cat_id, 'Does the lighting in inspection pits and under-chassis areas meet minimum Lux requirements for detailed mechanical work?', 10, 1),
    (v_cat_id, 'Is the compressed-air system functional and maintained?', 10, 2),
    (v_cat_id, 'Is there a Lifting Equipment Register showing biannual load-testing and certification for all heavy-duty lifts and jacks?', 10, 3),
    (v_cat_id, 'Are diagnostic tools available and functioning correctly?', 10, 4),
    (v_cat_id, 'Are specialised tools available for all required repair types?', 10, 5),
    (v_cat_id, 'Are torque wrenches calibrated according to schedule?', 10, 6),
    (v_cat_id, 'Is a secure tool-control system in place?', 10, 7),
    (v_cat_id, 'Are waste-disposal systems compliant with regulations?', 10, 8),
    (v_cat_id, 'Is the workshop perimeter secure, and is there a Visitor/Driver Access Policy to keep non-technical staff out of work bays?', 10, 9);

END $$;
