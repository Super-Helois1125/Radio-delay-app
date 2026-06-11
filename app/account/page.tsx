"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Mail, Settings2, ShieldCheck, User2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/auth-provider";
import {
  userPreferencesService,
  type UserPreferences,
} from "@/services/user-preferences-service";

export default function AccountPage() {
  const { user, loading, configured, signOut } = useAuth();
  const router = useRouter();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace("/login?redirectTo=/account");
    }
  }, [loading, configured, user, router]);

  useEffect(() => {
    userPreferencesService.get().then(setPrefs);
  }, [user]);

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out.");
    router.push("/");
  }

  return (
    <div className="page-section w-full">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <span className="eyebrow">Account</span>
          <h1 className="section-heading">Your profile</h1>
        </div>

        {!configured ? (
          <Card>
            <CardHeader>
              <CardTitle>Demo mode</CardTitle>
              <CardDescription>
                Supabase isn&apos;t configured, so there&apos;s no account to
                manage yet. Your preferences and saved streams are stored
                locally in this browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="gradient" asChild>
                <Link href="/player">Go to player</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5 text-primary" /> Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.email ?? "—"}</span>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Your data is protected by Supabase Row Level Security.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" /> Preferences
                </CardTitle>
                <CardDescription>
                  Defaults applied when you open the player.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Default delay</dt>
                    <dd className="text-lg font-bold">
                      {prefs ? `${prefs.defaultDelaySeconds}s` : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Default volume</dt>
                    <dd className="text-lg font-bold">
                      {prefs ? `${Math.round(prefs.defaultVolume * 100)}%` : "—"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
