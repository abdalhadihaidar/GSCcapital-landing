'use client';

import { useEffect, useState } from 'react';

export function AnimatedGradientBg() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" />
      
      {/* Animated gradient orbs */}
      <div 
        className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{
          left: `${mousePosition.x * 0.05}px`,
          top: `${mousePosition.y * 0.05}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div 
        className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{
          right: `${mousePosition.x * -0.05}px`,
          bottom: `${mousePosition.y * -0.05}px`,
          transform: 'translate(50%, 50%)',
        }}
      />
      <div 
        className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translateX(${Math.sin(Date.now() / 1000) * 50}px)`,
        }}
      />
    </div>
  );
}