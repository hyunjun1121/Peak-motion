import React from 'react';
import { Calendar, Medal, Clock, Video } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { currentUser, lessons, parameters } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  
  // Calculate total training time
  const totalTrainingMinutes = lessons.reduce((total, lesson) => total + lesson.duration, 0);
  const totalHours = Math.floor(totalTrainingMinutes / 60);
  const remainingMinutes = totalTrainingMinutes % 60;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Calculate average parameter value
  const calculateAverageSkill = () => {
    const sum = parameters.reduce((total, param) => total + param.value, 0);
    return Math.round(sum / parameters.length);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Section title="Profile">
            <div className="p-6 flex flex-col items-center text-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md mb-4"
              />
              <h2 className="text-2xl font-bold mb-1">{currentUser.name}</h2>
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                {currentUser.level} Player
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Member since {formatDate(currentUser.joinedDate)}
              </p>
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </Section>
          
          <div className="mt-6">
            <Section title="Stats Summary">
              <div className="p-4 grid grid-cols-2 gap-4">
                <Card className={`${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <div className="flex flex-col items-center text-center">
                    <Video className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                      {lessons.length}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                      Sessions
                    </p>
                  </div>
                </Card>
                
                <Card className={`${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <div className="flex flex-col items-center text-center">
                    <Clock className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                      {totalHours}h {remainingMinutes}m
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                      Total Time
                    </p>
                  </div>
                </Card>
                
                <Card className={`${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <div className="flex flex-col items-center text-center">
                    <Calendar className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                      {currentUser.commitmentDays.length}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                      Days/Week
                    </p>
                  </div>
                </Card>
                
                <Card className={`${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                  <div className="flex flex-col items-center text-center">
                    <Medal className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                      {calculateAverageSkill()}/100
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'}`}>
                      Avg. Skill
                    </p>
                  </div>
                </Card>
              </div>
            </Section>
          </div>
          
          <div className="mt-6">
            <Section title="Account Settings">
              <div className="p-4 space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Notification Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Password & Security
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export Training Data
                </Button>
              </div>
            </Section>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Section title="Skill Radar">
            <div className="p-6">
              <div className="w-full h-64 flex items-center justify-center mb-6">
                {/* Simple skill visualization */}
                <div className="relative w-56 h-56">
                  {/* Pentagon background */}
                  <div className={`absolute inset-0 flex items-center justify-center ${theme === 'dark' ? 'text-gray-700' : 'text-gray-200'}`}>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <polygon points="50,5 95,35 80,90 20,90 5,35" stroke="currentColor" strokeWidth="1" fill="none" />
                      <polygon points="50,20 80,40 70,75 30,75 20,40" stroke="currentColor" strokeWidth="1" fill="none" />
                      <polygon points="50,35 65,50 60,70 40,70 35,50" stroke="currentColor" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                  
                  {/* Data polygon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <polygon 
                        points={`
                          50,${5 + (95 - parameters.find(p => p.id === 'power')!.value * 0.9)}
                          ${95 - (95 - parameters.find(p => p.id === 'accuracy')!.value * 0.6)},35
                          ${80 - (80 - parameters.find(p => p.id === 'footwork')!.value * 0.6)},${90 - (90 - parameters.find(p => p.id === 'consistency')!.value * 0.85)}
                          ${20 + (parameters.find(p => p.id === 'consistency')!.value * 0.6)},${90 - (90 - parameters.find(p => p.id === 'strategy')!.value * 0.85)}
                          ${5 + (parameters.find(p => p.id === 'strategy')!.value * 0.6)},35
                        `}
                        className="fill-green-500/30 stroke-green-500"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute text-xs font-medium -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">Power</div>
                  <div className="absolute text-xs font-medium top-1/3 -right-1 transform translate-x-full -translate-y-1/2">Accuracy</div>
                  <div className="absolute text-xs font-medium bottom-0 right-1/4 transform translate-y-full">Footwork</div>
                  <div className="absolute text-xs font-medium bottom-0 left-1/4 transform translate-y-full">Consistency</div>
                  <div className="absolute text-xs font-medium top-1/3 -left-1 transform -translate-x-full -translate-y-1/2">Strategy</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                {parameters.map((parameter) => (
                  <div key={parameter.id}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold ${
                      parameter.id === 'power' ? 'bg-red-500' :
                      parameter.id === 'accuracy' ? 'bg-blue-500' :
                      parameter.id === 'footwork' ? 'bg-green-500' :
                      parameter.id === 'consistency' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}>
                      {parameter.value}
                    </div>
                    <p className="mt-2 text-sm font-medium">{parameter.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
          
          <Section title="Recent Activity">
            <div className="p-4">
              <div className="space-y-4">
                {lessons.slice(0, 3).map((lesson) => (
                  <Card key={lesson.id} className="flex items-center">
                    <div className="w-16 h-16 mr-4 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lesson.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {lesson.duration} min
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {lesson.mode.charAt(0).toUpperCase() + lesson.mode.slice(1)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Section>
          
          <Section title="Personal Records">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <div className="flex items-start">
                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'} mr-4`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Longest Session</h3>
                      <p className="text-lg font-bold">
                        {Math.max(...lessons.map(l => l.duration))} minutes
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lessons.sort((a, b) => b.duration - a.duration)[0].date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="flex items-start">
                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'} mr-4`}>
                      <Medal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Highest Rated Skill</h3>
                      <p className="text-lg font-bold">
                        {parameters.sort((a, b) => b.value - a.value)[0].name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {parameters.sort((a, b) => b.value - a.value)[0].value}/100
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="flex items-start">
                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'} mr-4`}>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Most Improved</h3>
                      <p className="text-lg font-bold">
                        Consistency
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        +15% in last month
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="flex items-start">
                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'} mr-4`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Consistency Streak</h3>
                      <p className="text-lg font-bold">
                        12 Days
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current streak
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// Missing imports
import { TrendingUp } from 'lucide-react';