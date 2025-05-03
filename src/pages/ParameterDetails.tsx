import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { parameters } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

const ParameterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const parameter = parameters.find(p => p.id === id);
  
  if (!parameter) {
    return (
      <div className="h-80 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-3">Parameter not found</h2>
        <Button
          variant="outline"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/parameters')}
        >
          Back to Parameters
        </Button>
      </div>
    );
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/parameters')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">{parameter.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Parameter Overview">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Current Level</h3>
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
                  size="lg"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {parameter.description}. This is a crucial skill for tennis players at all levels. Your current score is {parameter.value} 
                  out of {parameter.maxValue}, which places you at an intermediate level for this skill.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Regular practice and focusing on the recommended improvement techniques will help you enhance this parameter over time.
                </p>
              </div>
            </div>
          </Section>
          
          <Section title="Progress History">
            <div className="p-6">
              <div className={`h-60 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg relative mb-4`}>
                {/* Simple chart visualization */}
                <div className="absolute inset-0 p-4 flex items-end">
                  {parameter.history.map((point, index) => {
                    const height = `${(point.value / parameter.maxValue) * 100}%`;
                    const width = `${100 / (parameter.history.length * 2)}%`;
                    const margin = `${100 / (parameter.history.length * 2)}%`;
                    
                    return (
                      <div 
                        key={index} 
                        className="flex flex-col items-center"
                        style={{ width, marginLeft: margin, marginRight: margin }}
                      >
                        <div 
                          className={`w-full rounded-t-sm ${
                            parameter.id === 'power' ? 'bg-red-500' :
                            parameter.id === 'accuracy' ? 'bg-blue-500' :
                            parameter.id === 'footwork' ? 'bg-green-500' :
                            parameter.id === 'consistency' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`}
                          style={{ height }}
                        ></div>
                        <div className="text-xs mt-2 text-gray-600 dark:text-gray-300 text-center">
                          {formatDate(point.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute inset-y-0 left-0 p-4 flex flex-col justify-between pointer-events-none">
                  <span className="text-xs text-gray-500 dark:text-gray-400">100</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">75</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">50</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">25</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your {parameter.name.toLowerCase()} has {
                  parameter.history[0].value > parameter.history[parameter.history.length - 1].value
                    ? 'improved'
                    : 'fluctuated'
                } over the past {parameter.history.length} sessions. 
                {
                  parameter.history[0].value > parameter.history[parameter.history.length - 1].value
                    ? ` There's been a ${parameter.history[0].value - parameter.history[parameter.history.length - 1].value}% improvement since your first recorded session.`
                    : ' Focus on consistency to see more stable progress.'
                }
              </p>
            </div>
          </Section>
        </div>
        
        <div className="space-y-6">
          <Section title="Improvement Tips">
            <div className="p-4">
              <div className="space-y-4">
                {parameter.tips.map((tip, index) => (
                  <Card 
                    key={index} 
                    className={`border-l-4 ${
                      parameter.id === 'power' ? 'border-red-500' :
                      parameter.id === 'accuracy' ? 'border-blue-500' :
                      parameter.id === 'footwork' ? 'border-green-500' :
                      parameter.id === 'consistency' ? 'border-yellow-500' :
                      'border-purple-500'
                    }`}
                  >
                    <p className="text-sm">{tip}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Section>
          
          <Section title="Recommended Drills">
            <div className="p-4">
              <div className="space-y-3">
                <Card>
                  <h4 className="font-medium mb-1">Shadow Practice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Practice your swing technique without a ball to focus purely on form.
                  </p>
                </Card>
                <Card>
                  <h4 className="font-medium mb-1">Target Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Place targets on the court and aim your shots to improve precision.
                  </p>
                </Card>
                <Card>
                  <h4 className="font-medium mb-1">Rally Consistency</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Focus on maintaining long rallies to build muscle memory and consistency.
                  </p>
                </Card>
              </div>
              
              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={() => navigate('/live-session')}
              >
                Start Practice Session
              </Button>
            </div>
          </Section>
          
          <Section title="Related Parameters">
            <div className="p-4">
              <div className="space-y-3">
                {parameters
                  .filter(p => p.id !== parameter.id)
                  .slice(0, 3)
                  .map(relatedParam => (
                    <div 
                      key={relatedParam.id}
                      className={`p-3 rounded-lg cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      onClick={() => navigate(`/parameters/${relatedParam.id}`)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{relatedParam.name}</h4>
                        <span className="text-sm">{relatedParam.value}/{relatedParam.maxValue}</span>
                      </div>
                      <div className={`w-full h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                        <div
                          className={`h-full rounded-full ${
                            relatedParam.id === 'power' ? 'bg-red-500' :
                            relatedParam.id === 'accuracy' ? 'bg-blue-500' :
                            relatedParam.id === 'footwork' ? 'bg-green-500' :
                            relatedParam.id === 'consistency' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${(relatedParam.value / relatedParam.maxValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ParameterDetails;