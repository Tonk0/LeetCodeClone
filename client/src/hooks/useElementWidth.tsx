import {
  RefObject, useEffect, useRef, useState,
} from 'react';

export const useElementWidth = (elementRef: RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState(0);
  const isThrottle = useRef(false);
  const lastEntries = useRef<ResizeObserverEntry[]>([]);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    setWidth(element.getBoundingClientRect().width);

    const resizeObserver = new ResizeObserver((entries) => {
      lastEntries.current = entries;
      if (isThrottle.current) return;
      isThrottle.current = true;
      setTimeout(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const entry of lastEntries.current) {
          setWidth(entry.contentRect.width);
        }
        isThrottle.current = false;
      }, 300);
    });
    resizeObserver.observe(element);

    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect();
  }, [elementRef]);

  return width;
};
