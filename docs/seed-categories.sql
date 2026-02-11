-- docs/seed-categories.sql
-- Insert default categories for Mervason (Cameroon market)

-- Note: Run this in Supabase SQL Editor ONCE
-- Path: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Tu as oublier de mettre le icon_slug et attentions au doublons qui sont deja dans la bd

INSERT INTO categories (name, slug) VALUES
  ('Électronique', 'electronique'),
  ('Téléphones & Accessoires', 'telephones-accessoires'),
  ('Ordinateurs & Tablettes', 'ordinateurs-tablettes'),
  ('Mode & Vêtements', 'mode-vetements'),
  ('Chaussures', 'chaussures'),
  ('Sacs & Accessoires', 'sacs-accessoires'),
  ('Maison & Décoration', 'maison-decoration'),
  ('Meubles', 'meubles'),
  ('Cuisine & Électroménager', 'cuisine-electromenager'),
  ('Beauté & Santé', 'beaute-sante'),
  ('Cosmétiques', 'cosmetiques'),
  ('Parfums', 'parfums'),
  ('Sports & Loisirs', 'sports-loisirs'),
  ('Jeux & Jouets', 'jeux-jouets'),
  ('Livres & Éducation', 'livres-education'),
  ('Alimentation & Boissons', 'alimentation-boissons'),
  ('Automobile & Moto', 'automobile-moto'),
  ('Services', 'services')
ON CONFLICT (slug) DO NOTHING;

-- Verify insertion
SELECT id, name, slug FROM categories ORDER BY name;
