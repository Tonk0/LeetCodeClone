import React, { useRef } from 'react';

export const useMoveHorizontally = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContainerRef = useRef<HTMLDivElement>(null);

  const updateWidth = (currentLeftWidth: number, dx:number) => {
    const container = containerRef.current;
    const leftContainerEl = leftContainerRef.current;
    if (!container || !leftContainerEl) return;
    const containerWidth = container.getBoundingClientRect().width;
    const delta = currentLeftWidth + dx;
    const newLeftHalfWidth = (delta * 100) / containerWidth;
    leftContainerEl.style.width = `${newLeftHalfWidth}%`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    if (!leftContainerRef.current) return;
    const currentLeftWidth = leftContainerRef.current.getBoundingClientRect().width;
    document.body.style.cursor = 'ew-resize';
    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - startX;
      updateWidth(currentLeftWidth, dx);
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
    const startX = touch.clientX;

    if (!leftContainerRef.current) return;
    const currentLeftWidth = leftContainerRef.current.getBoundingClientRect().width;
    const handleTouchMove = (event: TouchEvent) => {
      const touchMove = event.touches[0];
      const dx = touchMove.clientX - startX;
      updateWidth(currentLeftWidth, dx);
    };
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return {
    containerRef, leftContainerRef, handleMouseDown, handleTouchStart,
  };
};
