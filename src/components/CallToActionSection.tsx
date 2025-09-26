import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CallToActionSectionProps {
  language: 'ar' | 'en';
  onOrderClick: () => void;
}

const CallToActionSection = ({ language, onOrderClick }: CallToActionSectionProps) => {
  const translations = {
    ar: {
      readyToOrder: "جاهز للطلب؟",
      subtitle: "اطلب الآن واستمتع بأشهى الأطباق مع توصيل سريع لباب منزلك",
      orderNow: "اطلب الآن",
      viewMenu: "استعرض القائمة",
      callUs: "اتصل بنا",
      whatsapp: "واتساب"
    },
    en: {
      readyToOrder: "Ready to Order?",
      subtitle: "Order now and enjoy the most delicious dishes with fast delivery to your door",
      orderNow: "Order Now",
      viewMenu: "View Menu", 
      callUs: "Call Us",
      whatsapp: "WhatsApp"
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${isRTL ? 'font-arabic' : ''}`}>
          {t.readyToOrder}
        </h2>
        
        <p className={`text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-12 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
          {t.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button 
            size="lg"
            variant="secondary"
            onClick={onOrderClick}
            className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-4"
          >
            {t.orderNow}
            <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/20 text-lg px-8 py-4"
            asChild
          >
            <Link to="/full-menu">
              {t.viewMenu}
            </Link>
          </Button>
        </div>

        {/* Quick Contact */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="ghost" 
            size="lg"
            className="text-white hover:bg-white/20"
            asChild
          >
            <a href="tel:+201234567899">
              <Phone className="h-5 w-5 mr-2" />
              {t.callUs}
            </a>
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg"
            className="text-white hover:bg-white/20"
            asChild
          >
            <a href="https://wa.me/201234567899" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t.whatsapp}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;