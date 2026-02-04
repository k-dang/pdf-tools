import { Scissors, Layers, Terminal } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { FeatureCard, FeatureGrid } from "@/components/landing/feature-card";
import { SplitDemo } from "@/components/landing/split-demo";
import { MergeDemo } from "@/components/landing/merge-demo";
import { TuiShowcase } from "@/components/landing/tui-showcase";
import { TechGrid } from "@/components/landing/tech-grid";
import { InstallCta } from "@/components/landing/install-cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <Hero />

      {/* Feature Triptych */}
      <FeatureGrid>
        <FeatureCard
          icon={Scissors}
          title="Split"
          description="Extract pages with surgical precision. Single pages, ranges, or complex selections."
          delay={0}
        />
        <FeatureCard
          icon={Layers}
          title="Merge"
          description="Combine documents seamlessly while preserving quality and metadata."
          delay={100}
        />
        <FeatureCard
          icon={Terminal}
          title="TUI"
          description="Interactive visual interface for browsing and selecting pages."
          badge="Interactive"
          delay={200}
        />
      </FeatureGrid>

      {/* Split Demo */}
      <SplitDemo />

      {/* Merge Demo */}
      <MergeDemo />

      {/* TUI Showcase */}
      <TuiShowcase />

      {/* Tech Grid */}
      <TechGrid />

      {/* Install CTA */}
      <InstallCta />

      {/* Footer */}
      <Footer />
    </main>
  );
}
