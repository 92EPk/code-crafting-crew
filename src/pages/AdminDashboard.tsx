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
import AttributeManagement from "@/pages/admin/AttributeManagement";
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
        <AdminSidebar />
        
        <main className="flex-1">
          {/* Modern Header */}
          <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden hover:bg-primary/10 transition-colors" />
                  <div>
                    <h1 className={`text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent ${isRTL ? 'font-arabic' : ''}`}>
                      {t.adminDashboard}
                    </h1>
                    <p className={`text-sm text-gray-500 mt-0.5 ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'إدارة المطعم بكفاءة' : 'Manage your restaurant efficiently'}
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    {t.connected}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                    <Bell className="h-4 w-4 mr-2" />
                    {t.notifications}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route index element={
                <>
                  {/* Modern Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary bg-gradient-to-br from-white to-primary/5">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          {t.totalOrders}
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-primary mb-1">{stats.totalOrders}</div>
                        <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'جميع الطلبات في النظام' : 'All orders in system'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-yellow-500 bg-gradient-to-br from-white to-yellow-50">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          {t.pendingOrders}
                        </CardTitle>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-yellow-600 mb-1">{stats.pendingOrders}</div>
                        <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                          {t.needsAttention}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'الطلبات المكتملة' : 'Completed Orders'}
                        </CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-green-600 mb-1">{stats.completedOrders}</div>
                        <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'تم توصيلها بنجاح' : 'Successfully delivered'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          {t.totalRevenue}
                        </CardTitle>
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-emerald-600 mb-1">{stats.totalRevenue.toFixed(2)} {t.egp}</div>
                        <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                          {t.fromCompletedOrders}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                      <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'font-arabic' : ''}`}>
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        {t.recentOrders}
                      </CardTitle>
                      <CardDescription className={`${isRTL ? 'font-arabic' : ''} text-base`}>
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
                        <div className="space-y-3">
                          {orders.slice(0, 10).map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-5 border-2 border-transparent rounded-xl hover:border-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 cursor-pointer transition-all duration-300 hover:shadow-lg group"
                              onClick={() => handleOrderClick(order)}
                            >
                              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className={`w-4 h-4 rounded-full ${getStatusColor(order.status)} shadow-lg group-hover:scale-110 transition-transform`}></div>
                                <div>
                                  <p className={`font-semibold text-gray-800 group-hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                                    {order.customer_name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.customer_phone}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-primary">{order.total_amount} {t.egp}</p>
                                <Badge variant="outline" className="mt-2 font-medium">
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
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="offers" element={<OffersManagement />} />
              <Route path="attributes" element={<AttributeManagement />} />
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