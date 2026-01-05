
export interface WaterLog {
  id: string;
  timestamp: number;
  amount: number; // in ml
}

export interface NFCTagMapping {
  tagId: string;
  amount: number;
  name: string;
}

export interface UserSettings {
  dailyGoal: number; // in ml
  reminderInterval: number; // in minutes
  remindersEnabled: boolean;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  NFC_CONFIG = 'NFC_CONFIG'
}
