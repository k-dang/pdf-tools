import { Terminal } from "./terminal";
import { FadeIn } from "./fade-in";

export function SplitDemo() {
  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div className="flex flex-col justify-center">
            <FadeIn variant="fade-right" duration={600}>
              <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
                Extract What You Need
              </h2>
            </FadeIn>
            <FadeIn variant="fade-right" delay={100} duration={600}>
              <p className="mb-6 text-lg text-muted-foreground">
                Precise page extraction with flexible range syntax. Single
                pages, ranges, or complex selections — all in one command.
              </p>
            </FadeIn>

            {/* Syntax examples */}
            <div className="space-y-3 font-mono text-sm">
              <FadeIn variant="fade-right" delay={200} duration={500}>
                <div className="flex items-center gap-3">
                  <span className="syntax-number">6</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-muted-foreground">Single page</span>
                </div>
              </FadeIn>
              <FadeIn variant="fade-right" delay={300} duration={500}>
                <div className="flex items-center gap-3">
                  <span className="syntax-number">6-8</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-muted-foreground">Page range</span>
                </div>
              </FadeIn>
              <FadeIn variant="fade-right" delay={400} duration={500}>
                <div className="flex items-center gap-3">
                  <span className="syntax-number">1,3,5-8</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-muted-foreground">Mixed selection</span>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Terminal demo */}
          <FadeIn variant="fade-left" delay={150} duration={700}>
            <div className="flex flex-col gap-4">
              <Terminal
                lines={[
                  { comment: "# Extract a single page" },
                  {
                    prompt: "$ ",
                    command: 'pdf-tools split report.pdf --pages "6"',
                  },
                  { output: "✓ Created report_pages_6.pdf" },
                  { output: "" },
                  { comment: "# Extract a range of pages" },
                  {
                    prompt: "$ ",
                    command: 'pdf-tools split book.pdf -p "1-10"',
                  },
                  { output: "✓ Created book_pages_1-10.pdf" },
                  { output: "" },
                  { comment: "# Complex selection with custom output" },
                  {
                    prompt: "$ ",
                    command:
                      'pdf-tools split doc.pdf -p "1,3,5-8" -o selected.pdf',
                  },
                  { output: "✓ Created selected.pdf (6 pages)" },
                ]}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
