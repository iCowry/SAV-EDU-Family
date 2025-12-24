import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Users, Briefcase, GraduationCap, Cpu, Layers, AlertTriangle, 
    ShoppingCart, CheckSquare, Image as ImageIcon, Box, Activity,
    Timer, Sparkles, Printer, Zap, Plus
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

type ManagerRole = 'PARENT' | 'MANAGER' | 'MENTOR';

// Mock Data
const SKILL_DATA = [
    { subject: 'Mechanics', A: 120, fullMark: 150 },
    { subject: 'Programming', A: 98, fullMark: 150 },
    { subject: 'Design', A: 86, fullMark: 150 },
    { subject: 'Teamwork', A: 99, fullMark: 150 },
    { subject: 'Math', A: 85, fullMark: 150 },
];

const INVENTORY = [
    { id: 1, name: 'V5 Brain', count: 2, status: 'ok' },
    { id: 2, name: 'V5 Motors', count: 12, status: 'ok' },
    { id: 3, name: 'Optical Sensor', count: 0, status: 'critical' },
    { id: 4, name: 'Aluminum C-Channel', count: 20, status: 'low' },
];

const PROCUREMENT_LIST = [
    { id: 1, item: 'High Strength Gears', price: '$45.00', priority: 'High' },
    { id: 2, item: 'Omni Wheels 3.25"', price: '$60.00', priority: 'Medium' },
];

const TASKS = [
    { id: 1, en: 'Finish Python PID Loop', zh: '完成 Python PID 闭环控制', done: true },
    { id: 2, en: 'Design Intake Mechanism', zh: '设计吸入装置结构', done: false },
    { id: 3, en: 'Record Engineering Notebook', zh: '记录工程笔记', done: false },
];

const PORTFOLIO = [
    { 
        id: 1, 
        title: 'Gearbox V2', 
        desc: 'Optimized torque output with 3:7 ratio.', 
        tags: ['Physics', 'Mechanics'],
        imgColor: 'bg-cyan-900'
    },
    { 
        id: 2, 
        title: 'Auto-Aim Algorithm', 
        desc: 'Implemented using vision sensor and odometry.', 
        tags: ['Code', 'Math'],
        imgColor: 'bg-purple-900'
    }
];

