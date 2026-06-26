import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { clearSupabaseAuthCookies } from "./auth-cookies";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";
import { safeGetUser, safeSignOut } from "./safe-auth";

/** App routes that require an authenticated user. */
const PROTECTED_PREFIXES = [
  "/player",
  "/stream-tester",
  "/saved-streams",
  "/account",
  "/dashboard",
  "/admin",
];

/** Auth routes an already-signed-in user should be bounced away from. */
const AUTH_ROUTES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Without Supabase configured we can't protect routes; let everything
  // through so the audio engine remains demoable locally.
  if (!isSupabaseConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const auth = await safeGetUser(supabase);

  // Stale or unreachable auth — drop cookies so the browser stops retrying
  // token refresh (the source of the "fetch failed" spam in the console).
  if (auth.invalidSession || auth.networkError) {
    await safeSignOut(supabase);
    clearSupabaseAuthCookies(supabaseResponse, request);
  }

  const user = auth.user;
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/player";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
