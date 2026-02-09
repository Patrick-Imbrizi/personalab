"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("A confirmação da nova senha não confere.");
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user?.email) {
      toast.error("Não foi possível validar o usuário autenticado.");
      setLoading(false);
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword,
    });

    if (reauthError) {
      toast.error("Senha atual incorreta.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      toast.error(updateError.message);
      setLoading(false);
      return;
    }

    toast.success("Senha alterada com sucesso.");
    router.push("/personas");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>
        <CardDescription>
          Informe sua senha atual e defina uma nova senha de acesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="current-password">Senha atual</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-password-account">Nova senha</Label>
            <Input
              id="new-password-account"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-new-password-account">Confirmar nova senha</Label>
            <Input
              id="confirm-new-password-account"
              type="password"
              autoComplete="new-password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          <Button className="w-full" disabled={loading} type="submit">
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            Salvar nova senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
