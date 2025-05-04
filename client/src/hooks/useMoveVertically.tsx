import { useRef } from 'react';

export const useMoveVertically = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topContainerRef = useRef<HTMLDivElement>(null);

  const updateHeight = (currentTopHeight: number, dy:number) => {
    const container = containerRef.current;
    const topContainerEl = topContainerRef.current;
    if (!container || !topContainerEl) return;
    const containerHeight = container.getBoundingClientRect().height;
    const delta = currentTopHeight + dy;
    const newTopHeight = (delta * 100) / containerHeight;
    topContainerEl.style.height = `${newTopHeight}%`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    if (!topContainerRef.current) return;
    const currentTopHeight = topContainerRef.current.getBoundingClientRect().height;
    document.body.style.cursor = 'ns-resize';
    const handleMouseMove = (event: MouseEvent) => {
      const dy = event.clientY - startY;
      updateHeight(currentTopHeight, dy);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.removeProperty('cursor');
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const startY = touch.clientY;

    if (!topContainerRef.current) return;
    const currentTopHeight = topContainerRef.current.getBoundingClientRect().height;
    const handleTouchMove = (event: TouchEvent) => {
      const touchMove = event.touches[0];
      const dy = touchMove.clientY - startY;
      updateHeight(currentTopHeight, dy);
    };
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };
  return {
    containerRef, topContainerRef, handleMouseDown, handleTouchStart,
  };
};
