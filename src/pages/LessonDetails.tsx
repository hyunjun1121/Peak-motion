import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { lessons } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

const LessonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const lesson = lessons.find(lesson => lesson.id === id);
  
  if (!lesson) {
    return (
      <div className="h-80 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-3">Lesson not found</h2>
        <Button
          variant="outline"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/lessons')}
        >
          Back to Lessons
        </Button>
      </div>
    );
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/lessons')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section title="Lesson Video">
            <div className={`aspect-video ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
              <div className="text-center">
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(lesson.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{lesson.duration} minutes</span>
                </div>
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                  {lesson.mode.charAt(0).toUpperCase() + lesson.mode.slice(1)} Training
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">Session Description</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This {lesson.mode} training session focused on improving your {Object.keys(lesson.parameters).slice(0, 2).join(' and ')}. 
                The session lasted {lesson.duration} minutes and was recorded on {formatDate(lesson.date)}.
              </p>
              
              <div className="flex items-center gap-2">
                <Button variant="primary">
                  Download Video
                </Button>
                <Button variant="outline">
                  Share Results
                </Button>
              </div>
            </div>
          </Section>
        </div>
        
        <div className="space-y-6">
          <Section title="Performance Metrics">
            <div className="p-4 space-y-4">
              {Object.entries(lesson.parameters).map(([key, value]) => (
                <ProgressBar
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  max={100}
                  color={
                    key === 'power' ? 'error' :
                    key === 'accuracy' ? 'secondary' :
                    key === 'footwork' ? 'primary' :
                    key === 'consistency' ? 'warning' :
                    'success'
                  }
                />
              ))}
            </div>
          </Section>
          
          <Section title="Coach's Feedback">
            <div className="p-4">
              <div className="space-y-3">
                {lesson.feedback.map((feedback, index) => (
                  <Card key={index} className="border-l-4 border-green-500">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <p className="text-sm">{feedback}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Section>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/live-session')}
          >
            Start New Training Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;