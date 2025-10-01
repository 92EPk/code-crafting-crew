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
    url: '/admin',
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
    title: { ar: 'إدارة الخصائص', en: 'Attributes' },
    url: '/admin/attributes',
    icon: Settings
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
      className={`${collapsed ? "w-14" : "w-60"} bg-gray-900 border-gray-800 transition-all duration-300`}
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarTrigger className="m-2 self-end text-gray-300 hover:text-white" />

      <SidebarContent className="p-4 space-y-4 bg-gray-900">
        {/* Header */}
        {!collapsed && (
          <div className="text-center pb-4 border-b border-border/50">
            <h2 className={`text-xl font-bold text-white ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
            </h2>
            <p className={`text-sm text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
              Mix & Taste
            </p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className={`text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-primary text-white font-semibold shadow-lg' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`
                      }
                      end
                    >
                      <item.icon className="h-5 w-5" />
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
        <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
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
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
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