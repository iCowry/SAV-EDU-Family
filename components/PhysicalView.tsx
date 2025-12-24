import React, { useEffect, useRef, useState } from 'react';
import { Activity, Eye, ScanFace, Dumbbell, AlertCircle, Watch, TrendingUp, Trophy, Play, Square, RefreshCcw, MonitorPlay, Footprints, Flame, CheckCircle2, Circle, Battery, RefreshCw, FileText, Ruler, Weight, Plus, ChevronRight, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, CartesianGrid, Legend } from 'recharts';
import { GeminiService } from '../services/geminiService';
import { GrowthData, SportsAdvice, DailyPlanTask, DailyGoal, GrowthRecord, SportsRecord } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const MOCK_HR_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  bpm: 70 + Math.random() * 20 + (i > 10 ? 30 : 0) // Simulate workout spike
}));

// Mock Growth Data
const STUDENT_GROWTH: GrowthData = {
    height: 168,
    weight: 54,
    growthRateCmPerMonth: 1.8, // Rapid growth
    bmi: 19.1
};

// Mock Historical Data with Standards (Simulating a 14-15 year old male)
const INITIAL_GROWTH_HISTORY: GrowthRecord[] = [
    { month: '2024-09', height: 164.5, weight: 51.0, standardHeight: 165.0, standardWeight: 53.0 },
    { month: '2024-10', height: 165.2, weight: 51.5, standardHeight: 165.5, standardWeight: 53.5 },
    { month: '2024-11', height: 166.0, weight: 52.2, standardHeight: 166.0, standardWeight: 54.0 },
    { month: '2024-12', height: 167.1, weight: 53.0, standardHeight: 166.5, standardWeight: 54.5 },
    { month: '2025-01', height: 167.8, weight: 53.5, standardHeight: 167.0, standardWeight: 55.0 },
    { month: '2025-02', height: 168.0, weight: 54.0, standardHeight: 167.5, standardWeight: 55.5 },
];

const INITIAL_SPORTS_HISTORY: SportsRecord[] = [
    { month: '2024-09', item: 'Jump Rope', score: 140, grade: 70 },
    { month: '2024-10', item: 'Jump Rope', score: 155, grade: 80 },
    { month: '2024-11', item: 'Jump Rope', score: 165, grade: 88 },
    { month: '2024-12', item: 'Jump Rope', score: 172, grade: 92 },
    { month: '2025-01', item: 'Jump Rope', score: 180, grade: 96 },
    { month: '2025-02', item: 'Jump Rope', score: 182, grade: 98 },
];

