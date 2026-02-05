import { Terminal } from "./terminal";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { FadeIn } from "./fade-in";

export function InstallCta() {
  return (
    <section className="section relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <FadeIn variant="fade-up" duration={600}>
          <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
            Get Started
          </h2>
        </FadeIn>
        <FadeIn variant="fade-up" delay={100} duration={600}>
          <p className="mb-8 text-lg text-muted-foreground">
            Install globally and start manipulating PDFs in seconds.
          </p>
        </FadeIn>

        {/* Install command */}
        <FadeIn variant="scale" delay={200} duration={600}>
          <Terminal
            lines={[{ prompt: "$ ", command: "bun add -g @k-dang/pdf-tools" }]}
            showCopyButton
            className="mb-4"
          />
        </FadeIn>

        {/* GitHub button */}
        <FadeIn variant="fade-up" delay={300} duration={500}>
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
              <Star className="h-4 w-4" />
              Star on GitHub
            </a>
          </Button>
        </FadeIn>
      </div>

      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent-green/5 blur-3xl" />
      </div>
    </section>
  );
}
