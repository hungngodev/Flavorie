import { useCallback, useLayoutEffect, useState } from 'react';

const debounce = <T extends unknown[]>(limit: number, callback: (...args: T) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, limit);
  };
};

function getDimensionObject(node: HTMLElement | null): {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
} {
  if (!node)
    return {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      right: 0,
      bottom: 0,
    };
  const rect = node.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    x: rect.x,
    y: rect.y,
    right: rect.right,
    bottom: rect.bottom,
  };
}

export default function useBoundingRect(): [
  (node: HTMLElement | null) => void,
  { [key: string]: number },
  HTMLElement | null,
] {
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && node) {
      const measure = () => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)));

      measure();

      const listener = debounce(100, measure);

      window.addEventListener('resize', listener);
      window.addEventListener('scroll', listener);
      return () => {
        window.removeEventListener('resize', listener);
        window.removeEventListener('scroll', listener);
      };
    }
  }, [node]);

  return [ref, dimensions, node];
}
