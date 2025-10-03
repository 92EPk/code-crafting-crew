import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenuItems, useCategories } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Package, Settings, Star, Eye, Layers } from 'lucide-react';
import { toast } from 'sonner';
import ProductAttributesDialog from '@/components/admin/ProductAttributesDialog';

interface ProductForm {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  discount_price?: number;
  category_id: string;
  image_url: string;
  prep_time: string;
  is_spicy: boolean;
  is_offer: boolean;
  is_available: boolean;
  is_featured: boolean;
  allow_customization: boolean;
  rating: number;
}

const ProductManagement = () => {
  const { language, isRTL } = useLanguage();
  const { menuItems, loading, fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const { categories, fetchCategories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAttributesDialogOpen, setIsAttributesDialogOpen] = useState(false);
  const [selectedProductForAttributes, setSelectedProductForAttributes] = useState<any>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    discount_price: undefined,
    category_id: '',
    image_url: '',
    prep_time: '15-20',
    is_spicy: false,
    is_offer: false,
    is_available: true,
    is_featured: false,
    allow_customization: false,
    rating: 4.5
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      price: 0,
      discount_price: undefined,
      category_id: '',
      image_url: '',
      prep_time: '15-20',
      is_spicy: false,
      is_offer: false,
      is_available: true,
      is_featured: false,
      allow_customization: false,
      rating: 4.5
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name_ar: product.name_ar || '',
      name_en: product.name_en || '',
      description_ar: product.description_ar || '',
      description_en: product.description_en || '',
      price: product.price || 0,
      discount_price: product.discount_price,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      prep_time: product.prep_time || '15-20',
      is_spicy: product.is_spicy || false,
      is_offer: product.is_offer || false,
      is_available: product.is_available !== undefined ? product.is_available : true,
      is_featured: product.is_featured || false,
      allow_customization: product.allow_customization || false,
      rating: product.rating || 4.5
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name_ar || !formData.name_en || !formData.category_id || formData.price <= 0) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingProduct) {
        await updateMenuItem(editingProduct.id, formData);
        toast.success(language === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
      } else {
        await addMenuItem({ 
          ...formData, 
          sort_order: menuItems.length 
        });
        toast.success(language === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product added successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuItem(id);
      toast.success(language === 'ar' ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleManageAttributes = (product: any) => {
    setSelectedProductForAttributes(product);
    setIsAttributesDialogOpen(true);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === selectedCategory);

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
          </h1>
          <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة منتجات المطعم والوجبات' : 'Manage restaurant products and meals'}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className={isRTL ? 'font-arabic' : ''}>
                {editingProduct 
                  ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product')
                  : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')
                }
              </DialogTitle>
              <DialogDescription className={isRTL ? 'font-arabic' : ''}>
                {language === 'ar' 
                  ? 'املأ المعلومات التالية لإضافة أو تعديل المنتج'
                  : 'Fill in the information below to add or edit a product'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'الاسم بالعربية *' : 'Arabic Name *'}
                    </Label>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل الاسم بالعربية' : 'Enter Arabic name'}
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'الاسم بالإنجليزية *' : 'English Name *'}
                    </Label>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل الاسم بالإنجليزية' : 'Enter English name'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={isRTL ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'الصنف *' : 'Category *'}
                  </Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الصنف' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {language === 'ar' ? category.name_ar : category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'السعر *' : 'Price *'}
                    </Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder={language === 'ar' ? 'السعر' : 'Price'}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'سعر الخصم' : 'Discount Price'}
                    </Label>
                    <Input
                      type="number"
                      value={formData.discount_price || ''}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder={language === 'ar' ? 'سعر الخصم' : 'Discount price'}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'وقت التحضير' : 'Prep Time'}
                    </Label>
                    <Select value={formData.prep_time} onValueChange={(value) => setFormData({ ...formData, prep_time: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">{language === 'ar' ? '5-10 دقائق' : '5-10 mins'}</SelectItem>
                        <SelectItem value="10-15">{language === 'ar' ? '10-15 دقيقة' : '10-15 mins'}</SelectItem>
                        <SelectItem value="15-20">{language === 'ar' ? '15-20 دقيقة' : '15-20 mins'}</SelectItem>
                        <SelectItem value="20-30">{language === 'ar' ? '20-30 دقيقة' : '20-30 mins'}</SelectItem>
                        <SelectItem value="30+">{language === 'ar' ? 'أكثر من 30 دقيقة' : '30+ mins'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
                    </Label>
                    <Textarea
                      value={formData.description_ar}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل الوصف بالعربية' : 'Enter Arabic description'}
                      dir="rtl"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'الوصف بالإنجليزية' : 'English Description'}
                    </Label>
                    <Textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل الوصف بالإنجليزية' : 'Enter English description'}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={isRTL ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                  </Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل رابط الصورة' : 'Enter image URL'}
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'الإعدادات' : 'Settings'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                    />
                    <Label htmlFor="is_available" className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'متوفر' : 'Available'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured" className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'مميز' : 'Featured'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_spicy"
                      checked={formData.is_spicy}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_spicy: checked })}
                    />
                    <Label htmlFor="is_spicy" className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'حار' : 'Spicy'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_offer"
                      checked={formData.is_offer}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_offer: checked })}
                    />
                    <Label htmlFor="is_offer" className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'عرض خاص' : 'Special Offer'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 col-span-2">
                    <Switch
                      id="allow_customization"
                      checked={formData.allow_customization}
                      onCheckedChange={(checked) => setFormData({ ...formData, allow_customization: checked })}
                    />
                    <Label htmlFor="allow_customization" className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'يسمح بالتخصيص' : 'Allow Customization'}
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSubmit}>
                {editingProduct 
                  ? (language === 'ar' ? 'تحديث' : 'Update')
                  : (language === 'ar' ? 'إضافة' : 'Add')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label className={isRTL ? 'font-arabic' : ''}>
          {language === 'ar' ? 'تصفية حسب الصنف:' : 'Filter by category:'}
        </Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع الأصناف' : 'All Categories'}
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {language === 'ar' ? category.name_ar : category.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'لا توجد منتجات' : 'No Products'}
            </h3>
            <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'ابدأ بإضافة منتج جديد' : 'Start by adding a new product'}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className={`text-lg ${isRTL ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? product.name_ar : product.name_en}
                  </CardTitle>
                  <div className="flex gap-1">
                    {product.is_featured && <Badge variant="secondary"><Star className="w-3 h-3" /></Badge>}
                    {!product.is_available && <Badge variant="destructive">{language === 'ar' ? 'غير متوفر' : 'Unavailable'}</Badge>}
                    {product.is_offer && <Badge variant="default">{language === 'ar' ? 'عرض' : 'Offer'}</Badge>}
                    {product.allow_customization && <Badge variant="outline"><Settings className="w-3 h-3" /></Badge>}
                  </div>
                </div>
                {product.image_url && (
                  <div className="w-full h-32 bg-muted rounded-md overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={language === 'ar' ? product.name_ar : product.name_en}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CardDescription className={`${isRTL ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? product.description_ar : product.description_en}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">{product.price} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                      {product.discount_price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {product.discount_price} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">
                      {product.prep_time} {language === 'ar' ? 'دقيقة' : 'min'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageAttributes(product)}
                    className="flex-1"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الخصائص' : 'Attributes'}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Trash2 className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'حذف' : 'Delete'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className={isRTL ? 'font-arabic' : ''}>
                          {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className={isRTL ? 'font-arabic' : ''}>
                          {language === 'ar' 
                            ? 'هل أنت متأكد من حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.'
                            : 'Are you sure you want to delete this product? This action cannot be undone.'
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(product.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {language === 'ar' ? 'حذف' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Product Attributes Dialog */}
      {selectedProductForAttributes && (
        <ProductAttributesDialog
          isOpen={isAttributesDialogOpen}
          onOpenChange={setIsAttributesDialogOpen}
          menuItemId={selectedProductForAttributes.id}
          menuItemName={language === 'ar' ? selectedProductForAttributes.name_ar : selectedProductForAttributes.name_en}
        />
      )}
    </div>
  );
};

export default ProductManagement;