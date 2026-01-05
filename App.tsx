
import React, { useState, useEffect } from 'react';
import { Home, History as HistoryIcon, Settings as SettingsIcon, Droplet } from 'lucide-react';
import { View, WaterLog, UserSettings, NFCTagMapping } from './types';
import { storageService } from './services/storageService';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { NFCModal } from './components/NFCModal';

const App = () => {
  // Fix: Removed <Type> generic syntax to avoid Babel SyntaxError
  const [currentView, setCurrentView] = useState(View.DASHBOARD);
  const [logs, setLogs] = useState(storageService.getLogs());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [tags, setTags] = useState(storageService.getTags());
  const [isNFCModalOpen, setIsNFCModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedTagId, setDetectedTagId] = useState(null);

  // Calculate today's total intake
  const todayTotal = logs
    .filter((log: WaterLog) => new Date(log.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum: number, log: WaterLog) => sum + log.amount, 0);

  // Handle reminder logic
  useEffect(() => {
    let intervalId: any;
    if (settings.remindersEnabled) {
      intervalId = setInterval(() => {
        if (todayTotal < settings.dailyGoal) {
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('該喝水囉！', {
                body: `您今日已喝 ${todayTotal}ml，距離目標還有 ${settings.dailyGoal - todayTotal}ml。`,
                icon: 'https://cdn-icons-png.flaticon.com/512/3100/3100566.png'
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
        }
      }, settings.reminderInterval * 60 * 1000);
    }
    return () => clearInterval(intervalId);
  }, [settings, todayTotal]);

  const addWater = (amount: number) => {
    const newLog: WaterLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amount
    };
    storageService.saveLog(newLog);
    setLogs((prev: WaterLog[]) => [...prev, newLog]);
  };

  const handleStartNFC = async () => {
    setIsNFCModalOpen(true);
    setIsScanning(true);
    setDetectedTagId(null);

    if ('NDEFReader' in window) {
      try {
        const reader = new (window as any).NDEFReader();
        await reader.scan();
        
        reader.onreading = (event: any) => {
          const id = event.serialNumber;
          const knownTag = tags.find((t: NFCTagMapping) => t.tagId === id);
          if (knownTag) {
            addWater(knownTag.amount);
            setIsNFCModalOpen(false);
            setIsScanning(false);
          } else {
            setDetectedTagId(id);
            setIsScanning(false);
          }
        };
      } catch (error) {
        console.error("NFC Error:", error);
        simulateNFCDetection();
      }
    } else {
      simulateNFCDetection();
    }
  };

  const simulateNFCDetection = () => {
    setTimeout(() => {
      const mockId = "MOCK-TAG-" + Math.floor(Math.random() * 10000);
      setDetectedTagId(mockId as any);
      setIsScanning(false);
    }, 2000);
  };

  const handleConfigureTag = (amount: number, name: string) => {
    if (detectedTagId) {
      const newTag: NFCTagMapping = { tagId: detectedTagId, amount, name };
      storageService.saveTag(newTag);
      setTags((prev: NFCTagMapping[]) => [...prev, newTag]);
      addWater(amount);
      setIsNFCModalOpen(false);
      setDetectedTagId(null);
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
    alert('設定已儲存');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 shadow-2xl relative">
      <header className="p-6 pb-2 flex justify-between items-center">
        <div>
          <h1 className="text-xs font-bold text-blue-600 tracking-widest uppercase">HydroNFC</h1>
          <p className="text-xl font-extrabold text-slate-800">
            {currentView === View.DASHBOARD ? '今日飲水' : currentView === View.HISTORY ? '歷史記錄' : '設定中心'}
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm">
          <Droplet className="w-6 h-6 text-blue-500 animate-pulse" />
        </div>
      </header>

      <main className="flex-1 pb-24 overflow-y-auto">
        {currentView === View.DASHBOARD && (
          <Dashboard 
            currentIntake={todayTotal} 
            goal={settings.dailyGoal} 
            onAddManual={addWater} 
            onStartNFC={handleStartNFC}
          />
        )}
        {currentView === View.HISTORY && (
          <History logs={logs} />
        )}
        {currentView === View.SETTINGS && (
          <Settings settings={settings} onSave={handleSaveSettings} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-around items-center z-40 rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <button 
          onClick={() => setCurrentView(View.DASHBOARD)}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === View.DASHBOARD ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">主頁</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.HISTORY)}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === View.HISTORY ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <HistoryIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">歷史</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.SETTINGS)}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === View.SETTINGS ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">設定</span>
        </button>
      </nav>

      {isNFCModalOpen && (
        <NFCModal 
          isScanning={isScanning}
          detectedTagId={detectedTagId}
          onClose={() => setIsNFCModalOpen(false)}
          onConfigureTag={handleConfigureTag}
        />
      )}
    </div>
  );
};

export default App;
