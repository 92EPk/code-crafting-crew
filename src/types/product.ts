// Product types with advanced options system
export interface ProductOption {
  id: string;
  type: 'bread' | 'sauce' | 'presentation' | 'meal_base' | 'pasta_sauce' | 'addon';
  name: { ar: string; en: string };
  price?: number; // additional price if any
  depends_on?: string; // option_type that this option depends on
  depends_on_value?: string; // specific value of the dependency
}

export interface ProductCategory {
  id: string;
  name: { ar: string; en: string };
  type: 'burger' | 'meat' | 'chicken' | 'dessert' | 'beverage';
  baseIncludes: { ar: string; en: string }; // what comes with the base dish
  requiredOptions: string[]; // option types that must be selected
  availableOptions: ProductOption[];
}

export interface Product {
  id: number;
  dbId?: string; // original UUID from database for reliable references
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  discountPrice?: number;
  image: string;
  categoryId: string;
  rating: number;
  prepTime: string;
  isSpicy: boolean;
  isOffer: boolean;
  customizations?: {
    allowCustomization: boolean;
    maxSelections?: number;
  };
}

export interface SelectedOptions {
  [optionType: string]: string; // optionType -> optionId
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: SelectedOptions;
  totalPrice: number; // base price + options
}

// Available product options data
export const PRODUCT_OPTIONS: { [key: string]: ProductOption[] } = {
  // Bread types
  bread: [
    { id: 'brioche', type: 'bread', name: { ar: 'عيش بريوش', en: 'Brioche Bread' } },
    { id: 'semolina', type: 'bread', name: { ar: 'عيش سيمولينا', en: 'Semolina Bread' } },
    { id: 'french', type: 'bread', name: { ar: 'عيش فرنساوي', en: 'French Bread' } },
    { id: 'lebanese', type: 'bread', name: { ar: 'عيش لبناني', en: 'Lebanese Bread' } },
    { id: 'syrian', type: 'bread', name: { ar: 'عيش سوري', en: 'Syrian Bread' } },
    { id: 'saj', type: 'bread', name: { ar: 'عيش صاج', en: 'Saj Bread' } }
  ],
  
  // Sauce types
  sauce: [
    { id: 'garlic', type: 'sauce', name: { ar: 'صوص ثوم', en: 'Garlic Sauce' } },
    { id: 'tahini', type: 'sauce', name: { ar: 'صوص طحينة', en: 'Tahini Sauce' } },
    { id: 'spicy', type: 'sauce', name: { ar: 'صوص حار', en: 'Spicy Sauce' } },
    { id: 'bbq', type: 'sauce', name: { ar: 'صوص باربكيو', en: 'BBQ Sauce' } },
    { id: 'cheese', type: 'sauce', name: { ar: 'صوص جبنة', en: 'Cheese Sauce' } }
  ],
  
  // Presentation options
  presentation: [
    { id: 'sandwich', type: 'presentation', name: { ar: 'ساندويتش', en: 'Sandwich' } },
    { id: 'meal', type: 'presentation', name: { ar: 'وجبة', en: 'Meal' } }
  ],
  
  // Meal base options (only for meals)
  meal_base: [
    { id: 'pasta', type: 'meal_base', name: { ar: 'مكرونة', en: 'Pasta' }, depends_on: 'presentation', depends_on_value: 'meal' },
    { id: 'rice', type: 'meal_base', name: { ar: 'أرز', en: 'Rice' }, depends_on: 'presentation', depends_on_value: 'meal' }
  ],

  // Pasta sauces (only for pasta meals)
  pasta_sauce: [
    { id: 'white', type: 'pasta_sauce', name: { ar: 'صوص أبيض', en: 'White Sauce' }, depends_on: 'meal_base', depends_on_value: 'pasta' },
    { id: 'red', type: 'pasta_sauce', name: { ar: 'صوص أحمر', en: 'Red Sauce' }, depends_on: 'meal_base', depends_on_value: 'pasta' }
  ]
};

// Product categories with their specific options
export const PRODUCT_CATEGORIES: { [key: string]: ProductCategory } = {
  burger: {
    id: 'burger',
    name: { ar: 'البرجر', en: 'Burgers' },
    type: 'burger',
    baseIncludes: { 
      ar: 'يُقدم مع البطاطس والطماطم والبصل والخص', 
      en: 'Served with fries, tomatoes, onions, and lettuce' 
    },
    requiredOptions: ['bread', 'sauce'],
    availableOptions: [...PRODUCT_OPTIONS.bread, ...PRODUCT_OPTIONS.sauce]
  },
  
  meat: {
    id: 'meat',
    name: { ar: 'اللحوم', en: 'Meat' },
    type: 'meat',
    baseIncludes: { 
      ar: 'يُقدم مع بطاطس ومخلل', 
      en: 'Served with fries and pickles' 
    },
    requiredOptions: ['presentation'],
    availableOptions: [...PRODUCT_OPTIONS.presentation, ...PRODUCT_OPTIONS.bread, ...PRODUCT_OPTIONS.meal_base, ...PRODUCT_OPTIONS.pasta_sauce]
  },
  
  chicken: {
    id: 'chicken',
    name: { ar: 'الفراخ', en: 'Chicken' },
    type: 'chicken',
    baseIncludes: { 
      ar: 'يُقدم مع بطاطس ومخلل', 
      en: 'Served with fries and pickles' 
    },
    requiredOptions: ['presentation'],
    availableOptions: [...PRODUCT_OPTIONS.presentation, ...PRODUCT_OPTIONS.bread, ...PRODUCT_OPTIONS.meal_base, ...PRODUCT_OPTIONS.pasta_sauce]
  }
};