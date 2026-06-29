"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Radio, X } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { useAppRouter } from "@/hooks/use-app-router";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/teams", label: "Teams" },
  { href: "/pricing", label: "Pricing" },
  { href: "/player", label: "Player" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useAppRouter();
  const { user, configured, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV_LINKS = [
    ...PUBLIC_LINKS,
    ...(user || !configured ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

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
            "site-header-pill flex h-[3.75rem] items-center justify-between transition-all duration-300",
            scrolled && "site-header-pill--scrolled"
          )}
        >
          <Link href="/" className="site-header-pill__brand flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand sm:h-10 sm:w-10">
              <Radio className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="hidden text-lg font-extrabold tracking-tight text-white sm:inline sm:text-xl">
              Play<span className="text-white/90">Delay</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
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
                    "site-header-pill__link",
                    active && "site-header-pill__link--active"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            {user ? (
              <>
                <Link href="/account" className="site-header-pill__link">
                  <span>Account</span>
                </Link>
                <button
                  type="button"
                  className="site-header-pill__link site-header-pill__link--outline"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="site-header-pill__link">
                  <span>Log in</span>
                </Link>
                <Link
                href="/player"
                className="site-header-pill__link site-header-pill__link--cta"
              >
                <span>Start syncing</span>
              </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="site-header-pill__menu-btn inline-flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu — centered rounded panel below pill */}
        {open && (
          <div className="site-header-pill site-header-pill--dropdown mt-2 overflow-hidden lg:hidden">
            <nav className="flex flex-col gap-1 p-2">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "site-header-pill__link site-header-pill__link--stack",
                      active && "site-header-pill__link--active"
                    )}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="mt-1 flex flex-col gap-1 border-t border-white/15 pt-2">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="site-header-pill__link site-header-pill__link--stack"
                    >
                      <span>Account</span>
                    </Link>
                    <button
                      type="button"
                      className="site-header-pill__link site-header-pill__link--stack site-header-pill__link--outline"
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="site-header-pill__link site-header-pill__link--stack"
                    >
                      <span>Log in</span>
                    </Link>
                    <Link
                      href="/player"
                      onClick={() => setOpen(false)}
                      className="site-header-pill__link site-header-pill__link--stack site-header-pill__link--cta"
                    >
                      <span>Start syncing</span>
                    </Link>
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
