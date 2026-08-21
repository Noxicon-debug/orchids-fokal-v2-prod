/*
# Create gallery tables and public images bucket

## Summary
Creates three tables for the gallery feature (categories, projects, and project media)
plus a public storage bucket for images. The gallery content is public-readable so
the anon-key frontend can display it; only authenticated admins can modify it.

## New Tables
1. `gallery_categories`
   - `id` (text, primary key) — short slug like "videography"
   - `name` (text, not null) — display name
   - `icon_name` (text, not null) — lucide icon name
   - `display_order` (int, default 0) — sort order

2. `gallery_projects`
   - `id` (int, primary key, auto-increment)
   - `title` (text, not null)
   - `category_id` (text, FK to gallery_categories, not null)
   - `client` (text)
   - `year` (text)
   - `description` (text)
   - `image_url` (text, not null) — cover image path
   - `featured` (boolean, default false)
   - `order_index` (int, default 0)
   - `created_at` (timestamptz, default now())

3. `gallery_project_media`
   - `id` (int, primary key, auto-increment)
   - `project_id` (int, FK to gallery_projects, ON DELETE CASCADE)
   - `type` (text, not null, default 'image') — 'image' or 'video'
   - `url` (text, not null)
   - `thumbnail_url` (text)
   - `caption` (text, default '')
   - `order_index` (int, default 0)

## Storage
- Creates a public bucket named `images` for serving media files.

## Security
- RLS enabled on all three tables.
- SELECT: public (anon, authenticated) — gallery is visible to everyone.
- INSERT/UPDATE/DELETE: authenticated only — admins manage content.
- Storage bucket is public so images load via fast permanent URLs.
*/

-- Create the public images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Gallery categories
CREATE TABLE IF NOT EXISTS gallery_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon_name text NOT NULL DEFAULT 'LayoutGrid',
  display_order int NOT NULL DEFAULT 0
);

ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_categories" ON gallery_categories;
CREATE POLICY "public_read_gallery_categories"
  ON gallery_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_insert_gallery_categories"
  ON gallery_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_update_gallery_categories"
  ON gallery_categories FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_delete_gallery_categories"
  ON gallery_categories FOR DELETE
  TO authenticated
  USING (true);

-- Gallery projects
CREATE TABLE IF NOT EXISTS gallery_projects (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  category_id text NOT NULL REFERENCES gallery_categories(id) ON DELETE RESTRICT,
  client text DEFAULT '',
  year text DEFAULT '',
  description text DEFAULT '',
  image_url text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_projects" ON gallery_projects;
CREATE POLICY "public_read_gallery_projects"
  ON gallery_projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_projects" ON gallery_projects;
CREATE POLICY "auth_insert_gallery_projects"
  ON gallery_projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_projects" ON gallery_projects;
CREATE POLICY "auth_update_gallery_projects"
  ON gallery_projects FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_projects" ON gallery_projects;
CREATE POLICY "auth_delete_gallery_projects"
  ON gallery_projects FOR DELETE
  TO authenticated
  USING (true);

-- Gallery project media
CREATE TABLE IF NOT EXISTS gallery_project_media (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id int NOT NULL REFERENCES gallery_projects(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  thumbnail_url text,
  caption text DEFAULT '',
  order_index int NOT NULL DEFAULT 0
);

ALTER TABLE gallery_project_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_media" ON gallery_project_media;
CREATE POLICY "public_read_gallery_media"
  ON gallery_project_media FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_media" ON gallery_project_media;
CREATE POLICY "auth_insert_gallery_media"
  ON gallery_project_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_media" ON gallery_project_media;
CREATE POLICY "auth_update_gallery_media"
  ON gallery_project_media FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_media" ON gallery_project_media;
CREATE POLICY "auth_delete_gallery_media"
  ON gallery_project_media FOR DELETE
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gallery_projects_category ON gallery_projects(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_projects_featured ON gallery_projects(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_media_project ON gallery_project_media(project_id);

-- Storage policies: allow public read, authenticated write
DROP POLICY IF EXISTS "public_read_images_bucket" ON storage.objects;
CREATE POLICY "public_read_images_bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "auth_insert_images_bucket" ON storage.objects;
CREATE POLICY "auth_insert_images_bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "auth_update_images_bucket" ON storage.objects;
CREATE POLICY "auth_update_images_bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "auth_delete_images_bucket" ON storage.objects;
CREATE POLICY "auth_delete_images_bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');