-- Create attributes table for dynamic menu system
CREATE TABLE public.attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  attribute_type TEXT NOT NULL, -- serving_type, sauce_type, bread_type, etc.
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attribute_options table
CREATE TABLE public.attribute_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price_adjustment NUMERIC DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_item_attributes table to link products with attributes
CREATE TABLE public.menu_item_attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  is_required_for_item BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(menu_item_id, attribute_id)
);

-- Create attribute_dependencies table for hierarchical options
CREATE TABLE public.attribute_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_option_id UUID NOT NULL REFERENCES public.attribute_options(id) ON DELETE CASCADE,
  child_attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_option_id, child_attribute_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_options ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.menu_item_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_dependencies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (restaurant menu is public)
CREATE POLICY "Enable all operations for attributes" ON public.attributes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for attribute_options" ON public.attribute_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for menu_item_attributes" ON public.menu_item_attributes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for attribute_dependencies" ON public.attribute_dependencies FOR ALL USING (true) WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_attributes_updated_at BEFORE UPDATE ON public.attributes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attribute_options_updated_at BEFORE UPDATE ON public.attribute_options FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.attributes (name_ar, name_en, attribute_type, is_required, sort_order) VALUES
('طريقة التقديم', 'Serving Type', 'serving_type', true, 1),
('نوع الصوص', 'Sauce Type', 'sauce_type', true, 2),
('نوع الخبز', 'Bread Type', 'bread_type', true, 3),
('الإضافات', 'Add-ons', 'addons', false, 4);

-- Insert sample attribute options
INSERT INTO public.attribute_options (attribute_id, name_ar, name_en, price_adjustment, sort_order) VALUES
-- Serving type options
((SELECT id FROM public.attributes WHERE attribute_type = 'serving_type'), 'مكرونة', 'Pasta', 0, 1),
((SELECT id FROM public.attributes WHERE attribute_type = 'serving_type'), 'رز', 'Rice', 0, 2),
((SELECT id FROM public.attributes WHERE attribute_type = 'serving_type'), 'ساندوتش', 'Sandwich', 5, 3),

-- Sauce type options
((SELECT id FROM public.attributes WHERE attribute_type = 'sauce_type'), 'صوص أبيض', 'White Sauce', 0, 1),
((SELECT id FROM public.attributes WHERE attribute_type = 'sauce_type'), 'صوص أحمر', 'Red Sauce', 0, 2),
((SELECT id FROM public.attributes WHERE attribute_type = 'sauce_type'), 'صوص باربكيو', 'BBQ Sauce', 3, 3),

-- Bread type options
((SELECT id FROM public.attributes WHERE attribute_type = 'bread_type'), 'عيش بريوش', 'Brioche Bread', 2, 1),
((SELECT id FROM public.attributes WHERE attribute_type = 'bread_type'), 'عيش فرنساوي', 'French Bread', 0, 2),
((SELECT id FROM public.attributes WHERE attribute_type = 'bread_type'), 'توست', 'Toast', 1, 3),

-- Add-ons options
((SELECT id FROM public.attributes WHERE attribute_type = 'addons'), 'جبنة إضافية', 'Extra Cheese', 5, 1),
((SELECT id FROM public.attributes WHERE attribute_type = 'addons'), 'فراخ إضافية', 'Extra Chicken', 15, 2),
((SELECT id FROM public.attributes WHERE attribute_type = 'addons'), 'خضروات', 'Vegetables', 3, 3);

-- Insert attribute dependencies (pasta -> sauce, sandwich -> bread)
INSERT INTO public.attribute_dependencies (parent_option_id, child_attribute_id) VALUES
-- When pasta is selected, show sauce options
((SELECT id FROM public.attribute_options WHERE name_en = 'Pasta'), (SELECT id FROM public.attributes WHERE attribute_type = 'sauce_type')),
-- When sandwich is selected, show bread options  
((SELECT id FROM public.attribute_options WHERE name_en = 'Sandwich'), (SELECT id FROM public.attributes WHERE attribute_type = 'bread_type'));