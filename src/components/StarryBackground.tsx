
import { useEffect } from 'react';

const StarryBackground = () => {
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}vw`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      document.getElementById('starry-bg')?.appendChild(star);
      
      setTimeout(() => {
        star.remove();
      }, 5000);
    };

    const interval = setInterval(() => {
      createStar();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <div id="starry-bg" className="fixed inset-0 pointer-events-none overflow-hidden" />;
};

export default StarryBackground;
