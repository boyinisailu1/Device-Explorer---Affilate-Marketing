-- Create site_stats table for TrustSignals component
-- Run this in your Supabase dashboard under SQL Editor

CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  devices_indexed TEXT DEFAULT '5,000+',
  active_users TEXT DEFAULT '50K+',
  verified_specs TEXT DEFAULT '100%',
  comparisons_made TEXT DEFAULT '500K+',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read
CREATE POLICY "public_read_site_stats" ON site_stats
  FOR SELECT USING (true);

-- Policy: Only admins can update
CREATE POLICY "admin_update_site_stats" ON site_stats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can insert
CREATE POLICY "admin_insert_site_stats" ON site_stats
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT ON site_stats TO authenticated, anon;
GRANT UPDATE, INSERT ON site_stats TO authenticated;

-- Insert default row
INSERT INTO site_stats (id, devices_indexed, active_users, verified_specs, comparisons_made)
VALUES (uuid_generate_v4(), '5,000+', '50K+', '100%', '500K+')
ON CONFLICT DO NOTHING;
