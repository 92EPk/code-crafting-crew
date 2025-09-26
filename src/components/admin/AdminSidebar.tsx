import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tags,
  Utensils,
  ClipboardList,
  LogOut,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const menuItems = [
  {
    title: { ar: 'لوحة التحكم', en: 'Dashboard' },
    url: '/admin/dashboard',
    icon: Home
  },
  {
    title: { ar: 'إدارة الأصناف', en: 'Categories' },
    url: '/admin/categories',
    icon: Tags
  },
  {
    title: { ar: 'إدارة المنتجات', en: 'Products' },
    url: '/admin/products',
    icon: Package
  },
  {
    title: { ar: 'إدارة التخصيص', en: 'Customization' },
    url: '/admin/customization',
    icon: Settings
  },
  {
    title: { ar: 'إدارة الطلبات', en: 'Orders' },
    url: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: { ar: 'العروض الخاصة', en: 'Special Offers' },
    url: '/admin/offers',
    icon: Utensils
  },
  {
    title: { ar: 'التقارير', en: 'Analytics' },
    url: '/admin/analytics',
    icon: BarChart3
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { language, setLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-foreground";

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    toast.success(language === 'ar' ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} border-r transition-all duration-300`}
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="p-4 space-y-4">
        {/* Header */}
        {!collapsed && (
          <div className="text-center pb-4 border-b">
            <h2 className={`text-xl font-bold text-primary ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
            </h2>
            <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              Mix & Taste
            </p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className={isRTL ? 'font-arabic' : ''}>
            {language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                      end
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${isRTL && !collapsed ? 'ml-3 mr-0' : ''}`} />
                      {!collapsed && (
                        <span className={isRTL ? 'font-arabic' : ''}>
                          {item.title[language]}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full justify-start"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          >
            <Globe className={`h-4 w-4 ${collapsed ? '' : 'mr-2'} ${isRTL && !collapsed ? 'ml-2 mr-0' : ''}`} />
            {!collapsed && (
              <span className={isRTL ? 'font-arabic' : ''}>
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            )}
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-2'} ${isRTL && !collapsed ? 'ml-2 mr-0' : ''}`} />
            {!collapsed && (
              <span className={isRTL ? 'font-arabic' : ''}>
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </span>
            )}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}