-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_uid uuid;
  existing_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = 'admin@admin.com';

  IF existing_user_id IS NULL THEN
    -- Generate a UUID for the new admin user
    admin_uid := gen_random_uuid();

    -- Create the user in auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      aud,
      role
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000'::uuid,
      'admin@admin.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"first_name": "Admin", "last_name": "User"}'::jsonb,
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    -- Create the user profile with admin role
    INSERT INTO public.users (
      id,
      email,
      role,
      first_name,
      last_name
    ) VALUES (
      admin_uid,
      'admin@admin.com',
      'admin',
      'Admin',
      'User'
    );
  ELSE
    -- Update existing user to be admin
    UPDATE public.users
    SET 
      role = 'admin',
      first_name = 'Admin',
      last_name = 'User'
    WHERE id = existing_user_id;

    -- Update auth user metadata
    UPDATE auth.users
    SET 
      raw_user_meta_data = '{"first_name": "Admin", "last_name": "User"}'::jsonb,
      email_confirmed_at = now(),
      updated_at = now()
    WHERE id = existing_user_id;
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT create_admin_user();

-- Drop the function after use
DROP FUNCTION create_admin_user(); 