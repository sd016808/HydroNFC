
import { WaterLog, NFCTagMapping, UserSettings } from '../types';

const STORAGE_KEYS = {
  LOGS: 'hydro_logs',
  TAGS: 'hydro_tags',
  SETTINGS: 'hydro_settings'
};

export const storageService = {
  getLogs: (): WaterLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  
  saveLog: (log: WaterLog) => {
    const logs = storageService.getLogs();
    logs.push(log);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getTags: (): NFCTagMapping[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
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
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  getSettings: (): UserSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      dailyGoal: 2000,
      reminderInterval: 60,
      remindersEnabled: true
    };
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};
