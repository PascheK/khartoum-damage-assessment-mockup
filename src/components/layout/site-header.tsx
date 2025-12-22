import Link from "next/link";
import { Container } from "./container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-lg text-foreground hover:text-primary transition-colors"
          >
            UNOPS
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="https://registry-unops.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Registry
          </Link>
          <Link
            href="https://github.com/un-org/unops-starter"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </nav>
      </Container>
    </header>
  );
}
