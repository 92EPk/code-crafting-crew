import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Menu, X, Globe, Phone, MapPin, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, isRTL } = useLanguage();
  const t = translations[language];

  return (
    <header className="bg-background shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+20 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{language === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="text-primary-foreground hover:bg-primary-dark"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0161c61f-e0e5-469c-b26a-59aa97cc4b86.png" 
              alt="Mix and Taste" 
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse" dir={isRTL ? 'rtl' : 'ltr'}>
            <a href="#home" className={`text-foreground hover:text-primary transition-colors font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t.home}
            </a>
            <Link to="/full-menu" className={`text-foreground hover:text-primary transition-colors font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t.fullMenu}
            </Link>
            <a href="#contact" className={`text-foreground hover:text-primary transition-colors font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t.contact}
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className={isRTL ? 'font-arabic' : ''}>{t.callNow}</span>
            </Button>
            
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="hidden md:inline-flex"
              >
                <User className="h-4 w-4 mr-2" />
                <span className={isRTL ? 'font-arabic' : ''}>{t.dashboard}</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="hidden md:inline-flex"
              >
                <User className="h-4 w-4 mr-2" />
                <span className={isRTL ? 'font-arabic' : ''}>{t.signIn}</span>
              </Button>
            )}
            
            <Button 
              variant="default"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className={isRTL ? 'font-arabic' : ''}>{t.orderNow}</span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-secondary text-secondary-foreground">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col space-y-3 pt-4">
              <a href="#home" className={`text-foreground hover:text-primary transition-colors font-medium ${isRTL ? 'font-arabic' : ''}`}>
                {t.home}
              </a>
              <Link to="/full-menu" className={`text-foreground hover:text-primary transition-colors font-medium ${isRTL ? 'font-arabic' : ''}`}>
                {t.fullMenu}
              </Link>
              <a href="#contact" className={`text-foreground hover:text-primary transition-colors font-medium ${isRTL ? 'font-arabic' : ''}`}>
                {t.contact}
              </a>
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                <span className={isRTL ? 'font-arabic' : ''}>{t.callNow}</span>
              </Button>
              {user ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className={isRTL ? 'font-arabic' : ''}>{t.dashboard}</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className={isRTL ? 'font-arabic' : ''}>{t.signIn}</span>
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;