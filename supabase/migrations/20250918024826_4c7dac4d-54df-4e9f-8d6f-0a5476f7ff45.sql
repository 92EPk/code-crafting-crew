-- Add new meal and sauce options for hierarchical customization
-- Remove old pasta_sauce options and add new hierarchical structure

-- Add meal base options (pasta or rice)
INSERT INTO customization_options (category_id, option_type, name_ar, name_en, price, is_active, is_required, sort_order) 
SELECT 
  c.id as category_id,
  'meal_base' as option_type,
  'مكرونة' as name_ar,
  'Pasta' as name_en,
  0 as price,
  true as is_active,
  false as is_required,
  1 as sort_order
FROM categories c 
WHERE c.name_en IN ('Meat', 'Chicken') OR c.name_ar IN ('اللحوم', 'الفراخ');

INSERT INTO customization_options (category_id, option_type, name_ar, name_en, price, is_active, is_required, sort_order) 
SELECT 
  c.id as category_id,
  'meal_base' as option_type,
  'أرز' as name_ar,
  'Rice' as name_en,
  0 as price,
  true as is_active,
  false as is_required,
  2 as sort_order
FROM categories c 
WHERE c.name_en IN ('Meat', 'Chicken') OR c.name_ar IN ('اللحوم', 'الفراخ');

-- Add pasta sauce options (white or red) - these will show only when pasta is selected
INSERT INTO customization_options (category_id, option_type, name_ar, name_en, price, is_active, is_required, sort_order) 
SELECT 
  c.id as category_id,
  'pasta_sauce' as option_type,
  'صوص أبيض' as name_ar,
  'White Sauce' as name_en,
  0 as price,
  true as is_active,
  false as is_required,
  1 as sort_order
FROM categories c 
WHERE c.name_en IN ('Meat', 'Chicken') OR c.name_ar IN ('اللحوم', 'الفراخ');

INSERT INTO customization_options (category_id, option_type, name_ar, name_en, price, is_active, is_required, sort_order) 
SELECT 
  c.id as category_id,
  'pasta_sauce' as option_type,
  'صوص أحمر' as name_ar,
  'Red Sauce' as name_en,
  0 as price,
  true as is_active,
  false as is_required,
  2 as sort_order
FROM categories c 
WHERE c.name_en IN ('Meat', 'Chicken') OR c.name_ar IN ('اللحوم', 'الفراخ');

-- Remove any existing size options as they are not needed
DELETE FROM customization_options WHERE option_type = 'size';

-- Update existing presentation options to be more clear
UPDATE customization_options 
SET name_ar = 'ساندويتش', name_en = 'Sandwich' 
WHERE option_type = 'presentation' AND (name_en LIKE '%sandwich%' OR name_ar LIKE '%ساندويتش%');

UPDATE customization_options 
SET name_ar = 'وجبة', name_en = 'Meal' 
WHERE option_type = 'presentation' AND (name_en LIKE '%meal%' OR name_ar LIKE '%وجبة%');