import { Mood, EyeStrainSeverity } from './constants';

export interface User {
  id: string; 
  email: string;
  isEmailVerified: true; // Demo user is always verified
}

export interface HealthLog {
  id: string; // YYYY-MM-DD, unique identifier
  date: string; // YYYY-MM-DD
  hydration: number; // in glasses
  eyeStrain: EyeStrainSeverity;
  sleep: number; // in hours
  mood: Mood;
}

export interface JournalEntry {
  id: string; // Unique ID, e.g., timestamp
  date: string; // YYYY-MM-DD
  timestamp: number;
  text: string;
}

export interface ReminderSettings {
  waterBreakEnabled: boolean;
  screenBreakEnabled: boolean;
  notificationPermission: NotificationPermission;
}

export type ActiveSection = 
  | 'log' 
  | 'journal' 
  | 'dashboard' 
  | 'settings'
  | 'login';
