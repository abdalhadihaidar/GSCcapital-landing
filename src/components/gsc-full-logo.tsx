'use client';

import { Building2 } from 'lucide-react';

interface GSCFullLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'gradient';
  className?: string;
}

export function GSCFullLogo({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}: GSCFullLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const getBackgroundClass = () => {
    switch (variant) {
      case 'white':
        return 'bg-white';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600';
    }
  };

  const getTextClass = () => {
    switch (variant) {
      case 'white':
        return 'text-slate-900';
      case 'gradient':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} ${getBackgroundClass()} rounded-lg flex items-center justify-center shadow-lg`}>
        <Building2 className={`${iconSizes[size]} ${getTextClass()}`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${textSizes[size]} ${getTextClass()}`}>
          GSC
        </span>
        <span className={`text-xs ${getTextClass()} opacity-80`}>
          Capital Group
        </span>
      </div>
    </div>
  );
}