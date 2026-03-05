-- Seed: Transport Diesel Control Audit Checklist template
-- Total weight: 100

DO $$
DECLARE
  v_template_id UUID;
  v_cat_id UUID;
BEGIN

  -- Create the template
  INSERT INTO public.checklist_templates (name, description, is_active)
  VALUES (
    'Transport Diesel Control Audit Checklist',
    'A comprehensive audit checklist covering HSE compliance, diesel deliveries, dispensing protocols, and fuel control & security to prevent losses and ensure safe operations.',
    true
  )
  RETURNING id INTO v_template_id;

  -- =========================================================
  -- Section 1: Health, Safety, and Environmental (HSE) Compliance
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Health, Safety, and Environmental (HSE) Compliance', 1)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Are dry chemical fire extinguishers (minimum 9kg) mounted nearby, clearly marked, and have up-to-date service tags?', 4, 0),
    (v_cat_id, 'Are "Danger," "Highly Flammable," "No Smoking," and "No Cellphones" signs clearly visible from all approach angles?', 3, 1),
    (v_cat_id, 'Is a fully stocked spill kit (absorbent booms, pads, sand, disposal bags) stationed within 5 meters of the bowser?', 3, 2),
    (v_cat_id, 'Containment (Bund Wall): The concrete bund wall (containment area) is structurally sound, free of cracks, and drained of any rainwater or spilled fuel. (It must be able to hold 110% of the bowser''s capacity).', 3, 3),
    (v_cat_id, 'Static Grounding: The bowser is properly earthed/grounded to prevent static electricity build-up.', 3, 4),
    (v_cat_id, 'Emergency Shut-off: The emergency pump shut-off switch is clearly marked, accessible, and tested regularly.', 4, 5),
    (v_cat_id, 'PPE: Operators are wearing appropriate Personal Protective Equipment (fuel-resistant gloves, safety boots, and eye protection).', 3, 6);

  -- =========================================================
  -- Section 2: Diesel Deliveries (Receiving from Supplier)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Diesel Deliveries (Receiving from Supplier)', 2)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Pre-Drop Dip: A designated supervisor physically dips the bowser (or records the digital gauge) before the delivery truck starts pumping.', 5, 0),
    (v_cat_id, 'Capacity Check: Verify that the bowser has enough empty capacity to take the full ordered load without overfilling.', 3, 1),
    (v_cat_id, 'Seal Verification: The supervisor inspects the seals on the delivery truck''s valves and verifies the seal numbers against the delivery note.', 3, 2),
    (v_cat_id, 'Grounding: Ensure the delivery truck attaches its earthing/grounding cable to the bowser before any hoses are connected.', 3, 3),
    (v_cat_id, 'Supervision: A company representative remains physically present for the entire duration of the fuel drop.', 3, 4),
    (v_cat_id, 'Post-Drop Dip: Wait 10-15 minutes for the fuel to settle, then dip the bowser again.', 3, 5),
    (v_cat_id, 'Reconciliation: Calculate: (Post-Drop Dip) - (Pre-Drop Dip) = Total Liters Received.', 3, 6),
    (v_cat_id, 'Sign-off: Only sign the delivery note for the physically measured liters, not the amount printed on the supplier''s invoice.', 3, 7);

  -- =========================================================
  -- Section 3: Dispensing Diesel (Bowser to Fleet Truck)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Dispensing Diesel (Bowser to Fleet Truck)', 3)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Engine Off: The truck engine is switched off, and the keys are removed before the fuel cap is opened.', 3, 0),
    (v_cat_id, 'Authorized Operator: Only a designated fuel attendant (not the driver) operates the pump.', 3, 1),
    (v_cat_id, 'Pre-Fueling Data Capture: Date and Time recorded before pumping.', 1, 2),
    (v_cat_id, 'Pre-Fueling Data Capture: Truck Registration / Fleet Number recorded before pumping.', 2, 3),
    (v_cat_id, 'Pre-Fueling Data Capture: Driver Name recorded before pumping.', 1, 4),
    (v_cat_id, 'Pre-Fueling Data Capture: Current Odometer or Hubodometer reading recorded before pumping.', 3, 5),
    (v_cat_id, 'Direct to Tank: Fuel is dispensed only into the truck''s main fitted fuel tank.', 3, 6),
    (v_cat_id, 'No Loose Containers: No filling of jerry cans, drums, or unverified secondary tanks without a signed authorization slip from management.', 3, 7),
    (v_cat_id, 'Active Pumping: The operator remains at the nozzle the entire time. No propping the nozzle open with objects.', 3, 8),
    (v_cat_id, 'Post-Fueling: The truck''s fuel cap is securely replaced and locked. The operator records the exact liters dispensed and both the driver and operator sign the fuel slip.', 3, 9);

  -- =========================================================
  -- Section 4: Fuel Control, Security & Safekeeping (Anti-Theft)
  -- =========================================================
  INSERT INTO public.template_categories (template_id, name, category_number)
  VALUES (v_template_id, 'Fuel Control, Security & Safekeeping (Anti-Theft)', 4)
  RETURNING id INTO v_cat_id;

  INSERT INTO public.category_items (category_id, question, weight, sort_order) VALUES
    (v_cat_id, 'Lockdown: The dispensing nozzle, pump power switch, and tank inlet valves are secured with heavy-duty padlocks when the fuel station is unattended.', 4, 0),
    (v_cat_id, 'Key Control: Keys to the bowser are kept in a lockbox. Only authorized supervisors have access, and a key sign-out register is maintained.', 4, 1),
    (v_cat_id, 'CCTV Coverage: High-definition, night-vision CCTV cameras are positioned to clearly capture the truck registration, the pump meter display, and the person holding the nozzle.', 3, 2),
    (v_cat_id, 'Anti-Siphoning: All fleet trucks are fitted with mechanical anti-siphoning devices (mesh guards) inside their fuel filler necks to prevent drivers from draining fuel on the road.', 3, 3),
    (v_cat_id, 'Daily Reconciliation: Every morning, the Fleet Manager performs a mass balance equation: (Opening Dip + Delivered Liters - Dispensed Liters = Expected Closing Dip).', 3, 4),
    (v_cat_id, 'Variance Investigation: Any variance greater than 0.5% between the theoretical stock and physical dip is immediately investigated.', 3, 5),
    (v_cat_id, 'Consumption Tracking: Weekly fuel consumption reports (Liters per 100km or km/Liter) are generated for every truck. Sudden spikes in consumption indicate either a mechanical fault or fuel theft by the driver.', 3, 6),
    (v_cat_id, 'Pump Calibration: The bowser''s flow meter is calibrated and certified by an external contractor every 6 to 12 months to ensure it is reading accurately.', 3, 7);

END $$;
