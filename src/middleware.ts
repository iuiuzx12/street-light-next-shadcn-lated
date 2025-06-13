import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const locales = routing.locales;
const intlMiddleware = createMiddleware(routing);

// Base public pages - root path เป็น login
const BASE_PUBLIC_PAGES = ["/", "/not-auth", "/logout"];

export default async function middleware(req: NextRequest) {
  try {
    const cookiesStore = req.cookies;
    const authToken = cookiesStore.get('token');
    const publicPages = [...BASE_PUBLIC_PAGES];

    // ถ้า user login แล้วและเข้า root path ให้ redirect ไป dashboard
    if (authToken?.value && (req.nextUrl.pathname === '/th' || req.nextUrl.pathname === '/en' || req.nextUrl.pathname === '/')) {
      try {
        const responseUser = await fetch(
          `${process.env.API_URL}/StreetLight/getUserData`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken.value}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              projectname: process.env.NEXT_PUBLIC_PROJECT_ID 
            }),
          }
        );

        if (responseUser.ok) {
          const userData = await responseUser.json();
          if (userData.dashboard && userData.dashboard[0] === 1) {
            // Redirect logged-in user ไป dashboard
            const locale = req.nextUrl.pathname.split('/')[1] || 'th';
            return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
          }
        }
      } catch (error) {
        console.error('Error checking user auth:', error);
      }
    }

    // เช็ค permissions สำหรับ logged-in users
    if (authToken?.value) {
      try {
        const responseUser = await fetch(
          `${process.env.API_URL}/StreetLight/getUserData`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken.value}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              projectname: process.env.NEXT_PUBLIC_PROJECT_ID 
            }),
          }
        );

        if (responseUser.ok) {
          const userData = await responseUser.json();
          if (userData.dashboard && userData.dashboard[0] === 1) {
            publicPages.push("/dashboard");
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    const publicPathnameRegex = new RegExp(
      `^(/(${locales.join("|")}))?(${publicPages
        .flatMap((p) => (p === "/" ? ["", "/"] : p))
        .join("|")})/?$`,
      "i"
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
      return intlMiddleware(req);
    } else {
      // Protected pages - redirect to login (root)
      if (!authToken?.value) {
        const locale = req.nextUrl.pathname.split('/')[1] || 'th';
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
      }
      return intlMiddleware(req);
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*|img/*).*)",
  ],
};