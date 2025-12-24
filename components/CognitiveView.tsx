import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Camera, Upload, CheckCircle, AlertTriangle, XCircle, Search, Layers, RefreshCw, GraduationCap, ChevronDown, BookOpen, Clock, Target, PenTool, CheckSquare, Calendar, TrendingUp, Sparkles, Brain, ListTodo } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { GeminiService } from '../services/geminiService';
import { AcademicAnalysis, KnowledgePoint, Grade, Subject, HomeworkTask, ExamEvent, ExamScore } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { KNOWLEDGE_GRAPH } from '../utils/knowledgeGraphData';

// --- MOCK DATA ---
const INITIAL_TASKS: HomeworkTask[] = [
    { id: '1', subject: 'Math', description: 'Quadratic Equations Ex 5.2', estimatedMin: 45, status: 'pending', priority: 'high' },
    { id: '2', subject: 'Physics', description: 'Force Diagrams', estimatedMin: 30, status: 'pending', priority: 'medium' },
    { id: '3', subject: 'English', description: 'Read Chapter 4', estimatedMin: 20, status: 'completed', priority: 'low' },
];

const UPCOMING_EXAM: ExamEvent = {
    id: 'e1', name: 'Junior High Final', date: '2025-06-20', daysLeft: 45, type: 'Final', predictedScore: 685
};

const EXAM_SCORES: ExamScore[] = [
    { examName: 'Sep Monthly', date: '2024-09', totalScore: 580, rank: 45 },
    { examName: 'Midterm', date: '2024-11', totalScore: 610, rank: 32 },
    { examName: 'Jan Final', date: '2025-01', totalScore: 635, rank: 20 },
    { examName: 'Mar Monthly', date: '2025-03', totalScore: 650, rank: 15 },
];

