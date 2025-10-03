import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAttributes, useMenuItemAttributes } from "@/hooks/useDynamicAttributes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProductAttributesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  menuItemId: string;
  menuItemName: string;
}

const ProductAttributesDialog = ({ 
  isOpen, 
  onOpenChange, 
  menuItemId,
  menuItemName 
}: ProductAttributesDialogProps) => {
  const { language, isRTL } = useLanguage();
  const { attributes, loading: attributesLoading, fetchAttributes } = useAttributes();
  const { 
    menuItemAttributes, 
    loading: menuItemLoading,
    fetchMenuItemAttributes, 
    addMenuItemAttribute, 
    removeMenuItemAttribute 
  } = useMenuItemAttributes(menuItemId);

  const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set());
  const [requiredAttributes, setRequiredAttributes] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAttributes();
      fetchMenuItemAttributes();
    }
  }, [isOpen]);

  useEffect(() => {
    // Initialize selected and required attributes from existing data
    const selected = new Set<string>();
    const required = new Set<string>();
    
    menuItemAttributes.forEach(mia => {
      selected.add(mia.attribute_id);
      if (mia.is_required_for_item) {
        required.add(mia.attribute_id);
      }
    });
    
    setSelectedAttributes(selected);
    setRequiredAttributes(required);
  }, [menuItemAttributes]);

  const handleAttributeToggle = (attributeId: string) => {
    const newSelected = new Set(selectedAttributes);
    if (newSelected.has(attributeId)) {
      newSelected.delete(attributeId);
      // Also remove from required if unchecked
      const newRequired = new Set(requiredAttributes);
      newRequired.delete(attributeId);
      setRequiredAttributes(newRequired);
    } else {
      newSelected.add(attributeId);
    }
    setSelectedAttributes(newSelected);
  };

  const handleRequiredToggle = (attributeId: string) => {
    const newRequired = new Set(requiredAttributes);
    if (newRequired.has(attributeId)) {
      newRequired.delete(attributeId);
    } else {
      newRequired.add(attributeId);
    }
    setRequiredAttributes(newRequired);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Get current attribute IDs
      const currentAttributeIds = new Set(menuItemAttributes.map(mia => mia.attribute_id));
      
      // Find attributes to add
      const toAdd = Array.from(selectedAttributes).filter(id => !currentAttributeIds.has(id));
      
      // Find attributes to remove
      const toRemove = menuItemAttributes.filter(mia => !selectedAttributes.has(mia.attribute_id));
      
      // Add new attributes
      for (const attributeId of toAdd) {
        await addMenuItemAttribute({
          menu_item_id: menuItemId,
          attribute_id: attributeId,
          is_required_for_item: requiredAttributes.has(attributeId)
        });
      }
      
      // Remove old attributes
      for (const mia of toRemove) {
        await removeMenuItemAttribute(mia.id);
      }
      
      // Update required status for existing attributes
      for (const mia of menuItemAttributes) {
        if (selectedAttributes.has(mia.attribute_id)) {
          const shouldBeRequired = requiredAttributes.has(mia.attribute_id);
          if (mia.is_required_for_item !== shouldBeRequired) {
            // Note: You might need to add an update function to the hook
            // For now, we'll remove and re-add
            await removeMenuItemAttribute(mia.id);
            await addMenuItemAttribute({
              menu_item_id: menuItemId,
              attribute_id: mia.attribute_id,
              is_required_for_item: shouldBeRequired
            });
          }
        }
      }

      toast.success(language === 'ar' ? 'تم تحديث خصائص المنتج بنجاح' : 'Product attributes updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(language === 'ar' ? 'خطأ في التحديث' : 'Error updating attributes');
      console.error('Error updating product attributes:', error);
    } finally {
      setSaving(false);
    }
  };

  const loading = attributesLoading || menuItemLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {language === 'ar' ? 'إدارة خصائص المنتج' : 'Manage Product Attributes'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'ar' 
              ? `تخصيص الخصائص المتاحة للمنتج: ${menuItemName}`
              : `Customize available attributes for: ${menuItemName}`
            }
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : attributes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'لا توجد خصائص متاحة. قم بإنشاء خصائص أولاً في صفحة إدارة الخصائص.'
                  : 'No attributes available. Create attributes first in the Attributes Management page.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attributes
                .filter(attr => attr.is_active)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((attribute) => (
                  <div 
                    key={attribute.id} 
                    className="flex items-start space-x-3 rtl:space-x-reverse p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`attr-${attribute.id}`}
                      checked={selectedAttributes.has(attribute.id)}
                      onCheckedChange={() => handleAttributeToggle(attribute.id)}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`attr-${attribute.id}`}
                        className="text-base font-medium cursor-pointer"
                      >
                        {language === 'ar' ? attribute.name_ar : attribute.name_en}
                      </Label>
                      {attribute.description_ar || attribute.description_en ? (
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'ar' ? attribute.description_ar : attribute.description_en}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'النوع:' : 'Type:'} {attribute.attribute_type}
                        </span>
                      </div>
                    </div>
                    {selectedAttributes.has(attribute.id) && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox
                          id={`required-${attribute.id}`}
                          checked={requiredAttributes.has(attribute.id)}
                          onCheckedChange={() => handleRequiredToggle(attribute.id)}
                        />
                        <Label 
                          htmlFor={`required-${attribute.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {language === 'ar' ? 'مطلوب' : 'Required'}
                        </Label>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              language === 'ar' ? 'حفظ' : 'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAttributesDialog;
