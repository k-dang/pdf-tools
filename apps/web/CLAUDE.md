# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev:web          # Start dev server (from monorepo root)
bun run build:web        # Build for production (from monorepo root)
# Or from apps/web directory:
bun run dev              # Start Next.js dev server (localhost:3000)
bun run build            # Production build
bun run lint             # Run ESLint
```

## Architecture

Next.js 16 web application using the App Router, part of the pdf-tools monorepo.

**Tech stack:**
- Next.js 16 with React 19 and React Compiler
- Tailwind CSS v4 with PostCSS
- shadcn/ui (new-york style) with Radix UI primitives
- Lucide React for icons

**Directory structure:**
- `src/app/` - App Router pages and layouts
- `src/components/` - React components (shadcn/ui components go in `src/components/ui/`)
- `src/lib/` - Utilities (e.g., `cn()` for Tailwind class merging)
- `src/hooks/` - Custom React hooks

**Path aliases:** Use `@/` prefix (maps to `src/`)

**Adding shadcn/ui components:** `bunx shadcn@latest add <component>`

## Code Conventions

- Use `cn()` from `@/lib/utils` for combining Tailwind classes
- Server Components by default (mark client components with `"use client"`)
- Double quotes for imports
- Tailwind CSS v4 theme variables defined in `globals.css` using `@theme inline`
