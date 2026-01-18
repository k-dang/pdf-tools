import { mergeCommand } from "./merge.js";
import { splitCommand } from "./split.js";
import { tuiCommand } from "./tui.js";

export const commands = {
  split: splitCommand,
  merge: mergeCommand,
  tui: tuiCommand,
};
