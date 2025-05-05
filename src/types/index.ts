export type TrainingMode = 'tactics' | 'stroke' | 'challenges' | 'idol' | 'general';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  joinedDate: string;
  commitmentDays: number[];
  friends: Friend[];
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: string;
}

export interface Lesson {
  id: string;
  title: string;
  date: string;
  duration: number;
  mode: TrainingMode;
  thumbnail: string;
  videoUrl: string;
  parameters: Record<string, number>;
  feedback: string[];
}

export interface Parameter {
  id: string;
  name: string;
  description: string;
  value: number;
  maxValue: number;
  history: ParameterHistory[];
  tips: string[];
}

export interface ParameterHistory {
  date: string;
  value: number;
}

export interface TrainingModeInfo {
  id: TrainingMode;
  name: string;
  description: string;
  image: string;
}