// components/language-switcher.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  {
    code: 'th',
    name: 'ไทย',
    flag: '🇹🇭'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }
];

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  
  const handleLanguageChange = (languageCode: string) => {
    // Replace current locale in URL
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${languageCode}`);
    router.push(newPath);
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-10 w-10 p-0 hover:bg-sky-50 hover:scale-105 transition-all duration-200 border border-sky-200 rounded-full shadow-sm"
        >
          <span className="text-2xl" role="img" aria-label={currentLanguage.name}>
            {currentLanguage.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 shadow-lg border-sky-100"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer transition-colors duration-200 ${
              locale === language.code 
                ? 'bg-sky-50 text-sky-700 font-medium' 
                : 'hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            <span className="mr-3 text-lg" role="img" aria-label={language.name}>
              {language.flag}
            </span>
            <span className="text-sm">{language.name}</span>
            {locale === language.code && (
              <svg className="w-4 h-4 ml-auto text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}