import React, { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  const { theme } = useTheme();
  
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h2>
      <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        {children}
      </div>
    </section>
  );
};

export default Section;