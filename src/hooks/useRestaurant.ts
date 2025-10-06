import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  SimpleCategory, 
  SimpleMenuItem, 
  SimpleOffer, 
  SimpleOrder,
  CustomizationOption
} from '@/types/restaurant';

// Single simplified hook for all restaurant data management
export const useRestaurant = () => {
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [menuItems, setMenuItems] = useState<SimpleMenuItem[]>([]);
  const [offers, setOffers] = useState<SimpleOffer[]>([]);
  const [orders, setOrders] = useState<SimpleOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== CATEGORIES =====
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Error loading categories: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: Partial<SimpleCategory>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData as any)
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data as SimpleCategory]);
      toast.success('Category added successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error adding category: ' + error.message);
      return { data: null, error };
    }
  };

  const updateCategory = async (id: string, updates: Partial<SimpleCategory>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...data } : cat));
      toast.success('Category updated successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error updating category: ' + error.message);
      return { data: null, error };
    }
  };

  const deleteCategory = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this category? This will also delete all menu items in this category.');
    if (!confirmed) return { error: null };

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
      return { error: null };
    } catch (error: any) {
      toast.error('Error deleting category: ' + error.message);
      return { error };
    }
  };

  // ===== MENU ITEMS =====
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      const menuItemsWithCategoryInfo = (data || []).map(item => ({
        ...item,
        category_info: {
          name_ar: '',
          name_en: '',
          description_ar: '',
          description_en: '',
        },
        customization_options: []
      }));

      setMenuItems(menuItemsWithCategoryInfo);
    } catch (error: any) {
      toast.error('Error loading menu items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (itemData: Partial<SimpleMenuItem>) => {
    try {
      // Update category_info from the current category
      const category = categories.find(c => c.id === itemData.category_id);
      const finalData = {
        ...itemData,
        category_info: category ? {
          name_ar: category.name_ar,
          name_en: category.name_en,
          description_ar: category.description_ar,
          description_en: category.description_en,
        } : {},
        customization_options: itemData.customization_options || []
      };

      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          ...finalData,
          customization_options: JSON.stringify(finalData.customization_options || [])
        } as any)
        .select()
        .single();

      if (error) throw error;
      
      const transformedData: SimpleMenuItem = {
        ...data,
        allow_customization: data.allow_customization || false,
        customization_options: Array.isArray(data.customization_options) 
          ? data.customization_options as unknown as CustomizationOption[]
          : [],
        category_info: {
          name_ar: category?.name_ar || '',
          name_en: category?.name_en || '',
          description_ar: category?.description_ar || '',
          description_en: category?.description_en || '',
        }
      };
      
      setMenuItems(prev => [...prev, transformedData]);
      toast.success('Menu item added successfully');
      return { data: transformedData, error: null };
    } catch (error: any) {
      toast.error('Error adding menu item: ' + error.message);
      return { data: null, error };
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<SimpleMenuItem>) => {
    try {
      // Direct update since RPC might not be available yet
      const { data: updateData, error: updateError } = await supabase
        .from('menu_items')
        .update({
          ...updates,
          customization_options: JSON.stringify(updates.customization_options || [])
        } as any)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      const menuItemWithCategoryInfo = {
        ...updateData,
        category_info: {
          name_ar: '',
          name_en: '',
          description_ar: '',
          description_en: '',
        },
        customization_options: []
      };

      setMenuItems(prev => 
        prev.map(item => 
          item.id === id ? menuItemWithCategoryInfo : item
        )
      );
      
      toast.success('Menu item updated successfully');
      return { data: menuItemWithCategoryInfo, error: null };
    } catch (error: any) {
      toast.error('Error updating menu item: ' + error.message);
      return { data: null, error };
    }
  };

  const deleteMenuItem = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this menu item?');
    if (!confirmed) return { error: null };

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menu item deleted successfully');
      return { error: null };
    } catch (error: any) {
      toast.error('Error deleting menu item: ' + error.message);
      return { error };
    }
  };

  // ===== OFFERS =====
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setOffers(data || []);
    } catch (error: any) {
      toast.error('Error loading offers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async (offerData: Partial<SimpleOffer>) => {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .insert(offerData as any)
        .select()
        .single();

      if (error) throw error;
      setOffers(prev => [...prev, data as SimpleOffer]);
      toast.success('Offer added successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error adding offer: ' + error.message);
      return { data: null, error };
    }
  };

  const updateOffer = async (id: string, updates: Partial<SimpleOffer>) => {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOffers(prev => prev.map(offer => offer.id === id ? { ...offer, ...data } : offer));
      toast.success('Offer updated successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error updating offer: ' + error.message);
      return { data: null, error };
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('special_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOffers(prev => prev.filter(offer => offer.id !== id));
      toast.success('Offer deleted successfully');
      return { error: null };
    } catch (error: any) {
      toast.error('Error deleting offer: ' + error.message);
      return { error };
    }
  };

  // ===== ORDERS =====
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            menu_items(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match SimpleOrder type
      const transformedOrders = (data || []).map(order => ({
        ...order,
        order_items: order.order_items?.map((item: any) => ({
          ...item,
          menu_item: item.menu_items // Rename menu_items to menu_item
        }))
      }));
      
      setOrders(transformedOrders as SimpleOrder[] || []);
    } catch (error: any) {
      toast.error('Error loading orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: SimpleOrder['status']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
      toast.success('Order status updated successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error updating order status: ' + error.message);
      return { data: null, error };
    }
  };

  // ===== INITIALIZATION =====
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchOffers();
    fetchOrders();
  }, []);

  return {
    // Data
    categories,
    menuItems,
    offers,
    orders,
    loading,

    // Category methods
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,

    // Menu item methods
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,

    // Offer methods
    fetchOffers,
    addOffer,
    updateOffer,
    deleteOffer,

    // Order methods
    fetchOrders,
    updateOrderStatus,
  };
};