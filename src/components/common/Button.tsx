import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  const baseClasses = "rounded-lg font-medium transition-colors duration-200 flex items-center justify-center";
  
  const variantClasses = {
    primary: `${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`,
    secondary: `${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`,
    outline: `border ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`,
    text: `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`,
  };
  
  const sizeClasses = {
    sm: "text-sm px-3 py-1",
    md: "px-4 py-2",
    lg: "text-lg px-6 py-3",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;