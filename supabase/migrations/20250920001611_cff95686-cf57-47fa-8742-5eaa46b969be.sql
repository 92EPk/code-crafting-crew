-- First check what categories exist
SELECT id, name_en FROM categories ORDER BY sort_order;

-- Delete beverages and desserts categories and their related items
DELETE FROM menu_items WHERE category_id IN (
  SELECT id FROM categories WHERE name_en ILIKE '%beverage%' OR name_en ILIKE '%dessert%' OR name_en ILIKE '%drink%'
);

DELETE FROM categories WHERE name_en ILIKE '%beverage%' OR name_en ILIKE '%dessert%' OR name_en ILIKE '%drink%';

-- Get category IDs first
DO $$ 
DECLARE
    main_dishes_id uuid;
    appetizers_id uuid;
    sandwiches_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO main_dishes_id FROM categories WHERE name_en = 'Main Dishes' LIMIT 1;
    SELECT id INTO appetizers_id FROM categories WHERE name_en = 'Appetizers' LIMIT 1;
    SELECT id INTO sandwiches_id FROM categories WHERE name_en = 'Sandwiches' LIMIT 1;

    -- Insert menu items only if categories exist
    IF main_dishes_id IS NOT NULL THEN
        INSERT INTO menu_items (
          category_id, name_ar, name_en, description_ar, description_en, 
          price, image_url, prep_time, is_spicy, is_available, is_featured, sort_order, customization_options
        ) VALUES 
        -- Main Dishes - Burgers
        (main_dishes_id, 'برجر بيف كلاسيك', 'Classic Beef Burger', 
         'برجر لحم بقري طازج مع الخس والطماطم والجبن', 'Fresh beef patty with lettuce, tomato, and cheese',
         85.0, '/assets/burger-special.jpg', '15-20', false, true, true, 1,
         '[{"id":"1","name_ar":"عادي","name_en":"Regular","price":0,"type":"presentation"},{"id":"2","name_ar":"وجبة مع بطاطس","name_en":"Meal with Fries","price":25,"type":"meal_base"}]'::jsonb),

        (main_dishes_id, 'برجر دجاج حار', 'Spicy Chicken Burger', 
         'برجر دجاج محضر بالبهارات الحارة مع المايونيز الحار', 'Spicy seasoned chicken burger with hot mayo',
         75.0, '/assets/spicy-chicken.jpg', '12-15', true, true, false, 2,
         '[{"id":"1","name_ar":"عادي","name_en":"Regular","price":0,"type":"presentation"},{"id":"2","name_ar":"وجبة مع بطاطس","name_en":"Meal with Fries","price":25,"type":"meal_base"}]'::jsonb),

        -- Main Dishes - Beef
        (main_dishes_id, 'ستيك لحم بقري', 'Beef Steak', 
         'قطعة لحم بقري مشوية مع الخضار والأرز', 'Grilled beef steak served with vegetables and rice',
         150.0, NULL, '25-30', false, true, true, 3,
         '[{"id":"1","name_ar":"نادر","name_en":"Rare","price":0,"type":"presentation"},{"id":"2","name_ar":"متوسط","name_en":"Medium","price":0,"type":"presentation"},{"id":"3","name_ar":"مطبوخ جيداً","name_en":"Well Done","price":0,"type":"presentation"}]'::jsonb),

        -- Main Dishes - Chicken
        (main_dishes_id, 'دجاج مشوي', 'Grilled Chicken', 
         'نصف دجاجة مشوية مع البهارات الخاصة', 'Half grilled chicken with special spices',
         95.0, NULL, '20-25', false, true, false, 4,
         '[{"id":"1","name_ar":"عادي","name_en":"Regular","price":0,"type":"presentation"},{"id":"2","name_ar":"حار","name_en":"Spicy","price":5,"type":"presentation"}]'::jsonb),

        -- Main Dishes - Minced and Sausage
        (main_dishes_id, 'كفتة مشوية', 'Grilled Minced Meat', 
         'كفتة لحم مفروم مشوية مع الطحينة والسلطة', 'Grilled minced meat with tahini and salad',
         65.0, NULL, '15-18', false, true, false, 5,
         '[{"id":"1","name_ar":"مع أرز","name_en":"With Rice","price":10,"type":"meal_base"},{"id":"2","name_ar":"مع خبز","name_en":"With Bread","price":0,"type":"meal_base"}]'::jsonb),

        (main_dishes_id, 'سجق اسكندراني', 'Alexandrian Sausage', 
         'سجق لحم حار على الطريقة الاسكندرانية', 'Spicy meat sausage Alexandria style',
         55.0, NULL, '10-12', true, true, false, 6,
         '[{"id":"1","name_ar":"مع سلطة","name_en":"With Salad","price":15,"type":"addon"},{"id":"2","name_ar":"مع طحينة","name_en":"With Tahini","price":5,"type":"addon"}]'::jsonb),

        -- Main Dishes - Mix Menu
        (main_dishes_id, 'مشكل مشويات', 'Mixed Grill', 
         'تشكيلة من اللحوم المشوية (كباب، كفتة، فراخ)', 'Assorted grilled meats (kebab, kofta, chicken)',
         180.0, NULL, '25-30', false, true, true, 7,
         '[{"id":"1","name_ar":"للشخص الواحد","name_en":"Single Person","price":0,"type":"presentation"},{"id":"2","name_ar":"لشخصين","name_en":"For Two","price":120,"type":"presentation"}]'::jsonb);
    END IF;

    IF sandwiches_id IS NOT NULL THEN
        INSERT INTO menu_items (
          category_id, name_ar, name_en, description_ar, description_en, 
          price, prep_time, is_spicy, is_available, is_featured, sort_order, customization_options
        ) VALUES 
        (sandwiches_id, 'ساندويتش شاورما', 'Shawarma Sandwich', 
         'شاورما دجاج أو لحم مع الخضار والصوص', 'Chicken or beef shawarma with vegetables and sauce',
         35.0, '8-10', false, true, true, 8,
         '[{"id":"1","name_ar":"خبز عربي","name_en":"Arabic Bread","price":0,"type":"bread"},{"id":"2","name_ar":"خبز أفرنجي","name_en":"Regular Bread","price":5,"type":"bread"},{"id":"3","name_ar":"دجاج","name_en":"Chicken","price":0,"type":"meal_base"},{"id":"4","name_ar":"لحم","name_en":"Beef","price":10,"type":"meal_base"}]'::jsonb);
    END IF;

    IF appetizers_id IS NOT NULL THEN
        INSERT INTO menu_items (
          category_id, name_ar, name_en, description_ar, description_en, 
          price, prep_time, is_spicy, is_available, is_featured, sort_order, customization_options
        ) VALUES 
        (appetizers_id, 'بطاطس مقلية', 'French Fries', 
         'بطاطس مقطعة ومقلية ذهبية اللون', 'Golden fried potato strips',
         25.0, '5-8', false, true, false, 9,
         '[{"id":"1","name_ar":"عادي","name_en":"Regular","price":0,"type":"presentation"},{"id":"2","name_ar":"مع جبن","name_en":"With Cheese","price":15,"type":"addon"},{"id":"3","name_ar":"حار","name_en":"Spicy","price":5,"type":"addon"}]'::jsonb),

        (appetizers_id, 'بطاطس ودجز', 'Potato Wedges', 
         'قطع بطاطس كبيرة محضرة بالفرن مع البهارات', 'Large potato wedges baked with spices',
         30.0, '8-10', false, true, false, 10,
         '[{"id":"1","name_ar":"مع صوص الثوم","name_en":"With Garlic Sauce","price":5,"type":"addon"},{"id":"2","name_ar":"مع كاتشب","name_en":"With Ketchup","price":0,"type":"addon"}]'::jsonb);
    END IF;

END $$;