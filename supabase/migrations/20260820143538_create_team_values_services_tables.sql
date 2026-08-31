/*
# Create team_members, site_values, services, and service_features tables

## Purpose
These tables support the full-featured individual page components (AboutPage, ServicesPage)
that were previously unused because routing pointed to compact placeholder pages.

## New Tables

### team_members
- id (uuid, PK)
- name (text, not null) — team member's full name
- role (text, not null) — job title
- bio (text) — biography paragraph
- image_url (text) — path to profile photo in storage
- display_order (int, default 999) — controls sort order
- instagram_url (text) — optional social link
- linkedin_url (text) — optional social link
- facebook_url (text) — optional social link
- whatsapp_url (text) — optional social link
- created_at (timestamptz)

### site_values
- id (uuid, PK)
- title (text, not null) — value name (e.g. "Excellence")
- description (text) — what the value means
- icon_name (text) — maps to a lucide-react icon
- display_order (int, default 999)
- created_at (timestamptz)

### services
- id (uuid, PK)
- slug (text, unique, not null) — URL-friendly identifier
- title (text, not null) — service name
- description (text, not null) — service description
- icon_name (text) — maps to a lucide-react icon
- image_url (text) — path to service image in storage
- display_order (int, default 999)
- created_at (timestamptz)

### service_features
- id (uuid, PK)
- service_id (uuid, FK to services, cascade delete)
- feature (text, not null) — a feature/bullet point for the service
- created_at (timestamptz)

## Security
- RLS enabled on all four tables.
- Public read access (TO anon, authenticated) since this is a no-auth public website.
- No insert/update/delete policies for anon — only admin (service role) can write.
*/

-- team_members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  display_order int NOT NULL DEFAULT 999,
  instagram_url text,
  linkedin_url text,
  facebook_url text,
  whatsapp_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_team_members" ON team_members;
CREATE POLICY "anon_select_team_members" ON team_members FOR SELECT
  TO anon, authenticated USING (true);

-- site_values
CREATE TABLE IF NOT EXISTS site_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon_name text,
  display_order int NOT NULL DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_values" ON site_values;
CREATE POLICY "anon_select_site_values" ON site_values FOR SELECT
  TO anon, authenticated USING (true);

-- services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon_name text,
  image_url text,
  display_order int NOT NULL DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

-- service_features
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_service_features" ON service_features;
CREATE POLICY "anon_select_service_features" ON service_features FOR SELECT
  TO anon, authenticated USING (true);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_site_values_display_order ON site_values(display_order);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_service_features_service_id ON service_features(service_id);
