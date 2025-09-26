// Types for the dynamic menu attribute system

export interface Attribute {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  attribute_type: string; // serving_type, sauce_type, bread_type, etc.
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AttributeOption {
  id: string;
  attribute_id: string;
  name_ar: string;
  name_en: string;
  price_adjustment: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  attribute?: Attribute;
}

export interface MenuItemAttribute {
  id: string;
  menu_item_id: string;
  attribute_id: string;
  is_required_for_item: boolean;
  created_at: string;
  attribute?: Attribute;
}

export interface AttributeDependency {
  id: string;
  parent_option_id: string;
  child_attribute_id: string;
  created_at: string;
  parent_option?: AttributeOption;
  child_attribute?: Attribute;
}

// For dynamic customization state management
export interface DynamicCustomizationState {
  selectedOptions: Record<string, string>; // attribute_id -> option_id
  visibleAttributes: string[]; // attribute_ids that should be shown
  totalPriceAdjustment: number;
}

// Extended menu item type with dynamic attributes
export interface DynamicMenuItem {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  price: number;
  image?: string;
  category: string;
  attributes: MenuItemAttribute[];
  hasCustomization: boolean;
}