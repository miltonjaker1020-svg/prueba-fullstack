import type { ReactNode } from 'react';

interface AlertProps {
  tone: 'error' | 'success' | 'info';
  message: string;
}

export function Alert({ tone, message }: AlertProps): ReactNode {
  return (
    <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}
