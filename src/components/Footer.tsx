import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Heart } from "lucide-react";

// TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

interface FooterProps {
  language: 'ar' | 'en';
}

const Footer = ({ language }: FooterProps) => {
  const translations = {
    ar: {
      quickLinks: "روابط سريعة",
      home: "الرئيسية",
      menu: "القائمة",
      offers: "العروض",
      contact: "تواصل معنا",
      about: "من نحن",
      contactInfo: "معلومات التواصل",
      followUs: "تابعنا على",
      workingHours: "ساعات العمل",
      dailyHours: "يومياً من 10:00 ص إلى 2:00 ص",
      addressText: "شارع التحرير، وسط البلد، القاهرة، مصر",
      rightsReserved: "جميع الحقوق محفوظة",
      madeWith: "صُنع بـ",
      forRestaurant: "لمطعم مزيج وطعم",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة"
    },
    en: {
      quickLinks: "Quick Links",
      home: "Home",
      menu: "Menu",
      offers: "Offers", 
      contact: "Contact",
      about: "About Us",
      contactInfo: "Contact Information",
      followUs: "Follow Us",
      workingHours: "Working Hours",
      dailyHours: "Daily from 10:00 AM to 2:00 AM",
      addressText: "Tahrir Street, Downtown, Cairo, Egypt",
      rightsReserved: "All rights reserved",
      madeWith: "Made with",
      forRestaurant: "for Mix and Taste Restaurant",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service"
    }
  };

  const quickLinks = [
    { name: translations[language].home, href: "#home" },
    { name: translations[language].menu, href: "#menu" },
    { name: translations[language].offers, href: "#offers" },
    { name: translations[language].contact, href: "#contact" },
    { name: translations[language].about, href: "#about" }
  ];

  const socialMedia = [
    { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600" },
    { icon: Instagram, href: "https://instagram.com", color: "hover:text-pink-600" },
    { icon: TikTokIcon, href: "https://tiktok.com", color: "hover:text-pink-500" }
  ];

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <footer className="bg-neutral-dark text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/0161c61f-e0e5-469c-b26a-59aa97cc4b86.png" 
                alt="Mix and Taste" 
                className="h-16 w-auto mb-4 filter brightness-0 invert"
              />
              <p className={`text-gray-300 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' 
                  ? 'مطعم مزيج وطعم - وجهتك لأشهى الأطباق المحضرة بعناية من أجود المكونات'
                  : 'Mix and Taste Restaurant - Your destination for the most delicious dishes prepared with care from the finest ingredients'
                }
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className={`text-gray-300 hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t.contactInfo}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+20 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@mixandtasteegypt.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className={`text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
                    {t.addressText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours & Social */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t.workingHours}
            </h3>
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className={`text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
                    {t.dailyHours}
                  </p>
                </div>
              </div>
            </div>
            
            <h4 className={`text-md font-semibold mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t.followUs}
            </h4>
            <div className="flex gap-4">
              {socialMedia.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost" 
                  size="icon"
                  className={`text-gray-300 ${social.color} transition-colors`}
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`text-gray-300 text-sm ${isRTL ? 'font-arabic' : ''}`}>
            © 2024 Mix and Taste. {t.rightsReserved}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <a href="#" className={`hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}>
              {t.privacyPolicy}
            </a>
            <span>•</span>
            <a href="#" className={`hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}>
              {t.termsOfService}
            </a>
          </div>

          <div className={`flex items-center gap-2 text-sm text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
            {t.madeWith}
            <Heart className="h-4 w-4 text-primary fill-current" />
            {t.forRestaurant}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;