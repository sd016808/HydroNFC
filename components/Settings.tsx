
import React from 'react';
import { UserSettings } from '../types';
import { Target, Bell, Clock, Save } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">個人設定</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <Target className="w-4 h-4 text-blue-500" />
              每日飲水目標 (ml)
            </label>
            <input 
              type="number"
              value={localSettings.dailyGoal}
              onChange={(e) => setLocalSettings({...localSettings, dailyGoal: parseInt(e.target.value) || 0})}
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <Bell className={`w-5 h-5 ${localSettings.remindersEnabled ? 'text-orange-400' : 'text-slate-300'}`} />
              <span className="font-semibold text-slate-700">啟用提醒通知</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={localSettings.remindersEnabled}
                onChange={(e) => setLocalSettings({...localSettings, remindersEnabled: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {localSettings.remindersEnabled && (
            <div className="space-y-4 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <Clock className="w-4 h-4 text-indigo-500" />
                提醒間隔 (分鐘)
              </label>
              <select 
                value={localSettings.reminderInterval}
                onChange={(e) => setLocalSettings({...localSettings, reminderInterval: parseInt(e.target.value)})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
              >
                <option value={30}>每 30 分鐘</option>
                <option value={60}>每 1 小時</option>
                <option value={120}>每 2 小時</option>
                <option value={180}>每 3 小時</option>
              </select>
            </div>
          )}
        </div>

        <button 
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <Save className="w-5 h-5" />
          儲存設定
        </button>
      </form>
      
      <div className="bg-indigo-50 p-4 rounded-2xl text-xs text-indigo-600 leading-relaxed">
        💡 <b>提示：</b> 設定合理的目標，並配合 NFC 標籤自動化記錄，能幫助您更輕鬆維持飲水習慣！
      </div>
    </div>
  );
};