export const CognitiveView: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'homework' | 'exam' | 'graph'>('homework');
  
  // --- STATE: HOMEWORK ---
  const [tasks, setTasks] = useState<HomeworkTask[]>(INITIAL_TASKS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  // Scanner
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AcademicAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE: GRAPH ---
  const [selectedGrade, setSelectedGrade] = useState<Grade>('Grade 9');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [knowledgeMap, setKnowledgeMap] = useState<Partial<Record<Subject, KnowledgePoint[]>>>(KNOWLEDGE_GRAPH['Grade 9']);
  const [searchQuery, setSearchQuery] = useState('');

  // --- EFFECTS ---
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
        interval = setInterval(() => {
            setTimerSeconds(s => s + 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const rawMap = KNOWLEDGE_GRAPH[selectedGrade] || {};
    if (selectedSubject === 'All') {
      setKnowledgeMap(rawMap);
    } else {
      const filtered: Partial<Record<Subject, KnowledgePoint[]>> = {};
      if (rawMap[selectedSubject]) filtered[selectedSubject] = rawMap[selectedSubject];
      setKnowledgeMap(filtered);
    }
    // Reset search on filter change to avoid confusion, or keep it. Keeping it for now.
  }, [selectedGrade, selectedSubject]);

  // --- HANDLERS ---
  const handleTaskToggle = (id: string) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  };

  const formatTime = (totalSeconds: number) => {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        runAnalysis(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    const result = await GeminiService.analyzeHomeworkImage(base64, language);
    setAnalysis(result);
    // Optimistic map update
    if (result.knowledgeMapping.length > 0) {
      const subject = result.subject;
      const updatedMap = { ...knowledgeMap };
      if (!updatedMap[subject]) updatedMap[subject] = [];
      result.knowledgeMapping.forEach(newItem => {
        const existingSubjectPoints = updatedMap[subject] || [];
        const idx = existingSubjectPoints.findIndex(k => k.subTopic === newItem.subTopic);
        if (idx >= 0) { if (updatedMap[subject]) updatedMap[subject]![idx] = newItem; } 
        else { if (updatedMap[subject]) updatedMap[subject]!.push(newItem); }
      });
      setKnowledgeMap(updatedMap);
    }
    setIsAnalyzing(false);
  };

  // --- FILTER LOGIC ---
  const getDisplayMap = () => {
    if (!searchQuery.trim()) return knowledgeMap;
    const lowerQuery = searchQuery.toLowerCase();
    const filtered: Partial<Record<Subject, KnowledgePoint[]>> = {};
    
    Object.entries(knowledgeMap).forEach(([sub, points]) => {
        if (!points) return;
        const pts = points as KnowledgePoint[];
        const matches = pts.filter(p => 
            p.topic.toLowerCase().includes(lowerQuery) || 
            p.subTopic.toLowerCase().includes(lowerQuery)
        );
        if (matches.length > 0) {
            filtered[sub as Subject] = matches;
        }
    });
    return filtered;
  };

  const displayMap = getDisplayMap();

  // --- RENDER HELPERS ---
  const getHeatmapColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-rose-500';
  };

  const groupPointsByTopic = (points: KnowledgePoint[]) => {
    return points.reduce((acc, point) => {
      if (!acc[point.topic]) acc[point.topic] = [];
      acc[point.topic].push(point);
      return acc;
    }, {} as Record<string, KnowledgePoint[]>);
  };
  
  const availableSubjects = Object.keys(KNOWLEDGE_GRAPH[selectedGrade] || {}) as Subject[];

  return (
    <div className="h-full flex flex-col p-1 gap-4">
      
      {/* 1. TOP NAV SWITCHER */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 w-fit mx-auto flex space-x-2 shadow-sm overflow-x-auto">
          <button 
              onClick={() => setActiveTab('homework')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  activeTab === 'homework' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
              <ListTodo size={16} />
              <span>{t('cognitive.tab_homework')}</span>
          </button>
          <button 
              onClick={() => setActiveTab('exam')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  activeTab === 'exam' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
              <PenTool size={16} />
              <span>{t('cognitive.tab_exam')}</span>
          </button>
          <button 
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  activeTab === 'graph' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
              <Brain size={16} />
              <span>{t('cognitive.tab_graph')}</span>
          </button>
      </div>

      {/* --- TAB 1: HOMEWORK STATION --- */}
      {activeTab === 'homework' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
              {/* Left Col: Tasks & Timer */}
              <div className="flex flex-col gap-6">
                  {/* Timer Card */}
                  <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                       <div className="relative z-10 flex justify-between items-center">
                           <div>
                               <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">{t('cognitive.focus_timer')}</h3>
                               <div className="text-5xl font-mono font-bold tracking-tighter">{formatTime(timerSeconds)}</div>
                           </div>
                           <button 
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                                    isTimerRunning ? 'bg-yellow-500 text-yellow-900' : 'bg-emerald-500 text-white'
                                }`}
                           >
                               {isTimerRunning ? <div className="w-4 h-4 bg-current rounded-sm"/> : <div className="w-0 h-0 border-l-[14px] border-l-current border-y-[8px] border-y-transparent ml-1"/>}
                           </button>
                       </div>
                  </div>

                  {/* Task List */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col p-6 overflow-hidden">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <CheckSquare size={18} className="text-indigo-600" />
                          {t('cognitive.tasks_title')}
                      </h3>
                      <div className="space-y-3 overflow-y-auto pr-2">
                          {tasks.map(task => (
                              <div key={task.id} className={`p-4 rounded-xl border transition-all ${
                                  task.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                              }`}>
                                  <div className="flex items-center gap-3">
                                      <button 
                                        onClick={() => handleTaskToggle(task.id)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-500'
                                        }`}
                                      >
                                          {task.status === 'completed' && <CheckCircle size={14} className="text-white" />}
                                      </button>
                                      <div className="flex-1">
                                          <p className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.description}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                              <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{task.subject}</span>
                                              <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {task.estimatedMin} {t('cognitive.minutes')}</span>
                                              {task.priority === 'high' && <span className="text-[10px] text-rose-500 font-bold flex items-center"><AlertTriangle size={10} className="mr-0.5"/> High</span>}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Right Col: Scanner & Result (Integrated here) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden relative">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Camera size={18} className="text-indigo-600" />
                          {t('cognitive.scanner')}
                      </div>
                      {analysis && (
                          <button onClick={() => {setAnalysis(null); setImagePreview(null);}} className="text-xs text-slate-400 hover:text-indigo-600">Clear</button>
                      )}
                  </h3>

                  {imagePreview ? (
                      <div className="flex-1 flex flex-col overflow-hidden">
                           <div className="h-48 relative flex-shrink-0 mb-4 bg-slate-100 rounded-lg overflow-hidden">
                                <img src={imagePreview} alt="Scan" className="w-full h-full object-contain" />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                        <RefreshCw size={32} className="animate-spin mb-2" />
                                        <p className="text-xs font-mono">{t('cognitive.ocr_processing')}</p>
                                    </div>
                                )}
                           </div>
                           
                           {analysis ? (
                               <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                    <div className={`p-3 rounded-lg border flex items-center justify-between ${
                                        analysis.errorAttribution.type === 'Foundational' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'
                                    }`}>
                                        <span className="text-xs font-bold uppercase">{t('cognitive.ai_diagnostics')}</span>
                                        <span className="text-sm font-bold">{analysis.errorAttribution.type}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {analysis.errorAttribution.explanation}
                                    </p>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('cognitive.impacted_nodes')}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.knowledgeMapping.map((n, i) => (
                                                <span key={i} className={`text-xs px-2 py-1 rounded text-white font-semibold ${getHeatmapColor(n.masteryScore)}`}>
                                                    {n.subTopic} ({n.masteryScore}%)
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                               </div>
                           ) : null}
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-indigo-50/30 transition-colors p-8">
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                              <Camera size={32} className="text-indigo-500" />
                          </div>
                          <h4 className="font-bold text-slate-700">{t('cognitive.scan_title')}</h4>
                          <p className="text-xs text-slate-500 max-w-[200px] mt-2 mb-6">{t('cognitive.scan_desc')}</p>
                          <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">
                              {t('cognitive.upload_btn')}
                          </button>
                      </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
          </div>
      )}

      {/* --- TAB 2: EXAM SIMULATOR --- */}
      {activeTab === 'exam' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
              
              {/* Left: Status & Trends */}
              <div className="flex flex-col gap-6">
                   {/* Countdown Card */}
                   <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                       <div className="flex justify-between items-start mb-6">
                           <div>
                               <div className="flex items-center gap-2 text-indigo-200 mb-1">
                                   <Calendar size={16} />
                                   <span className="text-xs font-bold uppercase tracking-wider">{t('cognitive.countdown')}</span>
                               </div>
                               <h2 className="text-2xl font-bold">{UPCOMING_EXAM.name}</h2>
                           </div>
                           <div className="text-right">
                               <div className="text-4xl font-black">{UPCOMING_EXAM.daysLeft}</div>
                               <div className="text-xs text-indigo-200 uppercase">{t('cognitive.days_left')}</div>
                           </div>
                       </div>
                       <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 flex items-center justify-between">
                           <span className="text-sm font-medium">{t('cognitive.predicted_score')}</span>
                           <span className="text-2xl font-bold text-emerald-300">{UPCOMING_EXAM.predictedScore} <span className="text-sm text-white/60 font-normal">/ 750</span></span>
                       </div>
                   </div>

                   {/* Score Trend Chart */}
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 min-h-[250px]">
                       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <TrendingUp size={18} className="text-indigo-600" />
                           {t('cognitive.score_trend')}
                       </h3>
                       <div className="h-48 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={EXAM_SCORES}>
                                   <defs>
                                       <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                           <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                           <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                       </linearGradient>
                                   </defs>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                   <XAxis dataKey="examName" tick={{fontSize: 10}} stroke="#94a3b8" />
                                   <YAxis domain={[500, 750]} hide />
                                   <Tooltip contentStyle={{borderRadius: '8px', border:'none'}} />
                                   <Area type="monotone" dataKey="totalScore" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                               </AreaChart>
                           </ResponsiveContainer>
                       </div>
                   </div>
              </div>

              {/* Right: AI Weakness Attack */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
                   
                   <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                       <Target size={48} className="text-red-500" />
                   </div>
                   
                   <h2 className="text-2xl font-bold text-slate-800 mb-3">{t('cognitive.generate_quiz')}</h2>
                   <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                       {t('cognitive.quiz_desc')}
                   </p>

                   <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                           <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Target Subject</span>
                           <span className="font-bold text-slate-700">Math & Physics</span>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                           <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Focus Nodes</span>
                           <span className="font-bold text-slate-700 text-red-500">Weakest 5</span>
                       </div>
                   </div>

                   <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3">
                       <Sparkles size={20} className="text-yellow-400" />
                       {t('cognitive.start_quiz')}
                   </button>
              </div>
          </div>
      )}

      {/* --- TAB 3: KNOWLEDGE BRAIN (Existing Heatmap) --- */}
      {activeTab === 'graph' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-full overflow-y-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-full sm:w-auto">
                    <GraduationCap size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{t('cognitive.select_grade')}:</span>
                    <div className="relative flex-grow">
                        <select 
                            value={selectedGrade}
                            onChange={(e) => { setSelectedGrade(e.target.value as Grade); setSelectedSubject('All'); }}
                            className="appearance-none bg-transparent text-indigo-700 font-bold py-1 pl-2 pr-6 rounded-lg text-sm focus:outline-none cursor-pointer w-full"
                        >
                            {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map(g => (
                                <option key={g} value={g}>{t(`cognitive.${g.toLowerCase().replace(' ', '_')}`)}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-full sm:w-auto">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{t('cognitive.select_subject')}:</span>
                    <div className="relative flex-grow">
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value as Subject | 'All')}
                            className="appearance-none bg-transparent text-indigo-700 font-bold py-1 pl-2 pr-6 rounded-lg text-sm focus:outline-none cursor-pointer w-full"
                        >
                            <option value="All">{t('cognitive.all_subjects')}</option>
                            {availableSubjects.map(sub => (
                                // @ts-ignore
                                <option key={sub} value={sub}>{t(`cognitive.subjects.${sub}`)}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-full sm:w-auto flex-grow">
                    <Search size={16} className="text-slate-400" />
                    <input 
                        type="text"
                        placeholder={t('cognitive.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm w-full focus:outline-none text-slate-700 font-medium placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t('cognitive.heatmap_title')}</h2>
                    <p className="text-slate-500 mt-1">{t('cognitive.heatmap_desc')}</p>
                </div>
                <div className="flex gap-4 text-xs font-medium text-slate-600">
                     <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500 rounded-full"></span>{t('cognitive.critical')}</span>
                     <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full"></span>{t('cognitive.review_needed')}</span>
                     <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span>{t('cognitive.mastered')}</span>
                </div>
            </div>

            {Object.keys(displayMap).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <BookOpen size={48} className="mb-2 opacity-50" />
                    <p>{searchQuery ? `No results for "${searchQuery}"` : `No data available`}</p>
                 </div>
            ) : (
                <div className="columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6">
                    {(Object.entries(displayMap) as [string, KnowledgePoint[]][]).map(([subject, points]) => {
                        const pointsByTopic = groupPointsByTopic(points);
                        // @ts-ignore
                        const subjectTranslation = t(`cognitive.subjects.${subject}`) || subject;

                        return (
                        <div key={subject} className="break-inside-avoid border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">{subjectTranslation}</h3>
                                <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                    {points.length} {t('cognitive.nodes')}
                                </span>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {Object.entries(pointsByTopic).map(([topic, topicPoints]) => (
                                    <div key={topic}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <div className="h-px bg-slate-200 flex-grow"></div>{topic}<div className="h-px bg-slate-200 flex-grow"></div>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {topicPoints.map((node, idx) => (
                                                <div 
                                                    key={idx}
                                                    className={`${getHeatmapColor(node.masteryScore)} text-white rounded-lg px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer transition-transform hover:scale-105 hover:z-10 relative group`}
                                                    title={`Score: ${node.masteryScore}%. Last Reviewed: ${node.lastReviewed}`}
                                                >
                                                    {node.subTopic}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )})}
                </div>
            )}
        </div>
      )}
    </div>
  );
};