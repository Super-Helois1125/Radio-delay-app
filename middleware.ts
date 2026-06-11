import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets and the AudioWorklet
     * file in /worklets so the processor module always loads.
     */
    "/((?!_next/static|_next/image|favicon.ico|worklets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*)",
  ],
};
