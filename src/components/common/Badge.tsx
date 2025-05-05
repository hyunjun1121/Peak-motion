import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'sm',
}) => {
  const { theme } = useTheme();
  
  const baseClasses = "inline-block rounded-full font-medium";
  
  const variantClasses = {
    default: `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`,
    success: `${theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`,
    warning: `${theme === 'dark' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`,
    error: `${theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'}`,
    info: `${theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`,
  };
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {text}
    </span>
  );
};

export default Badge;