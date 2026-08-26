interface CrashTriggerProps {
  enabled: boolean;
}

export function CrashTrigger({ enabled }: CrashTriggerProps): null {
  if (enabled) {
    throw new Error(
      'Error de renderizado forzado intencionalmente para demostrar el ErrorBoundary (?crash=1).',
    );
  }
  return null;
}