export const EduManagerView: React.FC = () => {
    const { t } = useLanguage();
    const [currentRole, setCurrentRole] = useState<ManagerRole>('PARENT');
    const [taskList, setTaskList] = useState(TASKS);

    const toggleTask = (id: number) => {
        setTaskList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                 }}>
            </div>

            {/* Header / Role Switcher */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Box className="text-cyan-400" />
                    <h1 className="text-xl font-bold tracking-wider text-cyan-100 uppercase">{t('nav.edu_manager')}</h1>
                </div>

                <div className="flex bg-slate-800 rounded-lg p-1">
                    <button 
                        onClick={() => setCurrentRole('PARENT')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                            currentRole === 'PARENT' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Briefcase size={16} />
                        {t('edu_manager.role_parent')}
                    </button>
                    <button 
                        onClick={() => setCurrentRole('MANAGER')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                            currentRole === 'MANAGER' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Cpu size={16} />
                        {t('edu_manager.role_manager')}
                    </button>
                    <button 
                        onClick={() => setCurrentRole('MENTOR')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                            currentRole === 'MENTOR' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <GraduationCap size={16} />
                        {t('edu_manager.role_mentor')}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 z-10">
                
                {/* --- VIEW: PARENT / CEO --- */}
                {currentRole === 'PARENT' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* KPI Card */}
                        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-20 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h2 className="text-lg font-bold text-indigo-300 mb-6 flex items-center gap-2">
                                <Activity size={20} /> {t('edu_manager.kpi_title')}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                                            <PolarGrid stroke="#334155" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                            <Radar name="Skills" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#818cf8" fillOpacity={0.3} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-col justify-center gap-4">
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <p className="text-slate-400 text-xs uppercase font-bold">{t('edu_manager.engineering_hours')}</p>
                                        <p className="text-3xl font-mono font-bold text-white">12.5 <span className="text-sm text-slate-500">hrs</span></p>
                                        <div className="w-full bg-slate-700 h-1.5 mt-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full w-[65%]"></div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <p className="text-slate-400 text-xs uppercase font-bold">Project Velocity</p>
                                        <p className="text-3xl font-mono font-bold text-emerald-400">+15%</p>
                                        <p className="text-xs text-slate-500 mt-1">Vs Last Week</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side Column */}
                        <div className="flex flex-col gap-6">
                            {/* AI Summary */}
                            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-6 shadow-lg shadow-indigo-900/20">
                                <h3 className="text-indigo-300 font-bold mb-3 flex items-center gap-2">
                                    <Sparkles size={18} /> {t('edu_manager.ai_summary_title')}
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    "Significant progress in structural stability. Logic mapping for autonomous period shows 90% completion. Recommended focus: Intake mechanism reliability."
                                </p>
                            </div>

                            {/* Competitions */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                                    <Timer size={18} className="text-cyan-400" /> {t('edu_manager.competitions')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border-l-2 border-cyan-500">
                                        <div>
                                            <p className="font-bold text-sm">VEX Worlds</p>
                                            <p className="text-xs text-slate-400">Dallas, TX</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-mono font-bold text-white">45</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Days</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border-l-2 border-slate-600 opacity-60">
                                        <div>
                                            <p className="font-bold text-sm">NOC Nationals</p>
                                            <p className="text-xs text-slate-400">Beijing</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-mono font-bold text-white">120</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: LAB MANAGER --- */}
                {currentRole === 'MANAGER' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        
                        {/* 3D Printer Status */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                            <h2 className="text-lg font-bold text-cyan-300 mb-6 flex items-center gap-2">
                                <Printer size={20} /> {t('edu_manager.printer_status')}
                            </h2>
                            
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                     <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
                                        <circle cx="64" cy="64" r="56" stroke="#06b6d4" strokeWidth="8" fill="none" strokeDasharray="351.8" strokeDashoffset="77" strokeLinecap="round" />
                                     </svg>
                                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                                         <span className="text-3xl font-mono font-bold text-white">78%</span>
                                         <span className="text-[10px] text-cyan-500 uppercase">Printing</span>
                                     </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-white">Bambu Lab X1C</p>
                                    <p className="text-xs text-slate-400 mb-4">File: Intake_Mount_v4.gcode</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">{t('edu_manager.filament')} (PLA-CF)</span>
                                            <span className="text-red-400 font-bold flex items-center gap-1">
                                                <AlertTriangle size={10} /> 15%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-red-500 h-full w-[15%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400">
                                > Hotend: 220°C [OK]<br/>
                                > Bed: 55°C [OK]<br/>
                                > Chamber: 35°C
                            </div>
                        </div>

                        {/* Inventory & Procurement */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1">
                                <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                                    <Layers size={18} className="text-emerald-400" /> {t('edu_manager.inventory')}
                                </h3>
                                <div className="space-y-2">
                                    {INVENTORY.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-slate-800/30 p-2 rounded border border-slate-800">
                                            <span className="text-sm text-slate-300">{item.name}</span>
                                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                                item.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                item.status === 'low' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1">
                                <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                                    <ShoppingCart size={18} className="text-yellow-400" /> {t('edu_manager.procurement')}
                                </h3>
                                <div className="space-y-2">
                                    {PROCUREMENT_LIST.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-2 border-b border-slate-800 last:border-0">
                                            <div>
                                                <p className="text-sm text-slate-300">{item.item}</p>
                                                <p className="text-[10px] text-slate-500">{item.priority}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono text-yellow-500">{item.price}</p>
                                                <button className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-white transition-colors">Approve</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: MENTOR / AU PAIR --- */}
                {currentRole === 'MENTOR' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        
                        {/* Task List (Checklist) */}
                        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-fit">
                            <h2 className="text-lg font-bold text-emerald-300 mb-6 flex items-center gap-2">
                                <CheckSquare size={20} /> {t('edu_manager.tasks')}
                            </h2>
                            <div className="space-y-3">
                                {taskList.map(task => (
                                    <div 
                                        key={task.id} 
                                        onClick={() => toggleTask(task.id)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                            task.done 
                                            ? 'bg-emerald-900/10 border-emerald-900/30 opacity-60' 
                                            : 'bg-slate-800/40 border-slate-700 hover:border-emerald-500/50'
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                                task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
                                            }`}>
                                                {task.done && <CheckSquare size={12} className="text-white" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                    {task.en}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">{task.zh}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio Feed */}
                        <div className="lg:col-span-2 space-y-4">
                             <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2 mb-2">
                                <ImageIcon size={20} /> {t('edu_manager.portfolio')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {PORTFOLIO.map(item => (
                                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-purple-500/50 transition-colors">
                                        <div className={`h-40 w-full ${item.imgColor} flex items-center justify-center relative`}>
                                            <Zap size={48} className="text-white/20" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                                            <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
                                            <div className="flex gap-2">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Add New Placeholder */}
                                <div className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[200px] text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all cursor-pointer">
                                    <Plus size={32} />
                                    <span className="text-sm mt-2">Add New Entry</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};