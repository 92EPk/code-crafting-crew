import { useState, useEffect } from 'react';
import { CustomizationOption } from '@/hooks/useDatabase';

export interface HierarchicalCustomizationHook {
  selectedOptions: Record<string, string>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  getVisibleOptions: (optionType: string, options: CustomizationOption[]) => CustomizationOption[];
  isValidSelection: (options: CustomizationOption[]) => boolean;
  handleOptionSelect: (optionType: string, optionId: string) => void;
  calculateAdditionalPrice: (options: CustomizationOption[]) => number;
}

/**
 * Hook for managing hierarchical customization options
 * Handles dependencies between options (e.g., meal -> pasta -> sauce)
 */
export const useHierarchicalCustomization = (): HierarchicalCustomizationHook => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionSelect = (optionType: string, optionId: string) => {
    setSelectedOptions(prev => {
      const newSelections = { ...prev, [optionType]: optionId };
      
      // Clear dependent selections when parent changes
      if (optionType === 'presentation') {
        // Clear meal_base and pasta_sauce when presentation changes
        delete newSelections.meal_base;
        delete newSelections.pasta_sauce;
        delete newSelections.bread;
      } else if (optionType === 'meal_base') {
        // Clear pasta_sauce when meal_base changes
        delete newSelections.pasta_sauce;
      }
      
      return newSelections;
    });
  };

  const getVisibleOptions = (optionType: string, options: CustomizationOption[]) => {
    return options.filter(option => {
      if (option.option_type !== optionType) return false;
      
      // Handle hierarchical dependencies
      switch (optionType) {
        case 'meal_base':
          return selectedOptions['presentation'] === 'meal';
        case 'pasta_sauce':
          return selectedOptions['meal_base'] === 'pasta';
        case 'bread':
          return selectedOptions['presentation'] === 'sandwich';
        default:
          return true;
      }
    });
  };

  const isValidSelection = (options: CustomizationOption[]): boolean => {
    const optionsByType = options.reduce((acc, option) => {
      if (!acc[option.option_type]) {
        acc[option.option_type] = [];
      }
      acc[option.option_type].push(option);
      return acc;
    }, {} as Record<string, CustomizationOption[]>);

    for (const [optionType, optionList] of Object.entries(optionsByType)) {
      const visibleOptions = getVisibleOptions(optionType, options);
      if (visibleOptions.length > 0 && optionList.some(opt => opt.is_required) && !selectedOptions[optionType]) {
        return false;
      }
    }

    // Additional validation for hierarchical requirements
    if (selectedOptions.presentation === 'meal' && !selectedOptions.meal_base) {
      return false;
    }
    
    if (selectedOptions.meal_base === 'pasta' && !selectedOptions.pasta_sauce) {
      return false;
    }
    
    if (selectedOptions.presentation === 'sandwich' && !selectedOptions.bread) {
      return false;
    }

    return true;
  };

  const calculateAdditionalPrice = (options: CustomizationOption[]): number => {
    let additionalPrice = 0;
    
    Object.values(selectedOptions).forEach(optionId => {
      const option = options.find(opt => opt.id === optionId);
      if (option?.price) {
        additionalPrice += option.price;
      }
    });

    return additionalPrice;
  };

  return {
    selectedOptions,
    setSelectedOptions,
    getVisibleOptions,
    isValidSelection,
    handleOptionSelect,
    calculateAdditionalPrice
  };
};

/**
 * Get display name for option types in both languages
 */
export const getOptionTypeNames = (optionType: string, language: 'ar' | 'en') => {
  const typeNames: Record<string, { ar: string; en: string }> = {
    bread: { ar: "نوع العيش", en: "Bread Type" },
    sauce: { ar: "نوع الصوص", en: "Sauce Type" },
    presentation: { ar: "طريقة التقديم", en: "Presentation" },
    meal_base: { ar: "نوع الوجبة", en: "Meal Type" },
    pasta_sauce: { ar: "صوص المكرونة", en: "Pasta Sauce" },
    addon: { ar: "إضافات", en: "Add-ons" },
    drink: { ar: "مشروبات", en: "Drinks" }
  };

  return typeNames[optionType] || { ar: optionType, en: optionType };
};
