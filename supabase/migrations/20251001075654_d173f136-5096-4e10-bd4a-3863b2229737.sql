-- تنظيف جدول menu_items من الأعمدة القديمة المكررة
-- حذف الأعمدة القديمة غير المستخدمة

ALTER TABLE public.menu_items 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS image;

-- التأكد من أن name_ar و name_en و description_ar و description_en غير nullable
ALTER TABLE public.menu_items 
ALTER COLUMN name_ar SET NOT NULL,
ALTER COLUMN name_en SET NOT NULL,
ALTER COLUMN description_ar SET DEFAULT ''::text,
ALTER COLUMN description_en SET DEFAULT ''::text;

-- إضافة constraint للتأكد من صحة البيانات
ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_price_check CHECK (price >= 0);

-- تفعيل realtime للجداول الأساسية
ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.special_offers REPLICA IDENTITY FULL;

-- إضافة الجداول إلى realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.special_offers;