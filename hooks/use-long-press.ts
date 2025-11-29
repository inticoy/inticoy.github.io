import { useCallback, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  delay?: number;
}

export const useLongPress = (
  onLongPress: () => void,
  { threshold = 10, delay = 500 }: Options = {}
) => {
  const [isPressing, setIsPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Prevent default context menu on long press
      // event.preventDefault(); // We can't prevent default here for touchstart as it blocks scroll
      
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      startPosRef.current = { x: clientX, y: clientY };
      setIsPressing(true);

      timeoutRef.current = setTimeout(() => {
        onLongPress();
        setIsPressing(false); // Reset pressing state after trigger
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPressing(false);
    startPosRef.current = null;
  }, []);

  const move = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (!startPosRef.current || !timeoutRef.current) return;

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      const moveX = Math.abs(clientX - startPosRef.current.x);
      const moveY = Math.abs(clientY - startPosRef.current.y);

      if (moveX > threshold || moveY > threshold) {
        clear();
      }
    },
    [threshold, clear]
  );

  return {
    handlers: {
      onMouseDown: start,
      onTouchStart: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchEnd: clear,
      onMouseMove: move,
      onTouchMove: move,
    },
    isPressing,
  };
};
