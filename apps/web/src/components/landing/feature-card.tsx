import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "./fade-in";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  className?: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  className,
  delay = 0,
}: FeatureCardProps) {
  return (
    <FadeIn variant="fade-up" delay={delay} duration={600}>
      <div
        className={cn(
          "group relative rounded-xl border border-white/10 bg-card p-6 h-full",
          "transition-all duration-300",
          "hover:border-accent-green/30 hover:bg-card/80",
          className
        )}
      >
        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-xl bg-accent-green/5" />
        </div>

        <div className="relative">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-accent-green transition-colors group-hover:border-accent-green/30">
            <Icon className="h-6 w-6" />
          </div>

          {/* Title with optional badge */}
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-mono text-lg font-semibold">{title}</h3>
            {badge && (
              <Badge
                variant="outline"
                className="border-accent-amber/30 bg-accent-amber/10 text-accent-amber text-xs"
              >
                {badge}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </FadeIn>
  );
}

interface FeatureGridProps {
  children: React.ReactNode;
  className?: string;
}

export function FeatureGrid({ children, className }: FeatureGridProps) {
  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-6">
        <div className={cn("grid gap-6 md:grid-cols-3", className)}>
          {children}
        </div>
      </div>
    </section>
  );
}
