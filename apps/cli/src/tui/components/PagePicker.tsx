import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { parsePageRange } from "@pdf-tools/utils";

interface PagePickerProps {
  fileName: string;
  pageCount: number;
  selectedPages: Set<number>;
  onToggle: (page: number) => void;
  onConfirm: (pages?: number[]) => void;
  onBack: () => void;
}

const COLS = 10;
const VISIBLE_ROWS = 10;
const LARGE_PDF_THRESHOLD = 300;

export function PagePicker({
  fileName,
  pageCount,
  selectedPages,
  onToggle,
  onConfirm,
  onBack,
}: PagePickerProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [windowStartRow, setWindowStartRow] = useState(0);
  const [mode, setMode] = useState<"grid" | "range">(
    pageCount >= LARGE_PDF_THRESHOLD ? "range" : "grid"
  );
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState<string | null>(null);

  const totalRows = Math.ceil(pageCount / COLS);
  const maxWindowStartRow = Math.max(0, totalRows - VISIBLE_ROWS);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const ensureFocusVisible = (nextFocus: number) => {
    const focusRow = Math.floor(nextFocus / COLS);
    const currentWindowStartRow = clamp(windowStartRow, 0, maxWindowStartRow);
    if (focusRow < currentWindowStartRow) {
      setWindowStartRow(focusRow);
    } else if (focusRow >= currentWindowStartRow + VISIBLE_ROWS) {
      setWindowStartRow(focusRow - VISIBLE_ROWS + 1);
    }
  };

  useKeyboard((key) => {
    if (key.name === "escape") {
      onBack();
      return;
    }

    if (key.name === "t") {
      setMode((prev) => (prev === "grid" ? "range" : "grid"));
      setRangeError(null);
      return;
    }

    if (mode === "range") {
      if (key.name === "backspace") {
        setRangeInput((prev) => prev.slice(0, -1));
        setRangeError(null);
        return;
      }

      if (key.name === "return") {
        const trimmed = rangeInput.trim();
        if (!trimmed) {
          setRangeError("Enter a page range.");
          return;
        }

        try {
          const pages = parsePageRange(trimmed);
          const outOfRange = pages.some((p) => p < 1 || p > pageCount);
          if (outOfRange) {
            setRangeError(`Page range out of bounds (1-${pageCount}).`);
            return;
          }

          setRangeError(null);
          onConfirm(pages);
        } catch (error) {
          setRangeError(
            error instanceof Error ? error.message : "Invalid page range."
          );
        }
        return;
      }

      const char = key.sequence;
      if (char && char.length === 1 && /[0-9,\-\s]/.test(char)) {
        setRangeInput((prev) => prev + char);
        setRangeError(null);
        return;
      }

      return;
    }

    if (key.name === "up" || key.name === "k") {
      setFocusIndex((i) => {
        const next = Math.max(0, i - COLS);
        ensureFocusVisible(next);
        return next;
      });
    } else if (key.name === "down" || key.name === "j") {
      setFocusIndex((i) => {
        const next = Math.min(pageCount - 1, i + COLS);
        ensureFocusVisible(next);
        return next;
      });
    } else if (key.name === "left" || key.name === "h") {
      setFocusIndex((i) => {
        const next = Math.max(0, i - 1);
        ensureFocusVisible(next);
        return next;
      });
    } else if (key.name === "right" || key.name === "l") {
      setFocusIndex((i) => {
        const next = Math.min(pageCount - 1, i + 1);
        ensureFocusVisible(next);
        return next;
      });
    } else if (key.name === "pageup" || key.name === "[") {
      setWindowStartRow((row) => {
        const nextRow = clamp(row - VISIBLE_ROWS, 0, maxWindowStartRow);
        const nextFocus = clamp(nextRow * COLS, 0, pageCount - 1);
        setFocusIndex(nextFocus);
        return nextRow;
      });
    } else if (key.name === "pagedown" || key.name === "]") {
      setWindowStartRow((row) => {
        const nextRow = clamp(row + VISIBLE_ROWS, 0, maxWindowStartRow);
        const nextFocus = clamp(nextRow * COLS, 0, pageCount - 1);
        setFocusIndex(nextFocus);
        return nextRow;
      });
    } else if (key.name === "space") {
      onToggle(focusIndex + 1); // Convert to 1-based page number
    } else if (key.name === "return" && selectedPages.size > 0) {
      onConfirm();
    } else if (key.name === "a" && key.ctrl) {
      // Select all pages
      for (let i = 1; i <= pageCount; i++) {
        if (!selectedPages.has(i)) {
          onToggle(i);
        }
      }
    }
  });

  // Build rows for the grid (virtualized)
  const rows: number[][] = [];
  const effectiveWindowStartRow = clamp(windowStartRow, 0, maxWindowStartRow);
  const startIndex = effectiveWindowStartRow * COLS;
  const endIndex = Math.min(pageCount, startIndex + VISIBLE_ROWS * COLS);
  for (let i = startIndex; i < endIndex; i += COLS) {
    const row: number[] = [];
    for (let j = 0; j < COLS && i + j < pageCount; j++) {
      row.push(i + j);
    }
    rows.push(row);
  }

  const pageWindowStart = startIndex + 1;
  const pageWindowEnd = Math.min(pageCount, endIndex);

  return (
    <box flexDirection="column" padding={1}>
      <text>
        <strong>Select Pages from: {fileName}</strong>
      </text>
      <text>
        <span fg="gray">
          {mode === "grid"
            ? "Arrows to navigate, Space to toggle, Ctrl+A select all, PgUp/PgDn to scroll, Enter to confirm, T to toggle input, ESC to go back"
            : "Type a range (e.g. 1,3,5-8), Enter to confirm, T to toggle grid, ESC to go back"}
        </span>
      </text>
      {mode === "grid" ? (
        <>
          <text>
            <span fg="green">
              Selected: {selectedPages.size} page
              {selectedPages.size !== 1 ? "s" : ""}
            </span>
          </text>
          <text>
            <span fg="gray">
              Pages {pageWindowStart}-{pageWindowEnd} of {pageCount}
            </span>
          </text>
          <box
            style={{
              marginTop: 1,
              border: true,
              flexDirection: "column",
              padding: 1,
              height: VISIBLE_ROWS + 2,
            }}
          >
            {rows.map((row, rowIdx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <It's fine>
              <box key={rowIdx} flexDirection="row">
                {row.map((pageIdx) => {
                  const pageNum = pageIdx + 1; // 1-based for display
                  const isSelected = selectedPages.has(pageNum);
                  const isFocused = pageIdx === focusIndex;
                  const checkbox = isSelected ? "[x]" : "[ ]";
                  const label = `${checkbox} ${String(pageNum).padStart(3)} `;

                  return (
                    <text key={pageIdx} style={{ width: 10 }}>
                      <span
                        fg={
                          isFocused ? "cyan" : isSelected ? "green" : undefined
                        }
                      >
                        {label}
                      </span>
                    </text>
                  );
                })}
              </box>
            ))}
          </box>
        </>
      ) : (
        <box
          style={{
            marginTop: 1,
            border: true,
            flexDirection: "column",
            padding: 1,
          }}
        >
          <text>
            <span fg="cyan">Range:</span> {rangeInput || ""}_
          </text>
          {rangeError && (
            <text>
              <span fg="red">{rangeError}</span>
            </text>
          )}
        </box>
      )}
    </box>
  );
}
