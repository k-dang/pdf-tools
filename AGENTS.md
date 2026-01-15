# Agent Guidelines

## Commands

- `bun install` - Install dependencies
- `bun run index.ts <input> --pages <pages>` - Run the CLI
- `bun test` - Run tests (no tests yet, but this is command)
- `bun run <script>` - Run npm scripts

### TUI (apps/tui)

- `bun run dev` - Run TUI in development mode
- `bun run build` - Build all platform binaries
- `bun run publish:npm` - Build and publish to npm

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

The TUI app uses a **single-package multi-platform** approach (inspired by `better-context`):

### Entry Point (`bin.js`)

- Detects user's platform/arch (e.g., `win32-x64`, `darwin-arm64`)
- Maps to appropriate binary (e.g., `pdf-tools-tui-windows-x64.exe`)
- Spawns the platform-specific binary using `Bun.spawnSync()`

### Build Process (`scripts/build.ts`)

- Installs OpenTUI for all platforms: `bun install --os="*" --cpu="*" @opentui/core`
- Builds 5 platform binaries using `Bun.build({ compile: {...} })`
- Outputs to `dist/`: darwin-arm64, darwin-x64, linux-arm64, linux-x64, windows-x64.exe

### Package Structure

```
apps/tui/
├── bin.js              # Entry point (platform detection & spawning)
├── package.json
├── scripts/
│   ├── build.ts        # Build all platform binaries
│   └── publish.ts     # Build, pack, and publish to npm
└── dist/
    ├── pdf-tools-tui-darwin-arm64
    ├── pdf-tools-tui-darwin-x64
    ├── pdf-tools-tui-linux-arm64
    ├── pdf-tools-tui-linux-x64
    └── pdf-tools-tui-windows-x64.exe
```

### Publishing

- Single npm package: `@k-dang/pdf-tools-tui`
- Contains all 5 platform binaries (~493MB unpacked, ~180MB compressed)
- Users download all binaries but only run their platform's binary
- Trade-off: Simpler implementation (1 package vs 6) vs larger downloads

### Why This Approach?

Compared to OpenCode's 6-package approach (main + 5 platforms):

- ✅ Simpler: No optionalDependencies, postinstall scripts, or synchronized publishing
- ✅ Easier to maintain: Single package to version and publish
- ✅ Works perfectly: Proven by `better-context` and other tools
- ⚠️ Larger downloads: All users download all binaries (~180MB compressed)
- ⚠️ Wasted disk space: macOS users have Windows binaries, etc.

For pdf-tools-tui (65-122MB binaries), this is acceptable since total compressed size (~180MB) is manageable.
