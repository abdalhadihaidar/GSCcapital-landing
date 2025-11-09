'use client';

import { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface LanguageSwitcherProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export function LanguageSwitcher({ currentLang: propLang, onLanguageChange }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState(propLang || 'en');

  useEffect(() => {
    if (propLang) {
      setCurrentLang(propLang);
    }
  }, [propLang]);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    } else {
      // Store in localStorage as fallback
      localStorage.setItem('language', langCode);
      window.location.reload();
    }
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              currentLang === language.code ? 'bg-slate-100' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}