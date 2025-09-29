import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "sonner";

const OffersManagement = () => {
  const { language, isRTL } = useLanguage();
  const { offers, loading } = useRestaurant();
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleAddOffer = () => {
    toast.info(language === 'ar' ? 'سيتم إضافة هذه الميزة قريباً' : 'This feature will be added soon');
  };

  const handleEditOffer = (offer: any) => {
    setSelectedOffer(offer);
    toast.info(language === 'ar' ? 'سيتم إضافة هذه الميزة قريباً' : 'This feature will be added soon');
  };

  const handleDeleteOffer = (offerId: string) => {
    toast.info(language === 'ar' ? 'سيتم إضافة هذه الميزة قريباً' : 'This feature will be added soon');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة العروض الخاصة' : 'Special Offers Management'}
          </h1>
          <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة العروض والخصومات' : 'Manage your special offers and discounts'}
          </p>
        </div>
        <Button onClick={handleAddOffer} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {language === 'ar' ? 'إضافة عرض جديد' : 'Add New Offer'}
        </Button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
            </div>
          </div>
        ) : offers.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'لا توجد عروض حتى الآن' : 'No offers yet'}
                </h3>
                <p className={`text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'ابدأ بإضافة أول عرض خاص' : 'Start by adding your first special offer'}
                </p>
                <Button onClick={handleAddOffer}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إضافة عرض' : 'Add Offer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer: any) => (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className={`${isRTL ? 'font-arabic' : ''}`}>
                        {language === 'ar' ? offer.title_ar : offer.title_en}
                      </CardTitle>
                      <CardDescription className={`${isRTL ? 'font-arabic' : ''}`}>
                        {language === 'ar' ? offer.description_ar : offer.description_en}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={offer.is_active ? "default" : "secondary"}>
                        {offer.is_active 
                          ? (language === 'ar' ? 'نشط' : 'Active')
                          : (language === 'ar' ? 'غير نشط' : 'Inactive')
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {offer.discount_percentage && (
                        <span className="text-green-600 font-medium">
                          {offer.discount_percentage}% {language === 'ar' ? 'خصم' : 'OFF'}
                        </span>
                      )}
                      {offer.discount_amount && (
                        <span className="text-green-600 font-medium">
                          {offer.discount_amount} {language === 'ar' ? 'جنيه خصم' : 'EGP OFF'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOffer(offer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersManagement;