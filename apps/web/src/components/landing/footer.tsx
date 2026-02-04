import { Github } from "lucide-react";
import { FadeIn } from "./fade-in";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn variant="fade" duration={600}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Logo / Name */}
            <div className="font-mono text-sm text-muted-foreground">
              <span className="text-foreground">pdf-tools</span> — Built with Bun
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.npmjs.com/package/@k-dang/pdf-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                npm
              </a>
              <a
                href="https://github.com/k-dang/pdf-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
