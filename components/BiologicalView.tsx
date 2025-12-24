import React, { useState, useEffect } from 'react';
import { Utensils, Flame, Clock, ChefHat, Droplets, Moon, Sun, Battery, Activity, BookOpen, Gamepad2, AlertTriangle, Plus, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GeminiService } from '../services/geminiService';
import { MealPlan, FocusInterval } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const FOCUS_DATA: FocusInterval[] = [
  { hour: '08:00', focusScore: 60 },
  { hour: '10:00', focusScore: 85 },
  { hour: '12:00', focusScore: 50 },
  { hour: '14:00', focusScore: 45 },
  { hour: '16:00', focusScore: 70 },
  { hour: '18:00', focusScore: 80 },
  { hour: '19:00', focusScore: 95, recommendation: 'Math/Physics' },
  { hour: '20:00', focusScore: 90 },
  { hour: '21:00', focusScore: 60 },
  { hour: '22:00', focusScore: 30 },
];

export const BiologicalView: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rhythm' | 'nutrition'>('rhythm');

  // --- TAB 1: RHYTHM & SLEEP STATE ---
  const [simulatedTime, setSimulatedTime] = useState('20:00');
  const [remainingHomeworkMin, setRemainingHomeworkMin] = useState(120);
  const [bedtime, setBedtime] = useState('');
  const [isDelayed, setIsDelayed] = useState(false);
  
  const [activityLog, setActivityLog] = useState({
      study: 360, // mins
      rest: 90,
      sport: 45,
      reading: 30
  });

  // --- TAB 2: NUTRITION STATE ---
  const [studyTime, setStudyTime] = useState(120);
  const [sportType, setSportType] = useState('Swimming');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // --- EFFECTS: Sleep Calculation ---
  useEffect(() => {
      // Simple calc: Simulated Time + Remaining Homework + 30m buffer
      const [hours, mins] = simulatedTime.split(':').map(Number);
      const now = new Date();
      now.setHours(hours, mins, 0);
      
      const finishTime = new Date(now.getTime() + (remainingHomeworkMin + 30) * 60000);
      const finishHours = finishTime.getHours();
      const finishMins = finishTime.getMinutes().toString().padStart(2, '0');
      
      setBedtime(`${finishHours}:${finishMins}`);
      
      // Check for > 22:30 warning
      // Logic: If finish time is between 22:31 and 04:00 (next day)
      const threshold = new Date(now);
      threshold.setHours(22, 30, 0);
      
      // Adjust date if calculation rolls over midnight
      if (finishTime.getDate() !== now.getDate()) {
           setIsDelayed(true);
      } else {
           setIsDelayed(finishTime > threshold);
      }
      
  }, [simulatedTime, remainingHomeworkMin]);


  // --- HANDLERS ---
  const generateMenu = async () => {
    setLoading(true);
    const plan = await GeminiService.generateMetabolicPlan(studyTime, sportType, language);
    setMealPlan(plan);
    setLoading(false);
  };

  const macroData = mealPlan ? [
    { name: 'Protein', value: mealPlan.macros.protein, color: '#3b82f6' },
    { name: 'Carbs', value: mealPlan.macros.carbs, color: '#10b981' },
    { name: 'Fats', value: mealPlan.macros.fats, color: '#f59e0b' },
  ] : [];

  const activityData = [
      { name: t('biological.study'), value: activityLog.study, color: '#6366f1' },
      { name: t('biological.play'), value: activityLog.rest, color: '#f59e0b' },
      { name: t('biological.sport'), value: activityLog.sport, color: '#10b981' },
      { name: t('biological.reading'), value: activityLog.reading, color: '#3b82f6' },
  ];

  return (
    <div className="h-full p-1 flex flex-col gap-4">
        
        {/* Tab Switcher */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 w-fit mx-auto flex space-x-2 shadow-sm">
            <button 
                onClick={() => setActiveTab('rhythm')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${
                    activeTab === 'rhythm' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Clock size={16} />
                <span>{t('biological.tab_rhythm')}</span>
            </button>
            <button 
                onClick={() => setActiveTab('nutrition')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${
                    activeTab === 'nutrition' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Utensils size={16} />
                <span>{t('biological.tab_nutrition')}</span>
            </button>
        </div>

        {/* --- TAB 1: 24H RHYTHM MANAGEMENT --- */}
        {activeTab === 'rhythm' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                 
                 {/* Left: Efficiency Chart & Focus Analysis */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                     <div className="flex items-center gap-2 mb-2">
                         <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                             <Activity size={24} />
                         </div>
                         <h2 className="text-xl font-bold text-slate-800">{t('biological.rhythm_title')}</h2>
                     </div>

                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={FOCUS_DATA}>
                                <defs>
                                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="hour" tick={{fontSize: 10}} stroke="#94a3b8" />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip contentStyle={{borderRadius: '12px', border:'none'}} />
                                <Area type="monotone" dataKey="focusScore" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorFocus)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>

                     <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                         <Sparkles className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
                         <div>
                             <h4 className="font-bold text-indigo-900 text-sm uppercase">{t('biological.peak_focus')}</h4>
                             <p className="text-sm text-indigo-800 leading-snug mt-1">
                                 {t('biological.peak_focus_desc').replace('{time}', '19:00 - 20:00').replace('{subject}', 'Math / Physics')}
                             </p>
                         </div>
                     </div>
                 </div>

                 {/* Right: Sleep Prediction & Life Balance */}
                 <div className="flex flex-col gap-6">
                     
                     {/* Sleep Warning Card */}
                     <div className={`rounded-2xl shadow-sm border p-6 transition-colors ${
                         isDelayed ? 'bg-red-50 border-red-200' : 'bg-slate-900 border-slate-700 text-white'
                     }`}>
                         <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2">
                                 <Moon size={24} className={isDelayed ? 'text-red-500' : 'text-indigo-300'} />
                                 <h2 className={`text-lg font-bold ${isDelayed ? 'text-red-900' : 'text-white'}`}>{t('biological.landing_prediction')}</h2>
                             </div>
                             {isDelayed && <AlertTriangle className="text-red-600 animate-pulse" size={24} />}
                         </div>

                         <div className="grid grid-cols-2 gap-4 mb-4">
                             <div>
                                 <label className={`text-xs font-bold uppercase block mb-1 ${isDelayed ? 'text-red-700' : 'text-slate-400'}`}>{t('biological.current_time')}</label>
                                 <div className={`text-xl font-mono font-bold ${isDelayed ? 'text-red-900' : 'text-white'}`}>
                                     {simulatedTime}
                                 </div>
                             </div>
                             <div>
                                 <label className={`text-xs font-bold uppercase block mb-1 ${isDelayed ? 'text-red-700' : 'text-slate-400'}`}>{t('biological.remaining_work')}</label>
                                 <input 
                                    type="number" 
                                    value={remainingHomeworkMin}
                                    onChange={(e) => setRemainingHomeworkMin(parseInt(e.target.value) || 0)}
                                    className={`w-full bg-transparent border-b font-mono font-bold text-xl outline-none ${
                                        isDelayed ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-slate-600 text-white focus:border-indigo-400'
                                    }`}
                                 />
                             </div>
                         </div>

                         <div className="flex items-center justify-between border-t border-dashed pt-4 mb-2 opacity-80" style={{borderColor: isDelayed ? '#fecaca' : '#334155'}}>
                             <span className="text-sm font-medium">{t('biological.predicted_bedtime')}</span>
                             <span className="text-3xl font-bold font-mono">{bedtime}</span>
                         </div>
                         
                         {isDelayed && (
                             <div className="bg-white/80 p-3 rounded-lg border border-red-200 mt-2">
                                 <p className="text-xs font-bold text-red-600 uppercase mb-1">{t('biological.warning_delayed')}</p>
                                 <p className="text-xs text-red-800">{t('biological.suggestion_trim')}</p>
                             </div>
                         )}
                     </div>

                     {/* Life Balance Logger */}
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                             <Sun size={20} className="text-orange-500" />
                             {t('biological.balance_title')}
                         </h3>
                         
                         <div className="flex gap-4 items-center">
                             <div className="w-32 h-32 relative flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={activityData}
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {activityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                             
                             <div className="flex-1 grid grid-cols-2 gap-3">
                                 <div className="flex flex-col">
                                     <span className="text-[10px] text-slate-400 uppercase font-bold">{t('biological.study')}</span>
                                     <span className="text-lg font-bold text-indigo-500">{activityLog.study}m</span>
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-[10px] text-slate-400 uppercase font-bold">{t('biological.play')}</span>
                                     <div className="flex items-center gap-2">
                                         <button onClick={() => setActivityLog(p => ({...p, rest: Math.max(0, p.rest - 15)}))} className="text-slate-300 hover:text-slate-500">-</button>
                                         <span className="text-lg font-bold text-orange-500">{activityLog.rest}m</span>
                                         <button onClick={() => setActivityLog(p => ({...p, rest: p.rest + 15}))} className="text-slate-300 hover:text-slate-500">+</button>
                                     </div>
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-[10px] text-slate-400 uppercase font-bold">{t('biological.sport')}</span>
                                     <div className="flex items-center gap-2">
                                         <button onClick={() => setActivityLog(p => ({...p, sport: Math.max(0, p.sport - 15)}))} className="text-slate-300 hover:text-slate-500">-</button>
                                         <span className="text-lg font-bold text-emerald-500">{activityLog.sport}m</span>
                                         <button onClick={() => setActivityLog(p => ({...p, sport: p.sport + 15}))} className="text-slate-300 hover:text-slate-500">+</button>
                                     </div>
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-[10px] text-slate-400 uppercase font-bold">{t('biological.reading')}</span>
                                     <div className="flex items-center gap-2">
                                         <button onClick={() => setActivityLog(p => ({...p, reading: Math.max(0, p.reading - 15)}))} className="text-slate-300 hover:text-slate-500">-</button>
                                         <span className="text-lg font-bold text-blue-500">{activityLog.reading}m</span>
                                         <button onClick={() => setActivityLog(p => ({...p, reading: p.reading + 15}))} className="text-slate-300 hover:text-slate-500">+</button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        )}

        {/* --- TAB 2: NUTRITION (EXISTING) --- */}
        {activeTab === 'nutrition' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto">
                {/* Input Panel */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <Flame className="text-orange-500" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{t('biological.energy_input')}</h2>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center justify-between">
                                <span>{t('biological.study_duration')}</span>
                                <span className="text-indigo-600 font-bold">{studyTime} min</span>
                            </label>
                            <input 
                                type="range" 
                                min="30" 
                                max="300" 
                                step="30" 
                                value={studyTime}
                                onChange={(e) => setStudyTime(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">{t('biological.physical_activity')}</label>
                            <select 
                                value={sportType}
                                onChange={(e) => setSportType(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option>Swimming</option>
                                <option>Running (1000m)</option>
                                <option>Basketball</option>
                                <option>Sitting/Rest</option>
                                <option>Strength Training</option>
                            </select>
                        </div>
                    </div>

                    <button
                    onClick={generateMenu}
                    disabled={loading}
                    className="mt-6 w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                    {loading ? <span>{t('biological.analyzing')}</span> : (
                        <>
                            <Utensils size={18} />
                            <span>{t('biological.analyze_btn')}</span>
                        </>
                    )}
                    </button>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    {!mealPlan ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                            <ChefHat size={64} strokeWidth={1} className="mb-4"/>
                            <p>{t('biological.configure_prompt')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full animate-fade-in">
                            
                            {/* Visuals */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="h-48 w-48 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={macroData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {macroData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-slate-800">{mealPlan.calories}</span>
                                        <span className="text-xs text-slate-500">kcal</span>
                                    </div>
                                </div>
                                <div className="flex space-x-6 mt-6">
                                    {macroData.map((m) => (
                                        <div key={m.name} className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: m.color}}></div>
                                            <div className="text-sm">
                                                <p className="text-slate-500">{m.name}</p>
                                                <p className="font-bold text-slate-800">{m.value}g</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendation Text */}
                            <div className="flex flex-col justify-center space-y-6">
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                                    <h3 className="text-orange-800 font-bold mb-3 flex items-center">
                                        <ChefHat className="mr-2" size={20}/>
                                        {t('biological.ai_suggestion')}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-lg">
                                        {mealPlan.recommendation}
                                    </p>
                                </div>

                                <div className="flex space-x-4">
                                    <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center space-x-3">
                                        <Droplets className="text-blue-500" />
                                        <div>
                                            <p className="text-xs text-blue-800 font-semibold uppercase">{t('biological.hydration')}</p>
                                            <p className="text-blue-900 font-bold">{t('biological.water_amount')}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center space-x-3">
                                        <Clock className="text-emerald-500" />
                                        <div>
                                            <p className="text-xs text-emerald-800 font-semibold uppercase">{t('biological.timing')}</p>
                                            <p className="text-emerald-900 font-bold">{t('biological.within_30m')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};