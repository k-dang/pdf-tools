import { Terminal } from "./terminal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

const FALLBACK_VERSION = "0.0.0";

async function getNpmVersion(): Promise<string> {
  try {
    const res = await fetch(
      "https://registry.npmjs.org/@k-dang/pdf-tools/latest",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (!res.ok) return FALLBACK_VERSION;
    const data = await res.json();
    return data.version ?? FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
}

export async function Hero() {
  const version = await getNpmVersion();

  return (
    <section className="section relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 border-accent-green/30 bg-accent-green/10 text-accent-green"
          >
            v{version} now available
          </Badge>

          {/* Heading */}
          <h1 className="mb-6 max-w-3xl font-mono text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            PDF manipulation for the{" "}
            <span className="text-accent-green">command line</span>
          </h1>

          {/* Subheading */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Split, merge, and manage PDFs with precision. A fast, type-safe CLI
            built with Bun. Includes an interactive TUI for visual page
            selection.
          </p>

          {/* Terminal */}
          <Terminal
            lines={[{ prompt: "$ ", command: "bun add -g @k-dang/pdf-tools" }]}
            showCopyButton
            className="mb-10 w-full max-w-xl"
          />

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="gap-2 border-white/20 hover:border-accent-green hover:bg-accent-green/10 hover:text-accent-green"
            >
              <a
                href="https://github.com/k-dang/pdf-tools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://www.npmjs.com/package/@k-dang/pdf-tools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <NpmIcon className="h-4 w-4" />
                npm
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/5 blur-3xl" />
      </div>
    </section>
  );
}

function NpmIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
    </svg>
  );
}
