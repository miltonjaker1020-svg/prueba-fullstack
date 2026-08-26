import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/ApiError';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<number>(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    let cancelled = false;
    fetcherRef.current = fetcher;

    async function run(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
        }
      } catch (caught) {
        if (!cancelled) {
          setData(null);
          setError(ApiError.of(caught).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return { data, loading, error, refetch };
}
