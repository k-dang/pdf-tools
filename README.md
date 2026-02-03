# pdf-tools

[![NPM](https://img.shields.io/npm/v/@k-dang/pdf-tools?logo=npm)](https://www.npmjs.com/package/@k-dang/pdf-tools)

A monorepo containing tools for PDF manipulation, powered by Bun.

## Packages

| Package                              | Description                             |
| ------------------------------------ | --------------------------------------- |
| [@k-dang/pdf-tools](./apps/cli)      | CLI tool for splitting and merging PDFs |
| [web](./apps/web)                    | Web app for PDF tools                   |
| [@pdf-tools/utils](./packages/utils) | Shared PDF utilities using pdf-lib      |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.2

### Installation

```bash
bun install
```

### Development

Run the CLI in development mode:

```bash
bun run dev:cli
```

Run the web app in development mode:

```bash
bun run dev:web
```

Build the CLI:

```bash
bun run build:cli
```

Build the web app:

```bash
bun run build:web
```

### Other Commands

```bash
bun run check    # Type check all packages
bun run format   # Format code with Prettier
```

## Project Structure

```
pdf-tools/
├── apps/
│   ├── cli/          # CLI application
│   └── web/          # Web application
├── packages/
│   └── utils/        # Shared utilities
└── package.json      # Root workspace config
```
