-- Members table for storing membership applications
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialty TEXT NOT NULL,
  institution TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  interests TEXT,
  referral TEXT,
  subscribed_newsletter BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  date DATE NOT NULL,
  time TEXT,
  end_date DATE,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('conference', 'workshop', 'seminar', 'webinar', 'training')),
  image_url TEXT,
  capacity INTEGER,
  registration_link TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_past BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT,
  author_image TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  read_time TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (references auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can insert members (for registration)
CREATE POLICY "Anyone can submit membership" ON members FOR INSERT WITH CHECK (true);

-- Public can read published events
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

-- Public can read published blogs
CREATE POLICY "Anyone can view published blogs" ON blogs FOR SELECT USING (is_published = true);

-- Public can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin policies for members
CREATE POLICY "Admins can view all members" ON members FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can update members" ON members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete members" ON members FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Admin policies for events
CREATE POLICY "Admins can insert events" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete events" ON events FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Admin policies for blogs (full CRUD)
CREATE POLICY "Admins can view all blogs" ON blogs FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert blogs" ON blogs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can update blogs" ON blogs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete blogs" ON blogs FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Admin policies for newsletter subscribers
CREATE POLICY "Admins can view all subscribers" ON newsletter_subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can update subscribers" ON newsletter_subscribers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete subscribers" ON newsletter_subscribers FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Admin users can view themselves
CREATE POLICY "Admins can view admin_users" ON admin_users FOR SELECT USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin')
);
