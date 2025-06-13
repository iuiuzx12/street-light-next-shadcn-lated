// components/login-form.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale} from 'next-intl'
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "./language-switcher";
import { LogIn } from 'lucide-react';

export function LoginForm() {
  const rounter = useRouter();
  const locale = useLocale();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isloading, setLoading] = useState(false);
  const t = useTranslations('LoginPage');
 

  const haddleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('api/login/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': "1234"
        },
        body: JSON.stringify({ 
          username: username,
          password: password,
          projectname : process.env.NEXT_PUBLIC_PROJECT_ID 
        }),
      })

      if(res.status === 200) {
        setError(t('loginSuccess'));
        rounter.push(`/${locale}/dashboard`);
        rounter.refresh();
      } else{
        setLoading(false);
        setError(t('loginFailed'));
      }
    } catch {
      setError(t('loginError'));
    }
  }
  
  return (
    <Card className="mx-auto max-w-sm shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="relative pb-8">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto  flex items-center justify-center ">
            <Image 
              src="/logo/images.jpeg" 
              alt="Company Logo"
              width={100}
              height={100}
              className=" object-contain rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">{t('title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={haddleLogin}>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              {t('usernameLabel')}
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
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
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500/20 focus:ring-2 transition-all duration-200 pr-12"
                placeholder={t('inputPlaceholderPassword')}
              />
              
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          </div>
          
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 focus-visible:ring-sky-500 focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={isloading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {t('loginButton')}
          </Button>
        </form>
        <br />

        <p className="text-zinc-600 text-sm text-center text-bold">
          © 2024 - LOCAL Admin by L&E Lighting and Equipment Public Company
          Limited.
        </p>
      </CardContent>
    </Card>
  )
}
