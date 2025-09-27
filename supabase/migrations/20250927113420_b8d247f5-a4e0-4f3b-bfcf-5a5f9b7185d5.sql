-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for categories
CREATE POLICY "Enable all operations for categories" 
ON public.categories 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create special_offers table
CREATE TABLE IF NOT EXISTS public.special_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  discount_percentage NUMERIC,
  discount_amount NUMERIC,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- Create policy for special_offers
CREATE POLICY "Enable all operations for special_offers" 
ON public.special_offers 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  selected_options JSONB NOT NULL DEFAULT '{}',
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for order_items
CREATE POLICY "Enable all operations for order_items" 
ON public.order_items 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add category_id to menu_items and keep the existing category field
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS category_id UUID,
ADD COLUMN IF NOT EXISTS discount_price NUMERIC,
ADD COLUMN IF NOT EXISTS rating NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS prep_time TEXT NOT NULL DEFAULT '15 mins',
ADD COLUMN IF NOT EXISTS is_spicy BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_offer BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_customization BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS customization_options JSONB DEFAULT '[]';

-- Update menu_items to have proper field names
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS name_ar TEXT,
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Copy existing data to new columns if they don't have data
UPDATE public.menu_items 
SET name_ar = name WHERE name_ar IS NULL;

UPDATE public.menu_items 
SET name_en = name WHERE name_en IS NULL;

UPDATE public.menu_items 
SET description_ar = description WHERE description_ar IS NULL;

UPDATE public.menu_items 
SET description_en = description WHERE description_en IS NULL;

UPDATE public.menu_items 
SET image_url = image WHERE image_url IS NULL;

-- Add customer_address to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_address TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS total_amount NUMERIC,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Copy total to total_amount
UPDATE public.orders 
SET total_amount = total WHERE total_amount IS NULL;

-- Add triggers for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_special_offers_updated_at
BEFORE UPDATE ON public.special_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name_ar, name_en, sort_order) VALUES 
('المقبلات', 'Appetizers', 1),
('الأطباق الرئيسية', 'Main Dishes', 2),
('البيتزا', 'Pizza', 3),
('المعجنات', 'Pastries', 4),
('المشروبات', 'Beverages', 5),
('الحلويات', 'Desserts', 6)
ON CONFLICT DO NOTHING;