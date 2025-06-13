// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // รายการภาษาที่รองรับ
  locales: ['th', 'en'],

  // ภาษาเริ่มต้น
  defaultLocale: 'th',

  // กำหนด Path ของแต่ละหน้า
  pathnames: {
    // บอกว่า path "/" คือหน้าหลัก (ซึ่งเราจะใช้เป็นหน้า Login)
    '/': '/',

    // กำหนด path สำหรับหน้า Dashboard
    '/dashboard': {
      th: '/dashboard',
      en: '/dashboard'
    }
  }
});