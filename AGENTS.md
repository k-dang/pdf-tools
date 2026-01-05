# Agent Guidelines

## Commands

- `bun install` - Install dependencies
- `bun run index.ts <input> --pages <pages>` - Run the CLI
- `bun test` - Run tests (no tests yet, but this is the command)
- `bun run <script>` - Run npm scripts

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
