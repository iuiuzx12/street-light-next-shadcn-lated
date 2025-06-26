// src/middleware.ts

import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextFetchEvent, NextRequest } from "next/server";
import { ListAuth } from "./interface/auth";

const locales = ["en", "th"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "th",
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/not-auth",
    },
    secret: "your-256-bit-secret", // ควรเปลี่ยนเป็น secret ของคุณ
  }
);

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  // 1. กำหนดรายการหน้า public พื้นฐานไว้ก่อน
  const basePublicPages = ["/", "/login", "/logout", "/not-auth"];

  // 2. ฟังก์ชันสำหรับตรวจสอบว่าเป็น public page หรือไม่
  const isPublic = (pathname: string, pages: string[]) => {
    const publicPathnameRegex = RegExp(
      `^(/(${locales.join("|")}))?(${pages
        .flatMap((p) => (p === "/" ? ["", "/"] : p))
        .join("|")})/?$`,
      "i"
    );
    return publicPathnameRegex.test(pathname);
  };
  
  // 3. ตรวจสอบ Token
  const authToken = req.cookies.get("token");

  // 4. ถ้ามี Token ให้พยายามดึงข้อมูลสิทธิ์และเพิ่มหน้าเข้าไปในรายการที่เข้าถึงได้
  let allowedPages = [...basePublicPages];
  if (authToken?.value) {
    try {
      const responseUser = await fetch(
        process.env.API_URL + "/StreetLight/getDataUser",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + authToken.value,
          },
        }
      );

      if (responseUser.status === 200) {
        const DataUser: ListAuth = await responseUser.json();
        // เพิ่มหน้าที่ได้รับอนุญาตตามสิทธิ์
        if (DataUser.dashboard && DataUser.dashboard[0] === 1) allowedPages.push("/dashboard");
        if (DataUser.groupConfig && DataUser.groupConfig[0] === 1) allowedPages.push("/control-group");
        // ... เพิ่มหน้าอื่นๆ ตามสิทธิ์ ...
      }
    } catch (error) {
      console.error("Middleware: Could not fetch user data.", error);
      // หากเกิด error ในการติดต่อ API ให้ใช้สิทธิ์พื้นฐานไปก่อน
    }
  }

  // 5. ตรวจสอบว่าหน้าที่กำลังจะเข้าถึง อยู่ในรายการที่ได้รับอนุญาตหรือไม่
  const isPublicPage = isPublic(req.nextUrl.pathname, allowedPages);
  
  if (isPublicPage) {
    // ถ้าเป็นหน้าที่เข้าถึงได้ ให้ผ่าน intlMiddleware เพื่อจัดการภาษา
    return intlMiddleware(req);
  } else {
    // ถ้าไม่ใช่ ให้ผ่าน authMiddleware เพื่อจัดการ redirect ไปหน้า login
    // โดย ณ จุดนี้ withAuth จะทำงานตามที่เราตั้งค่าไว้คือถ้า token ไม่มีค่า (null) จะ redirect ไป /not-auth
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*|img/*).*)",
  ],
};