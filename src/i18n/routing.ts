import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'th',
  localePrefix: {
    mode: 'always',
    prefixes: {
      'en': '/en',
      'th': '/th'
    }
  },
  pathnames: {
    '/': '/',
    '/organization': {
      'en': '/organization',
      'th': '/organisation'
    }
  }
});