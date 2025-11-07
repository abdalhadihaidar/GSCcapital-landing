'use client';

import { Building2, TrendingUp, Home, Laptop, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  icon: any;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const icons = [Building2, TrendingUp, Home, Laptop, Users];
    const newElements: FloatingElement[] = [];
    
    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: i,
        icon: icons[Math.floor(Math.random() * icons.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      });
    }
    
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {elements.map((element) => {
        const Icon = element.icon;
        return (
          <div
            key={element.id}
            className="absolute opacity-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
              animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
            }}
          >
            <Icon className="w-full h-full text-blue-600" />
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
}