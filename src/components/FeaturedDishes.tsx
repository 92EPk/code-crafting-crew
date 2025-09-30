import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useMenuItems } from "@/hooks/useDatabase";
import { Product, SelectedOptions } from "@/types/product";
import ProductCustomization from "./ProductCustomization";

interface FeaturedDishesProps {
  onAddToCart: (product: Product, quantity?: number, selectedOptions?: SelectedOptions, totalPrice?: number) => void;
}

const FeaturedDishes = ({ onAddToCart }: FeaturedDishesProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const { menuItems, loading } = useMenuItems();
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    if (product.customizations?.allowCustomization) {
      setCustomizationProduct(product);
    } else {
      onAddToCart(product, 1);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'أطباقنا المميزة' : 'Our Signature Dishes'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-96 animate-pulse bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredItems = menuItems.slice(0, 6);

  return (
    <section className="py-20 bg-background-secondary" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="px-6 py-2 text-sm font-medium">
            {language === 'ar' ? 'الأطباق المميزة' : 'Featured Dishes'}
          </Badge>
          <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'اختر من أشهى أطباقنا' : 'Choose From Our Best'}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' 
              ? 'كل طبق محضر بعناية من أجود المكونات الطازجة'
              : 'Every dish crafted with care from the finest fresh ingredients'}
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => {
            const product: Product = {
              id: parseInt(item.id) || 0,
              dbId: item.id,
              name: {
                ar: item.name_ar || item.name || '',
                en: item.name_en || item.name || ''
              },
              description: {
                ar: item.description_ar || item.description || '',
                en: item.description_en || item.description || ''
              },
              price: item.price,
              discountPrice: item.discount_price,
              image: item.image_url || item.image || '',
              categoryId: item.category_id || item.category || '',
              rating: item.rating || 4.5,
              prepTime: item.prep_time || '30 دقيقة',
              isSpicy: item.is_spicy || false,
              isOffer: item.is_offer || false,
              customizations: {
                allowCustomization: item.allow_customization || false
              }
            };

            return (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-muted">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name[language]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {item.discount_price && (
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        -{Math.round(((item.price - item.discount_price) / item.price) * 100)}%
                      </Badge>
                    )}
                    {item.is_spicy && (
                      <Badge className="bg-accent text-accent-foreground shadow-lg">
                        <Flame className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 bg-card/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="font-semibold text-sm">4.5</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className={`text-xl font-bold text-foreground mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                      {product.name[language]}
                    </h3>
                    <p className={`text-sm text-muted-foreground line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
                      {product.description[language]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {item.discount_price ? (
                        <>
                          <span className="text-2xl font-bold text-primary">
                            {item.discount_price} {language === 'ar' ? 'ج.م' : 'EGP'}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-foreground">
                          {item.price} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleProductClick(product)}
                      className="group/btn rounded-full w-10 h-10 p-0"
                    >
                      <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 border-2"
            onClick={() => window.location.href = '/menu'}
          >
            <span className={isRTL ? 'font-arabic' : ''}>
              {language === 'ar' ? 'عرض القائمة الكاملة' : 'View Full Menu'}
            </span>
          </Button>
        </div>
      </div>

      {/* Customization Dialog */}
      {customizationProduct && (
        <ProductCustomization
          product={customizationProduct}
          language={language}
          isOpen={true}
          onClose={() => setCustomizationProduct(null)}
          onAddToCart={(product, quantity, selectedOptions, totalPrice) => {
            onAddToCart(product, quantity, selectedOptions, totalPrice);
            setCustomizationProduct(null);
          }}
        />
      )}
    </section>
  );
};

export default FeaturedDishes;
