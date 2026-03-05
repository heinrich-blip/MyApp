-- Seed: Transport Operational Audit Checklist
-- Each section totals 100 points

DO $$
DECLARE
  v_template_id UUID;
  v_cat_id UUID;
BEGIN

  INSERT INTO public.checklist_templates (name, description, is_active)
  VALUES (
    'Transport Operational Audit Checklist',
    'A comprehensive operational audit checklist for transport divisions covering fleet & asset management, driver management, vehicle safety, cold chain, scheduling, operational performance, incident management, documentation, safety/risk/legal compliance, fuel & cost management, and communication.',
    true
  )
  RETURNING id INTO v_template_id;

  -- =========================================================
  -- 1. Fleet & Asset Management (5%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Fleet & Asset Management', 1)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- General
    (v_cat_id, 'Is there a complete and accurate list of all trucks, trailers, and reefers?', 5, 0),
    (v_cat_id, 'Are all VIN numbers, engine numbers, and license plates correctly recorded?', 5, 1),
    (v_cat_id, 'Is asset allocation recorded (which truck is assigned to which driver/site)?', 5, 2),
    (v_cat_id, 'Are service level agreements (SLAs) defined for every client?', 10, 3),
    -- Maintenance Records
    (v_cat_id, 'Is a full service history available for every unit?', 10, 4),
    (v_cat_id, 'Are all breakdowns logged along with their root causes?', 10, 5),
    (v_cat_id, 'Are odometer readings updated weekly?', 10, 6),
    (v_cat_id, 'Are the tracker/telematics systems functioning correctly (where applicable)?', 5, 7),
    -- Condition
    (v_cat_id, 'Is the vehicle body condition inspected and recorded?', 5, 8),
    (v_cat_id, 'Are windscreens, mirrors, and lights intact and operational?', 5, 9),
    (v_cat_id, 'Are tyre tread, pressure, and wear inspected and monitored regularly?', 10, 10),
    (v_cat_id, 'Are daily pre-trip inspections completed and signed?', 10, 11),
    (v_cat_id, 'Is the refrigeration unit inspected (where applicable)?', 10, 12);

  -- =========================================================
  -- 2. Driver Management (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Driver Management', 2)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- Compliance
    (v_cat_id, 'Does every driver have a valid driver''s license and PDP?', 5, 0),
    (v_cat_id, 'Does every driver have a valid medical fitness certificate?', 10, 1),
    (v_cat_id, 'Are driver disciplinary records up to date?', 5, 2),
    -- Training
    (v_cat_id, 'Has the driver completed induction training?', 5, 3),
    (v_cat_id, 'Has the driver received defensive-driving training?', 10, 4),
    (v_cat_id, 'Has the driver been trained on load securing (flat-decks)?', 10, 5),
    (v_cat_id, 'Has the driver been trained on reefer handling and temperature management?', 10, 6),
    (v_cat_id, 'Have all drivers signed their SOP and Induction Documents?', 5, 7),
    -- Performance
    (v_cat_id, 'Is driver punctuality monitored and are late arrivals logged?', 10, 8),
    (v_cat_id, 'Are complaints about drivers recorded and followed up?', 10, 9),
    (v_cat_id, 'Is tracking data (speeding, harsh braking, idling) reviewed?', 5, 10),
    (v_cat_id, 'Is driving behaviour, including fatigue and fuel efficiency, monitored weekly?', 5, 11),
    (v_cat_id, 'Is driver communication discipline monitored and adhered to?', 10, 12);

  -- =========================================================
  -- 3. Vehicle Safety & Compliance (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Vehicle Safety & Compliance', 3)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- Roadworthiness
    (v_cat_id, 'Is the Certificate of Fitness (COF) valid?', 10, 0),
    (v_cat_id, 'Is the daily pre-trip inspection completed and signed?', 10, 1),
    (v_cat_id, 'Is the weekly vehicle condition check completed?', 15, 2),
    -- Safety Equipment
    (v_cat_id, 'Is the fire extinguisher serviced and functional?', 10, 3),
    (v_cat_id, 'Are reflective triangles present in the vehicle?', 10, 4),
    (v_cat_id, 'Is the first-aid kit stocked?', 10, 5),
    (v_cat_id, 'Are the wheel spanner and jack included?', 10, 6),
    -- Legal
    (v_cat_id, 'Are vehicle registrations and licenses up to date?', 10, 7),
    (v_cat_id, 'Are all cross-border permits / documents valid and available (if applicable)?', 15, 8);

  -- =========================================================
  -- 4. Cold Chain & Reefer Management (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Cold Chain & Reefer Management', 4)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- Temperature Control
    (v_cat_id, 'Is the temperature setpoint correct for the specific fruit type?', 10, 0),
    (v_cat_id, 'Are reefer sensors calibrated?', 10, 1),
    (v_cat_id, 'Is the printer/recording system functional?', 10, 2),
    -- Pre-Cooling
    (v_cat_id, 'Was the reefer pre-cooled before loading?', 10, 3),
    (v_cat_id, 'Was the start temperature verified and recorded before loading?', 10, 4),
    -- Monitoring
    (v_cat_id, 'Are continuous temperature printouts stored as records?', 10, 5),
    (v_cat_id, 'Are temperature alarm events investigated and resolved?', 10, 6),
    (v_cat_id, 'Was the fuel level checked before dispatch?', 10, 7),
    -- Hygiene
    (v_cat_id, 'Is the reefer cleaned and sanitised before use?', 10, 8),
    (v_cat_id, 'Is the reefer free of odours, mould, or debris?', 10, 9);

  -- =========================================================
  -- 5. Transport Scheduling & Dispatch (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Transport Scheduling & Dispatch', 5)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- Planning
    (v_cat_id, 'Is the weekly load plan available?', 10, 0),
    (v_cat_id, 'Is the daily transport plan prepared?', 10, 1),
    (v_cat_id, 'Are routes optimised for efficiency?', 10, 2),
    (v_cat_id, 'Are loading times communicated to drivers?', 10, 3),
    -- Execution
    (v_cat_id, 'Does the truck depart farms/depots on time?', 10, 4),
    (v_cat_id, 'Is the pick-up at farm completed on time?', 10, 5),
    (v_cat_id, 'Is delivery at depots completed on time?', 10, 6),
    -- Coordination
    (v_cat_id, 'Are communication logs maintained between Dispatch, QC, and Workshop?', 10, 7),
    (v_cat_id, 'Are delays reported immediately?', 10, 8),
    (v_cat_id, 'Is the 360° End-to-End Time Tracker completed, signed, and submitted to the Transport Head for every trip?', 10, 9);

  -- =========================================================
  -- 6. Operational Performance (15%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Operational Performance', 6)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- KPIs
    (v_cat_id, 'Is the breakdown rate monitored (per 10,000 km)?', 10, 0),
    (v_cat_id, 'Are late arrivals tracked and analysed?', 15, 1),
    (v_cat_id, 'Is truck utilisation measured (km/day or trips/day)?', 10, 2),
    -- Efficiency
    (v_cat_id, 'Are empty trips minimised where possible?', 10, 3),
    (v_cat_id, 'Is loading time vs waiting time monitored?', 15, 4),
    (v_cat_id, 'Is the average cycle time adhered to for every load?', 10, 5),
    -- Product Loss
    (v_cat_id, 'Are temperature deviations reported and investigated?', 15, 6),
    (v_cat_id, 'Are incidents of load shifting (flat-decks) logged?', 15, 7);

  -- =========================================================
  -- 7. Incident & Breakdown Management (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Incident & Breakdown Management', 7)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    -- Emergency Response
    (v_cat_id, 'Are breakdowns or accidents logged immediately when they occur?', 10, 0),
    (v_cat_id, 'Is a roadside assistance protocol in place and followed?', 5, 1),
    (v_cat_id, 'Is emergency response time monitored and met?', 10, 2),
    (v_cat_id, 'Are recurring failures tracked for each truck and trailer?', 10, 3),
    -- Reporting
    (v_cat_id, 'Are incident forms completed accurately?', 5, 4),
    (v_cat_id, 'Is the quality of incident reporting acceptable?', 5, 5),
    (v_cat_id, 'Are photos taken and attached as evidence?', 10, 6),
    (v_cat_id, 'Are driver statements submitted?', 10, 7),
    -- Investigation
    (v_cat_id, 'Is root cause analysis completed and documented for each breakdown or accident?', 10, 8),
    (v_cat_id, 'Are corrective and preventive actions (CAPA) implemented?', 10, 9),
    -- Insurance
    (v_cat_id, 'Are insurance claims filed for applicable incidents?', 5, 10),
    (v_cat_id, 'Is physical damage repaired?', 5, 11),
    (v_cat_id, 'Is cost recovery tracked?', 5, 12);

  -- =========================================================
  -- 8. Documentation & Record Keeping (5%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Documentation & Record Keeping', 8)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are vehicle files complete and up to date?', 10, 0),
    (v_cat_id, 'Are driver files complete and up to date?', 15, 1),
    (v_cat_id, 'Are temperature logs stored properly?', 15, 2),
    (v_cat_id, 'Are workshop job cards filed?', 15, 3),
    (v_cat_id, 'Are breakdown logs available and complete?', 15, 4),
    (v_cat_id, 'Are pre-trip books stored for the required retention period?', 15, 5),
    (v_cat_id, 'Are 360° End-to-End Time Tracker logs filed for every trip?', 15, 6);

  -- =========================================================
  -- 9. Safety, Risk & Legal Compliance (5%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Safety, Risk & Legal Compliance', 9)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are transport-operation risk assessments completed and updated?', 15, 0),
    (v_cat_id, 'Are emergency procedures displayed and accessible?', 15, 1),
    (v_cat_id, 'Is PPE usage enforced for all personnel?', 15, 2),
    (v_cat_id, 'Are toolbox talks conducted regularly?', 15, 3),
    (v_cat_id, 'Is compliance with working-hours regulations monitored?', 10, 4),
    (v_cat_id, 'Is occupational safety compliance ensured?', 15, 5),
    (v_cat_id, 'Is fire-safety compliance met?', 15, 6);

  -- =========================================================
  -- 10. Fuel & Cost Management (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Fuel & Cost Management', 10)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are fuel receipts recorded and stored?', 10, 0),
    (v_cat_id, 'Is fuel consumption per km monitored?', 15, 1),
    (v_cat_id, 'Is excessive fuel usage investigated?', 10, 2),
    (v_cat_id, 'Are fuel-theft controls in place?', 10, 3),
    -- Tyres
    (v_cat_id, 'Are tyre change records maintained?', 10, 4),
    (v_cat_id, 'Is the tyre pressure policy implemented and monitored?', 20, 5),
    -- Cost Control
    (v_cat_id, 'Is cost per km monitored?', 15, 6),
    (v_cat_id, 'Are maintenance-cost trends reviewed?', 10, 7);

  -- =========================================================
  -- 11. Communication & Coordination (10%)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Communication & Coordination', 11)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Do all drivers have functioning communication devices?', 25, 0),
    (v_cat_id, 'Does Dispatch communicate delays immediately?', 25, 1),
    (v_cat_id, 'Is the Workshop notified daily of all vehicle defects?', 25, 2),
    (v_cat_id, 'Are Depots, Farms, Transport, and QC notified promptly of temperature variances or delays?', 25, 3);

END $$;
