import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Phone, User, Package } from "lucide-react";
import { SimpleOrder } from "@/types/restaurant";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import OrderStatusManager from "./OrderStatusManager";

interface OrderDetailsModalProps {
  order: SimpleOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: SimpleOrder['status']) => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate }: OrderDetailsModalProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? `تفاصيل الطلب #${order.id.slice(-8)}` : `Order Details #${order.id.slice(-8)}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className={`font-semibold text-lg mb-3 flex items-center gap-2 ${isRTL ? 'font-arabic' : ''}`}>
              <User className="h-5 w-5" />
              {t.customerInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t.fullName}:</span>
                <span>{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t.phoneNumber}:</span>
                <span>{order.customer_phone}</span>
              </div>
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t.deliveryAddress}:</span>
                <span className="break-words">{order.customer_address}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className={`font-semibold text-lg mb-3 flex items-center gap-2 ${isRTL ? 'font-arabic' : ''}`}>
              <Package className="h-5 w-5" />
              {language === 'ar' ? 'حالة الطلب' : 'Order Status'}
            </h3>
            <OrderStatusManager 
              order={order} 
              onStatusUpdate={onStatusUpdate}
            />
          </div>

          {/* Order Items */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className={`font-semibold text-lg mb-3 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'عناصر الطلب' : 'Order Items'}
            </h3>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.menu_item?.image_url && (
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={item.menu_item.image_url} 
                          alt={language === 'ar' ? item.menu_item.name_ar : item.menu_item.name_en} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                        {language === 'ar' 
                          ? (item.menu_item?.name_ar || `المنتج ${item.menu_item_id.slice(0, 8)}`)
                          : (item.menu_item?.name_en || `Product ${item.menu_item_id.slice(0, 8)}`)
                        }
                      </p>
                      {item.menu_item && (
                        <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? item.menu_item.description_ar : item.menu_item.description_en}
                        </p>
                      )}
                      {Object.keys(item.selected_options).length > 0 && (
                        <div className={`text-xs text-muted-foreground mt-1 ${isRTL ? 'font-arabic' : ''}`}>
                          <span className="font-medium">
                            {language === 'ar' ? 'التخصيص: ' : 'Customization: '}
                          </span>
                          {Object.entries(item.selected_options).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'الكمية: ' : 'Quantity: '}{item.quantity}
                    </p>
                    <p className="font-bold text-primary">
                      {item.total_price} {t.egp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className={`font-semibold text-lg mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </h3>
              <p className={isRTL ? 'font-arabic' : ''}>{order.notes}</p>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className={`font-semibold text-lg mb-3 flex items-center gap-2 ${isRTL ? 'font-arabic' : ''}`}>
              <CalendarDays className="h-5 w-5" />
              {t.orderDetails}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'تاريخ الطلب:' : 'Order Date:'}
                </span>
                <span>{new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'وقت الطلب:' : 'Order Time:'}
                </span>
                <span>{new Date(order.created_at).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className={isRTL ? 'font-arabic' : ''}>{t.total}:</span>
                <span className="text-primary">{order.total_amount} {t.egp}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;