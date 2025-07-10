import { useState, useCallback } from 'react';

type AsyncFunction<T> = () => Promise<T>;

interface FetchState {
  loading: boolean;
  error: Error | null;
  run: () => Promise<void>;
}

export function useFetch<T = unknown>(fn: AsyncFunction<T>): FetchState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { loading, error, run };
}
