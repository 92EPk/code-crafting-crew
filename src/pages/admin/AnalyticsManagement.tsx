import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRestaurant } from "@/hooks/useRestaurant";

const AnalyticsManagement = () => {
  const { language, isRTL } = useLanguage();
  const { orders, menuItems } = useRestaurant();

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total_amount, 0),
    avgOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.total_amount, 0) / orders.length
      : 0,
    totalProducts: menuItems.length,
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'التقارير والتحليلات' : 'Analytics & Reports'}
        </h1>
        <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'تحليل الأداء والمبيعات' : 'Performance and sales analytics'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'منذ البداية' : 'Since beginning'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} {language === 'ar' ? 'جنيه' : 'EGP'}</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'من الطلبات المكتملة' : 'From completed orders'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgOrderValue.toFixed(2)} {language === 'ar' ? 'جنيه' : 'EGP'}</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'متوسط الطلب الواحد' : 'Per order average'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'في القائمة' : 'In menu'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className={`${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'الطلبات الأخيرة' : 'Recent Orders'}
          </CardTitle>
          <CardDescription className={`${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'آخر 5 طلبات تم تلقيها' : 'Last 5 orders received'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className={`text-muted-foreground text-center py-4 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}
              </p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total_amount.toFixed(2)} {language === 'ar' ? 'جنيه' : 'EGP'}</p>
                    <Badge variant="outline" className="mt-1">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={`${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'المبيعات الشهرية' : 'Monthly Sales'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className={`text-center ${isRTL ? 'font-arabic' : ''}`}>
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>{language === 'ar' ? 'الرسم البياني قريباً' : 'Chart coming soon'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Best Selling Products'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className={`text-center ${isRTL ? 'font-arabic' : ''}`}>
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>{language === 'ar' ? 'التحليل قريباً' : 'Analysis coming soon'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsManagement;