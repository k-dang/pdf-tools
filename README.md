# pdf-tools

A fast CLI tool to extract specific pages from PDF files and merge multiple PDFs, powered by Bun.

## Features

- Extract single pages or page ranges from PDFs
- Support for complex page specifications (e.g., `"1,3,5-8"`)
- Merge multiple PDFs into a single file
- Fast file operations using Bun runtime
- Built with TypeScript for type safety

## Prerequisites

You need [Bun](https://bun.sh) installed to run this tool:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Installation

```bash
bun install
```

## Usage

### Extract Pages

```bash
bun run index.ts <input-file> --pages <pages> [--output <output-file>]
```

#### Options

- `--pages`, `-p` - **Required.** Page numbers or ranges (e.g., `"6-8"` or `"1,3,5-8"`)
- `--output`, `-o` - Output filename (defaults to `<input>_split.pdf`)

#### Examples

Extract pages 6-8 from a PDF:

```bash
bun run index.ts document.pdf --pages 6-8
```

Extract specific pages and ranges:

```bash
bun run index.ts document.pdf --pages "1,3,5-8" --output extracted.pdf
```

Extract a single page:

```bash
bun run index.ts document.pdf --pages 10 --output page10.pdf
```

### Merge PDFs

```bash
bun run merge.ts <file1.pdf> <file2.pdf> [file3.pdf ...] [--output <output-file>]
```

#### Merge Options

- `--output`, `-o` - Output filename (defaults to `merged.pdf`)

#### Merge Examples

Merge two PDFs:

```bash
bun run merge.ts document1.pdf document2.pdf
```

Merge multiple PDFs with custom output:

```bash
bun run merge.ts file1.pdf file2.pdf file3.pdf --output combined.pdf
```

## Page Range Format

- Single page: `"6"`
- Page range: `"6-8"` (includes pages 6, 7, and 8)
- Multiple pages/ranges: `"1,3,5-8"` (pages 1, 3, 5, 6, 7, 8)

## Dependencies

- [pdf-lib](https://pdf-lib.js.org/) - PDF document creation and modification
- [meow](https://github.com/sindresorhus/meow) - CLI app helper
