import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the TUI entrypoint for dev or packaged builds.
 */
const resolveTuiEntry = async () => {
  const cliPath = process.argv[1]
    ? resolve(process.argv[1])
    : fileURLToPath(import.meta.url);
  const cliDir = dirname(cliPath);

  const distTuiPath = join(cliDir, "tui.js");
  if (await Bun.file(distTuiPath).exists()) {
    return distTuiPath;
  }

  const devTuiPath = join(cliDir, "..", "tui", "tui.tsx");
  if (await Bun.file(devTuiPath).exists()) {
    return devTuiPath;
  }

  return null;
};

export const tuiCommand = {
  run: async () => {
    const entryPath = await resolveTuiEntry();
    if (!entryPath) {
      console.error(
        "TUI entrypoint not found. Try rebuilding the CLI with `bun run build:cli`.",
      );
      process.exit(1);
    }

    const subprocess = Bun.spawn({
      cmd: ["bun", entryPath],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });

    const exitCode = await subprocess.exited;
    process.exit(exitCode);
  },
};
