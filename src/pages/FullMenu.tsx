import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, Star, Clock, Flame, ShoppingCart } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import OrderSidebar from "@/components/OrderSidebar";
import ProductCustomization from "@/components/ProductCustomization";
import { Product, SelectedOptions, CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useMenuItems, useCategories } from "@/hooks/useDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { supabase } from "@/integrations/supabase/client";

const FullMenu = () => {
  const { language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  // Database hooks
  const { menuItems, loading, fetchMenuItems } = useMenuItems();
  const { categories: dbCategories, fetchCategories } = useCategories();

  const t = translations[language];

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mixandtaste-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mixandtaste-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Setup realtime subscriptions for database updates
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();

    // Subscribe to menu items changes
    const menuChannel = supabase
      .channel('menu-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        () => {
          fetchMenuItems();
        }
      )
      .subscribe();

    // Subscribe to categories changes
    const categoryChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(categoryChannel);
    };
  }, []);

  // Build categories list from database
  const categories = [
    { id: 'all', name: { ar: t.all, en: t.all } },
    ...dbCategories.map(cat => ({
      id: cat.id,
      name: { ar: cat.name_ar, en: cat.name_en }
    }))
  ];

  const addToCart = (product: Product, quantity: number = 1, selectedOptions: SelectedOptions = {}, totalPrice?: number) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...currentItems, { 
          ...product, 
          quantity,
          selectedOptions,
          totalPrice: totalPrice || product.discountPrice || product.price
        } as CartItem];
      }
    });
    
    toast({
      title: language === 'ar' ? 'تم إضافة الطبق للسلة' : 'Added to cart',
      description: `${product.name[language]} ${language === 'ar' ? 'تمت إضافته للسلة' : 'has been added to your cart'}`,
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCustomization = (product: Product) => {
    setCustomizationProduct(product);
  };

  const filteredProducts = menuItems?.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category_id === selectedCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className={`text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors ${isRTL ? 'font-arabic' : ''}`}
              >
                <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                {t.back}
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <Badge variant="secondary" className="text-xs">
                    {cartItems.length}
                  </Badge>
                  <span className={`text-xs ${isRTL ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'عنصر في السلة' : 'items in cart'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold text-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.fullMenu}
          </h1>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'استكشف جميع أطباقنا الشهية المحضرة بعناية فائقة' : 'Explore all our delicious dishes prepared with exceptional care'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${isRTL ? 'font-arabic' : ''}`}
            >
              {category.name[language]}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className={`mt-4 text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {t.loading}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="relative p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={product.image_url || '/api/placeholder/300/200'}
                      alt={product[`name_${language}`] || product.name_ar}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {product.is_spicy && (
                        <Badge variant="destructive" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          {t.spicy}
                        </Badge>
                      )}
                      {product.is_offer && (
                        <Badge variant="secondary" className="bg-amber-500 text-white text-xs">
                          {t.offer}
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      {product.rating}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className={`font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
                        {product[`name_${language}`] || product.name_ar}
                      </h3>
                      <p className={`text-sm text-muted-foreground line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
                        {product[`description_${language}`] || product.description_ar}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{product.prep_time} {t.minutes}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.discount_price ? (
                          <>
                            <span className="text-lg font-bold text-primary">
                              {product.discount_price} {t.egp}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {product.price} {t.egp}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {product.price} {t.egp}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {product.customization_options && product.customization_options.length > 0 ? (
                        <Button
                          variant="outline"
                          className={`flex-1 ${isRTL ? 'font-arabic' : ''}`}
                          onClick={() => handleCustomization({
                            id: parseInt(product.id.slice(-8), 16),
                            name: { ar: product.name_ar, en: product.name_en },
                            description: { ar: product.description_ar || '', en: product.description_en || '' },
                            price: product.price,
                            discountPrice: product.discount_price,
                            image: product.image_url || '/placeholder.svg',
                            categoryId: product.category_id,
                            rating: product.rating,
                            prepTime: product.prep_time,
                            isSpicy: product.is_spicy,
                            isOffer: product.is_offer
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t.customize}
                        </Button>
                      ) : (
                        <Button
                          className={`flex-1 ${isRTL ? 'font-arabic' : ''}`}
                          onClick={() => addToCart({
                            id: parseInt(product.id.slice(-8), 16),
                            name: { ar: product.name_ar, en: product.name_en },
                            description: { ar: product.description_ar || '', en: product.description_en || '' },
                            price: product.price,
                            discountPrice: product.discount_price,
                            image: product.image_url || '/placeholder.svg',
                            categoryId: product.category_id,
                            rating: product.rating,
                            prepTime: product.prep_time,
                            isSpicy: product.is_spicy,
                            isOffer: product.is_offer
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t.addToCart}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'لا توجد أطباق في هذه الفئة' : 'No dishes found in this category'}
            </p>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsOrderOpen(true);
        }}
      />

      {/* Order Sidebar */}
      <OrderSidebar
        language={language}
        isOpen={isOrderOpen}
        onOpenChange={setIsOrderOpen}
        cartItems={cartItems}
        onOrderComplete={() => {
          clearCart();
          setIsOrderOpen(false);
        }}
      />

      {/* Product Customization Modal */}
      {customizationProduct && (
        <ProductCustomization
          product={customizationProduct}
          language={language}
          isOpen={!!customizationProduct}
          onClose={() => setCustomizationProduct(null)}
          onAddToCart={(product, quantity, selectedOptions, totalPrice) => {
            addToCart(product, quantity, selectedOptions, totalPrice);
            setCustomizationProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default FullMenu;