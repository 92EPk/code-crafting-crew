import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import EnhancedCustomizationManager from "@/components/admin/EnhancedCustomizationManager";

const CustomizationManagement = () => {
  const { language, isRTL } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'إدارة التخصيص' : 'Customization Management'}
        </h1>
        <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'إدارة خيارات تخصيص المنتجات' : 'Manage product customization options'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'font-arabic' : ''}>
            {language === 'ar' ? 'خيارات التخصيص' : 'Customization Options'}
          </CardTitle>
          <CardDescription className={isRTL ? 'font-arabic' : ''}>
            {language === 'ar' ? 'إضافة وتعديل خيارات التخصيص للمنتجات' : 'Add and edit customization options for products'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedCustomizationManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomizationManagement;