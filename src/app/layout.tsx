import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaLab",
  description:
    "Webapp acadêmico para apoiar exercícios da disciplina Interface e Jornada do Usuário, com criação e exportação de personas de UX.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AppHeader isAuthenticated={Boolean(user?.id)} email={user?.email ?? null} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 print:max-w-none print:px-0">
            {children}
          </main>
          <footer className="border-t py-5 print:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
              <p>Projeto acadêmico para a disciplina Interface e Jornada do Usuário.</p>
              <p>
                Feito por Patrick Imbrizi ·{" "}
                <a
                  href="https://github.com/Patrick-Imbrizi/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4"
                >
                  github.com/Patrick-Imbrizi
                </a>
              </p>
            </div>
          </footer>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
