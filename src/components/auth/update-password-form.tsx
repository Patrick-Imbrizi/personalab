"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UpdatePasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function prepareRecoverySession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          toast.error("Link inválido ou expirado. Solicite um novo e-mail de recuperação.");
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast.error("Sessão de recuperação não encontrada. Solicite um novo link.");
        return;
      }

      if (mounted) {
        setSessionReady(true);
      }
    }

    void prepareRecoverySession();

    return () => {
      mounted = false;
    };
  }, [supabase.auth]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Senha atualizada com sucesso.");
    router.push("/personas");
    router.refresh();
  }

  return (
    <Card className="border-zinc-300 bg-background/80 backdrop-blur-sm dark:border-zinc-700">
      <CardHeader>
        <CardTitle>Definir nova senha</CardTitle>
        <CardDescription>
          Crie uma senha nova para concluir a recuperação da conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!sessionReady ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Validando sessão de recuperação...
            </p>
            <Button className="w-full" disabled>
              <LoaderCircle className="size-4 animate-spin" />
              Aguarde
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/auth/recover" className="underline underline-offset-4">
                Solicitar novo link
              </Link>
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Confirmar nova senha</Label>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            <Button className="w-full" disabled={loading} type="submit">
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              Atualizar senha
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
