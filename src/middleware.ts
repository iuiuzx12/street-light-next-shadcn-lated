import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextFetchEvent, NextRequest } from "next/server";
// ListAuth might not be needed here anymore if the API call is removed
// import { ListAuth } from "./interface/auth";

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
  secret: "your-256-bit-secret", // Ensure this matches the secret in next-auth options
  }
);

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const token = await getToken({ req, secret: "your-256-bit-secret" });

  let publicPages = ["/", "/login", "/logout", "/not-auth"];

  // Check if token exists and has the dashboardPermission property
  // The value 1 indicates permission, adjust if your API returns boolean or other values
  if (token && (token as any).dashboardPermission === 1) {
    publicPages.push("/dashboard");
  }
  // Add other pages that depend on token flags similarly

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p)) // Handle root path correctly
      .join("|")})/?$`,
    "i"
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req); // Serve public page with internationalization
  } else {
    // For non-public pages, enforce authentication using authMiddleware
    // authMiddleware will redirect to signIn page if not authenticated
    return (authMiddleware as any)(req, event);
  }
  // The try-catch block for the API call is removed.
  // General error handling for middleware execution can be added if needed,
  // but often, letting errors propagate to Next.js default error handling is fine
  // or specific errors handled by intlMiddleware or authMiddleware.
}

export const config = {
  // Skip all paths that should not be internationalized
  //matcher: ['/((?!api|_next|.*\\..*).*)']
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*|img/*).*)",
  ],
};
