import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, TrendingUp, Award, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface ModernHeroProps {
  onOrderClick: () => void;
}

const ModernHero = ({ onOrderClick }: ModernHeroProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroContent = {
    ar: {
      title: "تجربة طعام استثنائية",
      subtitle: "نقدم لك أشهى المأكولات المحضرة بعناية فائقة من أجود المكونات",
      cta1: "اطلب الآن",
      cta2: "استكشف القائمة",
      stats: [
        { number: "50K+", label: "عميل سعيد" },
        { number: "15+", label: "سنة خبرة" },
        { number: "200+", label: "طبق مميز" }
      ]
    },
    en: {
      title: "Exceptional Dining Experience",
      subtitle: "Discover delicious meals crafted with care from the finest ingredients",
      cta1: "Order Now",
      cta2: "Explore Menu",
      stats: [
        { number: "50K+", label: "Happy Customers" },
        { number: "15+", label: "Years Experience" },
        { number: "200+", label: "Signature Dishes" }
      ]
    }
  };

  const content = heroContent[language];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            className={`space-y-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Award className="w-4 h-4" />
              <span className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'الأفضل في المدينة' : 'Best in Town'}
              </span>
            </div>

            {/* Main Title */}
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight ${isRTL ? 'font-arabic' : ''}`}>
              <span className="block text-foreground">{content.title}</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl text-muted-foreground max-w-xl ${isRTL ? 'font-arabic' : ''}`}>
              {content.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={onOrderClick}
                className="group px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className={isRTL ? 'font-arabic' : ''}>{content.cta1}</span>
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
              
              <Link to="/menu">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 hover:bg-muted transition-all duration-300"
                >
                  <span className={isRTL ? 'font-arabic' : ''}>{content.cta2}</span>
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {content.stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center lg:text-${isRTL ? 'right' : 'left'} ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Content */}
          <div className={`relative ${isVisible ? 'animate-scale-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-2xl mx-auto">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <ChefHat className="w-64 h-64 text-primary/30" />
                </div>
                
                {/* Overlay Badges */}
                <div className="absolute top-8 right-8 bg-card rounded-2xl p-4 shadow-lg animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">4.9</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'التقييم' : 'Rating'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 bg-card rounded-2xl p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">200+</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'طلب يومي' : 'Daily Orders'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
