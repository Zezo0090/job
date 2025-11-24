import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleLanguage}
      className="language-switcher"
      data-testid="language-switcher"
      title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe size={20} />
      <span className="lang-text">{i18n.language === 'ar' ? 'EN' : 'عر'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
