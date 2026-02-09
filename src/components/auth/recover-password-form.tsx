"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecoverPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    const redirectTo = `${window.location.origin}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("E-mail de redefinição enviado. Verifique sua caixa de entrada.");
    setLoading(false);
  }

  return (
    <Card className="border-zinc-300 bg-background/80 backdrop-blur-sm dark:border-zinc-700">
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Enviaremos um link para redefinir sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="recover-email">E-mail</Label>
            <Input
              id="recover-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <Button className="w-full" disabled={loading} type="submit">
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            Enviar link de recuperação
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/auth" className="underline underline-offset-4">
              Voltar para login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
