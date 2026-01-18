# Agent Guidelines

## Commands

- `bun install` - Install dependencies
- `bun test` - Run tests (no tests yet, but this is command)
- `bun run <script>` - Run npm scripts

### CLI (apps/cli)

Published as `@k-dang/pdf-tools` on npm. Entry point: `cli.ts` using meow for arg parsing.

**Development:**
- `bun run dev` - Run CLI in dev mode (from apps/cli)
- `bun run build` - Build CLI + TUI to `dist/` (from apps/cli)
- `bun run check` - Type check

**Commands:**
- `pdf-tools split <input> --pages <pages> [--output <file>]` - Extract pages from PDF
- `pdf-tools merge <file1> <file2> [...] [--output <file>]` - Merge multiple PDFs
- `pdf-tools tui` - Launch interactive TUI

**Flags:**
- `--pages, -p` - Page range (split only, required). Formats: `"6"`, `"6-8"`, `"1,3,5-8"`
- `--output, -o` - Output filename (optional)

**Command structure:** `apps/cli/src/commands/` contains `split.ts`, `merge.ts`, `tui.ts`, exported via `index.ts`

## Code Style

- TypeScript strict mode (ESNext target, verbatimModuleSyntax)
- Use Bun runtime APIs: `Bun.file()` for file I/O, `Bun.write()` for output
- Double quotes for imports, JSDoc comments for functions
- camelCase for variables/functions, PascalCase for types
- Error handling with try/catch, descriptive error messages with context
- Page numbers are 1-based in CLI, 0-based with pdf-lib (convert accordingly)

## Testing (when adding)

- Use `import { test, expect } from "bun:test";`
- `bun test` to run, `bun test <file>` for single test

## Key Dependencies

- pdf-lib for PDF manipulation
- meow for CLI parsing

## TUI Build Architecture

The TUI is bundled directly within the CLI:

- TUI source lives in `apps/cli/src/tui/` (entry: `index.tsx`)
- CLI build script (`apps/cli/scripts/build.ts`) bundles both `cli.js` and `tui.js` into `apps/cli/dist/`
- Users launch TUI via `pdf-tools tui` which spawns `bun dist/tui.js`
- Only `@k-dang/pdf-tools` is published to npm (includes bundled TUI)
