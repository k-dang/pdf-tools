# pdf-tools

A fast CLI tool to extract specific pages from PDF files and merge multiple PDFs, powered by Bun.

## Features

- Extract single pages or page ranges from PDFs
- Support for complex page specifications (e.g., `"1,3,5-8"`)
- Merge multiple PDFs into a single file
- Interactive TUI for visual file selection and page picking
- Fast file operations using Bun runtime
- Built with TypeScript for type safety

## Installation

**Requires Bun runtime.** Install [Bun](https://bun.sh) first, then:

```bash
bun install -g @k-dang/pdf-tools
```

## Usage

```bash
pdf-tools split <input-file> --pages <pages> [--output <output-file>]
pdf-tools merge <file1.pdf> <file2.pdf> [file3.pdf ...] [--output <output-file>]
pdf-tools tui
```

### Extract Pages

```bash
pdf-tools split <input-file> --pages <pages> [--output <output-file>]
```

#### Options

- `--pages`, `-p` - **Required.** Page numbers or ranges (e.g., `"6-8"` or `"1,3,5-8"`)
- `--output`, `-o` - Output filename (defaults to `<input>_split.pdf`)

#### Examples

Extract pages 6-8 from a PDF:

```bash
pdf-tools split document.pdf --pages 6-8
```

Extract specific pages and ranges:

```bash
pdf-tools split document.pdf --pages "1,3,5-8" --output extracted.pdf
```

Extract a single page:

```bash
pdf-tools split document.pdf --pages 10 --output page10.pdf
```

### Merge PDFs

```bash
pdf-tools merge <file1.pdf> <file2.pdf> [file3.pdf ...] [--output <output-file>]
```

#### Merge Options

- `--output`, `-o` - Output filename (defaults to `merged.pdf`)

#### Merge Examples

Merge two PDFs:

```bash
pdf-tools merge document1.pdf document2.pdf
```

Merge multiple PDFs with custom output:

```bash
pdf-tools merge file1.pdf file2.pdf file3.pdf --output combined.pdf
```

### Interactive TUI

Launch the interactive terminal UI for visual file browsing and page selection:

```bash
pdf-tools tui
```

The TUI provides:

- File browser for selecting PDFs
- Visual page picker for split operations
- Multi-file selection for merge operations

## Page Range Format

- Single page: `"6"`
- Page range: `"6-8"` (includes pages 6, 7, and 8)
- Multiple pages/ranges: `"1,3,5-8"` (pages 1, 3, 5, 6, 7, 8)
