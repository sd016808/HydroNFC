
import { WaterLog, NFCTagMapping, UserSettings } from '../types';

const STORAGE_KEYS = {
  LOGS: 'hydro_logs',
  TAGS: 'hydro_tags',
  SETTINGS: 'hydro_settings'
};

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Storage access blocked:', e);
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Storage write blocked:', e);
  }
};

export const storageService = {
  getLogs: (): WaterLog[] => {
    const data = safeGetItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  
  saveLog: (log: WaterLog) => {
    const logs = storageService.getLogs();
    logs.push(log);
    safeSetItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getTags: (): NFCTagMapping[] => {
    const data = safeGetItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  },

  saveTag: (tag: NFCTagMapping) => {
    const tags = storageService.getTags();
    const existingIndex = tags.findIndex(t => t.tagId === tag.tagId);
    if (existingIndex > -1) {
      tags[existingIndex] = tag;
    } else {
      tags.push(tag);
    }
    safeSetItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  getSettings: (): UserSettings => {
    const data = safeGetItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      dailyGoal: 2000,
      reminderInterval: 60,
      remindersEnabled: true
    };
  },

  saveSettings: (settings: UserSettings) => {
    safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};
