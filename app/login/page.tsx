import { Suspense } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Log in — PlayDelay" };

export default function LoginPage() {
  return (
    <div className="page-gutter flex min-h-[calc(100vh-7rem)] w-full items-center justify-center py-16">
      <div className="w-full max-w-md">
        <ScrollReveal className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand">
              <Radio className="h-5 w-5" />
            </span>
            <span className="text-2xl font-extrabold">
              Play<span className="brand-gradient-text">Delay</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Log in to access your saved streams and player.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <Suspense fallback={null}>
                <AuthForm mode="login" />
              </Suspense>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
