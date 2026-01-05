
import React, { useState } from 'react';
import { Nfc, Loader2, X } from 'lucide-react';

interface NFCModalProps {
  isScanning: boolean;
  detectedTagId: string | null;
  onClose: () => void;
  onConfigureTag: (amount: number, name: string) => void;
}

export const NFCModal: React.FC<NFCModalProps> = ({ isScanning, detectedTagId, onClose, onConfigureTag }) => {
  const [customAmount, setCustomAmount] = useState(250);
  const [tagName, setTagName] = useState('我的水杯');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="flex justify-end w-full -mt-4 -mr-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {isScanning && !detectedTagId && (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                <div className="relative bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center text-blue-500">
                  <Nfc className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">正在等待標籤...</h3>
                <p className="text-slate-500 text-sm">請將手機背面靠近 NFC 標籤以進行感應</p>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Loader2 className="w-3 h-3 animate-spin" />
                偵測中...
              </div>
            </>
          )}

          {detectedTagId && (
            <>
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center text-green-500">
                <Nfc className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">偵測到新標籤！</h3>
                <p className="text-slate-500 text-sm">標籤 ID: {detectedTagId.substring(0, 12)}...</p>
              </div>

              <div className="w-full space-y-4 pt-4 border-t border-slate-100 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">標籤名稱</label>
                  <input 
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：健身房水壺"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">預設飲水量 (ml)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[150, 250, 500].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setCustomAmount(amt)}
                        className={`py-2 rounded-xl text-sm font-bold border transition-all ${customAmount === amt ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {amt}ml
                      </button>
                    ))}
                  </div>
                  <input 
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                    className="w-full p-4 mt-2 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-center text-xl"
                  />
                </div>
              </div>

              <button 
                onClick={() => onConfigureTag(customAmount, tagName)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                儲存標籤並記錄
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
