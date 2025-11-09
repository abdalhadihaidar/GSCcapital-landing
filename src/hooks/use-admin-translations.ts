import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

export function useAdminTranslations() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ar', 'zh', 'fr', 'es'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const t = translations[language].admin;
  const isRTL = language === 'ar';

  return { t, language, setLanguage, isRTL };
}

