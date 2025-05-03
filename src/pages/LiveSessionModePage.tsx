import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import { trainingModes } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LiveSessionModePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-4">Choose Your Training Mode</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Select the type of training session you want to start. Your AI coach will adapt its feedback based on your choice.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trainingModes.map((mode) => (
          <Card
            key={mode.id}
            className="overflow-hidden transform transition-all duration-300 hover:scale-[1.02] h-full flex flex-col"
            onClick={() => navigate(`/live-session/${mode.id}`)}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={mode.image} 
                alt={mode.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-xl font-semibold mb-2">{mode.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                {mode.description}
              </p>
              <div className={`mt-auto flex items-center justify-end text-green-600 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                <span className="font-medium">Start Session</span>
                <ArrowRight className="ml-1 w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveSessionModePage;