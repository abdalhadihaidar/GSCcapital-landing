'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { optimizeCompanyImage } from '@/lib/cloudinary';

interface EnhancedCardProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  imageUrl?: string;
  color: string;
  onLearnMore?: () => void;
  className?: string;
}

export function EnhancedCard({ 
  title, 
  description, 
  features, 
  icon, 
  imageUrl,
  color, 
  onLearnMore,
  className = '' 
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`group relative overflow-hidden border-0 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-105 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
      />
      
      {/* Floating icon background */}
      <div 
        className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-r ${color} rounded-full opacity-10 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`}
      />
      
      <CardHeader className="pb-4 relative z-10">
        <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden`}>
          {imageUrl ? (
            <img 
              src={optimizeCompanyImage(imageUrl)} 
              alt={title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            icon
          )}
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-600">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <ul className="space-y-2 mb-6">
          {features.slice(0, 4).map((feature, index) => (
            <li 
              key={index} 
              className="flex items-center text-sm text-slate-600 transform transition-all duration-300 group-hover:translate-x-1"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="group-hover:text-slate-900 transition-colors duration-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full bg-gradient-to-r ${color} hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}
          onClick={onLearnMore}
        >
          Learn More
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
      
      {/* Shimmer effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 animate-shimmer" />
        </div>
      )}
    </Card>
  );
}