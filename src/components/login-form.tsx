// components/login-form.tsx
'use client';

import Link from "next/link"
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "./language-switcher";

export function LoginForm() {
  const t = useTranslations('LoginPage');
  
  return (
    <Card className="mx-auto max-w-sm shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="relative pb-8">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto  flex items-center justify-center ">
            <img 
              src="/logo/images.jpeg" 
              alt="Company Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">{t('title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              {t('usernameLabel')}
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              className="h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500/20 focus:ring-2 transition-all duration-200"
              placeholder={t('inputPlaceholderUsername')}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('passwordLabel')}
              </Label>
              
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500/20 focus:ring-2 transition-all duration-200"
              placeholder={t('inputPlaceholderPassword')}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 focus-visible:ring-sky-500 focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {t('loginButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}