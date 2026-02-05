import { Badge } from "@/components/ui/badge";
import { FadeIn } from "./fade-in";
import Image from "next/image";

export function TuiShowcase() {
  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <FadeIn variant="fade-down" duration={500}>
            <Badge
              variant="outline"
              className="mb-4 border-accent-amber/30 bg-accent-amber/10 text-accent-amber"
            >
              Interactive Mode
            </Badge>
          </FadeIn>
          <FadeIn variant="fade-up" delay={100} duration={600}>
            <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
              When You Want More Control
            </h2>
          </FadeIn>
          <FadeIn variant="fade-up" delay={200} duration={600}>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Launch the interactive TUI for visual file browsing and page
              selection. Perfect for complex selections or when you need to
              preview before extracting.
            </p>
          </FadeIn>
        </div>

        {/* TUI Screenshot */}
        <FadeIn variant="scale" delay={300} duration={700}>
          <div className="relative mx-auto max-w-3xl">
            {/* Ambient glow */}
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-accent-amber/20 via-accent-amber/5 to-transparent blur-2xl" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-accent-amber/10 via-transparent to-accent-green/5 blur-xl" />

            {/* Terminal frame */}
            <div className="relative rounded-xl border border-white/10 bg-black/40 p-1 shadow-2xl shadow-black/50 backdrop-blur-sm">
              {/* Window chrome - title bar */}
              <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="ml-2 font-mono text-[10px] text-white/30">
                  pdf-tools tui
                </span>
              </div>

              {/* Screenshot with overlay effects */}
              <div className="relative overflow-hidden rounded-b-lg">
                <Image
                  src="/interactive.png"
                  alt="PDF Tools interactive TUI mode"
                  width={1200}
                  height={675}
                  className="w-full"
                />
                {/* Subtle scanline overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
                  }}
                />
                {/* Vignette effect */}
                <div className="pointer-events-none absolute inset-0 rounded-b-lg shadow-[inset_0_0_60px_rgba(0,0,0,0.4)]" />
              </div>
            </div>

            {/* Reflection/glow on surface */}
            <div className="absolute -bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-accent-amber/10 blur-2xl" />
          </div>
        </FadeIn>

        {/* Feature list */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <FadeIn variant="fade-up" delay={400} duration={500}>
            <TuiFeature
              title="Keyboard Navigation"
              description="Arrow keys to navigate, Space to toggle selection"
            />
          </FadeIn>
          <FadeIn variant="fade-up" delay={500} duration={500}>
            <TuiFeature
              title="Visual Selection"
              description="See your selection in real-time before extraction"
            />
          </FadeIn>
          <FadeIn variant="fade-up" delay={600} duration={500}>
            <TuiFeature
              title="Range Input Mode"
              description="Press 'r' to enter ranges like '1-5,8,10'"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function TuiFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <h3 className="mb-1 font-mono text-sm font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
