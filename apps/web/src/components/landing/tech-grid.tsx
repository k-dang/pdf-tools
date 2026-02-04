import { Zap, Shield, Layers, Sparkles } from "lucide-react";
import { FadeIn } from "./fade-in";

const features = [
  {
    icon: Zap,
    title: "Bun-Powered",
    description: "Lightning-fast runtime for instant operations",
  },
  {
    icon: Shield,
    title: "TypeScript",
    description: "Type-safe CLI with full IntelliSense support",
  },
  {
    icon: Layers,
    title: "Dual Interface",
    description: "Command-line and interactive TUI modes",
  },
  {
    icon: Sparkles,
    title: "Smart Defaults",
    description: "Auto-naming and sensible output conventions",
  },
];

export function TechGrid() {
  return (
    <section className="section border-y border-white/5 bg-card/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} variant="fade-up" delay={i * 100} duration={500}>
              <TechCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-accent-green">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-1 font-mono text-sm font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
