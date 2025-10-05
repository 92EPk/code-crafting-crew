import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  Bell, 
  Star,
  LogOut,
  Settings,
  Package,
  Clock,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, isRTL } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(language === 'ar' ? 'خطأ في تسجيل الخروج' : 'Error signing out');
    } else {
      toast.success(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Signed out successfully');
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className={`text-muted-foreground hover:text-foreground ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'العودة للرئيسية ←' : '← Back to Home'}
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className={`text-2xl font-bold ${isRTL ? 'font-arabic' : ''}`}>{t.myDashboard}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className={isRTL ? 'font-arabic' : ''}
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
              <Button variant="outline" onClick={handleSignOut} className={isRTL ? 'font-arabic' : ''}>
                <LogOut className="mr-2 h-4 w-4" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className={`text-lg ${isRTL ? 'font-arabic' : ''}`}>{t.welcomeBack}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>{t.totalOrdersCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>{t.favorites}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className={isRTL ? 'font-arabic' : ''}>{t.overview}</TabsTrigger>
                <TabsTrigger value="profile" className={isRTL ? 'font-arabic' : ''}>{t.profile}</TabsTrigger>
                <TabsTrigger value="orders" className={isRTL ? 'font-arabic' : ''}>{t.orders}</TabsTrigger>
                <TabsTrigger value="favorites" className={isRTL ? 'font-arabic' : ''}>{t.favorites}</TabsTrigger>
                <TabsTrigger value="addresses" className={isRTL ? 'font-arabic' : ''}>{t.addresses}</TabsTrigger>
                <TabsTrigger value="notifications" className={isRTL ? 'font-arabic' : ''}>{t.notifications}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.noRecentOrders}</h3>
                      <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.noRecentOrdersDesc}
                      </p>
                      <Button size="sm" onClick={() => navigate('/menu')} className={isRTL ? 'font-arabic' : ''}>
                        {t.browseMenu}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.noFavoriteItems}</h3>
                      <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.noFavoriteItemsDesc}
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('favorites')} className={isRTL ? 'font-arabic' : ''}>
                        {t.viewFavorites}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.addAddress}</h3>
                      <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.addAddressDesc}
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('addresses')} className={isRTL ? 'font-arabic' : ''}>
                        {t.manageAddresses}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <Settings className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.profileSettings}
                    </CardTitle>
                    <CardDescription className={isRTL ? 'font-arabic' : ''}>
                      {t.profileSettingsDesc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                        {t.profileComingSoon}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <ShoppingBag className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.orderHistory}
                    </CardTitle>
                    <CardDescription className={isRTL ? 'font-arabic' : ''}>
                      {t.orderHistoryDesc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.noOrdersYetTitle}</h3>
                      <p className={`text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.noOrdersYetDesc}
                      </p>
                      <Button onClick={() => navigate('/menu')} className={isRTL ? 'font-arabic' : ''}>
                        {t.startShopping}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <Heart className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.favoriteItems}
                    </CardTitle>
                    <CardDescription className={isRTL ? 'font-arabic' : ''}>
                      {t.savedFavorites}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.noFavoritesYet}</h3>
                      <p className={`text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.noFavoritesYetDesc}
                      </p>
                      <Button onClick={() => navigate('/menu')} className={isRTL ? 'font-arabic' : ''}>
                        {t.browseMenu}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.deliveryAddresses}
                    </CardTitle>
                    <CardDescription className={isRTL ? 'font-arabic' : ''}>
                      {t.manageLocations}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.noAddressesSaved}</h3>
                      <p className={`text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.noAddressesSavedDesc}
                      </p>
                      <Button className={isRTL ? 'font-arabic' : ''}>
                        {t.addNewAddress}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <Bell className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.notificationsTitle}
                    </CardTitle>
                    <CardDescription className={isRTL ? 'font-arabic' : ''}>
                      {t.notificationsDesc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t.noNotifications}</h3>
                      <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                        {t.allCaughtUp}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;