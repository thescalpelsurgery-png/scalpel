-- Create trigger to automatically add admin status for specific emails
CREATE OR REPLACE FUNCTION public.handle_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email is the admin email
  IF NEW.email = 'scalpel_admin@scalpel.com' THEN
    INSERT INTO public.admin_users (id, email, role, created_at)
    VALUES (
      NEW.id,
      NEW.email,
      'super_admin',
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = NEW.email,
        role = 'super_admin';
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;

CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_user();
