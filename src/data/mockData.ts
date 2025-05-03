import { User, Lesson, Parameter, TrainingModeInfo } from '../types';

// Mock user data
export const currentUser: User = {
  id: '1',
  name: 'Hyunjun Kim',
  email: 'hyunjun@example.com',
  avatar: './image/김현준.jpg',
  level: 'Intermediate',
  joinedDate: '2024-03-15',
  commitmentDays: [1, 2, 4, 5], // Days of the week (0 = Sunday, 6 = Saturday)
  friends: [
    {
      id: '2',
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 'Advanced',
    },
    {
      id: '3',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 'Beginner',
    },
    {
      id: '4',
      name: 'Sophia Garcia',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 'Intermediate',
    },
  ],
};

// Mock lessons data
export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Backhand Practice',
    date: '2024-06-01',
    duration: 45,
    mode: 'stroke',
    thumbnail: './image/Backhand Practice.jpg',
    videoUrl: '#',
    parameters: {
      power: 72,
      accuracy: 65,
      footwork: 80,
      consistency: 68,
    },
    feedback: [
      'Good backhand technique, but watch your follow-through',
      'Try to keep your front shoulder more open during the swing',
      'Your footwork has improved significantly since last session',
    ],
  },
  {
    id: '2',
    title: 'Serve Training',
    date: '2024-05-28',
    duration: 60,
    mode: 'stroke',
    thumbnail: './image/Serve Training.jpg',
    videoUrl: '#',
    parameters: {
      power: 85,
      accuracy: 62,
      footwork: 75,
      consistency: 70,
    },
    feedback: [
      'Excellent power on your serves today',
      'Work on consistency with the ball toss',
      'Try to use more leg drive to increase power',
    ],
  },
  {
    id: '3',
    title: 'Match Simulation',
    date: '2024-05-25',
    duration: 90,
    mode: 'general',
    thumbnail: './image/Match Simulation.jpg',
    videoUrl: '#',
    parameters: {
      power: 75,
      accuracy: 78,
      footwork: 82,
      consistency: 80,
      strategy: 73,
    },
    feedback: [
      'Good court positioning throughout the match',
      'Try to vary your shots more to keep your opponent guessing',
      'Your consistency has improved significantly',
    ],
  },
  {
    id: '4',
    title: 'Federer-Style Practice',
    date: '2024-05-20',
    duration: 75,
    mode: 'idol',
    thumbnail: './image/Federer-Style Practice.jpg',
    videoUrl: '#',
    parameters: {
      power: 70,
      accuracy: 82,
      footwork: 78,
      consistency: 75,
      elegance: 85,
    },
    feedback: [
      'Your one-handed backhand is getting closer to Federer\'s style',
      'Work on the fluid transition between shots',
      'Good footwork and court coverage',
    ],
  },
];

// Mock parameters data
export const parameters: Parameter[] = [
  {
    id: 'power',
    name: 'Power',
    description: 'The force and speed of your shots',
    value: 75,
    maxValue: 100,
    history: [
      { date: '2024-06-01', value: 72 },
      { date: '2024-05-28', value: 85 },
      { date: '2024-05-25', value: 75 },
      { date: '2024-05-20', value: 70 },
      { date: '2024-05-15', value: 68 },
    ],
    tips: [
      'Work on your core strength to improve power',
      'Practice proper weight transfer during shots',
      'Try using a slightly heavier racket for power training',
    ],
  },
  {
    id: 'accuracy',
    name: 'Accuracy',
    description: 'The precision of your shots',
    value: 68,
    maxValue: 100,
    history: [
      { date: '2024-06-01', value: 65 },
      { date: '2024-05-28', value: 62 },
      { date: '2024-05-25', value: 78 },
      { date: '2024-05-20', value: 82 },
      { date: '2024-05-15', value: 60 },
    ],
    tips: [
      'Focus on your follow-through to improve accuracy',
      'Practice hitting to specific targets on the court',
      'Keep your eye on the ball throughout your swing',
    ],
  },
  {
    id: 'footwork',
    name: 'Footwork',
    description: 'Movement and positioning on the court',
    value: 80,
    maxValue: 100,
    history: [
      { date: '2024-06-01', value: 80 },
      { date: '2024-05-28', value: 75 },
      { date: '2024-05-25', value: 82 },
      { date: '2024-05-20', value: 78 },
      { date: '2024-05-15', value: 72 },
    ],
    tips: [
      'Practice split-step timing to improve reactivity',
      'Work on your lateral movement with side-to-side drills',
      'Focus on your recovery steps after each shot',
    ],
  },
  {
    id: 'consistency',
    name: 'Consistency',
    description: 'The reliability of your shots',
    value: 72,
    maxValue: 100,
    history: [
      { date: '2024-06-01', value: 68 },
      { date: '2024-05-28', value: 70 },
      { date: '2024-05-25', value: 80 },
      { date: '2024-05-20', value: 75 },
      { date: '2024-05-15', value: 65 },
    ],
    tips: [
      'Practice maintaining the same stroke technique repeatedly',
      'Focus on consistent contact point for each type of shot',
      'Work on your mental focus during longer rallies',
    ],
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Your tactical approach to the game',
    value: 65,
    maxValue: 100,
    history: [
      { date: '2024-06-01', value: 60 },
      { date: '2024-05-28', value: 62 },
      { date: '2024-05-25', value: 73 },
      { date: '2024-05-20', value: 68 },
      { date: '2024-05-15', value: 60 },
    ],
    tips: [
      'Analyze your opponents\' weaknesses before and during matches',
      'Develop a game plan for different types of opponents',
      'Practice adapting your strategy mid-match',
    ],
  },
];

// Training mode information
export const trainingModes: TrainingModeInfo[] = [
  {
    id: 'tactics',
    name: 'Tactics Training',
    description: 'Focus on strategic aspects of your game, including court positioning, shot selection, and game management',
    image: './image/Tactics training.PNG',
  },
  {
    id: 'stroke',
    name: 'Stroke Practice',
    description: 'Develop and refine specific tennis strokes like forehand, backhand, serve, volley, and more',
    image: './image/Stroke practice.JPG',
  },
  {
    id: 'challenges',
    name: 'Challenges',
    description: 'Take on specific drills and challenges designed to push your limits and test your skills',
    image: './image/Challenges.PNG',
  },
  {
    id: 'idol',
    name: 'Idol Mode',
    description: 'Emulate the playing style of tennis legends like Federer, Nadal, Williams, and others',
    image: './image/Idol mode.PNG',
  },
  {
    id: 'general',
    name: 'General Training',
    description: 'Comprehensive sessions that simulate match conditions and cover all aspects of tennis',
    image: './image/General training.JPG',
  },
];