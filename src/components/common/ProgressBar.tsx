import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'primary',
}) => {
  const { theme } = useTheme();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };
  
  const colorClasses = {
    primary: `${theme === 'dark' ? 'bg-green-600' : 'bg-green-600'}`,
    secondary: `${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'}`,
    success: `${theme === 'dark' ? 'bg-emerald-600' : 'bg-emerald-600'}`,
    warning: `${theme === 'dark' ? 'bg-amber-500' : 'bg-amber-500'}`,
    error: `${theme === 'dark' ? 'bg-red-600' : 'bg-red-600'}`,
  };
  
  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && <span className="text-sm">{value}/{max}</span>}
        </div>
      )}
      <div className={`w-full ${heightClasses[size]} bg-gray-300 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;