/*
  # Add email column to users table

  1. Changes
    - Add email column to users table to store user email addresses
    - Update existing user records with email from auth.users
*/

-- Add email column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;

-- Update existing users with their email from auth.users
UPDATE users
SET email = au.email
FROM auth.users au
WHERE users.id = au.id;

-- Make email required for future records
ALTER TABLE users ALTER COLUMN email SET NOT NULL;