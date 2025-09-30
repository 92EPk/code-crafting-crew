import { ChefHat, Leaf, Clock, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyChooseUs = () => {
  const { language, isRTL } = useLanguage();

  const features = {
    ar: [
      {
        icon: ChefHat,
        title: "طهاة محترفون",
        description: "فريق من أمهر الطهاة ذوي الخبرة الواسعة"
      },
      {
        icon: Leaf,
        title: "مكونات طازجة",
        description: "نستخدم فقط أجود المكونات الطازجة يومياً"
      },
      {
        icon: Clock,
        title: "توصيل سريع",
        description: "نضمن وصول طلبك ساخناً وطازجاً في الوقت المحدد"
      },
      {
        icon: Award,
        title: "جودة مضمونة",
        description: "رضاك هو أولويتنا مع ضمان الجودة الفائقة"
      }
    ],
    en: [
      {
        icon: ChefHat,
        title: "Professional Chefs",
        description: "Team of expert chefs with vast experience"
      },
      {
        icon: Leaf,
        title: "Fresh Ingredients",
        description: "Using only the finest fresh ingredients daily"
      },
      {
        icon: Clock,
        title: "Fast Delivery",
        description: "Your order arrives hot and fresh on time"
      },
      {
        icon: Award,
        title: "Quality Guaranteed",
        description: "Your satisfaction is our priority with premium quality"
      }
    ]
  };

  const content = features[language];

  return (
    <section className="py-20 bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'لماذا نحن؟' : 'Why Choose Us?'}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar' 
              ? 'نقدم لك أفضل تجربة طعام بأعلى معايير الجودة'
              : 'We provide the best dining experience with highest quality standards'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className={`text-xl font-bold mb-3 text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                  {feature.title}
                </h3>
                <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
