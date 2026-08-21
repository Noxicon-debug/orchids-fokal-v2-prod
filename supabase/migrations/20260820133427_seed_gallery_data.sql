/*
# Seed gallery categories and projects

## Summary
Populates gallery_categories and gallery_projects with the existing content
shown on the site. Image paths reference files in the public `images` bucket.

## Data Inserted
- 5 categories: Videography, Photography, Events, Branding, Content Creation
- 4 featured projects matching the homepage showcase

## Notes
- Uses ON CONFLICT to be idempotent (safe to re-run)
- Image paths are relative to the `images` bucket root
*/

INSERT INTO gallery_categories (id, name, icon_name, display_order) VALUES
  ('videography', 'Videography', 'Video', 1),
  ('photography', 'Photography', 'Camera', 2),
  ('events', 'Events', 'Calendar', 3),
  ('branding', 'Branding', 'PenTool', 4),
  ('content', 'Content Creation', 'LayoutGrid', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO gallery_projects (title, category_id, client, year, description, image_url, featured, order_index)
VALUES
  ('Corporate Videos', 'videography', 'FOKAL Solutions', '2025', 'Professional corporate video production covering conferences, interviews, and promotional content.', 'TWM3.jpg', true, 1),
  ('Graduation Photoshoot', 'photography', 'FOKAL Solutions', '2025', 'Beautiful graduation photography capturing milestone moments with creativity and style.', 'GRAD5.jpg', true, 2),
  ('Sporting Events', 'events', 'Kumul Consolidated Holdings', '2025', 'Full event coverage for major sporting events including live production and post-production.', 'KUMULS.jpg', true, 3),
  ('Company Branding', 'branding', 'FOKAL Solutions', '2025', 'Complete brand identity development including logo design, brand guidelines, and visual systems.', '6.png', true, 4)
ON CONFLICT DO NOTHING;
