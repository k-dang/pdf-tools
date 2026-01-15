import { useKeyboard } from "@opentui/react";
import { useState } from "react";

interface PagePickerProps {
  fileName: string;
  pageCount: number;
  selectedPages: Set<number>;
  onToggle: (page: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const COLS = 5;

export function PagePicker({
  fileName,
  pageCount,
  selectedPages,
  onToggle,
  onConfirm,
  onBack,
}: PagePickerProps) {
  const [focusIndex, setFocusIndex] = useState(0);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setFocusIndex((i) => Math.max(0, i - COLS));
    } else if (key.name === "down" || key.name === "j") {
      setFocusIndex((i) => Math.min(pageCount - 1, i + COLS));
    } else if (key.name === "left" || key.name === "h") {
      setFocusIndex((i) => Math.max(0, i - 1));
    } else if (key.name === "right" || key.name === "l") {
      setFocusIndex((i) => Math.min(pageCount - 1, i + 1));
    } else if (key.name === "space") {
      onToggle(focusIndex + 1); // Convert to 1-based page number
    } else if (key.name === "return" && selectedPages.size > 0) {
      onConfirm();
    } else if (key.name === "escape") {
      onBack();
    } else if (key.name === "a" && key.ctrl) {
      // Select all pages
      for (let i = 1; i <= pageCount; i++) {
        if (!selectedPages.has(i)) {
          onToggle(i);
        }
      }
    }
  });

  // Build rows for the grid
  const rows: number[][] = [];
  for (let i = 0; i < pageCount; i += COLS) {
    const row: number[] = [];
    for (let j = 0; j < COLS && i + j < pageCount; j++) {
      row.push(i + j);
    }
    rows.push(row);
  }

  return (
    <box flexDirection="column" padding={1}>
      <text>
        <strong>Select Pages from: {fileName}</strong>
      </text>
      <text>
        <span fg="gray">
          Arrows to navigate, Space to toggle, Ctrl+A to select all, Enter to
          confirm, ESC to go back
        </span>
      </text>
      <text>
        <span fg="green">
          Selected: {selectedPages.size} page{selectedPages.size !== 1 ? "s" : ""}
        </span>
      </text>
      <box
        style={{
          marginTop: 1,
          border: true,
          flexDirection: "column",
          padding: 1,
        }}
      >
        {rows.map((row, rowIdx) => (
          <box key={rowIdx} flexDirection="row">
            {row.map((pageIdx) => {
              const pageNum = pageIdx + 1; // 1-based for display
              const isSelected = selectedPages.has(pageNum);
              const isFocused = pageIdx === focusIndex;
              const checkbox = isSelected ? "[x]" : "[ ]";
              const label = `${checkbox} ${String(pageNum).padStart(3)} `;

              return (
                <text key={pageIdx} style={{ width: 10 }}>
                  <span fg={isFocused ? "cyan" : isSelected ? "green" : undefined}>
                    {label}
                  </span>
                </text>
              );
            })}
          </box>
        ))}
      </box>
    </box>
  );
}
