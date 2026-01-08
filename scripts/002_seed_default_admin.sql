
DO $$
BEGIN
  INSERT INTO public.admin_users (id, email, role, created_at)
  VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'scalpel_admin@scalpel.com',
    'super_admin',
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;
  
END $$;

