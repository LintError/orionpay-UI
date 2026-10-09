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
  // Tracks the account currently being fetched so overlapping runs for the
  // same account are skipped while a different account can still load.
  const inFlightRef = useRef<string | null>(null);
  const loadRef = useRef(loadAccountData);

  useEffect(() => {
    loadRef.current = loadAccountData;
  }, [loadAccountData]);

  const runRefresh = useCallback(async () => {
    if (!publicKey || inFlightRef.current === publicKey) {
      return false;
    }

    inFlightRef.current = publicKey;
    try {
      await loadRef.current(publicKey);
      return true;
    } catch {
      return false;
    } finally {
      if (inFlightRef.current === publicKey) {
        inFlightRef.current = null;
      }
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      if (cancelled) {
        return;
      }
      timer = setTimeout(tick, intervalMs);
    };

    const tick = async () => {
      if (cancelled) {
        return;
      }

      // Background tabs do not need fresh data, so skip the network call but
      // keep the loop alive so we resume as soon as the tab is visible again.
      if (!isPageVisible()) {
        schedule();
        return;
      }

      await runRefresh();
      schedule();
    };

    const handleVisibilityChange = () => {
      if (cancelled) {
        return;
      }

      if (isPageVisible()) {
        // Drop the pending tick and refresh right away so the user does not
        // stare at stale balances for another full interval.
        if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
        void tick();
      }
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