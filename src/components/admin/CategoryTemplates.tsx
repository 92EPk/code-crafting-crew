import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Utensils, Beef, Drumstick, Cookie, Coffee } from "lucide-react";

interface CategoryTemplate {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: React.ComponentType<any>;
  requiredOptions: string[];
  baseIncludes_ar: string;
  baseIncludes_en: string;
}

const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    id: 'burger',
    name_ar: 'برجر',
    name_en: 'Burger',
    description_ar: 'برجر مع خيارات العيش والصوص',
    description_en: 'Burger with bread and sauce options',
    icon: Utensils,
    requiredOptions: ['bread', 'sauce'],
    baseIncludes_ar: 'يُقدم مع البطاطس والطماطم والبصل والخس',
    baseIncludes_en: 'Served with fries, tomatoes, onions, and lettuce'
  },
  {
    id: 'meat',
    name_ar: 'لحوم',
    name_en: 'Meat',
    description_ar: 'أطباق اللحوم مع خيارات التقديم',
    description_en: 'Meat dishes with presentation options',
    icon: Beef,
    requiredOptions: ['presentation'],
    baseIncludes_ar: 'يُقدم مع بطاطس ومخلل',
    baseIncludes_en: 'Served with fries and pickles'
  },
  {
    id: 'chicken',
    name_ar: 'فراخ',
    name_en: 'Chicken',
    description_ar: 'أطباق الفراخ مع خيارات التقديم',
    description_en: 'Chicken dishes with presentation options',
    icon: Drumstick,
    requiredOptions: ['presentation'],
    baseIncludes_ar: 'يُقدم مع بطاطس ومخلل',
    baseIncludes_en: 'Served with fries and pickles'
  },
  {
    id: 'dessert',
    name_ar: 'حلويات',
    name_en: 'Desserts',
    description_ar: 'حلويات متنوعة',
    description_en: 'Various desserts',
    icon: Cookie,
    requiredOptions: [],
    baseIncludes_ar: '',
    baseIncludes_en: ''
  },
  {
    id: 'beverages',
    name_ar: 'مشروبات',
    name_en: 'Beverages',
    description_ar: 'مشروبات ساخنة وباردة',
    description_en: 'Hot and cold beverages',
    icon: Coffee,
    requiredOptions: [],
    baseIncludes_ar: '',
    baseIncludes_en: ''
  }
];

interface CategoryTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CategoryTemplate) => void;
  language: 'ar' | 'en';
}

const CategoryTemplates = ({ isOpen, onClose, onSelectTemplate, language }: CategoryTemplatesProps) => {
  const isRTL = language === 'ar';

  const translations = {
    ar: {
      selectTemplate: 'اختر نوع الفئة',
      selectDescription: 'اختر نوع الفئة لإضافة الخيارات المناسبة تلقائياً',
      requiredOptions: 'الخيارات المطلوبة',
      baseIncludes: 'يشمل أساساً'
    },
    en: {
      selectTemplate: 'Select Category Type',
      selectDescription: 'Choose category type to automatically add appropriate options',
      requiredOptions: 'Required options',
      baseIncludes: 'Base includes'
    }
  };

  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'font-arabic' : ''}>{t.selectTemplate}</DialogTitle>
          <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
            {t.selectDescription}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? template.name_ar : template.name_en}
                    </h3>
                    <p className={`text-sm text-muted-foreground mt-1 ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? template.description_ar : template.description_en}
                    </p>
                    
                    {template.requiredOptions.length > 0 && (
                      <div className="mt-2">
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {t.requiredOptions}:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.requiredOptions.map((option) => (
                            <Badge key={option} variant="secondary" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(template.baseIncludes_ar || template.baseIncludes_en) && (
                      <div className="mt-2">
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {t.baseIncludes}:
                        </p>
                        <p className={`text-xs text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? template.baseIncludes_ar : template.baseIncludes_en}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryTemplates;
export type { CategoryTemplate };