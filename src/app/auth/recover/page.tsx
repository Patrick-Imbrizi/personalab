import { RecoverPasswordForm } from "@/components/auth/recover-password-form";

export default function RecoverPasswordPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-8rem)] w-full max-w-md place-items-center">
      <RecoverPasswordForm />
    </div>
  );
}
