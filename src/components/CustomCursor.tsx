import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('label') ||
        !!target.closest('select') ||
        !!target.closest('.word-span') ||
        target.classList.contains('word-span') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-4px, -4px)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <img
        src={isPointer 
          ? 'https://i.ibb.co/mmTwFwC/Jujutsu-Kaisen-Gojo-Cat-Chibi-Satoru-Gojo-pointer-Sweezy-Cursors.png'
          : 'https://i.ibb.co/svQ6rPBK/Jujutsu-Kaisen-Gojo-Cat-Chibi-Satoru-Gojo-cursor-Sweezy-Cursors.png'
        }
        alt=""
        className="w-8 h-8 object-contain"
        draggable={false}
      />
    </div>
  );
}
