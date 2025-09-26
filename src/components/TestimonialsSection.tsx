import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface TestimonialsSectionProps {
  language: 'ar' | 'en';
}

const TestimonialsSection = ({ language }: TestimonialsSectionProps) => {
  const translations = {
    ar: {
      customerReviews: "آراء عملائنا",
      subtitle: "ماذا يقول عملاؤنا عنا",
      testimonials: [
        {
          name: "أحمد محمد",
          review: "أفضل مطعم جربته في حياتي! الطعم رائع والجودة ممتازة والتوصيل سريع جداً.",
          rating: 5,
          location: "القاهرة"
        },
        {
          name: "فاطمة أحمد", 
          review: "الطعام لذيذ جداً والخدمة ممتازة. أنصح الجميع بتجربة برجر اللحم المشوي.",
          rating: 5,
          location: "الجيزة"
        },
        {
          name: "محمد علي",
          review: "خدمة توصيل سريعة وطعام ساخن ولذيذ. سأطلب مرة أخرى بالتأكيد!",
          rating: 5,
          location: "الإسكندرية"
        }
      ]
    },
    en: {
      customerReviews: "Customer Reviews",
      subtitle: "What our customers say about us",
      testimonials: [
        {
          name: "Ahmed Mohamed",
          review: "Best restaurant I've ever tried! Amazing taste, excellent quality, and very fast delivery.",
          rating: 5,
          location: "Cairo"
        },
        {
          name: "Fatima Ahmed",
          review: "Very delicious food and excellent service. I recommend everyone to try the grilled beef burger.",
          rating: 5,
          location: "Giza"
        },
        {
          name: "Mohamed Ali", 
          review: "Fast delivery service and hot, delicious food. I will definitely order again!",
          rating: 5,
          location: "Alexandria"
        }
      ]
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <section className="py-20 bg-gradient-to-br from-background-cream/30 to-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.customerReviews}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-0 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-primary/10 text-primary p-2 rounded-full">
                <Quote className="h-4 w-4" />
              </div>
              
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Review */}
                <p className={`text-muted-foreground mb-6 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                  "{testimonial.review}"
                </p>

                {/* Customer Info */}
                <div className="border-t pt-4">
                  <h4 className={`font-semibold text-foreground mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-primary/10 rounded-lg p-8">
            <div className="text-4xl font-bold text-primary mb-2">4.9</div>
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'تقييم متوسط' : 'Average Rating'}
            </div>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-8">
            <div className="text-4xl font-bold text-accent mb-2">1,200+</div>
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'تقييم إيجابي' : 'Positive Reviews'}
            </div>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-8">
            <div className="text-4xl font-bold text-secondary mb-2">15,000+</div>
            <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'عميل سعيد' : 'Happy Customers'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;