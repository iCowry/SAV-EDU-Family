import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake, Send, ShieldCheck, User, Sparkles, Zap, BatteryCharging, CloudRain, Sun, BellOff, MessageSquare, BrainCircuit, Heart, Timer, Music, AlertTriangle, Play, Smile, Frown, Meh, AlertCircle, BookOpen, Lightbulb, CheckCircle2, Circle, Plus, Baby, Monitor, Flame, Loader, BarChart3, TrendingDown, Moon, Activity } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { ChatMessage, FlowState, EmotionalWeather, AIButlerTask, MissionContract, ResilienceIntervention, FacialExpression, ParentTask, ParentingScript, ChildSystemContext } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Mock Quantitative Data from other modules
const MOCK_SYSTEM_CONTEXT: ChildSystemContext = {
    recentExamTrend: 'falling',
    homeworkCompletionRate: 85,
    averageSleepDuration: 6.8, // Low sleep
    recentStressLevel: 'high',
    physicalActivityLevel: 'low'
};

export const RelationalView: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'monitor' | 'wisdom'>('monitor');

  // --- STATE ---
  const [flowState, setFlowState] = useState<FlowState>('deep_focus');
  
  // Mental Resilience State
  const [emotion, setEmotion] = useState<EmotionalWeather>({
    hrv: 45, // Low HRV = Stress
    status: 'cloudy',
    detectedExpression: 'Neutral',
    outburstProbability: 65,
    stressIndex: 40
  });

  const [stuckMinutes, setStuckMinutes] = useState(0);
  const [isSimulatingFrustration, setIsSimulatingFrustration] = useState(false);
  const [interventions, setInterventions] = useState<ResilienceIntervention[]>([]);

  // Parent Advice
  const [aiTip, setAiTip] = useState<string>("Analyzing biometric stress levels...");
  
  const [butlerLog, setButlerLog] = useState<AIButlerTask[]>([
    { id: '1', timestamp: '10:05', type: 'correction', description: 'Posture corrected (spinal angle > 15°)', savedParentNagging: true },
    { id: '2', timestamp: '10:45', type: 'reminder', description: 'Hydration prompt issued via ambient light', savedParentNagging: true },
    { id: '3', timestamp: '11:30', type: 'encouragement', description: 'Celebrated finishing Math module', savedParentNagging: false },
  ]);

  const [contract, setContract] = useState<MissionContract>({
    title: 'Weekly Jump Rope Challenge',
    target: 5000,
    current: 3450,
    unit: 'jumps',
    rewardSkin: 'Mecha-Paladin Armor',
    status: 'active'
  });

  // Chat/Buffer State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessingMsg, setIsProcessingMsg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- PARENT WISDOM STATE ---
  const [parentTasks, setParentTasks] = useState<ParentTask[]>([
      { id: '1', title: 'Read "The Whole-Brain Child" Ch.3', status: 'completed', streakDays: 3 },
      { id: '2', title: 'Study 15 mins of French', status: 'active', streakDays: 1 },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // AI Script Generation State
  const [scenarioInput, setScenarioInput] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<ParentingScript | null>(null);

  // --- EFFECTS ---

  // Simulate real-time biometric changes & Get Advice
  useEffect(() => {
    const fetchAdvice = async () => {
      const tip = await GeminiService.generateParentingGuidance(emotion, language);
      setAiTip(tip);
    };
    fetchAdvice();

    let interval: any;
    
    if (isSimulatingFrustration) {
        // Frustration Mode: Ramp up stress and stuck time
        interval = setInterval(() => {
            setStuckMinutes(prev => prev + 1);
            setEmotion(prev => {
                const newHrv = Math.max(15, prev.hrv - 2);
                const newStress = Math.min(95, prev.stressIndex + 5);
                return {
                    ...prev,
                    hrv: newHrv,
                    stressIndex: newStress,
                    detectedExpression: newStress > 70 ? 'Frustrated' : 'Confused',
                    status: newStress > 80 ? 'stormy' : 'cloudy'
                };
            });
        }, 1000); // Fast simulation
    } else {
        // Normal Fluctuation
        interval = setInterval(() => {
            setEmotion(prev => {
                const newHrv = Math.max(20, Math.min(100, prev.hrv + (Math.random() * 10 - 5)));
                const newStress = Math.max(10, Math.min(80, prev.stressIndex + (Math.random() * 6 - 3)));
                return {
                    ...prev,
                    hrv: Math.round(newHrv),
                    stressIndex: Math.round(newStress),
                    status: newStress > 70 ? 'stormy' : newStress > 40 ? 'cloudy' : 'sunny',
                    detectedExpression: newStress > 70 ? 'Frustrated' : newStress < 30 ? 'Happy' : 'Neutral'
                };
            });
        }, 3000);
    }

    return () => clearInterval(interval);
  }, [language, isSimulatingFrustration]); 

  // Watch for Intervention Trigger
  useEffect(() => {
      if (stuckMinutes >= 15 && emotion.stressIndex > 75) {
          // TRIGGER INTERVENTION
          const newIntervention: ResilienceIntervention = {
              id: Date.now().toString(),
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              trigger: t('relational.intervention_trigger_desc'),
              action: 'Played "Alpha Wave" Music',
              script: t('relational.intervention_script_asteroid')
          };
          setInterventions(prev => [newIntervention, ...prev]);
          
          // Reset Simulation
          setIsSimulatingFrustration(false);
          setStuckMinutes(0);
          setEmotion(prev => ({ ...prev, stressIndex: 45, detectedExpression: 'Neutral', hrv: 60, status: 'cloudy' }));
      }
  }, [stuckMinutes, emotion.stressIndex, t]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- HANDLERS ---

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessingMsg(true);

    const mediatedText = await GeminiService.mediateParentCommunication(userMsg.text, language);
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: mediatedText, timestamp: new Date() };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsProcessingMsg(false);
  };

  const handleGenerateScript = async () => {
      if (!scenarioInput.trim()) return;
      setIsGeneratingScript(true);
      const script = await GeminiService.generateParentingScripts(scenarioInput, emotion, MOCK_SYSTEM_CONTEXT, language);
      setGeneratedScript(script);
      setIsGeneratingScript(false);
  };

  const handleAddParentTask = () => {
      if (newTaskInput.trim()) {
          setParentTasks(prev => [...prev, {
              id: Date.now().toString(),
              title: newTaskInput,
              status: 'active',
              streakDays: 0
          }]);
          setNewTaskInput('');
      }
  };

  const toggleParentTask = (id: string) => {
      setParentTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'completed' : 'active' } : t));
  };

  const getExpressionIcon = (exp: FacialExpression) => {
      switch(exp) {
          case 'Happy': return <Smile size={48} className="text-emerald-500" />;
          case 'Frustrated': return <AlertCircle size={48} className="text-red-500" />;
          case 'Confused': return <AlertTriangle size={48} className="text-orange-500" />;
          case 'Focused': return <Zap size={48} className="text-blue-500" />;
          default: return <Meh size={48} className="text-slate-400" />;
      }
  };

  return (
    <div className="h-full flex flex-col p-1 gap-4">

        {/* Tab Switcher */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 w-fit mx-auto flex space-x-2 shadow-sm">
            <button 
                onClick={() => setActiveTab('monitor')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${
                    activeTab === 'monitor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Monitor size={16} />
                <span>{t('relational.tab_monitor')}</span>
            </button>
            <button 
                onClick={() => setActiveTab('wisdom')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${
                    activeTab === 'wisdom' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Lightbulb size={16} />
                <span>{t('relational.tab_wisdom')}</span>
            </button>
        </div>

      {/* --- TAB 1: CHILD MONITOR (EXISTING) --- */}
      {activeTab === 'monitor' && (
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
            {/* 1. Deep Flow Shield */}
            <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-500 relative overflow-hidden ${
                flowState === 'deep_focus' 
                ? 'bg-indigo-900 border-indigo-700 text-white' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
                {flowState === 'deep_focus' && (
                    <div className="absolute top-0 right-0 p-12 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                )}
                
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Zap size={20} className={flowState === 'deep_focus' ? 'text-yellow-400' : 'text-slate-400'} fill={flowState === 'deep_focus' ? "currentColor" : "none"}/>
                            <h2 className="text-lg font-bold tracking-tight">{t('relational.connection_status')}</h2>
                        </div>
                        {flowState === 'deep_focus' ? (
                            <div>
                                <p className="text-2xl font-bold text-white mb-1">{t('relational.deep_flow_active')}</p>
                                <p className="text-indigo-200 text-sm flex items-center gap-2">
                                    <BellOff size={14} />
                                    {t('relational.notifications_muted')}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{t('relational.child_available')}</p>
                                <p className="text-slate-500 text-sm">{t('relational.notifications_enabled')}</p>
                            </div>
                        )}
                    </div>
                    
                    <div 
                        onClick={() => setFlowState(prev => prev === 'deep_focus' ? 'idle' : 'deep_focus')} // Toggle for demo
                        className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-colors ${flowState === 'deep_focus' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${flowState === 'deep_focus' ? 'translate-x-8' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>

            {/* 2. Resilience & Emotion Monitor */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <HeartHandshake className="text-pink-500" size={18} />
                        {t('relational.emotional_weather')}
                    </h3>
                    <button 
                        onClick={() => { setIsSimulatingFrustration(!isSimulatingFrustration); setStuckMinutes(0); }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                            isSimulatingFrustration 
                            ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        {isSimulatingFrustration ? 'Simulating Frustration...' : t('relational.simulate_frustration')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {/* Live Telemetry */}
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="mb-3 transform transition-transform duration-500 hover:scale-110">
                            {getExpressionIcon(emotion.detectedExpression)}
                        </div>
                        <span className="text-lg font-bold text-slate-700 mb-1">{emotion.detectedExpression}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">{t('relational.expression')}</span>
                        
                        <div className="w-full mt-4 space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-500 flex items-center gap-1"><Heart size={12}/> HRV</span>
                                <span className={emotion.hrv < 40 ? 'text-red-500' : 'text-slate-700'}>{emotion.hrv} ms</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-500 flex items-center gap-1"><Timer size={12}/> {t('relational.stuck_time')}</span>
                                <span className={stuckMinutes > 10 ? 'text-orange-500' : 'text-slate-700'}>{stuckMinutes} min</span>
                            </div>
                        </div>
                    </div>

                    {/* Stress Gauge & Parenting Advice */}
                    <div className="flex flex-col gap-4">
                        {/* Gauge */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-slate-400 uppercase">{t('relational.stress_index')}</span>
                                <span className={`text-2xl font-black ${
                                    emotion.stressIndex > 70 ? 'text-red-500' : emotion.stressIndex > 40 ? 'text-orange-500' : 'text-emerald-500'
                                }`}>{emotion.stressIndex}/100</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        emotion.stressIndex > 70 ? 'bg-red-500' : emotion.stressIndex > 40 ? 'bg-orange-500' : 'bg-emerald-500'
                                    }`} 
                                    style={{width: `${emotion.stressIndex}%`}}
                                ></div>
                            </div>
                        </div>

                        {/* Dynamic Parent Advice Card */}
                        <div className={`p-4 rounded-xl border transition-colors ${
                            interventions.length > 0 || emotion.stressIndex > 70 
                            ? 'bg-rose-50 border-rose-100' 
                            : 'bg-emerald-50 border-emerald-100'
                        }`}>
                            <h4 className={`text-xs font-bold uppercase mb-1 flex items-center gap-1 ${
                                interventions.length > 0 || emotion.stressIndex > 70 ? 'text-rose-700' : 'text-emerald-700'
                            }`}>
                                <Sparkles size={12}/> {t('relational.parent_advice_title')}
                            </h4>
                            <p className={`font-bold text-sm mb-1 ${
                                interventions.length > 0 || emotion.stressIndex > 70 ? 'text-rose-900' : 'text-emerald-900'
                            }`}>
                                {interventions.length > 0 || emotion.stressIndex > 70 ? t('relational.parent_advice_high_stress') : t('relational.parent_advice_normal')}
                            </p>
                            <p className="text-xs opacity-80 leading-snug">
                                {interventions.length > 0 || emotion.stressIndex > 70 ? t('relational.parent_advice_high_stress_desc') : t('relational.parent_advice_normal_desc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Intervention Log */}
                {interventions.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-100 animate-fade-in">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                            <BrainCircuit size={12}/> {t('relational.intervention_log')}
                        </h4>
                        <div className="space-y-2">
                            {interventions.map(int => (
                                <div key={int.id} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded text-indigo-600 border border-indigo-100">{int.timestamp}</span>
                                        <span className="text-[10px] text-slate-500">{int.trigger}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Music size={14} className="text-indigo-500" />
                                        <span className="text-xs font-bold text-indigo-900">{int.action}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 italic border-l-2 border-indigo-300 pl-2">
                                        "{int.script}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Mission Contract (Gamification) */}
            <div className="bg-slate-900 text-white rounded-2xl shadow-lg shadow-indigo-500/20 p-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ShieldCheck className="text-emerald-400" />
                            {t('relational.joint_contract')}: {contract.title}
                        </h3>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">{t('relational.active')}</span>
                    </div>

                    <div className="flex items-end justify-between mb-2">
                        <span className="text-4xl font-bold font-mono">{contract.current}</span>
                        <span className="text-slate-400 mb-1">/ {contract.target} {contract.unit}</span>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full transition-all duration-1000" 
                            style={{width: `${(contract.current / contract.target) * 100}%`}}
                        ></div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <BatteryCharging size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-300">{t('relational.unlock_reward')}</p>
                            <p className="font-bold text-sm text-white">{contract.rewardSkin}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
            
            {/* AI Butler Log */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col min-h-[300px]">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    {t('relational.ai_butler_log')}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{t('relational.butler_desc')}</p>

                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {butlerLog.map((task) => (
                        <div key={task.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className={`mt-1 p-1.5 rounded-full ${
                                task.type === 'correction' ? 'bg-amber-100 text-amber-600' :
                                task.type === 'reminder' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                                {task.type === 'correction' ? <ShieldCheck size={12}/> : <BellOff size={12}/>}
                            </div>
                            <div>
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{task.type}</span>
                                    <span className="text-[10px] text-slate-400">{task.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-800 leading-snug mt-1">{task.description}</p>
                                {task.savedParentNagging && (
                                    <span className="inline-block mt-2 text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                                        {t('relational.saved_nag')}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legacy Buffer Chat (Mini Mode) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-[300px] flex flex-col">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <MessageSquare size={16} className="text-slate-400" />
                    <h4 className="font-bold text-sm text-slate-700">{t('relational.buffered_chat')}</h4>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 text-xs">
                    {messages.length === 0 && <p className="text-slate-400 text-center mt-10 italic">{t('relational.buffer_placeholder')}</p>}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-slate-100 ml-4' : 'bg-indigo-50 text-indigo-800 mr-4'}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="relative">
                    <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder={t('relational.type_raw')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isProcessingMsg}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isProcessingMsg}
                        className="absolute right-1 top-1 p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
      </div>
      )}

      {/* --- TAB 2: PARENT WISDOM --- */}
      {activeTab === 'wisdom' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
               
               {/* 1. Smart Scripts (Scenario-based with Quant Context) */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                   <div className="flex items-center gap-2 mb-2">
                       <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                           <MessageSquare size={24} />
                       </div>
                       <h2 className="text-xl font-bold text-slate-800">{t('relational.smart_scripts')}</h2>
                   </div>

                   {/* System Context Visualization (Small Dashboard) */}
                   <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                        <h4 className="text-xs font-bold text-indigo-800 uppercase mb-3 flex items-center gap-1">
                            <BarChart3 size={14} /> {t('relational.context_title')}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <TrendingDown size={16} className="text-red-500 mx-auto mb-1" />
                                <span className="text-[10px] text-slate-400 block uppercase">{t('relational.context_grades')}</span>
                                <span className="text-xs font-bold text-slate-700">{t('relational.trend_falling')}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Moon size={16} className="text-orange-500 mx-auto mb-1" />
                                <span className="text-[10px] text-slate-400 block uppercase">{t('relational.context_sleep')}</span>
                                <span className="text-xs font-bold text-slate-700">6.8h</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Zap size={16} className="text-red-500 mx-auto mb-1" />
                                <span className="text-[10px] text-slate-400 block uppercase">{t('relational.context_stress')}</span>
                                <span className="text-xs font-bold text-slate-700">{t('relational.level_high')}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Activity size={16} className="text-orange-500 mx-auto mb-1" />
                                <span className="text-[10px] text-slate-400 block uppercase">{t('relational.context_activity')}</span>
                                <span className="text-xs font-bold text-slate-700">{t('relational.level_low')}</span>
                            </div>
                        </div>
                   </div>

                   {/* Input Section */}
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <textarea 
                           className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
                           rows={2}
                           placeholder={t('relational.enter_scenario')}
                           value={scenarioInput}
                           onChange={(e) => setScenarioInput(e.target.value)}
                       />
                       <button 
                           onClick={handleGenerateScript}
                           disabled={isGeneratingScript || !scenarioInput.trim()}
                           className="mt-3 w-full bg-violet-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                           {isGeneratingScript ? (
                               <><Loader size={16} className="animate-spin" /> {t('relational.generating')}</>
                           ) : (
                               <><Sparkles size={16} /> {t('relational.generate_btn')}</>
                           )}
                       </button>
                   </div>

                   {/* Dynamic Content based on Generation or Emotion */}
                   <div className={`p-4 rounded-xl border ${
                       generatedScript ? 'bg-violet-50 border-violet-100' :
                       (emotion.stressIndex > 60 || isSimulatingFrustration)
                       ? 'bg-rose-50 border-rose-100'
                       : 'bg-slate-50 border-slate-100'
                   }`}>
                       <div className="flex items-center gap-2 mb-3">
                           {generatedScript ? (
                                <Sparkles className="text-violet-500" size={18} />
                           ) : (emotion.stressIndex > 60 || isSimulatingFrustration ? (
                               <AlertTriangle className="text-rose-500" size={18} />
                           ) : (
                               <Smile className="text-slate-400" size={18} />
                           ))}
                           <span className={`text-xs font-bold uppercase tracking-wide ${
                               generatedScript ? 'text-violet-700' :
                               (emotion.stressIndex > 60 || isSimulatingFrustration) ? 'text-rose-700' : 'text-slate-500'
                           }`}>
                               {generatedScript 
                                    ? "AI Suggested Approach" 
                                    : (emotion.stressIndex > 60 || isSimulatingFrustration 
                                        ? t('relational.script_trigger') 
                                        : "Current State: Calm / Focused")}
                           </span>
                       </div>

                       {generatedScript ? (
                           <div className="space-y-4 animate-fade-in">
                               {/* AI Data Attribution */}
                               <div className="bg-indigo-900/5 p-3 rounded-lg border border-indigo-900/10">
                                   <div className="flex items-center gap-2 mb-1">
                                       <BrainCircuit size={14} className="text-indigo-600" />
                                       <span className="text-[10px] font-bold text-indigo-700 uppercase">{t('relational.ai_analysis_title')}</span>
                                   </div>
                                   <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                                       "{generatedScript.analysis}"
                                   </p>
                               </div>

                               <div className="space-y-3">
                                   <div className="bg-white p-3 rounded-lg border border-violet-100 shadow-sm">
                                       <span className="text-[10px] font-bold text-violet-400 uppercase mb-1 block">Step 1: Validate</span>
                                       <p className="text-slate-800 font-medium text-sm">"{generatedScript.step1}"</p>
                                   </div>
                                   <div className="bg-white p-3 rounded-lg border border-violet-100 shadow-sm">
                                       <span className="text-[10px] font-bold text-violet-400 uppercase mb-1 block">Step 2: Inquire</span>
                                       <p className="text-slate-800 font-medium text-sm">"{generatedScript.step2}"</p>
                                   </div>
                                   <div className="bg-white p-3 rounded-lg border border-violet-100 shadow-sm">
                                       <span className="text-[10px] font-bold text-violet-400 uppercase mb-1 block">Step 3: Act</span>
                                       <p className="text-slate-800 font-medium text-sm">"{generatedScript.step3}"</p>
                                   </div>
                               </div>
                           </div>
                       ) : (
                           (emotion.stressIndex > 60 || isSimulatingFrustration) ? (
                               <div className="space-y-3">
                                   <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-sm">
                                       <span className="text-[10px] font-bold text-rose-400 uppercase mb-1 block">Step 1</span>
                                       <p className="text-slate-800 font-medium text-sm">"{t('relational.script_suggestion_1')}"</p>
                                   </div>
                                   <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-sm">
                                       <span className="text-[10px] font-bold text-rose-400 uppercase mb-1 block">Step 2</span>
                                       <p className="text-slate-800 font-medium text-sm">"{t('relational.script_suggestion_2')}"</p>
                                   </div>
                                   <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-sm">
                                       <span className="text-[10px] font-bold text-rose-400 uppercase mb-1 block">Step 3</span>
                                       <p className="text-slate-800 font-medium text-sm">"{t('relational.script_suggestion_3')}"</p>
                                   </div>
                               </div>
                           ) : (
                               <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                   <p className="text-sm">No intervention needed right now.</p>
                                   <p className="text-xs">Great time to just listen or offer a snack!</p>
                               </div>
                           )
                       )}
                   </div>
               </div>

               <div className="flex flex-col gap-6">
                   {/* 2. Parenting Pitfall Guide (Insights) */}
                   <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-16 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                       <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-4">
                               <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                   <Lightbulb size={20} className="text-yellow-300" />
                               </div>
                               <h3 className="font-bold text-lg">{t('relational.pitfall_guide')}</h3>
                           </div>
                           
                           <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                               <p className="text-indigo-200 text-xs font-bold uppercase mb-2">Insight #24: Learning Style</p>
                               <p className="leading-relaxed font-medium">
                                   "{t('relational.insight_visual_learner')}"
                               </p>
                           </div>
                       </div>
                   </div>

                   {/* 3. Parent Study Room */}
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1">
                       <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                               <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                   <BookOpen size={20} />
                               </div>
                               <h3 className="font-bold text-slate-800">{t('relational.parent_study_room')}</h3>
                           </div>
                           <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg border border-orange-100">
                               <Flame size={14} />
                               <span className="text-xs font-bold">5 {t('relational.days')} {t('relational.co_learning_streak')}</span>
                           </div>
                       </div>

                       <div className="space-y-3 mb-4">
                           {parentTasks.map(task => (
                               <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => toggleParentTask(task.id)}>
                                   {task.status === 'completed' ? (
                                       <CheckCircle2 className="text-emerald-500" size={20} />
                                   ) : (
                                       <Circle className="text-slate-300" size={20} />
                                   )}
                                   <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                       {task.title}
                                   </span>
                               </div>
                           ))}
                       </div>

                       <div className="flex gap-2">
                           <input 
                               type="text" 
                               value={newTaskInput}
                               onChange={(e) => setNewTaskInput(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleAddParentTask()}
                               placeholder={t('relational.add_goal')}
                               className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                           />
                           <button 
                               onClick={handleAddParentTask}
                               className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors"
                           >
                               <Plus size={20} />
                           </button>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                           <p className="text-xs text-slate-400 italic flex items-center justify-center gap-1">
                               <Baby size={12} /> {t('relational.fighting_together')}
                           </p>
                       </div>
                   </div>
               </div>
           </div>
      )}

    </div>
  );
};