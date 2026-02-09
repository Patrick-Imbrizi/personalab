import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function AuthPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/personas");
  }

  return (
    <div className="mx-auto grid min-h-[calc(100dvh-8rem)] w-full max-w-md place-items-center">
      <AuthForm />
    </div>
  );
}
