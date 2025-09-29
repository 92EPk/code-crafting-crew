import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Bell
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import type { SimpleOrder } from "@/types/restaurant";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import CategoryManagement from "@/pages/admin/CategoryManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import OffersManagement from "@/pages/admin/OffersManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CustomizationManagement from "@/pages/admin/CustomizationManagement";
import AnalyticsManagement from "@/pages/admin/AnalyticsManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { language, setLanguage, isRTL } = useLanguage();
  const { orders, updateOrderStatus, loading } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState<SimpleOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("admin-token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    toast.success(language === 'ar' ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
    navigate("/admin/login");
  };

  const handleOrderClick = (order: SimpleOrder) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: SimpleOrder['status']) => {
    await updateOrderStatus(orderId, newStatus);
    toast.success(t.statusUpdated);
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
      pending: t.pending,
      confirmed: t.confirmed,
      preparing: t.preparing,
      ready: t.ready,
      delivered: t.delivered,
      cancelled: t.cancelled,
    };
    return statusMap[status] || status;
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    totalRevenue: orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total_amount, 0),
    completedOrders: orders.filter(order => order.status === 'delivered').length,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/50 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
        <AdminSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className={`text-2xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
                    {t.adminDashboard}
                  </h1>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {t.connected}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    {t.notifications}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <>
                  {/* Enhanced Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                          {t.totalOrders}
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{stats.totalOrders}</div>
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'جميع الطلبات في النظام' : 'All orders in system'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                          {t.pendingOrders}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {t.needsAttention}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'الطلبات المكتملة' : 'Completed Orders'}
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.completedOrders}</div>
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'تم توصيلها بنجاح' : 'Successfully delivered'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                          {t.totalRevenue}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} {t.egp}</div>
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {t.fromCompletedOrders}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${isRTL ? 'font-arabic' : ''}`}>
                        <ShoppingBag className="h-5 w-5" />
                        {t.recentOrders}
                      </CardTitle>
                      <CardDescription className={isRTL ? 'font-arabic' : ''}>
                        {t.manageTrackOrders}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                            {t.loading}
                          </div>
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t.noOrdersYet}
                          </h3>
                          <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                            {t.ordersWillAppear}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 10).map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-all duration-200 hover:shadow-md"
                              onClick={() => handleOrderClick(order)}
                            >
                              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                                <div>
                                  <p className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                                    {order.customer_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.customer_phone}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{order.total_amount} {t.egp}</p>
                                <Badge variant="outline" className="mt-1">
                                  {getStatusLabel(order.status)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              } />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="offers" element={<OffersManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="customization" element={<CustomizationManagement />} />
              <Route path="analytics" element={<AnalyticsManagement />} />
            </Routes>
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;