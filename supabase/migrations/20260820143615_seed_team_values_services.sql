/*
# Seed team_members, site_values, services, and service_features

## Purpose
Populate the four new tables with realistic content so the full-featured
AboutPage and ServicesPage display rich content immediately.

## Data

### site_values (4 rows)
- Excellence, Commitment, Integrity, Impact

### services (5 rows)
- Videography, Photography, Events Management, Branding & Design, Content Creation

### service_features
- 4 features per service (20 rows total)

### team_members (2 rows)
- Patrick Turbarat (Managing Director)
- Shannon Ambu (Director / Operations Manager)

## Notes
- Uses ON CONFLICT DO NOTHING for idempotent re-runs.
- image_url paths reference the Supabase storage 'images' bucket.
*/

-- Seed site_values
INSERT INTO site_values (title, description, icon_name, display_order) VALUES
  ('Excellence', 'We strive for the highest quality in every project, delivering work that exceeds expectations and sets new standards.', 'Award', 1),
  ('Commitment', 'We are dedicated to our clients and their vision, ensuring every project receives our full attention and care.', 'Users', 2),
  ('Integrity', 'We operate with honesty and transparency, building trust through reliable communication and ethical practices.', 'Target', 3),
  ('Impact', 'We create content that resonates, telling stories that matter and making a lasting impression on audiences.', 'Zap', 4)
ON CONFLICT DO NOTHING;

-- Seed services
INSERT INTO services (slug, title, description, icon_name, image_url, display_order) VALUES
  ('videography', 'Videography', 'Professional video production for commercials, corporate videos, events, documentaries, and more. We bring stories to life with cinematic quality and expert editing.', 'Video', 'TWM3.jpg', 1),
  ('photography', 'Photography', 'Stunning photography for portraits, products, events, and commercial use. Every shot is crafted to capture the moment and tell your story.', 'Camera', 'BEACH.jpg', 2),
  ('events', 'Events Management', 'Full-service event planning and management for corporate and private events. From concept to execution, we handle every detail with precision.', 'Calendar', 'KUMULS.jpg', 3),
  ('branding', 'Branding & Design', 'Creative branding solutions including logo design, brand identity, and brand guidelines. We help you stand out with a cohesive and memorable visual identity.', 'PenTool', '6.png', 4),
  ('content', 'Content Creation', 'Engaging content creation for social media, websites, and marketing campaigns. We produce content that connects with your audience and drives results.', 'LayoutGrid', 'APEC.jpg', 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed service_features for videography
INSERT INTO service_features (service_id, feature)
SELECT s.id, f.feature FROM services s
CROSS JOIN (VALUES
  ('Creative concept and storyboard'),
  ('Professional cinematography'),
  ('Expert editing and post-production'),
  ('Multi-platform delivery')
) AS f(feature)
WHERE s.slug = 'videography'
ON CONFLICT DO NOTHING;

-- Seed service_features for photography
INSERT INTO service_features (service_id, feature)
SELECT s.id, f.feature FROM services s
CROSS JOIN (VALUES
  ('Portrait and product photography'),
  ('Event and commercial shoots'),
  ('Professional retouching'),
  ('High-resolution image delivery')
) AS f(feature)
WHERE s.slug = 'photography'
ON CONFLICT DO NOTHING;

-- Seed service_features for events
INSERT INTO service_features (service_id, feature)
SELECT s.id, f.feature FROM services s
CROSS JOIN (VALUES
  ('Event concept and planning'),
  ('Venue and logistics coordination'),
  ('On-the-day management'),
  ('Post-event evaluation')
) AS f(feature)
WHERE s.slug = 'events'
ON CONFLICT DO NOTHING;

-- Seed service_features for branding
INSERT INTO service_features (service_id, feature)
SELECT s.id, f.feature FROM services s
CROSS JOIN (VALUES
  ('Logo and visual identity design'),
  ('Brand guidelines development'),
  ('Marketing collateral design'),
  ('Digital and print assets')
) AS f(feature)
WHERE s.slug = 'branding'
ON CONFLICT DO NOTHING;

-- Seed service_features for content
INSERT INTO service_features (service_id, feature)
SELECT s.id, f.feature FROM services s
CROSS JOIN (VALUES
  ('Social media content strategy'),
  ('Video and photo content production'),
  ('Copywriting and caption creation'),
  ('Content scheduling and management')
) AS f(feature)
WHERE s.slug = 'content'
ON CONFLICT DO NOTHING;

-- Seed team_members
INSERT INTO team_members (name, role, bio, image_url, display_order, instagram_url, linkedin_url, facebook_url) VALUES
  ('Patrick Turbarat', 'Managing Director', 'Patrick serves as Managing Director, providing overall leadership and strategic direction for the company. He drives business growth, strengthens client relationships, and ensures that every project aligns with the company''s vision and standards. With a focus on innovation, performance, and long-term impact, Patrick leads the team in delivering high-quality multimedia experiences while positioning the company for sustained success.', '2026 Content/CWL_BTS_8.jpg', 1, 'https://www.instagram.com/mak3nii675/', 'https://www.linkedin.com/in/patrick-turbarat-083399211/?isSelfProfile=false', 'https://www.facebook.com/patrick.turbarat.9'),
  ('Shannon Ambu', 'Director / Operations Manager', 'Shannon serves as Director / Manager Operations, overseeing the company''s day-to-day operations and ensuring seamless project execution. He focuses on efficiency, coordination, and quality delivery, supporting the team in maintaining high standards across all work. Through strong leadership and operational oversight, Shannon plays a key role in driving performance and ensuring the consistent delivery of impactful multimedia experiences.', '2026 Content/CWL_BTS_8.jpg', 2, 'https://www.instagram.com/specsman_ambu/', 'https://www.linkedin.com/in/shannon-ambu-98a083282/', 'https://www.facebook.com/ambu.shannon')
ON CONFLICT DO NOTHING;
