/*
# Make first registered user admin

Updates the handle_new_user trigger function so that the very first user
to register gets the 'admin' role. All subsequent users get 'user'.
This ensures the admin dashboard is accessible for testing.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT count(*) INTO user_count FROM public.profiles;
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN user_count = 0 THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$;