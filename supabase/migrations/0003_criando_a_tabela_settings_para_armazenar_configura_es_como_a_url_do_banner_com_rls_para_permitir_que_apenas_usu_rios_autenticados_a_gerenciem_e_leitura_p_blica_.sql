-- Create settings table
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Allow authenticated read access to settings" ON public.settings
FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert new settings
CREATE POLICY "Allow authenticated insert access to settings" ON public.settings
FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update settings
CREATE POLICY "Allow authenticated update access to settings" ON public.settings
FOR UPDATE TO authenticated USING (true);

-- Allow public read access to specific settings (e.g., homepage banner)
-- This policy allows anyone to read the 'homepage_banner_url' setting.
CREATE POLICY "Allow public read access for homepage banner" ON public.settings
FOR SELECT USING (key = 'homepage_banner_url');

-- Insert initial banner URL if it doesn't exist
INSERT INTO public.settings (key, value)
VALUES ('homepage_banner_url', '/banner.png')
ON CONFLICT (key) DO NOTHING;