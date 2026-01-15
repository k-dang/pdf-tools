interface ProcessingProps {
  message: string;
}

export function Processing({ message }: ProcessingProps) {
  return (
    <box flexDirection="column" padding={1}>
      <text>
        <span fg="cyan">{message}</span>
      </text>
    </box>
  );
}
