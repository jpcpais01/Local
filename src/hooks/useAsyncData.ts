"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Runs `fn` whenever `deps` change, tracking loading/error state and
 * ignoring stale responses from superseded calls (e.g. rapid location switches).
 */
export function useAsyncData<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList,
  options?: { enabled?: boolean }
): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const callId = useRef(0);
  const enabled = options?.enabled ?? true;

  const run = useCallback(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    const id = ++callId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => {
        if (callId.current === id) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (callId.current === id)
          setState({ data: null, loading: false, error: err?.message ?? "Failed to load" });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}
