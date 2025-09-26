-- Delete all existing data in correct order (due to foreign key constraints)
DELETE FROM menu_items;
DELETE FROM customization_options;
DELETE FROM categories;

-- Insert basic restaurant categories
INSERT INTO categories (id, name_ar, name_en, description_ar, description_en, sort_order, is_active, image_url) VALUES 
('a1b2c3d4-e5f6-7890-abcd-123456789001', 'الأطباق الرئيسية', 'Main Dishes', 'أطباق اللحوم والدجاج المتنوعة', 'Variety of meat and chicken dishes', 1, true, '/placeholder.svg'),
('a1b2c3d4-e5f6-7890-abcd-123456789002', 'المقبلات', 'Appetizers', 'مقبلات شهية لبداية الوجبة', 'Delicious appetizers to start your meal', 2, true, '/placeholder.svg'),
('a1b2c3d4-e5f6-7890-abcd-123456789003', 'الساندويتشات', 'Sandwiches', 'ساندويتشات لذيذة ومتنوعة', 'Delicious and varied sandwiches', 3, true, '/placeholder.svg'),
('a1b2c3d4-e5f6-7890-abcd-123456789004', 'المشروبات', 'Beverages', 'مشروبات باردة وساخنة', 'Hot and cold beverages', 4, true, '/placeholder.svg'),
('a1b2c3d4-e5f6-7890-abcd-123456789005', 'الحلويات', 'Desserts', 'حلويات شهية ولذيذة', 'Delicious and tasty desserts', 5, true, '/placeholder.svg'),
('a1b2c3d4-e5f6-7890-abcd-123456789006', 'العروض الخاصة', 'Special Offers', 'عروض مميزة وتوفيرات رائعة', 'Special deals and great savings', 6, true, '/placeholder.svg');

-- Insert customization options for Main Dishes (hierarchical structure)
-- Presentation options (first level)
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111001', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'وجبة', 'Meal', 'presentation', 0, true, 1, true),
('11111111-1111-1111-1111-111111111002', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'ساندويتش', 'Sandwich', 'presentation', 0, true, 2, true);

-- Meal base options (second level - shown when presentation = meal)
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111003', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'مكرونة', 'Pasta', 'meal_base', 0, false, 1, true),
('11111111-1111-1111-1111-111111111004', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'أرز', 'Rice', 'meal_base', 0, false, 2, true);

-- Pasta sauce options (third level - shown when meal_base = pasta)
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111005', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'صوص أبيض', 'White Sauce', 'pasta_sauce', 0, false, 1, true),
('11111111-1111-1111-1111-111111111006', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'صوص أحمر', 'Red Sauce', 'pasta_sauce', 0, false, 2, true);

-- Bread options for main dishes (when sandwich is selected)
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111007', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'عيش شامي', 'Pita Bread', 'bread', 0, false, 1, true),
('11111111-1111-1111-1111-111111111008', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'عيش فينو', 'French Bread', 'bread', 0, false, 2, true),
('11111111-1111-1111-1111-111111111009', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'عيش برجر', 'Burger Bun', 'bread', 5, false, 3, true);

-- Sandwich customization options
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111010', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'عيش شامي', 'Pita Bread', 'bread', 0, true, 1, true),
('11111111-1111-1111-1111-111111111011', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'عيش فينو', 'French Bread', 'bread', 0, true, 2, true),
('11111111-1111-1111-1111-111111111012', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'عيش برجر', 'Burger Bun', 'bread', 5, true, 3, true);

-- Add-ons for main dishes and sandwiches
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111013', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'جبنة إضافية', 'Extra Cheese', 'addon', 10, false, 1, true),
('11111111-1111-1111-1111-111111111014', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'طحينة', 'Tahini', 'addon', 5, false, 2, true),
('11111111-1111-1111-1111-111111111015', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'جبنة إضافية', 'Extra Cheese', 'addon', 10, false, 1, true),
('11111111-1111-1111-1111-111111111016', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'طحينة', 'Tahini', 'addon', 5, false, 2, true);

-- Beverages options
INSERT INTO customization_options (id, category_id, name_ar, name_en, option_type, price, is_required, sort_order, is_active) VALUES 
('11111111-1111-1111-1111-111111111017', 'a1b2c3d4-e5f6-7890-abcd-123456789004', 'مشروب بارد', 'Cold Drink', 'drink', 0, false, 1, true),
('11111111-1111-1111-1111-111111111018', 'a1b2c3d4-e5f6-7890-abcd-123456789004', 'مشروب ساخن', 'Hot Drink', 'drink', 0, false, 2, true);

-- Sample menu items for testing
INSERT INTO menu_items (id, category_id, name_ar, name_en, description_ar, description_en, price, is_available, sort_order, allow_customization, is_featured) VALUES 
-- Main dishes
('22222222-2222-2222-2222-222222222001', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'دجاج مشوي', 'Grilled Chicken', 'دجاج طازج مشوي مع الخضروات', 'Fresh grilled chicken with vegetables', 45.00, true, 1, true, true),
('22222222-2222-2222-2222-222222222002', 'a1b2c3d4-e5f6-7890-abcd-123456789001', 'لحم مشوي', 'Grilled Meat', 'لحم بقري طازج مشوي', 'Fresh grilled beef', 65.00, true, 2, true, false),
-- Sandwiches  
('22222222-2222-2222-2222-222222222003', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'شاورما دجاج', 'Chicken Shawarma', 'شاورما دجاج طازجة مع الخضروات', 'Fresh chicken shawarma with vegetables', 25.00, true, 3, true, true),
('22222222-2222-2222-2222-222222222004', 'a1b2c3d4-e5f6-7890-abcd-123456789003', 'برجر لحم', 'Beef Burger', 'برجر لحم بقري مع الجبن', 'Beef burger with cheese', 35.00, true, 4, true, false),
-- Appetizers
('22222222-2222-2222-2222-222222222005', 'a1b2c3d4-e5f6-7890-abcd-123456789002', 'سلطة سيزر', 'Caesar Salad', 'سلطة سيزر كلاسيكية', 'Classic Caesar salad', 20.00, true, 5, false, false),
('22222222-2222-2222-2222-222222222006', 'a1b2c3d4-e5f6-7890-abcd-123456789002', 'حمص بالطحينة', 'Hummus with Tahini', 'حمص طازج بالطحينة', 'Fresh hummus with tahini', 15.00, true, 6, false, false),
-- Beverages
('22222222-2222-2222-2222-222222222007', 'a1b2c3d4-e5f6-7890-abcd-123456789004', 'عصير برتقال', 'Orange Juice', 'عصير برتقال طازج', 'Fresh orange juice', 12.00, true, 7, true, false),
-- Desserts
('22222222-2222-2222-2222-222222222008', 'a1b2c3d4-e5f6-7890-abcd-123456789005', 'كيك شوكولاتة', 'Chocolate Cake', 'كيك شوكولاتة لذيذة', 'Delicious chocolate cake', 18.00, true, 8, false, false);