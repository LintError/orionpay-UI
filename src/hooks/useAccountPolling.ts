'use client';

import { useCallback, useEffect, useRef } from 'react';

export const DEFAULT_POLL_INTERVAL_MS = 30_000;

export const isPageVisible = () => {
  if (typeof document === 'undefined') {
    return true;
  }

  return document.visibilityState !== 'hidden';
};

interface UseAccountPollingOptions {
  /** Account to poll. Polling is disabled while this is empty. */
  publicKey: string;
  /** Loads balances and transaction history for the given account. */
  loadAccountData: (publicKey: string) => Promise<unknown>;
  /** Delay between the end of one refresh and the start of the next. */
  intervalMs?: number;
}

/**
 * Polls account data without ever letting two refreshes overlap.
 *
 * A `setInterval` keeps firing on schedule even while a slow request is still
 * in flight, which stacks up requests against Horizon and lets an older
 * response land after a newer one. This hook uses a recursive `setTimeout`
 * that only schedules the next run once the previous one settles, skips runs
 * while the tab is hidden, and tears everything down on unmount or when the
 * account changes.
 */
export function useAccountPolling({
  publicKey,
  loadAccountData,
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
}: UseAccountPollingOptions) {
  // The in-flight refresh for a given account. Callers that ask for a refresh
  // while one is already running get the existing promise back instead of
  // starting a second request, so there is never more than one at a time.
  const inFlightRef = useRef<{ key: string; promise: Promise<boolean> } | null>(null);
  const loadRef = useRef(loadAccountData);

  useEffect(() => {
    loadRef.current = loadAccountData;
  }, [loadAccountData]);

  const runRefresh = useCallback((): Promise<boolean> => {
    if (!publicKey) {
      return Promise.resolve(false);
    }

    const existing = inFlightRef.current;
    if (existing && existing.key === publicKey) {
      return existing.promise;
    }

    const promise = (async () => {
      try {
        await loadRef.current(publicKey);
        return true;
      } catch {
        return false;
      } finally {
        const current = inFlightRef.current;
        if (current && current.promise === promise) {
          inFlightRef.current = null;
        }
      }
    })();

    inFlightRef.current = { key: publicKey, promise };

    return promise;
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // True while a tick is executing, so we never end up with two chains of
    // setTimeout each scheduling the next one.
    let running = false;

    const schedule = () => {
      if (cancelled) {
        return;
      }
      timer = setTimeout(() => void tick(), intervalMs);
    };

    const tick = async () => {
      if (cancelled || running) {
        return;
      }

      running = true;

      try {
        // Background tabs do not need fresh data, so skip the network call but
        // keep the loop alive so we resume as soon as the tab is visible again.
        if (isPageVisible()) {
          await runRefresh();
        }
      } finally {
        running = false;
        schedule();
      }
    };

    const handleVisibilityChange = () => {
      if (cancelled || !isPageVisible()) {
        return;
      }

      // Drop the pending tick and refresh right away so the user does not stare
      // at stale balances for another full interval. If a tick is already
      // running, let it schedule the next one instead of starting a second.
      if (running) {
        return;
      }

      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }

      void tick();
    };

    void tick();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [publicKey, intervalMs, runRefresh]);

  return { refresh: runRefresh };
}