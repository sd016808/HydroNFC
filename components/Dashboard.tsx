
import React from 'react';
import { Droplet, Plus, Nfc } from 'lucide-react';

interface DashboardProps {
  currentIntake: number;
  goal: number;
  onAddManual: (amount: number) => void;
  onStartNFC: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentIntake, goal, onAddManual, onStartNFC }) => {
  const percentage = Math.min(Math.round((currentIntake / goal) * 100), 100);
  
  return (
    <div className="flex flex-col items-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="relative w-64 h-64 rounded-full border-8 border-blue-100 flex items-center justify-center overflow-hidden bg-white shadow-xl">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-700 ease-out flex items-center justify-center"
          style={{ height: `${percentage}%`, opacity: 0.8 }}
        >
          <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400 opacity-50 blur-sm transform -translate-y-2"></div>
        </div>
        
        <div className="z-10 text-center flex flex-col items-center">
          <Droplet className={`w-12 h-12 mb-2 ${percentage > 50 ? 'text-white' : 'text-blue-500'}`} />
          <span className={`text-4xl font-bold ${percentage > 50 ? 'text-white' : 'text-slate-800'}`}>
            {currentIntake}
          </span>
          <span className={`text-sm font-medium ${percentage > 50 ? 'text-blue-100' : 'text-slate-500'}`}>
            / {goal} ml
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button 
          onClick={onStartNFC}
          className="col-span-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <Nfc className="w-6 h-6" />
          NFC 掃描確認
        </button>
        
        <button 
          onClick={() => onAddManual(250)}
          className="flex flex-col items-center justify-center bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 font-semibold py-4 rounded-2xl shadow-sm transition-all active:scale-95"
        >
          <span className="text-xs uppercase tracking-wider opacity-60">小杯</span>
          <span className="text-xl">250ml</span>
        </button>
        
        <button 
          onClick={() => onAddManual(500)}
          className="flex flex-col items-center justify-center bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 font-semibold py-4 rounded-2xl shadow-sm transition-all active:scale-95"
        >
          <span className="text-xs uppercase tracking-wider opacity-60">大杯</span>
          <span className="text-xl">500ml</span>
        </button>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm font-medium">
          {percentage >= 100 ? '🎉 目標達成！太棒了！' : `今日進度已完成 ${percentage}%`}
        </p>
      </div>
    </div>
  );
};
