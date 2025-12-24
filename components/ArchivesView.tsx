import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FolderOpen, TrendingUp, Brain, Heart, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Mock Data for Archives
const ACADEMIC_HISTORY = [
    { month: 'Sep', Math: 85, Physics: 80, English: 90 },
    { month: 'Oct', Math: 88, Physics: 82, English: 89 },
    { month: 'Nov', Math: 92, Physics: 85, English: 88 },
    { month: 'Dec', Math: 90, Physics: 88, English: 92 },
    { month: 'Jan', Math: 95, Physics: 90, English: 94 },
    { month: 'Feb', Math: 93, Physics: 92, English: 95 },
];

const PHYSICAL_GROWTH = [
    { month: 'Sep', height: 164.5, weight: 51.0 },
    { month: 'Oct', height: 165.2, weight: 51.5 },
    { month: 'Nov', height: 166.0, weight: 52.2 },
    { month: 'Dec', height: 167.1, weight: 53.0 },
    { month: 'Jan', height: 167.8, weight: 53.5 },
    { month: 'Feb', height: 168.0, weight: 54.0 },
];

const EMOTIONAL_HISTORY = [
    { month: 'Sep', mood: 70, stress: 40 },
    { month: 'Oct', mood: 65, stress: 55 },
    { month: 'Nov', mood: 80, stress: 30 },
    { month: 'Dec', mood: 75, stress: 45 },
    { month: 'Jan', mood: 85, stress: 25 },
    { month: 'Feb', mood: 80, stress: 35 },
];

export const ArchivesView: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto p-1">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FolderOpen size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{t('archives_view.title')}</h1>
                        <p className="text-slate-300 text-sm mt-1">{t('archives_view.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                
                {/* 1. Academic Trend */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Brain size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">{t('archives_view.academic_trend')}</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ACADEMIC_HISTORY}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis domain={[60, 100]} hide />
                                <Tooltip contentStyle={{borderRadius: '8px', border:'none'}} />
                                <Legend />
                                <Line type="monotone" dataKey="Math" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Physics" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="English" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Physical Growth */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">{t('archives_view.physical_trend')}</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PHYSICAL_GROWTH}>
                                <defs>
                                    <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis yAxisId="left" orientation="left" domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <YAxis yAxisId="right" orientation="right" domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <Tooltip contentStyle={{borderRadius: '8px', border:'none'}} />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="height" stroke="#10b981" fillOpacity={1} fill="url(#colorHeight)" strokeWidth={3} />
                                <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2} dot={{r: 3}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Emotional Balance */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <Heart size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">{t('archives_view.emotional_balance')}</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={EMOTIONAL_HISTORY}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip contentStyle={{borderRadius: '8px', border:'none'}} />
                                <Legend />
                                <Area type="monotone" dataKey="mood" stackId="1" stroke="#f43f5e" fill="url(#colorMood)" />
                                <Area type="monotone" dataKey="stress" stackId="1" stroke="#64748b" fill="#f1f5f9" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};