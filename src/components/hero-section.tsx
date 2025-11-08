'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, Globe } from 'lucide-react';
import { useState } from 'react';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isRTL = locale === 'ar';

  return (
    <section 
      className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Building2 
          className="absolute top-20 left-10 w-8 h-8 text-blue-600 opacity-20 animate-bounce"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <TrendingUp 
          className="absolute top-32 right-20 w-6 h-6 text-purple-600 opacity-20 animate-bounce"
          style={{ animationDelay: '1s', animationDuration: '3s' }}
        />
        <Globe 
          className="absolute bottom-20 left-1/4 w-10 h-10 text-pink-600 opacity-20 animate-bounce"
          style={{ animationDelay: '2s', animationDuration: '3s' }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo with animation */}
          <div className="mb-8 transform transition-all duration-500 hover:scale-105 flex justify-center">
            <img 
              src="/logo.png" 
              alt="GSC Capital Group Logo" 
              className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain"
            />
          </div>

          {/* Badge with animation */}
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm px-4 py-2 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
            Global Strategy Catalyst Group
          </Badge>

          {/* Main title with gradient effect */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="block transform transition-all duration-500 hover:scale-105">
              Empowering Business
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
              Excellence Worldwide
            </span>
          </h1>

          {/* Description with fade-in animation */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            GSC Capital Group brings together five specialized companies under one strategic umbrella, 
            delivering comprehensive solutions for real estate, technology, consulting, and investment.
          </p>

          {/* CTA buttons with hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              Explore Our Companies
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-blue-600 hover:text-blue-600"
            >
              Schedule Consultation
            </Button>
          </div>

          {/* Interactive element that follows mouse */}
          <div 
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
}