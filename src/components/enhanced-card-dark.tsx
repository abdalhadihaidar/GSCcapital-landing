'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { optimizeCompanyImage } from '@/lib/cloudinary';

interface EnhancedCardDarkProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  imageUrl?: string;
  color: string;
  onLearnMore?: () => void;
  className?: string;
}

export function EnhancedCardDark({ 
  title, 
  description, 
  features, 
  icon, 
  imageUrl,
  color, 
  onLearnMore,
  className = '' 
}: EnhancedCardDarkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`group relative overflow-hidden border border-slate-700 bg-slate-800 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-slate-600 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section - Upper Half */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <>
            <img 
              src={optimizeCompanyImage(imageUrl)} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
            <div className="text-white/80 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent`} />
      </div>
      
      {/* Content Section - Lower Half */}
      <div className="relative z-10 p-6">
        <CardTitle className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400 mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {description}
        </CardDescription>
        
        {/* Features - Hidden by default, shown on hover */}
        <div className={`overflow-hidden transition-all duration-500 ${isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="space-y-2 mb-4">
            {features.slice(0, 4).map((feature, index) => (
              <li 
                key={index} 
                className="flex items-center text-sm text-slate-400 transform transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span className="group-hover:text-slate-200 transition-colors duration-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          className={`w-full bg-gradient-to-r ${color} hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg`}
          onClick={onLearnMore}
        >
          Learn More
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
      
      {/* Shimmer effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      )}
    </Card>
  );
}
