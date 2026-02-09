import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { requireUser } from "@/lib/auth";

export default async function AccountPasswordPage() {
  await requireUser();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Conta</h1>
      <p className="text-sm text-muted-foreground">
        Atualize sua senha de acesso com segurança.
      </p>
      <ChangePasswordForm />
    </div>
  );
}
