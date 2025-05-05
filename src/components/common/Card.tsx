import React, { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', onClick }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;