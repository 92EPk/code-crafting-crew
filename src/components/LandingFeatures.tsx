import { Card, CardContent } from "@/components/ui/card";
import { Truck, Star, Shield, Clock, ChefHat, Heart } from "lucide-react";

interface LandingFeaturesProps {
  language: 'ar' | 'en';
}

const LandingFeatures = ({ language }: LandingFeaturesProps) => {
  const translations = {
    ar: {
      whyChooseUs: "لماذا تختارنا؟",
      subtitle: "نحن نقدم أفضل تجربة طعام ممكنة",
      fastDelivery: "توصيل سريع",
      fastDeliveryDesc: "توصيل خلال 30-45 دقيقة",
      topQuality: "جودة عالية",
      topQualityDesc: "أجود المكونات والخامات",
      securePayment: "دفع آمن",
      securePaymentDesc: "طرق دفع متعددة وآمنة",
      availableAlways: "متاح دائماً",
      availableAlwaysDesc: "خدمة 16 ساعة يومياً",
      expertChefs: "طهاة خبراء",
      expertChefsDesc: "فريق من أمهر الطهاة",
      customerLove: "حب العملاء",
      customerLoveDesc: "آلاف العملاء السعداء"
    },
    en: {
      whyChooseUs: "Why Choose Us?",
      subtitle: "We provide the best possible food experience",
      fastDelivery: "Fast Delivery",
      fastDeliveryDesc: "Delivery within 30-45 minutes",
      topQuality: "Top Quality",
      topQualityDesc: "Finest ingredients and materials",
      securePayment: "Secure Payment",
      securePaymentDesc: "Multiple safe payment methods",
      availableAlways: "Always Available",
      availableAlwaysDesc: "16 hours service daily",
      expertChefs: "Expert Chefs",
      expertChefsDesc: "Team of skilled chefs",
      customerLove: "Customer Love",
      customerLoveDesc: "Thousands of happy customers"
    }
  };

  const features = [
    {
      icon: Truck,
      title: translations[language].fastDelivery,
      description: translations[language].fastDeliveryDesc,
      color: "bg-primary text-primary-foreground"
    },
    {
      icon: Star,
      title: translations[language].topQuality,
      description: translations[language].topQualityDesc,
      color: "bg-accent text-accent-foreground"
    },
    {
      icon: Shield,
      title: translations[language].securePayment,
      description: translations[language].securePaymentDesc,
      color: "bg-secondary text-secondary-foreground"
    },
    {
      icon: Clock,
      title: translations[language].availableAlways,
      description: translations[language].availableAlwaysDesc,
      color: "bg-primary text-primary-foreground"
    },
    {
      icon: ChefHat,
      title: translations[language].expertChefs,
      description: translations[language].expertChefsDesc,
      color: "bg-accent text-accent-foreground"
    },
    {
      icon: Heart,
      title: translations[language].customerLove,
      description: translations[language].customerLoveDesc,
      color: "bg-secondary text-secondary-foreground"
    }
  ];

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <section className="py-20 bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.whyChooseUs}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className={`${feature.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;