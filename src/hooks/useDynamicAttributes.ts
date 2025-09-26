import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Attribute, AttributeOption, MenuItemAttribute, AttributeDependency } from '@/types/attributes';

// Hook for managing attributes
export const useAttributes = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attributes')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setAttributes(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading attributes';
      setError(message);
      console.error('Error fetching attributes:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAttribute = async (attributeData: Omit<Attribute, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('attributes')
        .insert(attributeData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Attribute Added",
        description: "New attribute has been added successfully",
      });
      
      await fetchAttributes();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding attribute';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateAttribute = async (id: string, updates: Partial<Attribute>) => {
    try {
      const { data, error } = await supabase
        .from('attributes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Attribute Updated",
        description: "Attribute has been updated successfully",
      });
      
      await fetchAttributes();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating attribute';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteAttribute = async (id: string) => {
    try {
      const { error } = await supabase
        .from('attributes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Attribute Deleted",
        description: "Attribute has been deleted successfully",
      });
      
      await fetchAttributes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting attribute';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  return {
    attributes,
    loading,
    error,
    fetchAttributes,
    addAttribute,
    updateAttribute,
    deleteAttribute,
  };
};

// Hook for managing attribute options
export const useAttributeOptions = (attributeId?: string) => {
  const [attributeOptions, setAttributeOptions] = useState<AttributeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAttributeOptions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('attribute_options')
        .select(`
          *,
          attribute:attributes(*)
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (attributeId) {
        query = query.eq('attribute_id', attributeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAttributeOptions(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading attribute options';
      setError(message);
      console.error('Error fetching attribute options:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAttributeOption = async (optionData: Omit<AttributeOption, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('attribute_options')
        .insert(optionData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Option Added",
        description: "New attribute option has been added successfully",
      });
      
      await fetchAttributeOptions();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding attribute option';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateAttributeOption = async (id: string, updates: Partial<AttributeOption>) => {
    try {
      const { data, error } = await supabase
        .from('attribute_options')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Option Updated",
        description: "Attribute option has been updated successfully",
      });
      
      await fetchAttributeOptions();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating attribute option';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteAttributeOption = async (id: string) => {
    try {
      const { error } = await supabase
        .from('attribute_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Option Deleted",
        description: "Attribute option has been deleted successfully",
      });
      
      await fetchAttributeOptions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting attribute option';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAttributeOptions();
  }, [attributeId]);

  return {
    attributeOptions,
    loading,
    error,
    fetchAttributeOptions,
    addAttributeOption,
    updateAttributeOption,
    deleteAttributeOption,
  };
};

// Hook for managing menu item attributes
export const useMenuItemAttributes = (menuItemId?: string) => {
  const [menuItemAttributes, setMenuItemAttributes] = useState<MenuItemAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenuItemAttributes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('menu_item_attributes')
        .select(`
          *,
          attribute:attributes(*)
        `)
        .order('created_at');

      if (menuItemId) {
        query = query.eq('menu_item_id', menuItemId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMenuItemAttributes(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading menu item attributes';
      setError(message);
      console.error('Error fetching menu item attributes:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItemAttribute = async (data: Omit<MenuItemAttribute, 'id' | 'created_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('menu_item_attributes')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Attribute Linked",
        description: "Attribute has been linked to menu item successfully",
      });
      
      await fetchMenuItemAttributes();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error linking attribute to menu item';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeMenuItemAttribute = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_item_attributes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Attribute Unlinked",
        description: "Attribute has been unlinked from menu item successfully",
      });
      
      await fetchMenuItemAttributes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error unlinking attribute from menu item';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchMenuItemAttributes();
  }, [menuItemId]);

  return {
    menuItemAttributes,
    loading,
    error,
    fetchMenuItemAttributes,
    addMenuItemAttribute,
    removeMenuItemAttribute,
  };
};

// Hook for managing attribute dependencies
export const useAttributeDependencies = () => {
  const [dependencies, setDependencies] = useState<AttributeDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDependencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attribute_dependencies')
        .select(`
          *,
          parent_option:attribute_options!parent_option_id(*),
          child_attribute:attributes!child_attribute_id(*)
        `)
        .order('created_at');

      if (error) throw error;
      setDependencies(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading attribute dependencies';
      setError(message);
      console.error('Error fetching attribute dependencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDependency = async (data: Omit<AttributeDependency, 'id' | 'created_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('attribute_dependencies')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Dependency Added",
        description: "Attribute dependency has been added successfully",
      });
      
      await fetchDependencies();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding attribute dependency';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeDependency = async (id: string) => {
    try {
      const { error } = await supabase
        .from('attribute_dependencies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Dependency Removed",
        description: "Attribute dependency has been removed successfully",
      });
      
      await fetchDependencies();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error removing attribute dependency';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  return {
    dependencies,
    loading,
    error,
    fetchDependencies,
    addDependency,
    removeDependency,
  };
};