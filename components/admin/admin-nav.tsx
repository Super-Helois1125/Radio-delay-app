"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Radio,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/streams", label: "Streams", icon: Activity },
  { href: "/admin/teams", label: "Teams", icon: Trophy },
  { href: "/admin/stations", label: "Stations", icon: Radio },
  { href: "/admin/agents", label: "Agents", icon: Bot },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      {ADMIN_NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("admin-nav__link", active && "admin-nav__link--active")}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
