# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Run CLI in dev mode (from apps/cli)
bun run build            # Build CLI + TUI to dist/ (from apps/cli)
bun run check            # TypeScript type checking
bun run format           # Format code with Prettier
bun test                 # Run tests (use bun test <file> for single file)
bun run <script>         # Run npm scripts
```

## Architecture

This is a Bun-powered monorepo for PDF manipulation tools.

**Monorepo structure:**

- `apps/cli` - @k-dang/pdf-tools CLI with integrated TUI (published to npm)
- `packages/utils` - @pdf-tools/utils shared PDF utilities

**CLI entry point:** `apps/cli/cli.ts` uses meow for argument parsing, delegates to command handlers in `apps/cli/src/commands/`.

**CLI commands:**

- `pdf-tools split <input> --pages <pages> [--output <file>]` - Extract pages from PDF
- `pdf-tools merge <file1> <file2> [...] [--output <file>]` - Merge multiple PDFs
- `pdf-tools tui` - Launch interactive TUI

**Flags:**

- `--pages, -p` - Page range (split only, required). Formats: `"6"`, `"6-8"`, `"1,3,5-8"`
- `--output, -o` - Output filename (optional)

**Command structure:** `apps/cli/src/commands/` contains `split.ts`, `merge.ts`, `tui.ts`, exported via `index.ts`.

**TUI:** `apps/cli/src/tui/` contains the OpenTUI React application for interactive file browsing and page selection. Launched via `pdf-tools tui` command.

**TUI build architecture:**

- TUI source lives in `apps/cli/src/tui/` (entry: `index.tsx`)
- CLI build script (`apps/cli/scripts/build.ts`) bundles both `cli.js` and `tui.js` into `apps/cli/dist/`
- Users launch TUI via `pdf-tools tui` which spawns `bun dist/tui.js`
- Only `@k-dang/pdf-tools` is published to npm (includes bundled TUI)

**PDF operations:** `packages/utils/src/pdf.ts` contains `splitPDF()`, `mergePDFs()`, and `getPageCount()` using pdf-lib.

**Page range parser:** `packages/utils/src/parser.ts` handles formats like "1,3,5-8".

## Code Conventions

- Use Bun runtime APIs: `Bun.file()` for reading, `Bun.write()` for output
- Page numbers are 1-based in CLI, 0-based with pdf-lib (convert in pdf.ts)
- TypeScript strict mode, ESNext target, verbatimModuleSyntax
- Double quotes for imports
- camelCase for variables/functions, PascalCase for types
- Error handling with try/catch, descriptive error messages with context
