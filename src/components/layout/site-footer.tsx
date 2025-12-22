import { Container } from "./container";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50 py-12">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-2">UNOPS Starter</h3>
            <p className="text-sm text-muted-foreground">
              A minimal, cloneable Next.js starter for UN/UNOPS projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="https://registry-unops.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Component Registry
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/un-org/unops-starter"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-2">Legal</h3>
            <p className="text-sm text-muted-foreground">
              MIT License • Built for UN-style products
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} PascheK. Made with ❤️ for UNOPS</p>
        </div>
      </Container>
    </footer>
  );
}
