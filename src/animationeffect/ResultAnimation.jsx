import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ResultAnimation = () => {
  useEffect(() => {
    const duration = 2000; // 5 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 20, spread: 240, ticks: 60, zIndex: 0 }; // Slower effect

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Adjust particleCount for smoother transition
      const particleCount = Math.min(100, 20 + (80 * (1 - timeLeft / duration)));

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 100); // Slower interval for smoother effect

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null; // No UI needed, just the animation
};

export default ResultAnimation;
