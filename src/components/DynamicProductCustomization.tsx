import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Check } from "lucide-react";
import { Product, SelectedOptions } from "@/types/product";
import { useDynamicCustomization } from "@/hooks/useDynamicCustomization";

interface DynamicProductCustomizationProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => void;
  language: 'ar' | 'en';
}

const DynamicProductCustomization = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  language
}: DynamicProductCustomizationProps) => {
  const [quantity, setQuantity] = useState(1);
  
  const {
    customizationState,
    availableAttributes,
    availableOptions,
    handleOptionSelect,
    resetCustomization,
    isValidSelection,
    totalPrice,
    loading
  } = useDynamicCustomization(product.dbId || product.id.toString(), product.price);

  const isRTL = language === 'ar';
  
  const translations = {
    ar: {
      customize: "تخصيص طلبك",
      customizeDescription: "اختر الخيارات التي تفضلها لطبقك",
      chooseOptions: "اختر من الخيارات التالية",
      required: "مطلوب",
      optional: "اختياري",
      quantity: "الكمية",
      totalPrice: "السعر الإجمالي",
      addToCart: "أضف للسلة",
      egp: "ج.م",
      loading: "جاري التحميل...",
      noOptions: "لا توجد خيارات تخصيص متاحة",
      selectRequired: "يرجى اختيار جميع الخيارات المطلوبة"
    },
    en: {
      customize: "Customize Your Order",
      customizeDescription: "Choose your preferred options for your dish",
      chooseOptions: "Choose from the following options",
      required: "Required",
      optional: "Optional",
      quantity: "Quantity",
      totalPrice: "Total Price",
      addToCart: "Add to Cart",
      egp: "EGP",
      loading: "Loading...",
      noOptions: "No customization options available",
      selectRequired: "Please select all required options"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      resetCustomization();
      setQuantity(1);
    }
  }, [isOpen, product.id]);

  const calculateTotalWithQuantity = (): number => {
    return totalPrice * quantity;
  };

  const handleAddToCart = () => {
    if (!isValidSelection) return;
    
    // Convert dynamic customization state to SelectedOptions format
    const selectedOptionsForCart: SelectedOptions = {};
    availableAttributes.forEach(attr => {
      const optionId = customizationState.selectedOptions[attr.id];
      if (optionId && availableOptions[attr.id]) {
        const option = availableOptions[attr.id].find(opt => opt.id === optionId);
        if (option) {
          selectedOptionsForCart[attr.id] = `${language === 'ar' ? option.name_ar : option.name_en} (+${option.price_adjustment} ${t.egp})`;
        }
      }
    });

    onAddToCart(product, quantity, selectedOptionsForCart, calculateTotalWithQuantity());
    onClose();
  };

  const getAttributeDisplayName = (attr: any) => {
    return language === 'ar' ? attr.name_ar : attr.name_en;
  };

  const getOptionDisplayName = (option: any) => {
    return language === 'ar' ? option.name_ar : option.name_en;
  };

  const renderAttribute = (attribute: any) => {
    const options = availableOptions[attribute.id] || [];
    const selectedOptionId = customizationState.selectedOptions[attribute.id];

    return (
      <div key={attribute.id} className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold text-base ${isRTL ? 'font-arabic' : ''}`}>
            {getAttributeDisplayName(attribute)}
          </h4>
          {attribute.is_required && (
            <Badge variant="destructive" className="text-xs">
              {t.required}
            </Badge>
          )}
        </div>
        
        {attribute.description_ar || attribute.description_en ? (
          <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? attribute.description_ar : attribute.description_en}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-2">
          {options.map((option: any) => {
            const isSelected = selectedOptionId === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(attribute.id, option.id)}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
                    {getOptionDisplayName(option)}
                  </span>
                </div>
                
                {option.price_adjustment !== 0 && (
                  <span className={`text-sm font-semibold ${option.price_adjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {option.price_adjustment > 0 ? '+' : ''}{option.price_adjustment} {t.egp}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto" 
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <DialogHeader>
          <DialogTitle className={`text-2xl ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? translations.ar.customize : translations.en.customize}
          </DialogTitle>
          <DialogDescription className={`${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? translations.ar.customizeDescription : translations.en.customizeDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            {product.image && (
              <img 
                src={product.image} 
                alt={typeof product.name === 'string' ? product.name : product.name[language]}
                className="w-20 h-20 object-cover rounded-md"
              />
            )}
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${isRTL ? 'font-arabic' : ''}`}>
                {typeof product.name === 'string' ? product.name : product.name[language]}
              </h3>
              <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {typeof product.description === 'string' ? product.description : product.description[language]}
              </p>
            </div>
          </div>

          <Separator />

          {/* Attributes */}
          {loading ? (
            <div className="text-center py-8">
              <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t.loading}
              </p>
            </div>
          ) : availableAttributes.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t.noOptions}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className={`font-semibold text-lg ${isRTL ? 'font-arabic' : ''}`}>
                {t.chooseOptions}
              </h3>
              
              {availableAttributes.map(renderAttribute)}
            </div>
          )}

          <Separator />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
              {t.quantity}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Total & Action */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span className={isRTL ? 'font-arabic' : ''}>{t.totalPrice}</span>
              <span className="text-primary">
                {calculateTotalWithQuantity().toFixed(2)} {t.egp}
              </span>
            </div>

            {!isValidSelection && availableAttributes.length > 0 && (
              <p className={`text-sm text-destructive ${isRTL ? 'font-arabic' : ''}`}>
                {t.selectRequired}
              </p>
            )}

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleAddToCart}
              disabled={!isValidSelection || loading}
            >
              {t.addToCart}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicProductCustomization;
