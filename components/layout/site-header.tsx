"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Radio, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/player", label: "Player" },
  { href: "/stream-tester", label: "Stream Tester" },
  { href: "/saved-streams", label: "Saved Streams" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, configured, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Centered pill navbar */}
        <div
          className={cn(
            "flex h-[3.75rem] items-center justify-between rounded-full border px-3 sm:px-5 transition-all duration-300",
            "glass border-border shadow-soft",
            scrolled && "shadow-brand"
          )}
        >
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand sm:h-10 sm:w-10">
              <Radio className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="hidden text-lg font-extrabold tracking-tight sm:inline sm:text-xl">
              Play<span className="brand-gradient-text">Delay</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-semibold transition-all xl:px-4",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/65 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-1.5 lg:flex">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-primary/10"
                  asChild
                >
                  <Link href="/account">Account</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/25 bg-transparent backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-primary/10"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="gradient" size="sm" className="rounded-full" asChild>
                  <Link href={configured ? "/signup" : "/player"}>
                    {configured ? "Get started" : "Open player"}
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="glass inline-flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu — centered rounded panel below pill */}
        {open && (
          <div className="glass mt-2 overflow-hidden rounded-3xl border border-primary/20 shadow-brand lg:hidden">
            <nav className="flex flex-col gap-1 p-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-primary/10"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-primary/15 pt-3">
                {user ? (
                  <>
                    <Button variant="ghost" className="rounded-full" asChild>
                      <Link href="/account" onClick={() => setOpen(false)}>
                        Account
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="rounded-full" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button variant="gradient" className="rounded-full" asChild>
                      <Link
                        href={configured ? "/signup" : "/player"}
                        onClick={() => setOpen(false)}
                      >
                        {configured ? "Get started" : "Open player"}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
