import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Clock, Truck, Plus, Sparkles, Award, Users } from "lucide-react";
import ProductCustomization from "./ProductCustomization";
import { Product, SelectedOptions } from "@/types/product";
import { useMenuItems } from "@/hooks/useDatabase";

interface HeroSectionProps {
  language: 'ar' | 'en';
  onOrderClick: () => void;
  onAddToCart: (product: Product, quantity?: number, selectedOptions?: SelectedOptions, totalPrice?: number) => void;
}

const HeroSection = ({ language, onOrderClick, onAddToCart }: HeroSectionProps) => {
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  const { menuItems } = useMenuItems();
  
  // Get featured products for home page
  const featuredProducts = menuItems.slice(0, 3).map(item => ({
    id: parseInt(item.id.slice(-8), 16),
    name: { ar: item.name_ar, en: item.name_en },
    description: { ar: item.description_ar || '', en: item.description_en || '' },
    price: item.price,
    discountPrice: item.discount_price,
    image: item.image_url || '/placeholder.svg',
    categoryId: item.category_id,
    rating: item.rating,
    prepTime: item.prep_time,
    isSpicy: item.is_spicy,
    isOffer: item.is_offer
  }));

  const translations = {
    ar: {
      title: "مذاق استثنائي يجمع بين الأصالة والحداثة",
      subtitle: "اكتشف أشهى الأطباق المحضرة بعناية فائقة من أجود المكونات الطازجة",
      orderNow: "اطلب الآن",
      viewMenu: "استعرض القائمة الكاملة", 
      fastDelivery: "توصيل سريع",
      freshIngredients: "مكونات طازجة",
      topRated: "الأفضل تقييماً",
      deliveryTime: "30-45 دقيقة",
      customersSatisfied: "15,000+ عميل سعيد",
      yearExperience: "سنوات من الخبرة",
      dailyOrders: "طلب يومياً"
    },
    en: {
      title: "Exceptional Taste Combining Authenticity and Modernity", 
      subtitle: "Discover the most delicious dishes prepared with exceptional care from the finest fresh ingredients",
      orderNow: "Order Now",
      viewMenu: "View Full Menu",
      fastDelivery: "Fast Delivery",
      freshIngredients: "Fresh Ingredients",
      topRated: "Top Rated",
      deliveryTime: "30-45 minutes",
      customersSatisfied: "15,000+ Happy Customers",
      yearExperience: "Years of Experience",
      dailyOrders: "Daily Orders"
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleProductClick = (product: Product) => {
    // Check if product needs customization
    const needsCustomization = ['burger', 'meat', 'chicken'].some(type => 
      product.name.en.toLowerCase().includes(type) || 
      product.name.ar.includes('برجر') || 
      product.name.ar.includes('لحم') || 
      product.name.ar.includes('دجاج') ||
      product.name.ar.includes('فراخ')
    );
    
    if (needsCustomization) {
      setCustomizationProduct(product);
    } else {
      onAddToCart(product, 1, {}, product.discountPrice || product.price);
    }
  };

  const handleCustomizedAddToCart = (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => {
    onAddToCart(product, quantity, selectedOptions, totalPrice);
    setCustomizationProduct(null);
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Advanced Background Decorations */}
      <div className="absolute inset-0 bg-grid-small-black/[0.2] bg-grid-small" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20 text-primary px-6 py-3 rounded-full mb-8 hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-semibold">{t.topRated}</span>
            <Star className="h-4 w-4 fill-current" />
          </div>
          
          {/* Main Title */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight ${isRTL ? 'font-arabic' : ''}`}>
            {t.title}
          </h1>
          
          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {t.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={onOrderClick}
              className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-primary-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg px-10 py-6 rounded-full"
            >
              <Sparkles className="h-5 w-5 mr-3 animate-spin" />
              {t.orderNow}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary/30 hover:bg-primary/5 backdrop-blur-sm text-lg px-10 py-6 rounded-full"
              onClick={() => {
                window.location.href = '/full-menu';
              }}
            >
              {t.viewMenu}
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-primary text-primary-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t.customersSatisfied}
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-accent text-accent-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">5+</div>
              <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t.yearExperience}
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-secondary text-secondary-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t.dailyOrders}
              </div>
            </div>
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mt-16">
              <h3 className={`text-3xl font-bold mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'أطباقنا المميزة' : 'Our Signature Dishes'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border/20">
                    <img 
                      src={product.image} 
                      alt={product.name[language]}
                      className="w-full h-48 object-cover rounded-xl mb-4 hover:scale-105 transition-transform"
                    />
                    <h4 className={`font-bold text-lg mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                      {product.name[language]}
                    </h4>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {product.discountPrice || product.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
                      onClick={() => handleProductClick(product)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Customization Dialog */}
      {customizationProduct && (
        <ProductCustomization
          product={customizationProduct}
          isOpen={!!customizationProduct}
          onClose={() => setCustomizationProduct(null)}
          onAddToCart={handleCustomizedAddToCart}
          language={language}
        />
      )}
    </section>
  );
};

export default HeroSection;