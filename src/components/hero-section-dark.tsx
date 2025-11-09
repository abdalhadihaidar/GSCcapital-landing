'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, Globe } from 'lucide-react';
import { useState } from 'react';
import { translations, Language } from '@/lib/translations';

interface HeroSectionDarkProps {
  locale: string;
}

export function HeroSectionDark({ locale }: HeroSectionDarkProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isRTL = locale === 'ar';
  const t = translations[locale as Language] || translations.en;

  return (
    <section 
      className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements for dark theme */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      {/* Floating icons for dark theme */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Building2 
          className="absolute top-20 left-10 w-8 h-8 text-blue-400 opacity-20 animate-bounce"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <TrendingUp 
          className="absolute top-32 right-20 w-6 h-6 text-purple-400 opacity-20 animate-bounce"
          style={{ animationDelay: '1s', animationDuration: '3s' }}
        />
        <Globe 
          className="absolute bottom-20 left-1/4 w-10 h-10 text-pink-400 opacity-20 animate-bounce"
          style={{ animationDelay: '2s', animationDuration: '3s' }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo with animation */}
          <div className="mb-8 transform transition-all duration-500 hover:scale-105 flex justify-center">
            <div className="relative drop-shadow-[0_0_20px_rgba(147,51,234,0.6)] drop-shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              <img 
                src="/logo.png" 
                alt="GSC Capital Group Logo" 
                className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain filter brightness-110 contrast-110"
              />
              <div className="absolute inset-0 rounded-lg border-2 border-purple-500/40 blur-md -z-10 animate-pulse" />
              <div className="absolute inset-0 rounded-lg border border-blue-400/30 blur-sm -z-10" />
            </div>
          </div>

          {/* Badge with animation */}
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm px-4 py-2 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
            {t.hero.badge}
          </Badge>

          {/* Main title with gradient effect */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" dir={isRTL ? 'rtl' : 'ltr'}>
            <span className="block transform transition-all duration-500 hover:scale-105">
              {t.hero.title1}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">
              {t.hero.title2}
            </span>
          </h1>

          {/* Description with fade-in animation */}
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
            {t.hero.description}
          </p>

          {/* CTA buttons with hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              onClick={() => {
                const companiesSection = document.getElementById('companies');
                if (companiesSection) {
                  companiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {t.companies.learnMore}
              <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} w-5 h-5 group-hover:translate-x-1 transition-transform duration-300`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-blue-400 hover:text-blue-400 text-white border-slate-600"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {t.hero.getStarted}
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