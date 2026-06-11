-- ============================================================
-- PM Gifts Dashboard — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Tables

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for performance

CREATE INDEX IF NOT EXISTS sales_date_idx ON sales (sale_date);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_id);

-- 3. Row Level Security — open access via anon key (single-user app)

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON sales FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 4. Seed Data — Categories and Products
-- ============================================================

INSERT INTO categories (name) VALUES ('Stationery (Local)') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Gift Items') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Jewellery') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Cosmetics') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Cleaning Aids') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Kitchenware') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Bath & Towels') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Bedding & Throws') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Room Fragrance & Decor') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Underwear, Socks & Belts') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Bags') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Stationery (Foreign)') ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, price, category_id) SELECT '10A adventure on island', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '10B adventure at castle', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '12A the holiday camp mystery', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '1A Play with us', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '1B Look at this', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '1C read and write', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '2CI like to write', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '3A things we like', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '4B fun at the farm', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '4C say the sound', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '9C enjoying reading', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Snow white and seven dwarfs', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Telling the time', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'The big pancake', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'The gingerbread man', 46.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Note 1 exercise book', 6.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Correction pen', 5.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Fine glue', 6.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Graded pencil', 27.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Staple pin', 13.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Nataraj pencil', 18.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Nataraj maths set', 45.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Coloured maths set', 18.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stapler big size', 77.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stapler medium size', 35.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Mercury pencil', 16.8, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Invoice book carbonised', 15.6, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Receipt book carbonised', 13.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stick note pad', 7.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Artist brush', 7.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sellotape 100y', 15.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sellotape 200y', 30.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sellotape 400y', 48.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Note 3 book', 23.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'White envelop', 19.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Graph book', 12.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Maths set nataraj', 39.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Maths set marshal', 15.6, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Carbonised receipt book', 11.05, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Poster colour big size', 32.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Poster colour smaller size', 17.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sketch pad', 15.6, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Paper roll', 26.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Board marker', 33.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Permanent marker', 26.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Fine glue small size', 6.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stamp pad', 10.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'long ruler', 2.6, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Rubber band', 19.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Nataraj pen', 104.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Higlighter', 3.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Foolscap smaller size', 36.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Foolscap medium size', 43.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Foolscap big size', 77.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'sellotape small size', 10.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sellotape medium', 13.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sellotape large', 20.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Big pen', 117.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Manila card', 5.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sharpener', 60.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Brown', 3.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Exercise book', 130.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Teacher note', 35.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'White glue', 4.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Endorsing ink', 6.3, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stapler medium', 35.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Mercury eraser', 1.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Price tag', 2.8, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Invoice book', 16.8, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'A4 paper', 416.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Shorthand', 7.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Foolscap', 39.5, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Duster', 3.0, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Staper remover', 9.8, id FROM categories WHERE name = 'Stationery (Local)' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Birthday cards', 13.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Wrappers', 7.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gift bags', 10.5, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sparkling candle', 21.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Metallic balloon', 60.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Normal balloon', 40.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Normal balloon small', 12.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Tiara', 23.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gift wrapper', 8.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Balloon non glitter', 39.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Balloon glitter', 52.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Red small gift bag', 8.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gift bags big size', 13.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '2 packs of gift bag', 11.5, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '3 medium of gift bag', 10.5, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '1 pack of gift bag', 7.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Balloons', 56.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gift bag', 10.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Balloon', 35.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Birthday tiara', 40.0, id FROM categories WHERE name = 'Gift Items' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bracelet cross', 130.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bracelet adinkra and love', 105.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Braceket', 120.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bracelet', 100.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Locket', 25.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Necklace', 140.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Long Necklace with locket', 120.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Short necklace with locket', 110.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stud earring', 90.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Stone earring', 90.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Star earring', 80.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Interlock earrings', 70.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Peal earrings', 85.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Big stone earring', 95.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Small stud earrings', 45.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Big stud earrings', 95.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bangles', 130.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Big bracelet', 130.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Earring with stone', 100.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gold hooks earrings', 90.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Leaves earrings', 70.0, id FROM categories WHERE name = 'Jewellery' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Cetaphil cream', 562.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Cetaphil lotion', 562.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Cetaphil bar cleanser', 485.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Cetaphil cleanser', 562.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Amlactin lotion', 380.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Old spice', 309.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Old spice roll-on', 356.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gillette gel', 456.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Olay body wash', 408.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Dove roll-on', 434.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Degree ultra roll-on', 383.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Nutrius splash', 675.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Aveeno lotion', 230.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Guess gift set', 787.5, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Fancy love set', 945.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Degree deodorant for men', 385.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Dove deodorant', 406.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Vince Camuto parfum', 563.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Jennifer Lopez parfum', 1015.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'DKNY parfum', 787.5, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Garnier micellar cleansing', 250.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'EOS lip balm', 380.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'OGX body scrub and wash', 338.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bath and body works splashs', 150.0, id FROM categories WHERE name = 'Cosmetics' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Dawn powerwash', 333.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Tide oxipod', 643.5, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Palmolive dish wash', 255.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Lysol wipes', 340.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Dawn platium wash', 340.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Lysol spray pack', 408.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Fabuloso detergent', 265.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sweeper', 357.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Swiffer wet', 540.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Lysol sanitzer', 44.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Diffuser set', 528.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Clorox sanitzer', 427.5, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Lysol power clinging gel', 394.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Downy comfy', 340.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Clorox clean', 405.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Tide downy', 480.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Meyers dish wash', 360.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Pinesol 2x detergent', 383.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Tide oxipods', 608.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Downy unstopable fresh', 450.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Downy ultimate', 340.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Savon Bleu H+B hand washing soap', 340.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Lysol detergent', 270.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'fabuloso detergent', 270.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Clorox bleach', 450.0, id FROM categories WHERE name = 'Cleaning Aids' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Mason jar', 566.4, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Wine track', 489.6, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Ninja blast', 2040.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Kitchen towel', 325.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Dutch Oven', 1575.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Pogo water bottle', 340.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Ceramic cookware', 3150.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Gotham steel natural collection', 3150.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Snapware plastic', 500.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Paper holder', 450.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Titan lunch box', 450.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '6 steak knife', 417.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Keepcool bag', 270.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'T''fal 3 pieces', 924.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'AZ pro lunch box', 450.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Ladies lunch tote', 563.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Insulated shopper bag', 270.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '3pk frying pan', 680.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Modern ceramic jumbo', 878.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Ice chest', 1170.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Dish rack', 630.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Build a board', 450.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Pandex drinking glasses', 380.0, id FROM categories WHERE name = 'Kitchenware' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bath mat', 315.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Texture towel pink', 489.6, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Texture towel blue', 255.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Texture towel grey', 255.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Halo mirrior', 517.5, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'White Wash towel', 340.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'White Hand towel', 475.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'White bath towel', 610.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Poopourri', 495.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Laundry tote', 315.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Joseph toilet brush', 495.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Sam''s towel', 150.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Hotel premier floor mat', 360.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Purely indulgent floor mat', 380.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Cotton Memory foam bath mat', 360.0, id FROM categories WHERE name = 'Bath & Towels' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Blanket throw king size', 518.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Blanket throw queen size', 450.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'South point king size', 528.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'South point queen size', 444.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Wafle throw', 340.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'DKNY ladies nighty set', 383.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '6PC King sheets', 610.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '4PC Full sheet', 383.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '4PC Twin sheet', 383.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Down alternative queen blanket', 473.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Down alternative twin blanket', 383.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Down alternative king blanket', 563.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '700Cotton bedsheet', 1800.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Mastress protector', 675.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Serta pillow', 338.0, id FROM categories WHERE name = 'Bedding & Throws' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Diffuser set', 518.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'LED candle', 528.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Bath and body works candle', 350.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Airwick', 439.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Hour glass', 360.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Small clock', 540.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Candles', 518.0, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Febreze car', 247.5, id FROM categories WHERE name = 'Room Fragrance & Decor' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Puma boxer shorts', 385.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Puma ladies panty', 295.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Felina ladies panty', 338.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Addidas socks', 295.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'K Bell', 273.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Levi''s belt', 360.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Guess belt', 360.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT '32d cool tee', 230.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Felina bra', 485.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Reversible belt', 360.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Banana Republic tee 3pk', 225.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'CK bikini', 360.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Skechers socks', 248.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Felina panty', 450.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'CK briefs boxer', 360.0, id FROM categories WHERE name = 'Underwear, Socks & Belts' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Aldo bag', 1080.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Guess bag', 1020.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'DKYN black bag', 1080.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Blue madison west', 840.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Anne Klein black bag', 1080.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Steve Madden', 1080.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Steve Madden brown bag', 900.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Madison west green bag', 787.5, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Halston brown bag', 787.5, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Divina firenze brown bag', 1238.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Miztique brown bag', 900.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'La terre blue bag', 900.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Guess blue bag', 1080.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Miztique black bag', 675.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Rachel Zoe', 787.5, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Seven days bag', 1080.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Anne Klein beige purse', 450.0, id FROM categories WHERE name = 'Bags' ON CONFLICT DO NOTHING;
INSERT INTO products (name, price, category_id) SELECT 'Casio calculator', 337.5, id FROM categories WHERE name = 'Stationery (Foreign)' ON CONFLICT DO NOTHING;