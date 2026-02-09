"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { messages } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      router.push("/personas");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/personas`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Conta criada. Se necessário, confirme seu e-mail antes de entrar.");
    setMode("signin");
    setLoading(false);
  }

  return (
    <Card className="border-zinc-300 bg-background/80 backdrop-blur-sm dark:border-zinc-700">
      <CardHeader>
        <CardTitle>{messages.auth.title}</CardTitle>
        <CardDescription>{messages.auth.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">{messages.auth.email}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{messages.auth.password}</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          {mode === "signin" && (
            <p className="text-right text-sm text-muted-foreground">
              <Link href="/auth/recover" className="underline underline-offset-4">
                Esqueci minha senha
              </Link>
            </p>
          )}

          <Button className="w-full" disabled={loading} type="submit">
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            {mode === "signin" ? messages.auth.signIn : messages.auth.signUp}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => setMode((current) => (current === "signin" ? "signup" : "signin"))}
          >
            {mode === "signin" ? messages.auth.switchToSignUp : messages.auth.switchToSignIn}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline underline-offset-4">
              Voltar para início
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
