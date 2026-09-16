import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

/**
 * Scales the nominal design box so the complete stack always fits inside its
 * stage without scrolling, at any viewport size.
 *
 * Uses a callback ref so the observer re-attaches when the stage element is
 * swapped out (for example when switching between isometric and compact mode).
 */
export function useFitScale(designWidth: number, designHeight: number, maxScale = 1.05) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.8);

  const ref = useCallback((element: HTMLDivElement | null) => setNode(element), []);

  useLayoutEffect(() => {
    if (!node) return;

    const measure = (width: number, height: number) => {
      if (width === 0 || height === 0) return;
      const next = Math.min(width / designWidth, height / designHeight, maxScale);
      setScale(Number(Math.max(next, 0.25).toFixed(4)));
    };

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      measure(rect.width, rect.height);
    });

    observer.observe(node);
    measure(node.clientWidth, node.clientHeight);
    return () => observer.disconnect();
  }, [node, designWidth, designHeight, maxScale]);

  return { ref, scale };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', handler);
    return () => list.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