export const PhysicalView: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'health' | 'exam' | 'archives'>('exam');
  
  // Camera & Stream State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  // Health Mode State
  const [postureStatus, setPostureStatus] = useState<'Good' | 'Slouching' | 'Too Close'>('Good');

  // Wearable Data State
  const [isSyncing, setIsSyncing] = useState(false);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanTask[]>([
      { id: '1', title: 'Morning Jog', status: 'completed', target: '2km' },
      { id: '2', title: 'Jump Rope', status: 'pending', target: '1000 reps' },
      { id: '3', title: 'Plank', status: 'pending', target: '3 mins' }
  ]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
      { type: 'Steps', current: 6540, target: 8000, unit: '' },
      { type: 'Calories', current: 320, target: 450, unit: 'kcal' },
      { type: 'Distance', current: 4.2, target: 5.0, unit: 'km' }
  ]);

  // Exam Mode State
  const [exerciseType, setExerciseType] = useState('Jump Rope');
  const [isExercising, setIsExercising] = useState(false);
  const [reps, setReps] = useState(0);
  const [coachAdvice, setCoachAdvice] = useState<SportsAdvice | null>(null);
  const [heartRate, setHeartRate] = useState(85);

  // Archive Mode State
  const [growthHistory, setGrowthHistory] = useState(INITIAL_GROWTH_HISTORY);
  const [sportsHistory, setSportsHistory] = useState(INITIAL_SPORTS_HISTORY);
  const [newGrowth, setNewGrowth] = useState({ month: '2025-03', height: '', weight: '' });
  const [newSport, setNewSport] = useState({ month: '2025-03', item: 'Jump Rope', score: '' });

  // Calculated Stats
  const latestGrowth = growthHistory[growthHistory.length - 1];
  const heightDiff = latestGrowth.height - (latestGrowth.standardHeight || 0);
  const weightDiff = latestGrowth.weight - (latestGrowth.standardWeight || 0);

  const getHeightStatus = () => {
    if (heightDiff > 2) return t('physical.archives.status_tall');
    if (heightDiff < -2) return t('physical.archives.status_short');
    return t('physical.archives.status_normal');
  };

  const getWeightStatus = () => {
      if (weightDiff > 3) return t('physical.archives.status_overweight');
      if (weightDiff < -3) return t('physical.archives.status_underweight');
      return t('physical.archives.status_normal');
  };

  const getAIAdvice = () => {
      if (heightDiff > 2) return t('physical.archives.advice_tall');
      if (Math.abs(heightDiff) <= 2 && Math.abs(weightDiff) <= 3) return t('physical.archives.advice_normal');
      return t('physical.archives.advice_attention');
  };

  // --- LIFECYCLE: Camera ---
  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      setStreamActive(false);
      setIsSimulationMode(false);
      
      // Check for browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (mounted) setIsSimulationMode(true);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        if (mounted) {
            console.log("Camera access not available, switching to simulation mode.");
            setIsSimulationMode(true);
            setStreamActive(false);
        }
      }
    };
    
    // Only start camera if not in archive mode
    if (activeTab !== 'archives') {
        startCamera();
    }

    return () => {
        mounted = false;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    };
  }, [activeTab]); 

  // --- LIFECYCLE: Simulations ---
  useEffect(() => {
    if (activeTab === 'health') {
        // Sync Simulation
        const syncInterval = setInterval(() => {
            setIsSyncing(true);
            setTimeout(() => {
                setDailyGoals(prev => prev.map(g => ({ ...g, current: Math.min(g.target, g.current + Math.floor(Math.random() * 5)) })));
                setIsSyncing(false);
            }, 1500);
        }, 10000);

        const interval = setInterval(() => {
            const states: ('Good' | 'Slouching' | 'Too Close')[] = ['Good', 'Good', 'Good', 'Slouching', 'Too Close'];
            setPostureStatus(states[Math.floor(Math.random() * states.length)]);
        }, 5000);
        return () => { clearInterval(interval); clearInterval(syncInterval); };
    } else if (activeTab === 'exam') {
        // Exam Mode Simulation
        const hrInterval = setInterval(() => {
            if (isExercising) {
                setReps(r => r + 1);
                setHeartRate(h => Math.min(170, h + Math.random() * 2));
            } else {
                setHeartRate(h => Math.max(70, h - 1));
            }
        }, 1000); // 1 rep/sec simulated

        // Fetch AI Advice once
        if (!coachAdvice) {
            GeminiService.generateSportsCoaching(STUDENT_GROWTH, exerciseType, language).then(setCoachAdvice);
        }

        return () => clearInterval(hrInterval);
    }
  }, [activeTab, isExercising, exerciseType, language]);

  const handleAddGrowth = () => {
      if (newGrowth.height && newGrowth.weight) {
          // Approximate standard growth for demo (+0.5cm, +0.5kg per month)
          const lastRecord = growthHistory[growthHistory.length - 1];
          setGrowthHistory([...growthHistory, {
              month: newGrowth.month,
              height: parseFloat(newGrowth.height),
              weight: parseFloat(newGrowth.weight),
              standardHeight: (lastRecord.standardHeight || 167) + 0.5,
              standardWeight: (lastRecord.standardWeight || 55) + 0.5
          }]);
          setNewGrowth({ ...newGrowth, height: '', weight: '' });
      }
  };

  return (
    <div className="h-full flex flex-col p-1 gap-4">
        
        {/* Top Tab Switcher */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 w-fit mx-auto flex space-x-2 shadow-sm overflow-x-auto">
            <button 
                onClick={() => setActiveTab('exam')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                    activeTab === 'exam' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Trophy size={16} />
                <span>{t('physical.exam_training')}</span>
            </button>
            <button 
                onClick={() => setActiveTab('health')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                    activeTab === 'health' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Activity size={16} />
                <span>{t('physical.health_monitor')}</span>
            </button>
            <button 
                onClick={() => setActiveTab('archives')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                    activeTab === 'archives' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <FileText size={16} />
                <span>{t('physical.growth_archives')}</span>
            </button>
        </div>

        {/* --- ARCHIVES MODE (NEW) --- */}
        {activeTab === 'archives' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                {/* 1. Growth & Development */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                <TrendingUp size={20} />
                             </div>
                             <h3 className="font-bold text-slate-800">{t('physical.archives.height_weight')}</h3>
                        </div>
                        <div className="flex gap-2 text-[10px] font-semibold uppercase">
                            <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-0.5 bg-blue-300"></div>{t('physical.archives.std_height')}</span>
                            <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-0.5 bg-orange-300"></div>{t('physical.archives.std_weight')}</span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={growthHistory} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{fontSize: 12}} />
                                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" domain={['dataMin - 5', 'dataMax + 5']} />
                                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                
                                {/* Standard Reference Lines (Dashed/Light) */}
                                <Line yAxisId="left" type="monotone" dataKey="standardHeight" name={t('physical.archives.std_height')} stroke="#93c5fd" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="standardWeight" name={t('physical.archives.std_weight')} stroke="#fdba74" strokeWidth={2} strokeDasharray="5 5" dot={false} />

                                {/* User Data Lines (Solid/Bold) */}
                                <Line yAxisId="left" type="monotone" dataKey="height" name={t('physical.archives.height')} stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                                <Line yAxisId="right" type="monotone" dataKey="weight" name={t('physical.archives.weight')} stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Manual Input */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                            <Plus size={14} /> {t('physical.archives.add_record')}
                        </p>
                        <div className="flex gap-2 mb-2">
                             <div className="flex-1 relative">
                                <Ruler size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input 
                                    type="number" 
                                    placeholder={t('physical.archives.height')}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newGrowth.height}
                                    onChange={(e) => setNewGrowth({...newGrowth, height: e.target.value})}
                                />
                             </div>
                             <div className="flex-1 relative">
                                <Weight size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input 
                                    type="number" 
                                    placeholder={t('physical.archives.weight')}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newGrowth.weight}
                                    onChange={(e) => setNewGrowth({...newGrowth, weight: e.target.value})}
                                />
                             </div>
                        </div>
                        <button 
                            onClick={handleAddGrowth}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                        >
                            {t('physical.archives.submit')}
                        </button>
                    </div>

                    {/* AI Analysis Block */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <MonitorPlay size={16} />
                            {t('physical.archives.analysis')}
                        </h4>
                        
                        <div className="flex flex-wrap gap-4 mb-3">
                             <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                                 <span className="text-xs text-slate-500 block mb-1">{t('physical.archives.comparison')} ({t('physical.archives.height')})</span>
                                 <div className={`text-sm font-bold flex items-center gap-1 ${
                                     heightDiff > 0 ? 'text-emerald-600' : 'text-slate-600'
                                 }`}>
                                     {heightDiff > 0 ? '+' : ''}{heightDiff.toFixed(1)} cm
                                     <span className="text-[10px] font-normal text-slate-400 uppercase ml-1">
                                         {getHeightStatus()}
                                     </span>
                                 </div>
                             </div>
                             <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                                 <span className="text-xs text-slate-500 block mb-1">{t('physical.archives.comparison')} ({t('physical.archives.weight')})</span>
                                 <div className={`text-sm font-bold flex items-center gap-1 ${
                                     Math.abs(weightDiff) < 3 ? 'text-emerald-600' : 'text-orange-500'
                                 }`}>
                                     {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
                                     <span className="text-[10px] font-normal text-slate-400 uppercase ml-1">
                                         {getWeightStatus()}
                                     </span>
                                 </div>
                             </div>
                        </div>
                        
                        <div className="flex gap-2 items-start">
                             <Info size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                             <p className="text-sm text-slate-700 italic">
                                "{getAIAdvice()}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Sports Exam Records */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                             <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <Trophy size={20} />
                             </div>
                             <h3 className="font-bold text-slate-800">{t('physical.archives.sports_trend')}</h3>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={sportsHistory} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{fontSize: 12}} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Area type="monotone" dataKey="grade" stroke="#f97316" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                     {/* Manual Input */}
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                            <Plus size={14} /> {t('physical.archives.add_record')}
                        </p>
                        <div className="flex gap-2 mb-2">
                             <select className="flex-1 rounded-lg border border-slate-200 text-sm p-2 outline-none">
                                 <option>Jump Rope (1min)</option>
                                 <option>1000m Run</option>
                                 <option>Sit-ups</option>
                             </select>
                             <div className="flex-1 relative">
                                <input 
                                    type="number" 
                                    placeholder={t('physical.archives.score')}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                             </div>
                        </div>
                        <button className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">
                            {t('physical.archives.submit')}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Recent History</h4>
                        {sportsHistory.slice().reverse().map((record, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{record.item}</p>
                                    <p className="text-xs text-slate-500">{record.month}</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-lg font-bold text-indigo-600">{record.score}</p>
                                     <p className="text-[10px] text-slate-400">Score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- EXAM TRAINING MODE --- */}
        {activeTab === 'exam' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
                {/* 1. Main Visual Tracking Arena */}
                <div className="lg:col-span-2 bg-black rounded-2xl relative overflow-hidden shadow-lg border border-slate-800 flex flex-col">
                     {/* Video Feed */}
                     <div className="flex-1 relative">
                        {streamActive ? (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                                {isSimulationMode ? (
                                    <div className="flex flex-col items-center text-center p-6 animate-fade-in">
                                        <div className="bg-blue-500/10 p-4 rounded-full mb-4">
                                            <MonitorPlay size={48} className="text-blue-400"/>
                                        </div>
                                        <span className="text-blue-300 font-bold mb-2 uppercase tracking-wide">AI Simulation Mode</span>
                                        <span className="text-xs text-slate-500 max-w-xs">
                                            {t('physical.simulation_mode')}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <ScanFace size={48} className="mb-2"/>
                                        <span>{t('physical.initializing')}</span>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {/* AR Overlay - Simulated Skeleton */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                             <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Simple Stick Figure Simulation */}
                            <path d="M50% 20% L50% 50% M50% 50% L30% 70% M50% 50% L70% 70% M50% 30% L30% 40% M50% 30% L70% 40%" 
                                  stroke={isSimulationMode ? "#60a5fa" : "#00ff9d"} 
                                  strokeWidth="3" fill="none" filter="url(#glow)"
                                  className={isExercising ? "animate-pulse" : ""}
                            />
                            <circle cx="50%" cy="20%" r="20" stroke={isSimulationMode ? "#60a5fa" : "#00ff9d"} strokeWidth="2" fill="none" />
                        </svg>

                        {/* Top HUD */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white">
                                <span className="text-xs text-slate-400 uppercase tracking-widest">{t('physical.exercise')}</span>
                                <div className="text-xl font-bold flex items-center gap-2">
                                    <Dumbbell size={18} className="text-indigo-400"/>
                                    {exerciseType}
                                </div>
                            </div>
                            
                            <div className={`px-4 py-2 rounded-lg border backdrop-blur-md font-mono ${
                                isExercising ? 'bg-red-500/20 border-red-500 text-red-100 animate-pulse' : 'bg-emerald-500/20 border-emerald-500 text-emerald-100'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${isExercising ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                    <span className="text-sm font-bold">{isExercising ? t('physical.tracking_active') : t('physical.ready_to_start')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Center Counter Overlay */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] tabular-nums">
                                {reps}
                            </div>
                            <div className="text-xl text-indigo-300 font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded">{t('physical.reps')}</div>
                        </div>

                        {/* Bottom Stats Overlay */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                             <div className="bg-black/70 backdrop-blur p-4 rounded-xl border border-white/10 w-48">
                                <p className="text-xs text-slate-400 uppercase mb-1">{t('physical.form_quality')}</p>
                                <div className="w-full bg-slate-700 h-2 rounded-full mb-1">
                                    <div className="bg-emerald-400 h-2 rounded-full" style={{width: '92%'}}></div>
                                </div>
                                <div className="flex justify-between text-xs text-white">
                                    <span>{t('physical.excellent')}</span>
                                    <span>92%</span>
                                </div>
                             </div>

                             <div className="flex gap-2">
                                <button 
                                    onClick={() => { setIsExercising(!isExercising); if (!isExercising) setReps(0); }}
                                    className={`p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center ${
                                        isExercising ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                                >
                                    {isExercising ? <Square fill="white" size={24} className="text-white"/> : <Play fill="white" size={24} className="text-white ml-1"/>}
                                </button>
                                <button 
                                    onClick={() => setReps(0)}
                                    className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full text-white shadow-lg transition-transform hover:scale-105"
                                >
                                    <RefreshCcw size={24} />
                                </button>
                             </div>
                        </div>
                     </div>
                </div>

                {/* 2. Side Panel: Biometrics & Coaching */}
                <div className="flex flex-col gap-6">
                    
                    {/* Watch Sync Card */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Watch size={64} className="text-indigo-900" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <Watch size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{t('physical.watch_sync')}</h3>
                                <p className="text-[10px] text-green-600 flex items-center gap-1 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    {t('physical.connected')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                                <p className="text-xs text-rose-800 uppercase font-bold">{t('physical.heart_rate')}</p>
                                <div className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                                    {Math.round(heartRate)}
                                    <span className="text-xs font-normal text-slate-500">bpm</span>
                                </div>
                            </div>
                             <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-800 uppercase font-bold">{t('physical.spo2')}</p>
                                <div className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                                    98
                                    <span className="text-xs font-normal text-slate-500">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Growth AI Coach */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                    <TrendingUp size={20} className="text-emerald-400" />
                                </div>
                                <h3 className="font-bold">{t('physical.growth_intel')}</h3>
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                                +{STUDENT_GROWTH.growthRateCmPerMonth}cm / month
                            </span>
                        </div>

                        <div className="flex-1 space-y-4">
                            {!coachAdvice ? (
                                <p className="text-slate-400 text-sm animate-pulse">{t('physical.analyzing_growth')}</p>
                            ) : (
                                <>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest mb-1">{t('physical.deepseek_insight')}</p>
                                        <p className="text-sm font-medium leading-relaxed">
                                            "{coachAdvice.preventionWarning}"
                                        </p>
                                    </div>
                                    
                                    <div className="bg-emerald-900/30 p-4 rounded-xl border border-emerald-500/20">
                                        <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-widest mb-1">{t('physical.suggested_drill')}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold">{coachAdvice.customDrill}</span>
                                            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition">
                                                {t('physical.view_demo')}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
             </div>
        )}

        {/* --- HEALTH MONITOR MODE --- */}
        {activeTab === 'health' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* LEFT COLUMN: Visual Analysis */}
            <div className="lg:col-span-2 space-y-6 flex flex-col">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative flex-1 min-h-[400px]">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>{t('physical.live_skeleton')}</span>
                    </div>

                    <div className="w-full h-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
                        {streamActive ? (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center">
                                {isSimulationMode ? (
                                    <div className="flex flex-col items-center text-center p-6 animate-fade-in">
                                        <div className="bg-blue-500/10 p-4 rounded-full mb-4">
                                            <MonitorPlay size={48} className="text-blue-400"/>
                                        </div>
                                        <span className="text-blue-300 font-bold mb-2 uppercase tracking-wide">AI Simulation Mode</span>
                                        <span className="text-xs text-slate-500 max-w-xs">
                                            {t('physical.simulation_mode')}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <ScanFace size={48} className="mb-2"/>
                                        <span>{t('physical.camera_init')}</span>
                                    </>
                                )}
                            </div>
                        )}
                        
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" preserveAspectRatio="none">
                            <rect x="25%" y="20%" width="50%" height="60%" fill="none" stroke={postureStatus === 'Good' ? '#10b981' : '#ef4444'} strokeWidth="2" strokeDasharray="10,5" />
                            <line x1="50%" y1="20%" x2="50%" y2="80%" stroke={postureStatus === 'Good' ? '#10b981' : '#ef4444'} strokeWidth="1" />
                        </svg>

                        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-xl backdrop-blur-md border ${
                            postureStatus === 'Good' 
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' 
                            : 'bg-red-500/20 border-red-500/50 text-red-100'
                        }`}>
                            <span className="font-bold flex items-center gap-2">
                                {postureStatus === 'Good' ? <Activity size={16}/> : <AlertCircle size={16}/>}
                                {t('physical.posture')}: {postureStatus.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vision Health Row */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                     <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Eye size={20}/></div>
                        <h3 className="font-semibold text-slate-700">{t('physical.vision_health')}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t('physical.screen_distance')}</span>
                                <span className="font-medium text-slate-800">{t('physical.optimal_dist')}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t('physical.blink_rate')}</span>
                                <span className="font-medium text-slate-800">12 / min</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{width: '95%'}}></div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Smart Wearable Hub */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <Watch className="mr-2 text-indigo-600" size={20}/>
                        {t('physical.wearable.title')}
                    </h3>
                    <Battery className="text-emerald-500" size={20} />
                </div>

                {/* Device Status */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">{t('physical.wearable.device_name')}</p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                             {isSyncing ? (
                                <>
                                    <RefreshCw size={12} className="animate-spin text-indigo-500" />
                                    {t('physical.wearable.syncing')}
                                </>
                             ) : (
                                <>
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    {t('physical.wearable.synced')}
                                </>
                             )}
                        </p>
                    </div>
                    <Watch size={32} className="text-slate-300" />
                </div>

                {/* Activity Rings */}
                <div className="space-y-4">
                     {dailyGoals.map((goal, idx) => {
                         const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                         return (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 font-medium">
                                        {goal.type === 'Steps' ? t('physical.wearable.steps') : 
                                         goal.type === 'Calories' ? t('physical.wearable.calories') : t('physical.wearable.distance')}
                                    </span>
                                    <span className="font-bold text-slate-800">
                                        {goal.current} <span className="text-xs text-slate-400">/ {goal.target} {goal.unit}</span>
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            goal.type === 'Steps' ? 'bg-blue-500' : 
                                            goal.type === 'Calories' ? 'bg-orange-500' : 'bg-emerald-500'
                                        }`} 
                                        style={{width: `${percent}%`}}
                                    ></div>
                                </div>
                            </div>
                         );
                     })}
                </div>

                {/* Daily Plan Checklist */}
                <div className="flex-1 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                     <p className="text-xs font-bold text-indigo-800 uppercase mb-3 flex items-center gap-1">
                        <TrendingUp size={14}/>
                        {t('physical.wearable.daily_plan')}
                     </p>
                     <div className="space-y-2">
                        {dailyPlan.map(task => (
                            <div key={task.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                {task.status === 'completed' ? (
                                    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <Circle size={18} className="text-slate-300 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                                    <p className="text-xs text-slate-500">{task.target}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Mini Metabolism Chart */}
                <div className="pt-4 border-t border-slate-100">
                     <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('physical.metabolism')}</p>
                     <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_HR_DATA}>
                                <defs>
                                    <linearGradient id="colorBpmMini" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="bpm" stroke="#f43f5e" fillOpacity={1} fill="url(#colorBpmMini)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                </div>

            </div>
            </div>
        )}
    </div>
  );
};