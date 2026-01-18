import { useKeyboard } from "@opentui/react";

interface ResultProps {
  message: string;
  isError: boolean;
  onDismiss: () => void;
}

export function Result({ message, isError, onDismiss }: ResultProps) {
  useKeyboard((key) => {
    if (key.name === "return" || key.name === "escape") {
      onDismiss();
    }
  });

  return (
    <box flexDirection="column" padding={1}>
      <text>
        <strong>{isError ? "Error" : "Success"}</strong>
      </text>
      <box
        style={{
          marginTop: 1,
          border: true,
          padding: 1,
        }}
      >
        <text>
          <span fg={isError ? "red" : "green"}>{message}</span>
        </text>
      </box>
      <text style={{ marginTop: 1 }}>
        <span fg="gray">Press Enter to return to menu</span>
      </text>
    </box>
  );
}
