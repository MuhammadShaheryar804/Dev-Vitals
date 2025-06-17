import { User } from './types';

export enum Mood {
  GREAT = "😊 Great",
  GOOD = "🙂 Good",
  OKAY = "😐 Okay",
  BAD = "🙁 Bad",
  AWFUL = "😩 Awful",
}

export enum EyeStrainSeverity {
  NONE = "None",
  MILD = "Mild",
  MODERATE = "Moderate",
  SEVERE = "Severe",
}

export const MOOD_OPTIONS: Mood[] = Object.values(Mood);
export const EYE_STRAIN_OPTIONS: EyeStrainSeverity[] = Object.values(EyeStrainSeverity);

export const REMINDER_INTERVAL_WATER_MS = 30 * 60 * 1000; // 30 minutes
export const REMINDER_INTERVAL_SCREEN_BREAK_MS = 60 * 60 * 1000; // 1 hour

export const LOCAL_STORAGE_KEYS = {
  HEALTH_LOGS: 'devVitalsHealthLogs',
  JOURNAL_ENTRIES: 'devVitalsJournalEntries',
  REMINDER_SETTINGS: 'devVitalsReminderSettings',
  AUTH_USER: 'devVitalsAuthUser', 
};

export const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'dev@vitals.app',
  isEmailVerified: true,
};
