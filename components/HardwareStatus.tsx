import React, { useState, useEffect } from 'react';
import { Wind, Thermometer, Sun, MicOff, Wifi } from 'lucide-react';
import { CapsuleStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const HardwareStatus: React.FC = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<CapsuleStatus>({
    co2: 412,
    temp: 22.5,
    lux: 450,
    noiseCancelling: true,
    privacyMode: true,
  });

  // Simulate hardware telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        co2: Math.max(400, Math.min(450, prev.co2 + (Math.random() * 10 - 5))),
        lux: Math.max(440, Math.min(460, prev.lux + (Math.random() * 4 - 2))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900 text-slate-300 py-2 px-6 flex items-center justify-between text-xs sm:text-sm border-b border-slate-700 shadow-md">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-emerald-400">
            <Wifi size={14} />
            <span className="font-semibold tracking-wider">{t('hardware.pod_online')}</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-1" title="CO2 Level">
          <Wind size={14} className={status.co2 > 1000 ? "text-red-400" : "text-blue-400"} />
          <span>{Math.round(status.co2)} ppm</span>
        </div>

        <div className="hidden sm:flex items-center space-x-1" title="Temperature">
          <Thermometer size={14} className="text-orange-400" />
          <span>{status.temp.toFixed(1)}°C</span>
        </div>

        <div className="hidden sm:flex items-center space-x-1" title="Lighting">
          <Sun size={14} className="text-yellow-400" />
          <span>{Math.round(status.lux)} lux ({t('hardware.focus')})</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-1 ${status.noiseCancelling ? 'text-indigo-400' : 'text-slate-600'}`}>
          <MicOff size={14} />
          <span className="hidden md:inline">{t('hardware.anc_active')}</span>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
    </div>
  );
};