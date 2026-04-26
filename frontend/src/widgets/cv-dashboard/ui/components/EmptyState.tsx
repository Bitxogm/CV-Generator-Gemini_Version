interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="text-center text-muted-foreground py-8">{message}</p>
  );
}
