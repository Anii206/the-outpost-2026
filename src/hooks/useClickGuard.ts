import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook to guard against accidental double-clicks or rapid button taps.
 * Temporarily disables the button/action for delayMs (default 400ms).
 */
export function useClickGuard(delayMs = 400) {
  const [guardedKeys, setGuardedKeys] = useState<Record<string, boolean>>({});
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      // Clear all active timers on unmount
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const runGuarded = useCallback(
    (key: string, callback: () => void) => {
      if (guardedKeys[key]) {
        return;
      }

      setGuardedKeys((prev) => ({ ...prev, [key]: true }));

      try {
        callback();
      } finally {
        if (timersRef.current[key]) {
          clearTimeout(timersRef.current[key]);
        }
        timersRef.current[key] = setTimeout(() => {
          setGuardedKeys((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
          delete timersRef.current[key];
        }, delayMs);
      }
    },
    [guardedKeys, delayMs]
  );

  const isGuarded = useCallback(
    (key: string): boolean => {
      return Boolean(guardedKeys[key]);
    },
    [guardedKeys]
  );

  return { runGuarded, isGuarded };
}
