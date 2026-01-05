
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { WaterLog } from '../types';

interface HistoryProps {
  logs: WaterLog[];
}

export const History: React.FC<HistoryProps> = ({ logs }) => {
  // Aggregate data by day for the last 7 days
  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const data = last7Days.map(dateStr => {
    const dailyTotal = logs
      .filter(log => new Date(log.timestamp).toISOString().split('T')[0] === dateStr)
      .reduce((sum, log) => sum + log.amount, 0);
    
    // Format date for display
    const dateObj = new Date(dateStr);
    const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    
    return { name: label, amount: dailyTotal };
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">歷史飲水曲線</h2>
      
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">最近紀錄</h3>
        <div className="space-y-2">
          {logs.slice(-5).reverse().map((log) => (
            <div key={log.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <span className="text-xs font-bold">ML</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{log.amount} ml</p>
                  <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <span className="text-slate-300">#{(log.id).substring(0, 4)}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-center text-slate-400 py-8 italic">尚無喝水紀錄</p>
          )}
        </div>
      </div>
    </div>
  );
};
