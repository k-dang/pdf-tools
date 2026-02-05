import { Terminal } from "./terminal";
import { FadeIn } from "./fade-in";

export function MergeDemo() {
  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Terminal demo - order reversed for alternating layout */}
          <FadeIn
            variant="fade-right"
            delay={150}
            duration={700}
            className="lg:order-1"
          >
            <div className="flex flex-col gap-4">
              <Terminal
                lines={[
                  { comment: "# Merge two documents" },
                  {
                    prompt: "$ ",
                    command: "pdf-tools merge intro.pdf content.pdf",
                  },
                  { output: "✓ Created merged.pdf (24 pages)" },
                  { output: "" },
                  { comment: "# Merge multiple files with custom output" },
                  {
                    prompt: "$ ",
                    command:
                      "pdf-tools merge ch1.pdf ch2.pdf ch3.pdf -o book.pdf",
                  },
                  { output: "✓ Created book.pdf (156 pages)" },
                  { output: "" },
                  { comment: "# Use glob patterns" },
                  {
                    prompt: "$ ",
                    command: "pdf-tools merge ./chapters/*.pdf -o complete.pdf",
                  },
                  { output: "✓ Merged 12 files → complete.pdf" },
                ]}
              />
            </div>
          </FadeIn>

          {/* Text content */}
          <div className="flex flex-col justify-center lg:order-2">
            <FadeIn variant="fade-left" duration={600}>
              <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
                Combine with Confidence
              </h2>
            </FadeIn>
            <FadeIn variant="fade-left" delay={100} duration={600}>
              <p className="mb-6 text-lg text-muted-foreground">
                Merge multiple PDFs into a single document. Works with any
                number of files, preserving quality and metadata.
              </p>
            </FadeIn>

            {/* Features */}
            <ul className="space-y-3 text-sm text-muted-foreground">
              <FadeIn variant="fade-left" delay={200} duration={500}>
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Preserves hyperlinks and bookmarks
                </li>
              </FadeIn>
              <FadeIn variant="fade-left" delay={300} duration={500}>
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Maintains document metadata
                </li>
              </FadeIn>
              <FadeIn variant="fade-left" delay={400} duration={500}>
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Smart output naming by default
                </li>
              </FadeIn>
              <FadeIn variant="fade-left" delay={500} duration={500}>
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Glob pattern support for batch operations
                </li>
              </FadeIn>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
