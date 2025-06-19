// app/[locale]/layout.tsx
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import {routing} from '@/i18n/routing';
import "../globals.css" // ตรวจสอบ path ของ globals.css ให้ถูกต้อง
import { notFound } from "next/navigation";



const inter = Inter({ subsets: ["latin"] });

// คุณอาจจะต้องเพิ่ม type สำหรับ params หาก TypeScript แจ้งเตือน


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {

  
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}