import { RefObject, useEffect, useRef } from 'react';

interface UseFixedWidthBelowThresholdProps {
  containerRef: RefObject<HTMLDivElement>;
  elementWidth: number;
  threshold: number;
}

export const useFixedWidthBelowThreshold = ({
  threshold, elementWidth, containerRef,
}
: UseFixedWidthBelowThresholdProps) => {
  const isFixed = useRef<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const contentWidthPercent = (
      elementWidth / containerRef.current.getBoundingClientRect().width
    ) * 100;

    if (contentWidthPercent <= threshold && !isFixed.current) {
      contentRef.current.style.width = `${elementWidth}px`;
      contentRef.current.style.minWidth = `${elementWidth}px`;
      isFixed.current = true;
    } else if (isFixed.current && contentWidthPercent > threshold) {
      contentRef.current.style.width = '100%';
      contentRef.current.style.minWidth = 'auto';
      isFixed.current = false;
    }
  }, [containerRef, elementWidth, threshold]);

  return contentRef;
};
