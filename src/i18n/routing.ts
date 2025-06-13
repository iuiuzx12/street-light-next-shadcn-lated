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
    '/not-auth': '/not-auth',
    '/organization': {
      'en': '/organization',
      'th': '/organisation'
    }
  }
});