import type { ReactNode } from 'react';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Cargando…' }: SpinnerProps): ReactNode {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
