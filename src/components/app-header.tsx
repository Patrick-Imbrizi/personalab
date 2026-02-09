import Link from "next/link";

import { messages } from "@/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

type AppHeaderProps = {
  isAuthenticated: boolean;
  email?: string | null;
};

export function AppHeader({ isAuthenticated, email }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            {messages.appName}
          </Link>
          {isAuthenticated && (
            <nav className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/personas">{messages.nav.dashboard}</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/personas/new">{messages.nav.newPersona}</Link>
              </Button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && email ? (
            <UserMenu email={email} />
          ) : (
            <Button asChild size="sm">
              <Link href="/auth">{messages.nav.auth}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
