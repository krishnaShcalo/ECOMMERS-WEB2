import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sgwsgomybdlktvqfktsu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'; // Get this from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    // Create the user
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@admin.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User'
      }
    });

    if (createError) throw createError;

    // Make the user an admin
    const { error: adminError } = await supabase.rpc('make_user_admin', {
      user_email: 'admin@admin.com'
    });

    if (adminError) throw adminError;

    console.log('Admin user created successfully:', authUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser(); 