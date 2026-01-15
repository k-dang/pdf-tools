import { useKeyboard } from "@opentui/react";
import { useState, useMemo } from "react";
import { join } from "path";
import {
  listPdfFiles,
  listDirectories,
  getParentDirectory,
  isAtRoot,
} from "../utils/files";

interface BrowserItem {
  type: "parent" | "directory" | "file";
  name: string;
  path: string;
}

interface UnifiedBrowserProps {
  mode: "single" | "multi";
  title: string;
  currentDirectory: string;
  onDirectoryChange: (newDirectory: string) => void;
  onFileSelect: (filePath: string) => void;
  onFilesConfirm?: (filePaths: string[]) => void;
  onBack: () => void;
}

export function UnifiedBrowser({
  mode,
  title,
  currentDirectory,
  onDirectoryChange,
  onFileSelect,
  onFilesConfirm,
  onBack,
}: UnifiedBrowserProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    const result: BrowserItem[] = [];

    // Add parent directory if not at root
    if (!isAtRoot(currentDirectory)) {
      result.push({
        type: "parent",
        name: "..",
        path: getParentDirectory(currentDirectory),
      });
    }

    // Add subdirectories
    const directories = listDirectories(currentDirectory);
    for (const dir of directories) {
      result.push({
        type: "directory",
        name: dir,
        path: join(currentDirectory, dir),
      });
    }

    // Add PDF files
    const pdfFiles = listPdfFiles(currentDirectory);
    for (const file of pdfFiles) {
      result.push({
        type: "file",
        name: file,
        path: join(currentDirectory, file),
      });
    }

    return result;
  }, [currentDirectory]);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setFocusIndex((i) => Math.max(0, i - 1));
    } else if (key.name === "down" || key.name === "j") {
      setFocusIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (key.name === "backspace") {
      if (!isAtRoot(currentDirectory)) {
        onDirectoryChange(getParentDirectory(currentDirectory));
        setFocusIndex(0);
        setSelectedFiles(new Set());
      }
    } else if (key.name === "return") {
      const item = items[focusIndex];
      if (!item) return;

      if (item.type === "parent" || item.type === "directory") {
        onDirectoryChange(item.path);
        setFocusIndex(0);
        setSelectedFiles(new Set());
      } else if (item.type === "file") {
        if (mode === "single") {
          onFileSelect(item.path);
        } else if (mode === "multi" && selectedFiles.size >= 2 && onFilesConfirm) {
          onFilesConfirm([...selectedFiles]);
        }
      }
    } else if (key.name === "space" && mode === "multi") {
      const item = items[focusIndex];
      if (item?.type === "file") {
        setSelectedFiles((prev) => {
          const next = new Set(prev);
          if (next.has(item.path)) {
            next.delete(item.path);
          } else {
            next.add(item.path);
          }
          return next;
        });
      }
    } else if (key.name === "escape") {
      onBack();
    }
  });

  const instructions =
    mode === "single"
      ? "↑↓ navigate, Enter to select, Backspace to go up, ESC to back"
      : `↑↓ navigate, Space to toggle, Enter to confirm (${selectedFiles.size}/2+), ESC to back`;

  return (
    <box flexDirection="column" padding={1}>
      <text>
        <strong>{title}</strong>
      </text>
      <text>
        <span fg="gray">Path: {currentDirectory}</span>
      </text>
      <text>
        <span fg="gray">{instructions}</span>
      </text>
      <box
        style={{
          marginTop: 1,
          border: true,
          flexDirection: "column",
          maxHeight: 15,
        }}
      >
        {items.length === 0 ? (
          <text>
            <span fg="yellow">Empty directory</span>
          </text>
        ) : (
          items.map((item, i) => {
            const isFocused = i === focusIndex;
            const isSelected = selectedFiles.has(item.path);

            let prefix: string;
            let label: string;

            if (item.type === "parent") {
              prefix = isFocused ? "> " : "  ";
              label = "..";
            } else if (item.type === "directory") {
              prefix = isFocused ? "> " : "  ";
              label = `[DIR] ${item.name}`;
            } else {
              // File
              if (mode === "multi") {
                prefix = isSelected ? "[x] " : "[ ] ";
              } else {
                prefix = isFocused ? "> " : "  ";
              }
              label = item.name;
            }

            return (
              <text key={item.path}>
                <span fg={isFocused ? "cyan" : isSelected ? "green" : undefined}>
                  {prefix}
                  {label}
                </span>
              </text>
            );
          })
        )}
      </box>
      {mode === "multi" && selectedFiles.size > 0 && (
        <box style={{ marginTop: 1 }}>
          <text>
            <span fg="green">
              Selected: {[...selectedFiles].map((p) => p.split(/[/\\]/).pop()).join(", ")}
            </span>
          </text>
        </box>
      )}
    </box>
  );
}
