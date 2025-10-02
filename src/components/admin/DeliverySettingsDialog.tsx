import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeliverySettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeliverySettingsDialog = ({ isOpen, onOpenChange }: DeliverySettingsDialogProps) => {
  const { language, isRTL } = useLanguage();
  const [deliveryFee, setDeliveryFee] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDeliveryFee();
    }
  }, [isOpen]);

  const fetchDeliveryFee = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('delivery_fee')
        .single();

      if (error) throw error;
      setDeliveryFee(data?.delivery_fee?.toString() || '0');
    } catch (error: any) {
      toast.error(language === 'ar' ? 'خطأ في تحميل الإعدادات' : 'Error loading settings');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ delivery_fee: parseFloat(deliveryFee) || 0 })
        .eq('id', (await supabase.from('admin_settings').select('id').single()).data?.id);

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم تحديث سعر التوصيل بنجاح' : 'Delivery fee updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(language === 'ar' ? 'خطأ في التحديث' : 'Error updating delivery fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isRTL ? "font-arabic" : ""} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {language === 'ar' ? 'إعدادات التوصيل' : 'Delivery Settings'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="delivery_fee">
              {language === 'ar' ? 'سعر التوصيل (ج.م)' : 'Delivery Fee (EGP)'}
            </Label>
            <Input
              id="delivery_fee"
              type="number"
              min="0"
              step="0.01"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading 
              ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
              : (language === 'ar' ? 'حفظ' : 'Save')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliverySettingsDialog;
