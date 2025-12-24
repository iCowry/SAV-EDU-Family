import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  BrainCircuit, 
  Activity, 
  Utensils, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Target, 
  Flame, 
  Eye, 
  User, 
  ChevronRight,
  ShieldCheck,
  ThermometerSun,
  Lightbulb,
  Zap,
  Smile,
  CloudRain,
  Wind
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  
  // State for Emotion & Rhythm
  const [moodLevel, setMoodLevel] = useState(75); // 0-100
  const [landingTime, setLandingTime] = useState('20:45');
  const [landingMinutes, setLandingMinutes] = useState(45);

  // Mock Data for specific UI request
  const knowledgePoints = [
    { name: 'Quadratic Equations', subject: 'Math', difficulty: 'Hard' },
    { name: 'Newton\'s 3rd Law', subject: 'Physics', difficulty: 'Medium' },
    { name: 'Past Participle', subject: 'English', difficulty: 'Medium' }
  ];

  const sportsScores = [
    { name: 'Jump Rope', score: '100/100', status: t('dashboard.full_score'), color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: '1000m Run', score: '62/100', status: t('dashboard.passing'), color: 'text-yellow-500', bg: 'bg-yellow-500' },
  ];

  // Helper for mood
  const getMoodConfig = (level: number) => {
      if (level > 70) return { icon: Smile, color: 'text-emerald-500', label: t('dashboard.mood_calm'), bg: 'bg-emerald-50' };
      if (level > 40) return { icon: Wind, color: 'text-orange-500', label: t('dashboard.mood_excited'), bg: 'bg-orange-50' };
      return { icon: CloudRain, color: 'text-rose-500', label: t('dashboard.mood_anxious'), bg: 'bg-rose-50' };
  };
  const mood = getMoodConfig(moodLevel);

  return (
    <div className="h-full overflow-y-auto p-1 space-y-6">
      
      {/* 1. TOP CARD: Mission Status (Header) */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                 <Rocket size={24} className="text-indigo-300" />
              </div>
              <div>
                 <h2 className="text-xs font-bold tracking-widest text-indigo-300 uppercase mb-1">{t('dashboard.mission_status')}</h2>
                 <h1 className="text-lg md:text-xl font-bold leading-tight">{t('dashboard.commander_voyaging')} <span className="text-indigo-400">{t('dashboard.math_universe')}</span>.</h1>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
               <div className="text-right">
                   <p className="text-xs text-slate-400 uppercase">{t('dashboard.focus_level')}</p>
                   <p className="font-bold text-emerald-400">{t('dashboard.deep_flow')}</p>
               </div>
               <div className="w-px h-8 bg-slate-700"></div>
               <div className="text-right">
                   <p className="text-xs text-slate-400 uppercase">{t('dashboard.shielding')}</p>
                   <p className="font-bold text-blue-400">{t('dashboard.active')}</p>
               </div>
           </div>
        </div>
      </div>

      {/* 2. EMOTION & RHYTHM CENTER (New Feature) */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-indigo-50 rounded-3xl p-1 shadow-sm border border-slate-200">
          <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-6">
              <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                      <ThermometerSun size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">{t('dashboard.er_center')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* A. Mood Thermometer */}
                  <div className={`p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center ${mood.bg}`}>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-3">{t('dashboard.mood_thermometer')}</p>
                      <div className="relative mb-2">
                          <mood.icon size={40} className={mood.color} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <span className={`text-xl font-black ${mood.color}`}>{mood.label}</span>
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${mood.color.replace('text', 'bg')}`} style={{width: `${moodLevel}%`}}></div>
                      </div>
                  </div>

                  {/* B. Estimated Landing Time */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white flex flex-col items-center justify-center text-center shadow-sm">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">{t('dashboard.est_landing')}</p>
                      <div className="flex items-center gap-2 text-indigo-900 mb-1">
                          <Clock size={28} className="text-indigo-600" />
                          <span className="text-4xl font-black tracking-tighter">{landingTime}</span>
                      </div>
                      <p className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-1 rounded-full">
                          {t('dashboard.landing_in')} {landingMinutes} {t('dashboard.minutes')}
                      </p>
                  </div>

                  {/* C. Today's Tip (DeepSeek) */}
                  <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 flex flex-col justify-between">
                      <div>
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-indigo-800 uppercase flex items-center gap-1">
                                  <Lightbulb size={12} /> {t('dashboard.tip_of_day')}
                              </span>
                              <span className="text-[10px] bg-white text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">DeepSeek</span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                              "{t('dashboard.tip_content')}"
                          </p>
                      </div>
                      <button className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                          {t('dashboard.view_insight')} <ChevronRight size={12} />
                      </button>
                  </div>

              </div>
          </div>
      </div>

      {/* 3. MIDDLE MATRIX: 4-Grid Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Cognitive Hub */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BrainCircuit size={20}/></div>
                      <h3 className="font-bold text-slate-800">{t('dashboard.cognitive_hub')}</h3>
                  </div>
                  <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{t('dashboard.weekly_wins')}</span>
              </div>
              
              <div className="space-y-3">
                 <p className="text-sm text-slate-500 mb-2">{t('dashboard.conquered_nodes')} <span className="font-bold text-slate-800">3 {t('dashboard.hard_nodes')}</span> {t('dashboard.this_week')}:</p>
                 {knowledgePoints.map((kp, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                           <CheckCircle size={16} className="text-emerald-500" />
                           <span className="text-sm font-semibold text-slate-700">{kp.name}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{kp.subject}</span>
                     </div>
                 ))}
              </div>
          </div>

          {/* Card 2: Vital Signs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Activity size={20}/></div>
                      <h3 className="font-bold text-slate-800">{t('dashboard.vital_signs')}</h3>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{t('dashboard.live_telemetry')}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-sm text-slate-500 flex items-center gap-1"><User size={14}/> {t('dashboard.spine')}</span>
                         <span className="font-bold text-emerald-600">98/100</span>
                      </div>
                       <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '98%'}}></div>
                        </div>

                      <div className="flex items-center justify-between pt-2">
                         <span className="text-sm text-slate-500 flex items-center gap-1"><Eye size={14}/> {t('dashboard.vision')}</span>
                         <span className="font-bold text-blue-600">92/100</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '92%'}}></div>
                        </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center justify-center border border-orange-100">
                      <Flame className="text-orange-500 mb-1" size={24} />
                      <span className="text-2xl font-bold text-slate-800">450</span>
                      <span className="text-xs text-orange-600 uppercase font-semibold">{t('dashboard.kcal_burned')}</span>
                  </div>
              </div>
          </div>

          {/* Card 3: Sports Exam */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Trophy size={20}/></div>
                      <h3 className="font-bold text-slate-800">{t('dashboard.sports_exam')}</h3>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{t('dashboard.entrance_test')}</span>
              </div>

              <div className="space-y-4">
                  {sportsScores.map((sport, i) => (
                      <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-8 rounded-full ${sport.bg}`}></div>
                              <div>
                                  <p className="text-sm font-bold text-slate-800">{sport.name}</p>
                                  <p className={`text-xs font-semibold ${sport.color}`}>{sport.status}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="text-lg font-mono font-bold text-slate-700">{sport.score}</span>
                          </div>
                      </div>
                  ))}
                  <div className="pt-2">
                       <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-lg border border-slate-200 transition-colors">
                           {t('dashboard.view_motion')}
                       </button>
                  </div>
              </div>
          </div>

          {/* Card 4: Dinner Suggestion */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Utensils size={20}/></div>
                      <h3 className="font-bold text-slate-800">{t('dashboard.dinner_ai')}</h3>
                  </div>
                  <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded">{t('dashboard.post_recovery')}</span>
              </div>

              <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-800">Steamed Sea Bass</p>
                          <p className="text-xs text-slate-500 mt-1">High protein for brain recovery after math session.</p>
                      </div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-800">Broccoli</p>
                          <p className="text-xs text-slate-500 mt-1">Vitamin C & K boost.</p>
                      </div>
                  </div>
                  {/* Simple Pie visualization for Macros */}
                  <div className="w-24 flex flex-col items-center justify-center">
                      <div className="relative w-20 h-20">
                         <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-orange-400 rounded-full border-t-transparent border-l-transparent transform -rotate-45"></div>
                         <div className="absolute inset-0 flex items-center justify-center flex-col">
                             <span className="text-xs font-bold text-slate-800">{t('dashboard.optimal')}</span>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 4. BOTTOM BAR: Collaboration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1 pr-4 pl-4 flex items-center justify-between shadow-sm sticky bottom-0">
          <div className="flex items-center gap-4 py-3">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                   <ShieldCheck size={24} />
               </div>
               <div>
                   <h3 className="font-bold text-slate-800 text-sm md:text-base">{t('dashboard.contract_pending')}</h3>
                   <p className="text-xs text-slate-500">{t('dashboard.target')}: <span className="font-semibold text-indigo-600">Finish English Vocabulary Module</span> • {t('dashboard.reward')}: <span className="font-semibold text-orange-500">Unlock 30min Gaming</span></p>
               </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2">
              {t('dashboard.sign_contract')} <ChevronRight size={16} />
          </button>
      </div>
    </div>
  );
};
