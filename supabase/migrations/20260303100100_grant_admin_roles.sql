-- Grant admin role to existing users
INSERT INTO public.user_roles (user_id, role) VALUES
  ('111fcc33-1b0e-4f41-8d80-f73ce70c2d52', 'admin'),  -- marcusa@matanuska.co.zw
  ('ea86b13c-5ebb-45f7-9df6-281a132f1a9c', 'admin'),  -- heinrich@matanuska.co.za
  ('7fc17367-7b97-4205-aa5a-58f82587ba5c', 'admin')   -- marccusa@matanuska.co.zw
ON CONFLICT (user_id, role) DO NOTHING;
