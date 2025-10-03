import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types/product";
import { useOrders } from "@/hooks/useDatabase";
import { Loader2, MapPin, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderSidebarProps {
  language: 'ar' | 'en';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

const OrderSidebar = ({ language, isOpen, onOpenChange, cartItems, onOrderComplete }: OrderSidebarProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const { toast } = useToast();
  const { createOrder } = useOrders();

  // Fetch delivery fee from database
  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('delivery_fee')
          .single();
        
        if (error) throw error;
        setDeliveryFee(data?.delivery_fee || 0);
      } catch (error) {
        console.error('Error fetching delivery fee:', error);
        setDeliveryFee(0);
      }
    };

    if (isOpen) {
      fetchDeliveryFee();
    }
  }, [isOpen]);

  const translations = {
    ar: {
      orderDetails: "تفاصيل الطلب",
      customerInfo: "بيانات العميل",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      deliveryAddress: "عنوان التوصيل",
      subtotal: "المجموع الفرعي",
      delivery: "رسوم التوصيل",
      total: "الإجمالي",
      confirmOrder: "تأكيد الطلب",
      orderSuccess: "تم إرسال طلبك بنجاح!",
      orderError: "حدث خطأ في إرسال الطلب",
      fillAllFields: "يرجى ملء جميع البيانات",
      egp: "جنيه"
    },
    en: {
      orderDetails: "Order Details", 
      customerInfo: "Customer Information",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      deliveryAddress: "Delivery Address",
      subtotal: "Subtotal",
      delivery: "Delivery Fee",
      total: "Total",
      confirmOrder: "Confirm Order",
      orderSuccess: "Your order has been sent successfully!",
      orderError: "Error sending your order",
      fillAllFields: "Please fill all fields",
      egp: "EGP"
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: t.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        total: total,
        items: cartItems.map(item => ({
          menu_item_id: item.dbId || `temp-${item.id}`,
          quantity: item.quantity,
          unit_price: item.totalPrice,
          selected_options: item.selectedOptions || {},
          total_price: item.totalPrice * item.quantity
        }))
      };

      await createOrder(orderData);
      
      toast({
        title: t.orderSuccess,
      });

      // Reset form
      setCustomerInfo({ name: '', phone: '', address: '' });
      onOrderComplete();
      onOpenChange(false);

    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: t.orderError,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:w-[400px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <SheetHeader>
          <SheetTitle className={`text-xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
            {t.orderDetails}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Customer Information Form */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-lg ${isRTL ? 'font-arabic' : ''}`}>
              {t.customerInfo}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t.fullName}
              </Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t.fullName}
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t.phoneNumber}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t.phoneNumber}
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t.deliveryAddress}
              </Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder={t.deliveryAddress}
                className={`min-h-[80px] ${isRTL ? 'text-right' : ''}`}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className={`${isRTL ? 'font-arabic' : ''}`}>
                    {item.name[language]} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {(item.totalPrice * item.quantity).toFixed(2)} {t.egp}
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className={isRTL ? 'font-arabic' : ''}>{t.subtotal}:</span>
                  <span>{subtotal.toFixed(2)} {t.egp}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={isRTL ? 'font-arabic' : ''}>{t.delivery}:</span>
                  <span>{deliveryFee.toFixed(2)} {t.egp}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg pt-1 border-t">
                  <span className={isRTL ? 'font-arabic' : ''}>{t.total}:</span>
                  <span>{total.toFixed(2)} {t.egp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full mt-6"
            size="lg"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.confirmOrder}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSidebar;