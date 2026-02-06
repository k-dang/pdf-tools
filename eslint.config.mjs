import js from "@eslint/js";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["apps/cli/**/*.{ts,tsx}", "packages/utils/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["apps/cli/tsconfig.json", "packages/utils/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.bun,
      },
    },
  }
);
