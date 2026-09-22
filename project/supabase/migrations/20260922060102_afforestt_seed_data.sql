/*
# Auto-create profile on signup + seed data

1. Trigger function
- handle_new_user(): inserts a row into profiles when a new auth user is created,
  using the full_name from user metadata.
2. Seed data
- Inserts 5 trainings (Crash Course, Detailed, In-depth, Offline Workshop, Monthly
  Webinar) with prices from the DB.
- Inserts upcoming webinar (September 30, 6:30 PM).
- Inserts 1 real testimonial (Shreya Pareek) + 3 clearly-marked sample reviews.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed trainings
INSERT INTO trainings (slug, name, duration, price, description, features, badge, category, format, difficulty, image_url, seats, sort_order)
VALUES
  ('crash-course', 'Crash Course', '2 Hours', 3500,
   'Learn the basics of the Miyawaki Method and understand the essential steps involved in creating a native forest.',
   ARRAY['2-hour live training', 'Miyawaki Method fundamentals', 'Basic implementation guidance', 'Q&A session'],
   NULL, 'online', 'online', 'beginner',
   'https://images.pexels.com/photos/33164661/pexels-photo-33164661.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   50, 1),
  ('detailed-training', 'Detailed Training', '4 Hours', 5500,
   'A deeper practical introduction to native forest creation, covering methodology, planning and implementation.',
   ARRAY['4-hour training', 'Forest creation methodology', 'Species selection basics', 'Site preparation', 'Practical guidance', 'Q&A session'],
   NULL, 'online', 'online', 'beginner',
   'https://images.pexels.com/photos/38499277/pexels-photo-38499277.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   40, 2),
  ('in-depth-training', 'In-depth Training', '8 Hours / 2 Days', 9999,
   'Understand the complete process of native forest creation from planning to implementation.',
   ARRAY['8 hours over 2 days', 'Forest design', 'Species selection', 'Soil preparation', 'Plantation planning', 'Maintenance', 'Monitoring', 'Case studies', 'Q&A session'],
   'Popular', 'online', 'online', 'advanced',
   'https://images.pexels.com/photos/7867865/pexels-photo-7867865.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   30, 3),
  ('offline-workshop', 'Offline Workshop', '5 Days', 100000,
   'An immersive in-person forest creation experience with practical training.',
   ARRAY['5-day in-person training', 'Food included', 'Accommodation included', 'Training materials included', 'Practical forest creation', 'Expert guidance'],
   'Hands-on Experience', 'offline', 'offline', 'advanced',
   'https://images.pexels.com/photos/7656721/pexels-photo-7656721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   20, 4),
  ('monthly-webinar', 'Monthly Webinar', 'Live Online', 149,
   'Join our monthly online webinar and learn practical concepts related to native forest creation.',
   ARRAY['Live online session', 'Miyawaki Method overview', 'Q&A interaction', 'Recording access'],
   'Limited Seats', 'online', 'online', 'beginner',
   'https://images.pexels.com/photos/28505485/pexels-photo-28505485.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   100, 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed webinar
INSERT INTO webinars (title, webinar_date, webinar_time, price, seats, seats_filled, is_active)
VALUES ('Monthly Webinar: Native Forest Creation', '2026-09-30', '6:30 PM', 149, 100, 42, true)
ON CONFLICT DO NOTHING;

-- Seed reviews (1 real + 3 clearly marked sample)
INSERT INTO reviews (training_name, author_name, rating, content, is_sample, is_approved)
VALUES
  ('In-depth Training', 'Shreya Pareek', 5,
   'The training was very beneficial. I learnt so much and implemented the learnings to create my very own tiny patch of forest in my city. Thank you for the guidance.',
   false, true),
  ('Crash Course', 'Demo Reviewer A', 5,
   'This is a sample testimonial for demonstration purposes. The crash course provided a great overview of the Miyawaki Method.',
   true, true),
  ('Detailed Training', 'Demo Reviewer B', 4,
   'This is a sample testimonial for demonstration purposes. The 4-hour session was well-structured and informative.',
   true, true),
  ('Offline Workshop', 'Demo Reviewer C', 5,
   'This is a sample testimonial for demonstration purposes. The hands-on workshop was an incredible learning experience.',
   true, true)
ON CONFLICT DO NOTHING;