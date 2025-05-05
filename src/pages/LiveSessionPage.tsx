import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, StopCircle, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import { trainingModes, parameters } from '../data/mockData';
import { TrainingMode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const LiveSessionPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>() as { mode: TrainingMode };
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [liveParameters, setLiveParameters] = useState<Record<string, number>>({});
  
  // Find the selected training mode
  const selectedMode = trainingModes.find(m => m.id === mode);
  
  // If mode not found, redirect to mode selection
  if (!selectedMode) {
    navigate('/live-session');
    return null;
  }
  
  // Initialize parameters when session starts
  useEffect(() => {
    if (isRecording) {
      // Create initial parameter values
      const initialParams: Record<string, number> = {};
      parameters.forEach(param => {
        initialParams[param.id] = Math.floor(param.value * 0.8);
      });
      setLiveParameters(initialParams);
      
      // Add first feedback
      setFeedback(['Getting ready to analyze your session...']);
      
      // Timer for session duration
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Simulate parameter changes every few seconds
        if (sessionTime % 5 === 0) {
          updateParameters();
        }
        
        // Add AI feedback at certain intervals
        if (sessionTime === 5) {
          addFeedback('I see you\'re warming up. Remember to keep your knees slightly bent for better stability.');
        } else if (sessionTime === 15) {
          addFeedback('Your forehand swing is looking good, but try to follow through more completely.');
        } else if (sessionTime === 25) {
          addFeedback('Great footwork! You\'re moving well to position yourself for each shot.');
        } else if (sessionTime === 35) {
          addFeedback('Try to rotate your shoulders more on your backhand to generate more power.');
        } else if (sessionTime % 20 === 0 && sessionTime > 0) {
          const feedbackOptions = [
            'Remember to keep your eye on the ball throughout your swing.',
            'Your positioning is improving. Keep adjusting based on your opponent\'s stance.',
            'Nice follow-through on that last shot!',
            'Your rhythm is good, but you could vary your shots more to keep your opponent guessing.',
            'Great recovery after that challenging shot!',
          ];
          const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
          addFeedback(randomFeedback);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isRecording, sessionTime]);
  
  // Function to update parameters randomly
  const updateParameters = () => {
    setLiveParameters(prev => {
      const newParams = { ...prev };
      Object.keys(newParams).forEach(key => {
        // Random adjustment between -3 and +5
        const adjustment = Math.floor(Math.random() * 9) - 3;
        newParams[key] = Math.min(100, Math.max(50, newParams[key] + adjustment));
      });
      return newParams;
    });
  };
  
  // Add new feedback
  const addFeedback = (text: string) => {
    setFeedback(prev => [text, ...prev].slice(0, 5));
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle start/stop recording
  const toggleRecording = () => {
    if (isRecording) {
      // Handle end of recording
      navigate('/lessons');
    } else {
      setIsRecording(true);
      setSessionTime(0);
      setFeedback([]);
    }
  };
  
  // Handle pause recording
  const pauseRecording = () => {
    setIsRecording(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/live-session')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">{selectedMode.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Live Camera Feed">
            <div className={`aspect-video ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex flex-col items-center justify-center`}>
              {isRecording ? (
                <img
                  src={selectedMode.image}
                  alt="Live preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-12">
                  <div className="mb-4">
                    <Play className={`w-20 h-20 mx-auto ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Start</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Position yourself in front of the camera where your full body is visible and click "Start Recording" to begin.
                  </p>
                </div>
              )}
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-wrap gap-3">
              {isRecording ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<Pause className="w-5 h-5" />}
                    onClick={pauseRecording}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<StopCircle className="w-5 h-5" />}
                    onClick={toggleRecording}
                  >
                    End Session
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Play className="w-5 h-5" />}
                  onClick={toggleRecording}
                  className="mr-3"
                >
                  Start Recording
                </Button>
              )}
              
              <div className="flex-grow"></div>
              
              <Button
                variant="outline"
                size="md"
                icon={micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                onClick={() => setMicEnabled(!micEnabled)}
              >
                {micEnabled ? 'Mic On' : 'Mic Off'}
              </Button>
              
              <Button
                variant="outline"
                size="md"
                icon={cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                onClick={() => setCameraEnabled(!cameraEnabled)}
              >
                {cameraEnabled ? 'Camera On' : 'Camera Off'}
              </Button>
            </div>
          </Section>
          
          <Section title="AI Coach Feedback">
            <div className="p-4 min-h-48">
              {isRecording ? (
                <div className="space-y-3">
                  {feedback.length > 0 ? (
                    feedback.map((text, index) => (
                      <Card key={index} className={`border-l-4 ${index === 0 ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                        <div className="flex">
                          <p className={`text-sm ${index === 0 ? 'font-medium' : ''}`}>{text}</p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        Waiting for the AI coach to analyze your movements...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Start recording to receive real-time feedback from your AI coach.
                  </p>
                </div>
              )}
            </div>
          </Section>
        </div>
        
        <div className="space-y-6">
          <Section title="Session Info">
            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Duration</span>
                  <span className="font-mono">{formatTime(sessionTime)}</span>
                </div>
                <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(100, (sessionTime / 600) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 10-15 minutes per session
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Training Focus</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {selectedMode.description}
                </p>
              </div>
            </div>
          </Section>
          
          <Section title="Live Performance Metrics">
            <div className="p-4 space-y-5">
              {isRecording ? (
                Object.entries(liveParameters).slice(0, 5).map(([key, value]) => (
                  <div key={key}>
                    <ProgressBar
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
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Start recording to see live performance metrics.
                  </p>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;