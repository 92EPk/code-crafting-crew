import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Filter, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRestaurant } from "@/hooks/useRestaurant";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import type { SimpleOrder } from "@/types/restaurant";

const OrdersManagement = () => {
  const { language, isRTL } = useLanguage();
  const { orders, loading, updateOrderStatus } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState<SimpleOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleOrderClick = (order: SimpleOrder) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: SimpleOrder['status']) => {
    await updateOrderStatus(orderId, newStatus);
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-orange-500';
      case 'ready':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: language === 'ar' ? 'في الانتظار' : 'Pending',
      confirmed: language === 'ar' ? 'مؤكد' : 'Confirmed',
      preparing: language === 'ar' ? 'قيد التحضير' : 'Preparing',
      ready: language === 'ar' ? 'جاهز' : 'Ready',
      delivered: language === 'ar' ? 'تم التوصيل' : 'Delivered',
      cancelled: language === 'ar' ? 'ملغي' : 'Cancelled',
    };
    return statusMap[status] || status;
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}
          </h1>
          <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'تتبع وإدارة جميع الطلبات' : 'Track and manage all orders'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'فلترة' : 'Filter'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={isRTL ? 'font-arabic' : ''}
          >
            {status === 'all' 
              ? (language === 'ar' ? 'الكل' : 'All')
              : getStatusLabel(status)
            }
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'لا توجد طلبات' : 'No orders found'}
                </h3>
                <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'لا توجد طلبات تطابق الفلتر المحدد' : 'No orders match the selected filter'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className={`flex items-center gap-3 ${isRTL ? 'font-arabic' : ''}`}>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                      {order.customer_name}
                      <Badge variant="outline">
                        #{order.id.slice(0, 8)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className={`${isRTL ? 'font-arabic' : ''}`}>
                      {order.customer_phone} • {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getStatusLabel(order.status)}
                    </Badge>
                    <span className="font-medium">
                      {((order as any).total || 0).toFixed(2)} {language === 'ar' ? 'جنيه' : 'EGP'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {order.customer_address && (
                      <span>{language === 'ar' ? 'العنوان: ' : 'Address: '}{order.customer_address}</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOrderClick(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default OrdersManagement;