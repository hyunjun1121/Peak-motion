import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, TrendingUp, Users } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';
import { currentUser, lessons, parameters } from '../data/mockData';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Helper function to get day name
  const getDayName = (dayNumber: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayNumber];
  };
  
  // Get most recent lesson
  const latestLesson = lessons[0];
  
  // Get current day of week
  const today = new Date().getDay();
  
  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className={`rounded-xl overflow-hidden relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        />
        <div className="relative p-6 md:p-8 z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Welcome back, {currentUser.name}!</h1>
          <p className="text-lg mb-6 max-w-2xl">Ready to improve your tennis skills today? Your AI coach is ready to help you achieve your goals.</p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="primary" 
              size="lg"
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => navigate('/live-session')}
            >
              Start Training Session
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              icon={<TrendingUp className="w-5 h-5" />}
              onClick={() => navigate('/parameters')}
            >
              View Progress
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick stats */}
        <Section title="Quick Stats">
          <div className="grid grid-cols-2 gap-4 p-4">
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <div className="flex items-start">
                <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h4 className="font-medium text-sm text-blue-800 dark:text-blue-300">Best Skill</h4>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-200">Footwork</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">80/100</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-900/30">
              <div className="flex items-start">
                <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h4 className="font-medium text-sm text-green-800 dark:text-green-300">Most Improved</h4>
                  <p className="text-xl font-bold text-green-900 dark:text-green-200">Consistency</p>
                  <p className="text-sm text-green-700 dark:text-green-300">+15% this month</p>
                </div>
              </div>
            </Card>
            
            <Card className="col-span-2 bg-orange-50 dark:bg-orange-900/30">
              <div className="flex items-start">
                <Calendar className="w-10 h-10 text-orange-600 dark:text-orange-400 mr-3" />
                <div>
                  <h4 className="font-medium text-sm text-orange-800 dark:text-orange-300">Recent Activity</h4>
                  <p className="text-xl font-bold text-orange-900 dark:text-orange-200">{latestLesson.title}</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{latestLesson.date} • {latestLesson.duration} min</p>
                </div>
              </div>
            </Card>
          </div>
        </Section>
        
        {/* Weekly commitment */}
        <Section title="Weekly Training Schedule">
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const isCommitmentDay = currentUser.commitmentDays.includes(day);
                const isToday = day === today;
                
                return (
                  <div 
                    key={day}
                    className={`
                      text-center p-2 rounded-lg ${isToday ? 'ring-2 ring-offset-2' : ''}
                      ${isToday && theme === 'dark' ? 'ring-blue-500' : isToday ? 'ring-blue-400' : ''}
                      ${isCommitmentDay && theme === 'dark' ? 'bg-green-800 text-white' : ''}
                      ${isCommitmentDay && theme !== 'dark' ? 'bg-green-600 text-white' : ''}
                      ${!isCommitmentDay && theme === 'dark' ? 'bg-gray-700' : ''}
                      ${!isCommitmentDay && theme !== 'dark' ? 'bg-gray-100' : ''}
                    `}
                  >
                    <div className="font-medium">{getDayName(day)}</div>
                    {isCommitmentDay ? (
                      <div className="text-xs mt-1 font-medium">
                        Training Day
                      </div>
                    ) : (
                      <div className="text-xs mt-1">
                        Rest Day
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-4">
              <Button 
                variant="outline"
                onClick={() => {}}
              >
                Modify Schedule
              </Button>
            </div>
          </div>
        </Section>
        
        {/* Friends */}
        <Section title="Tennis Buddies">
          <div className="p-4">
            {currentUser.friends.map((friend) => (
              <div 
                key={friend.id}
                className={`flex items-center p-3 mb-2 rounded-lg ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <img 
                  src={friend.avatar} 
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-medium">{friend.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{friend.level}</p>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">
                    Invite
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="text"
              className="w-full mt-2"
              onClick={() => {}}
            >
              <Users className="w-4 h-4 mr-2" />
              Find More Friends
            </Button>
          </div>
        </Section>
        
        {/* Improvement suggestions */}
        <Section title="Coach's Tips">
          <div className="p-4">
            <div className="space-y-4">
              {parameters.slice(0, 3).map((param) => (
                <div key={param.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{param.name}</span>
                    <span className="text-sm">{param.value}/{param.maxValue}</span>
                  </div>
                  <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                    <div
                      className={`h-full rounded-full ${
                        param.id === 'power' ? 'bg-red-500' :
                        param.id === 'accuracy' ? 'bg-blue-500' :
                        param.id === 'footwork' ? 'bg-green-500' :
                        param.id === 'consistency' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${(param.value / param.maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    {param.tips[0]}
                  </p>
                </div>
              ))}
              
              <Button 
                variant="text"
                className="w-full mt-2"
                onClick={() => navigate('/parameters')}
              >
                View All Parameters
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default HomePage;