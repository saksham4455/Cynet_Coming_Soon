import { useEffect, useState } from 'react';

export const useControls = () => {
  const [direction, setDirection] = useState(null);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    // Touch controls for mobile
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchMove = (e) => {
      if (!touchStart) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const threshold = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) setDirection('right');
        else if (deltaX < -threshold) setDirection('left');
      } else {
        if (deltaY > threshold) setDirection('down');
        else if (deltaY < -threshold) setDirection('up');
      }
    };

    const handleTouchEnd = () => {
      setTouchStart(null);
      setDirection(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart]);

  // Compute direction from active keys
  useEffect(() => {
    if (activeKeys.has('w') || activeKeys.has('arrowup')) {
      setDirection('up');
    } else if (activeKeys.has('s') || activeKeys.has('arrowdown')) {
      setDirection('down');
    } else if (activeKeys.has('a') || activeKeys.has('arrowleft')) {
      setDirection('left');
    } else if (activeKeys.has('d') || activeKeys.has('arrowright')) {
      setDirection('right');
    } else {
      setDirection(null);
    }
  }, [activeKeys]);

  return direction;
};
