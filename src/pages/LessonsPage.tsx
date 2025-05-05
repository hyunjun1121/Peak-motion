import React, { useState } from 'react';
// 더 이상 필요하지 않은 useNavigate 제거
// import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Search } from 'lucide-react';
// import Section from '../components/common/Section'; // 사용하지 않는 임포트 제거
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { lessons } from '../data/mockData';
import { TrainingMode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const LessonsPage: React.FC = () => {
  const { theme } = useTheme();
  // 더 이상 사용하지 않는 navigate 제거
  // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<TrainingMode | 'all'>('all');
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Filter lessons based on search term and mode
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || lesson.mode === filterMode;
    return matchesSearch && matchesMode;
  });
  
  // Get badge variant based on mode
  const getBadgeVariant = (mode: TrainingMode) => {
    switch (mode) {
      case 'tactics': return 'info';
      case 'stroke': return 'success';
      case 'challenges': return 'warning';
      case 'idol': return 'default';
      case 'general': return 'error';
      default: return 'default';
    }
  };
  
  // Format mode name
  const formatModeName = (mode: TrainingMode) => {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };
  
  // Handle lesson card click - 'lessonId' 매개변수는 사용하지 않지만 향후 확장성을 위해 유지
  const handleLessonClick = (_lessonId: string) => {
    // Open tennis-pose-analyzer instead of navigating to lesson details
    window.location.href = '/tennis-pose-analyzer/index.html';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Lesson History</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className={`relative rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className={`w-full md:w-64 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white focus:ring-green-600' 
                  : 'bg-white text-gray-900 focus:ring-green-500'
              }`}
            />
          </div>
          
          <select
            value={filterMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterMode(e.target.value as TrainingMode | 'all')}
            className={`rounded-lg px-3 py-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            <option value="all">All Modes</option>
            <option value="tactics">Tactics</option>
            <option value="stroke">Stroke</option>
            <option value="challenges">Challenges</option>
            <option value="idol">Idol</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>
      
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="overflow-hidden flex flex-col h-full"
              onClick={() => handleLessonClick(lesson.id)}
            >
              <div className="relative h-40">
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  text={formatModeName(lesson.mode)}
                  variant={getBadgeVariant(lesson.mode)}
                  size="md"
                  
                />
              </div>
              <div className="flex-grow p-4">
                <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(lesson.date)}</span>
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-1" />
                  <span>{lesson.duration} min</span>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {Object.entries(lesson.parameters).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs capitalize">{key}</span>
                        <div className={`w-16 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-full rounded-full ${
                              key === 'power' ? 'bg-red-500' :
                              key === 'accuracy' ? 'bg-blue-500' :
                              key === 'footwork' ? 'bg-green-500' :
                              key === 'consistency' ? 'bg-yellow-500' :
                              'bg-purple-500'
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <h3 className="text-xl font-medium mb-2">No lessons found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Try changing your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilterMode('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;