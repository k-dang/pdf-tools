# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install              # Install dependencies
bun run dev:cli          # Run CLI in development mode
bun run build:cli        # Build CLI binary (includes TUI)
bun run check            # TypeScript type checking
bun run format           # Format code with Prettier
bun test                 # Run tests (use bun test <file> for single file)
```

## Architecture

This is a Bun-powered monorepo for PDF manipulation tools.

**Monorepo structure:**

- `apps/cli` - @k-dang/pdf-tools CLI with integrated TUI (published to npm)
- `packages/utils` - @pdf-tools/utils shared PDF utilities

**CLI entry point:** `apps/cli/cli.ts` uses meow for argument parsing, delegates to command handlers in `apps/cli/src/commands/`.

**CLI commands:** `split`, `merge`, and `tui` (launches interactive terminal UI).

**TUI:** `apps/cli/src/tui/` contains the OpenTUI React application for interactive file browsing and page selection. Launched via `pdf-tools tui` command.

**PDF operations:** `packages/utils/src/pdf.ts` contains `splitPDF()`, `mergePDFs()`, and `getPageCount()` using pdf-lib.

**Page range parser:** `packages/utils/src/parser.ts` handles formats like "1,3,5-8".

## Code Conventions

- Use Bun runtime APIs: `Bun.file()` for reading, `Bun.write()` for output
- Page numbers are 1-based in CLI, 0-based with pdf-lib (convert in pdf.ts)
- TypeScript strict mode, ESNext target
- Double quotes for imports
- Use `bun:test` for testing: `import { test, expect } from "bun:test"`

## Key Dependencies

- **pdf-lib** - PDF manipulation
- **meow** - CLI argument parsing
- **@opentui/react** - TUI components and hooks (useKeyboard, useRenderer, useInput)
