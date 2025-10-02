-- إضافة حقل سعر التوصيل إلى جدول admin_settings
ALTER TABLE admin_settings 
ADD COLUMN IF NOT EXISTS delivery_fee numeric DEFAULT 0;