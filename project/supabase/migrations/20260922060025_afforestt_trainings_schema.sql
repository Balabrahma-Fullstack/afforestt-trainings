/*
# Afforestt Trainings — full schema

1. Overview
Creates the complete data model for an Afforestt-inspired training booking platform.
Includes trainings (catalog), webinars, bookings (cart→checkout→payment→confirmation
flow), reviews, and profiles linked to Supabase Auth users. Prices stored in DB.

2. New Tables
- trainings — catalog of training programs with price, duration, features, etc.
- webinars — upcoming webinar schedule.
- bookings — user bookings with customer details, payment status, booking_id.
- reviews — user testimonials, with is_sample flag for demo content.
- profiles — public profile data for authenticated users (full_name, role).

3. Security
- RLS on every table.
- trainings, webinars, reviews SELECT publicly readable.
- bookings owner-scoped + admin override.
- admin role via profiles.role column.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  duration text NOT NULL,
  price integer NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  badge text,
  category text NOT NULL DEFAULT 'online',
  format text NOT NULL DEFAULT 'online',
  difficulty text NOT NULL DEFAULT 'beginner',
  image_url text,
  seats integer NOT NULL DEFAULT 50,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_trainings" ON trainings;
CREATE POLICY "public_select_trainings" ON trainings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_trainings" ON trainings;
CREATE POLICY "admin_insert_trainings" ON trainings FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_trainings" ON trainings;
CREATE POLICY "admin_update_trainings" ON trainings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_trainings" ON trainings;
CREATE POLICY "admin_delete_trainings" ON trainings FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  webinar_date date NOT NULL,
  webinar_time text NOT NULL,
  price integer NOT NULL DEFAULT 149,
  seats integer NOT NULL DEFAULT 100,
  seats_filled integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_webinars" ON webinars;
CREATE POLICY "public_select_webinars" ON webinars FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_webinars" ON webinars;
CREATE POLICY "admin_insert_webinars" ON webinars FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_webinars" ON webinars;
CREATE POLICY "admin_update_webinars" ON webinars FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_webinars" ON webinars;
CREATE POLICY "admin_delete_webinars" ON webinars FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE NOT NULL,
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  training_id uuid REFERENCES trainings(id) ON DELETE SET NULL,
  training_name text NOT NULL,
  selected_date date NOT NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  country text,
  amount integer NOT NULL,
  payment_method text NOT NULL DEFAULT 'upi',
  payment_status text NOT NULL DEFAULT 'pending',
  booking_status text NOT NULL DEFAULT 'confirmed',
  transaction_id text,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_bookings" ON bookings;
CREATE POLICY "admin_select_bookings" ON bookings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  training_name text NOT NULL,
  author_name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  content text NOT NULL,
  is_sample boolean NOT NULL DEFAULT false,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_reviews" ON reviews;
CREATE POLICY "public_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_update_reviews" ON reviews;
CREATE POLICY "admin_update_reviews" ON reviews FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_reviews" ON reviews;
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_trainings_active ON trainings(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_webinars_active ON webinars(is_active, webinar_date);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);