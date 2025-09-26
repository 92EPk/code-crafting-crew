import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit2, Trash2, Image, Package } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryForm {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  image_url: string;
  is_active: boolean;
}

const CategoryManagement = () => {
  const { language, isRTL } = useLanguage();
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      image_url: '',
      is_active: true
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name_ar: category.name_ar || '',
      name_en: category.name_en || '',
      description_ar: category.description_ar || '',
      description_en: category.description_en || '',
      image_url: category.image_url || '',
      is_active: category.is_active
    });
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name_ar || !formData.name_en) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success(language === 'ar' ? 'تم تحديث الصنف بنجاح' : 'Category updated successfully');
      } else {
        await addCategory({ 
          ...formData, 
          sort_order: categories.length 
        });
        toast.success(language === 'ar' ? 'تم إضافة الصنف بنجاح' : 'Category added successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success(language === 'ar' ? 'تم حذف الصنف بنجاح' : 'Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة الأصناف' : 'Category Management'}
          </h1>
          <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة أصناف المنتجات في المطعم' : 'Manage restaurant product categories'}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة صنف جديد' : 'Add New Category'}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className={isRTL ? 'font-arabic' : ''}>
                {editingCategory 
                  ? (language === 'ar' ? 'تعديل الصنف' : 'Edit Category')
                  : (language === 'ar' ? 'إضافة صنف جديد' : 'Add New Category')
                }
              </DialogTitle>
              <DialogDescription className={isRTL ? 'font-arabic' : ''}>
                {language === 'ar' 
                  ? 'املأ المعلومات التالية لإضافة أو تعديل الصنف'
                  : 'Fill in the information below to add or edit a category'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className={isRTL ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'فعال' : 'Active'}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSubmit}>
                {editingCategory 
                  ? (language === 'ar' ? 'تحديث' : 'Update')
                  : (language === 'ar' ? 'إضافة' : 'Add')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'لا توجد أصناف' : 'No Categories'}
            </h3>
            <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'ابدأ بإضافة صنف جديد' : 'Start by adding a new category'}
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${isRTL ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? category.name_ar : category.name_en}
                  </CardTitle>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active 
                      ? (language === 'ar' ? 'فعال' : 'Active')
                      : (language === 'ar' ? 'غير فعال' : 'Inactive')
                    }
                  </Badge>
                </div>
                {category.image_url && (
                  <div className="w-full h-32 bg-muted rounded-md overflow-hidden">
                    <img 
                      src={category.image_url} 
                      alt={language === 'ar' ? category.name_ar : category.name_en}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className={`mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? category.description_ar : category.description_en}
                </CardDescription>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تعديل' : 'Edit'}
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
                            ? 'هل أنت متأكد من حذف هذا الصنف؟ هذا الإجراء لا يمكن التراجع عنه.'
                            : 'Are you sure you want to delete this category? This action cannot be undone.'
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(category.id)}
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
    </div>
  );
};

export default CategoryManagement;