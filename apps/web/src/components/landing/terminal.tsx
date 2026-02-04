import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface TerminalLine {
  prompt?: string;
  command?: string;
  output?: string;
  comment?: string;
}

interface TerminalProps {
  lines: TerminalLine[];
  className?: string;
  showCopyButton?: boolean;
}

export function Terminal({
  lines,
  className,
  showCopyButton = false,
}: TerminalProps) {
  const commandText = lines
    .filter((line) => line.command)
    .map((line) => `${line.prompt || ""}${line.command}`.trim())
    .join("\n");

  return (
    <div className={cn("code-block", showCopyButton && "group", className)}>
      {showCopyButton && commandText && (
        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={commandText} />
        </div>
      )}
      <div className="p-4 font-mono text-sm">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.comment && (
              <span className="syntax-comment">{line.comment}</span>
            )}
            {line.prompt && (
              <span className="syntax-prompt">{line.prompt}</span>
            )}
            {line.command && <CommandHighlight command={line.command} />}
            {line.output && (
              <span className="text-muted-foreground">{line.output}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandHighlight({ command }: { command: string }) {
  const tokens = tokenize(command);

  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={token.className}>
          {token.text}
        </span>
      ))}
    </>
  );
}

interface Token {
  text: string;
  className: string;
}

function tokenize(command: string): Token[] {
  const tokens: Token[] = [];
  const parts = command.split(/(\s+)/);

  let isFirstWord = true;

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      tokens.push({ text: part, className: "" });
      continue;
    }

    if (isFirstWord) {
      tokens.push({ text: part, className: "syntax-command" });
      isFirstWord = false;
    } else if (part.startsWith("--") || part.startsWith("-")) {
      tokens.push({ text: part, className: "syntax-flag" });
    } else if (part.startsWith('"') || part.startsWith("'")) {
      tokens.push({ text: part, className: "syntax-string" });
    } else if (/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(part)) {
      tokens.push({ text: part, className: "syntax-number" });
    } else if (part.includes(".pdf") || part.includes("/")) {
      tokens.push({ text: part, className: "syntax-path" });
    } else {
      tokens.push({ text: part, className: "syntax-path" });
    }
  }

  return tokens;
}

interface TerminalTypingProps {
  command: string;
  prompt?: string;
  className?: string;
}

export function TerminalTyping({
  command,
  prompt = "$ ",
  className,
}: TerminalTypingProps) {
  return (
    <div className={cn("code-block", className)}>
      {/* Code content with typing effect */}
      <div className="p-4 font-mono text-sm">
        <span className="syntax-prompt">{prompt}</span>
        <span className="syntax-command typing-cursor">{command}</span>
      </div>
    </div>
  );
}
