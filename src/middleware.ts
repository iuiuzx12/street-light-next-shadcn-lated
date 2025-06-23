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
    secret: "your-256-bit-secret",
  }
);

let publicPages = ["/", "/login","/logout", "/not-auth"];

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  try {
    const cookies = req.cookies;
    const authToken = cookies.get("token");
    const responseUser = await fetch(
      process.env.API_URL + "/StreetLight/getDataUser",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken?.value,
        },
      }
    );

    if (responseUser.status === 200) {
      publicPages = ["/", "login","/logout", "/not-auth"];
      const DataUser: ListAuth = await responseUser.json().finally();

      

      if (DataUser.dashboard[0] === 1) publicPages.push("/dashboard");
      if(DataUser.groupConfig[0] === 1) publicPages.push("/control-group");
      
    }

    const publicPathnameRegex = RegExp(
      `^(/(${locales.join("|")}))?(${publicPages
        .flatMap((p) => (p === "/" ? ["", "/"] : p))
        .join("|")})/?$`,
      "i"
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
      return intlMiddleware(req);
    } else {
      return (authMiddleware as any)(req);
    }
  } catch (error) {
    return intlMiddleware(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  //matcher: ['/((?!api|_next|.*\\..*).*)']
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*|img/*).*)",
  ],
};
