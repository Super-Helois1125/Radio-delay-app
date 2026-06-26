import type { NextRequest, NextResponse } from "next/server";

/** Supabase auth cookies are prefixed with `sb-` (may be chunked as `.0`, `.1`, …). */
export function clearSupabaseAuthCookies(
  response: NextResponse,
  request: NextRequest
) {
  for (const { name } of request.cookies.getAll()) {
    if (name.startsWith("sb-")) {
      response.cookies.delete(name);
    }
  }
}
