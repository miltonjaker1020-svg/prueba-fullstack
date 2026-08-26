import { isAxiosError } from 'axios';

export type ApiErrorKind =
  | 'network'
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'notFound'
  | 'server'
  | 'unknown';

const KIND_BY_STATUS: Record<number, ApiErrorKind> = {
  400: 'validation',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  409: 'conflict',
};

function extractServerMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const maybe = body as { message?: unknown };
  if (Array.isArray(maybe.message)) {
    return maybe.message.filter((part): part is string => typeof part === 'string').join(' · ');
  }
  return typeof maybe.message === 'string' ? maybe.message : null;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }

  static of(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError(error)) {
      const status = error.response?.status ?? null;

      if (status === null) {
        return new ApiError(
          'network',
          'No hay conexión con el servidor. Verifica que el backend esté corriendo.',
        );
      }

      const serverMessage = extractServerMessage(error.response?.data) ?? error.message;
      const mapped = KIND_BY_STATUS[status];
      const kind: ApiErrorKind = mapped ?? (status >= 500 ? 'server' : 'unknown');

      return new ApiError(kind, serverMessage, status);
    }

    return new ApiError('unknown', 'Ocurrió un error inesperado.');
  }

  get isNetwork(): boolean {
    return this.kind === 'network';
  }

  get isAuth(): boolean {
    return this.kind === 'unauthorized' || this.kind === 'forbidden';
  }
}
