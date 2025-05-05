import React from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { parameters } from '../data/mockData';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ParametersPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // Calculate trend (positive or negative) for each parameter
  const getParameterTrend = (history: { date: string; value: number }[]) => {
    if (history.length < 2) return 0;
    const latestValue = history[0].value;
    const previousValue = history[1].value;
    return latestValue - previousValue;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Performance Parameters</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parameters.map((parameter) => {
          const trend = getParameterTrend(parameter.history);
          
          return (
            <Card
              key={parameter.id}
              className="overflow-hidden flex flex-col"
              onClick={() => navigate(`/parameters/${parameter.id}`)}
            >
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{parameter.name}</h3>
                  <div className={`flex items-center ${
                    trend > 0 
                      ? 'text-green-500' 
                      : trend < 0 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                  }`}>
                    {trend > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : trend < 0 ? (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    ) : null}
                    <span className="text-sm font-medium">
                      {trend > 0 ? `+${trend}` : trend}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {parameter.description}
                </p>
                
                <ProgressBar
                  value={parameter.value}
                  max={parameter.maxValue}
                  color={
                    parameter.id === 'power' ? 'error' :
                    parameter.id === 'accuracy' ? 'secondary' :
                    parameter.id === 'footwork' ? 'primary' :
                    parameter.id === 'consistency' ? 'warning' :
                    'success'
                  }
                />
              </div>
              
              <div className={`px-4 py-3 flex justify-between items-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <span className="text-sm font-medium">View Details</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Card>
          );
        })}
      </div>
      
      <Section title="Skills Analysis">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Strengths</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} mr-2`}></div>
                  <div>
                    <p className="font-medium">Excellent Footwork</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Your court movement and positioning is above average.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} mr-2`}></div>
                  <div>
                    <p className="font-medium">Consistent Power</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">You maintain good power throughout your sessions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} mr-2`}></div>
                  <div>
                    <p className="font-medium">Improving Consistency</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Your shot consistency has shown significant improvement.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Areas for Improvement</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-red-400' : 'bg-red-500'} mr-2`}></div>
                  <div>
                    <p className="font-medium">Strategic Decision Making</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Work on analyzing opponents and adapting your game plan.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-red-400' : 'bg-red-500'} mr-2`}></div>
                  <div>
                    <p className="font-medium">Accuracy Consistency</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Focus on maintaining accuracy throughout longer sessions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-red-400' : 'bg-red-500'} mr-2`}></div>
                  <div>
                    <p className="font-medium">Shot Variety</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Incorporate more varied shots into your game.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recommended Training Focus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h4 className="font-medium mb-2">Strategy Sessions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Focus on tactical training to improve your decision-making and game management.
                </p>
              </Card>
              <Card>
                <h4 className="font-medium mb-2">Accuracy Drills</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Practice target hitting exercises to improve your shot placement consistency.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ParametersPage;