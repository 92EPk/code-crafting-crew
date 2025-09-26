import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Attribute, AttributeOption, MenuItemAttribute, AttributeDependency, DynamicCustomizationState } from '@/types/attributes';

interface DynamicCustomizationHook {
  customizationState: DynamicCustomizationState;
  availableAttributes: Attribute[];
  availableOptions: Record<string, AttributeOption[]>;
  handleOptionSelect: (attributeId: string, optionId: string) => void;
  resetCustomization: () => void;
  isValidSelection: boolean;
  totalPrice: number;
  loading: boolean;
}

/**
 * Hook for managing dynamic menu item customization with hierarchical dependencies
 */
export const useDynamicCustomization = (menuItemId: string, basePrice: number): DynamicCustomizationHook => {
  const [customizationState, setCustomizationState] = useState<DynamicCustomizationState>({
    selectedOptions: {},
    visibleAttributes: [],
    totalPriceAdjustment: 0,
  });

  const [menuItemAttributes, setMenuItemAttributes] = useState<MenuItemAttribute[]>([]);
  const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
  const [allOptions, setAllOptions] = useState<AttributeOption[]>([]);
  const [dependencies, setDependencies] = useState<AttributeDependency[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch menu item attributes
        const { data: itemAttributes, error: itemError } = await supabase
          .from('menu_item_attributes')
          .select(`
            *,
            attribute:attributes(*)
          `)
          .eq('menu_item_id', menuItemId);

        if (itemError) throw itemError;

        // Fetch all attributes
        const { data: attributes, error: attributesError } = await supabase
          .from('attributes')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (attributesError) throw attributesError;

        // Fetch all attribute options
        const { data: options, error: optionsError } = await supabase
          .from('attribute_options')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (optionsError) throw optionsError;

        // Fetch attribute dependencies
        const { data: deps, error: depsError } = await supabase
          .from('attribute_dependencies')
          .select(`
            *,
            parent_option:attribute_options!parent_option_id(*),
            child_attribute:attributes!child_attribute_id(*)
          `);

        if (depsError) throw depsError;

        setMenuItemAttributes(itemAttributes || []);
        setAllAttributes(attributes || []);
        setAllOptions(options || []);
        setDependencies(deps || []);

        // Initialize visible attributes with root level attributes (those directly linked to the menu item)
        const rootAttributes = itemAttributes?.map(item => item.attribute_id) || [];
        setCustomizationState(prev => ({
          ...prev,
          visibleAttributes: rootAttributes
        }));

      } catch (error) {
        console.error('Error fetching customization data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (menuItemId) {
      fetchData();
    }
  }, [menuItemId]);

  // Get currently available attributes based on selections and dependencies
  const availableAttributes = useMemo(() => {
    return allAttributes.filter(attr => 
      customizationState.visibleAttributes.includes(attr.id)
    );
  }, [allAttributes, customizationState.visibleAttributes]);

  // Get available options for each visible attribute
  const availableOptions = useMemo(() => {
    const optionsByAttribute: Record<string, AttributeOption[]> = {};
    
    availableAttributes.forEach(attribute => {
      optionsByAttribute[attribute.id] = allOptions.filter(
        option => option.attribute_id === attribute.id
      );
    });

    return optionsByAttribute;
  }, [availableAttributes, allOptions]);

  // Handle option selection and update visible attributes based on dependencies
  const handleOptionSelect = (attributeId: string, optionId: string) => {
    setCustomizationState(prev => {
      const newSelectedOptions = { ...prev.selectedOptions, [attributeId]: optionId };
      
      // Calculate new visible attributes based on dependencies
      const newVisibleAttributes = [...prev.visibleAttributes];
      
      // Find child attributes that should be shown based on this selection
      const childAttributes = dependencies
        .filter(dep => dep.parent_option_id === optionId)
        .map(dep => dep.child_attribute_id);
      
      // Add child attributes to visible list
      childAttributes.forEach(childId => {
        if (!newVisibleAttributes.includes(childId)) {
          newVisibleAttributes.push(childId);
        }
      });

      // Remove attributes that are no longer relevant
      // If we're changing a selection, remove attributes that were dependent on the old selection
      const oldOptionId = prev.selectedOptions[attributeId];
      if (oldOptionId && oldOptionId !== optionId) {
        const oldChildAttributes = dependencies
          .filter(dep => dep.parent_option_id === oldOptionId)
          .map(dep => dep.child_attribute_id);
        
        oldChildAttributes.forEach(oldChildId => {
          const index = newVisibleAttributes.indexOf(oldChildId);
          if (index > -1) {
            newVisibleAttributes.splice(index, 1);
          }
          // Also remove the selection for these attributes
          delete newSelectedOptions[oldChildId];
        });
      }

      // Calculate price adjustment
      const totalPriceAdjustment = Object.values(newSelectedOptions).reduce((total, optId) => {
        const option = allOptions.find(opt => opt.id === optId);
        return total + (option?.price_adjustment || 0);
      }, 0);

      return {
        selectedOptions: newSelectedOptions,
        visibleAttributes: newVisibleAttributes,
        totalPriceAdjustment,
      };
    });
  };

  // Reset customization to initial state
  const resetCustomization = () => {
    const rootAttributes = menuItemAttributes.map(item => item.attribute_id);
    setCustomizationState({
      selectedOptions: {},
      visibleAttributes: rootAttributes,
      totalPriceAdjustment: 0,
    });
  };

  // Check if all required attributes have been selected
  const isValidSelection = useMemo(() => {
    const requiredAttributes = menuItemAttributes.filter(item => item.is_required_for_item);
    
    return requiredAttributes.every(item => {
      const attributeId = item.attribute_id;
      const isVisible = customizationState.visibleAttributes.includes(attributeId);
      const isSelected = !!customizationState.selectedOptions[attributeId];
      
      // If attribute is visible, it must be selected
      return !isVisible || isSelected;
    });
  }, [menuItemAttributes, customizationState]);

  // Calculate total price
  const totalPrice = basePrice + customizationState.totalPriceAdjustment;

  return {
    customizationState,
    availableAttributes,
    availableOptions,
    handleOptionSelect,
    resetCustomization,
    isValidSelection,
    totalPrice,
    loading,
  };
};

/**
 * Helper function to get display name for attribute in the current language
 */
export const getAttributeDisplayName = (attribute: Attribute, language: 'ar' | 'en') => {
  return language === 'ar' ? attribute.name_ar : attribute.name_en;
};

/**
 * Helper function to get display name for attribute option in the current language
 */
export const getOptionDisplayName = (option: AttributeOption, language: 'ar' | 'en') => {
  return language === 'ar' ? option.name_ar : option.name_en;
};