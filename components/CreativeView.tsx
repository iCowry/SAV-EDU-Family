import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Music, Palette, Mic, Play, Pause, Upload, Sparkles, 
    Zap, Headphones, Clock, RefreshCw, Maximize2, 
    Code, MessageSquare, Video, Mic2, Grid, Brain, Layout, Image as ImageIcon, CheckCircle2,
    Volume2, AlertCircle, StopCircle, BarChart3, X, Terminal, Cpu, Bug, Lightbulb
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { QualityEduAnalysis, QualityEducationCategory, ArtAnalysis, MusicReport, BoardAnalysis, CodeDebugHint } from '../types';

export const CreativeView: React.FC = () => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<QualityEducationCategory>('Music');

    // --- SHARED STATE ---
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionTimer, setSessionTimer] = useState(0);
    const [aiFeedback, setAiFeedback] = useState<QualityEduAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // --- ART MODULE STATE ---
    const [artImage, setArtImage] = useState<string | null>(null);
    const [artAnalysis, setArtAnalysis] = useState<ArtAnalysis | null>(null);
    const artInputRef = useRef<HTMLInputElement>(null);

    // --- MUSIC MODULE STATE ---
    const [rhythmStatus, setRhythmStatus] = useState<'perfect' | 'rush' | 'drag'>('perfect');
    const [rhythmOffset, setRhythmOffset] = useState(0); // -50 to 50
    const [stumbleCount, setStumbleCount] = useState(0);
    const [isPausedForCoach, setIsPausedForCoach] = useState(false);
    const [coachMessage, setCoachMessage] = useState<string>('');
    const [musicReport, setMusicReport] = useState<MusicReport | null>(null);

    // --- LOGIC MODULE STATE ---
    const [logicMode, setLogicMode] = useState<'board' | 'code'>('board');
    // Board State
    const [goBoard, setGoBoard] = useState<number[][]>([]); // 19x19 grid
    const [boardAnalysis, setBoardAnalysis] = useState<BoardAnalysis | null>(null);
    // Code State
    const [codeSnippet, setCodeSnippet] = useState(`def whack_mole():\n    mole_pos = random.randint(1, 9)\n    if hit_pos == mole_pos\n        print("Score!")`); // Intentional syntax error
    const [consoleOutput, setConsoleOutput] = useState<string>('');
    const [debugHint, setDebugHint] = useState<CodeDebugHint | null>(null);

    // --- MOCK VISUALIZERS ---
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(10));
    
    // --- EFFECTS ---
    useEffect(() => {
        let interval: any;
        if (isSessionActive && !isPausedForCoach) {
            interval = setInterval(() => {
                setSessionTimer(s => s + 1);
                
                if (activeTab === 'Music') {
                    // Simulate Rhythm Fluctuation
                    const newOffset = Math.max(-50, Math.min(50, rhythmOffset + (Math.random() * 20 - 10)));
                    setRhythmOffset(newOffset);
                    if (newOffset > 20) setRhythmStatus('rush');
                    else if (newOffset < -20) setRhythmStatus('drag');
                    else setRhythmStatus('perfect');

                    // Simulate Audio Levels
                    setAudioLevels(prev => prev.map(() => Math.floor(Math.random() * 60) + 20));

                    // SIMULATE STUMBLE (Every 15 seconds roughly)
                    if (sessionTimer > 0 && sessionTimer % 15 === 0 && Math.random() > 0.3) {
                        handleStumble();
                    }
                } else {
                    // Generic Visualizer for other tabs
                    setAudioLevels(prev => prev.map(() => Math.floor(Math.random() * 60) + 20));
                    // Trigger periodic AI analysis (Simulated for Live Mode)
                    if (sessionTimer > 0 && sessionTimer % 10 === 0 && activeTab !== 'Art' && activeTab !== 'Logic') {
                        triggerAnalysis();
                    }
                }
            }, 1000);
        } else {
            setAudioLevels(new Array(20).fill(10));
        }
        return () => clearInterval(interval);
    }, [isSessionActive, sessionTimer, activeTab, isPausedForCoach, rhythmOffset]);

    // Initialize Go Board
    useEffect(() => {
        if (activeTab === 'Logic' && logicMode === 'board') {
            const size = 19;
            const newBoard = Array(size).fill(0).map(() => Array(size).fill(0));
            // Simulate some stones
            for(let i=0; i<30; i++) {
                newBoard[Math.floor(Math.random()*size)][Math.floor(Math.random()*size)] = 1; // Black
                newBoard[Math.floor(Math.random()*size)][Math.floor(Math.random()*size)] = 2; // White
            }
            setGoBoard(newBoard);
        }
    }, [activeTab, logicMode]);

    const handleStumble = async () => {
        setIsPausedForCoach(true);
        setStumbleCount(prev => prev + 1);
        setCoachMessage("Analyzing stumble pattern...");
        
        // Call Gemini for specific coaching
        const context = `Student stumbled repeatedly in Bar ${8 + Math.floor(Math.random() * 4)}. Instrument: Piano.`;
        const advice = await GeminiService.provideMusicCoaching(context, language);
        setCoachMessage(advice);
    };

    const resumePractice = () => {
        setIsPausedForCoach(false);
        setCoachMessage('');
        setRhythmOffset(0);
    };

    const finishMusicSession = async () => {
        setIsSessionActive(false);
        setIsPausedForCoach(false);
        setIsAnalyzing(true);
        const report = await GeminiService.generateMusicReport(sessionTimer, stumbleCount, language);
        setMusicReport(report);
        setIsAnalyzing(false);
    };

    const triggerAnalysis = async () => {
        setIsAnalyzing(true);
        // Simulate context data based on active tab
        const contextMap = {
            'Music': 'Pitch deviation < 5 cents, Rhythm steady at 90bpm', // Fallback context
            'Art': 'Posture straight, Brush stroke confidence 85%',
            'Logic': 'Move time 15s, Branching factor 4',
            'Language': 'WPM 130, Emotion positive, Eye contact 90%'
        };
        // @ts-ignore
        const result = await GeminiService.analyzeQualityEducationPerformance(activeTab, contextMap[activeTab], language);
        setAiFeedback(result);
        setIsAnalyzing(false);
    };

    const handleArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setArtImage(base64String);
                // Trigger Art Analysis
                setIsAnalyzing(true);
                GeminiService.analyzeArtPiece(base64String.split(',')[1], language).then(result => {
                    setArtAnalysis(result);
                    setIsAnalyzing(false);
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- LOGIC HANDLERS ---
    const handleAnalyzeBoard = async () => {
        setIsAnalyzing(true);
        const analysis = await GeminiService.analyzeGoBoard("Endgame simulation", language);
        setBoardAnalysis(analysis);
        setIsAnalyzing(false);
    };

    const handleRunCode = async () => {
        setConsoleOutput("SyntaxError: invalid syntax (line 3)");
        setDebugHint(null);
    };

    const handleDebugAssist = async () => {
        setIsAnalyzing(true);
        const hint = await GeminiService.getCodeDebugHint(codeSnippet, "SyntaxError: invalid syntax", language);
        setDebugHint(hint);
        setIsAnalyzing(false);
    };

    const resetArtMode = () => {
        setArtImage(null);
        setArtAnalysis(null);
        setIsSessionActive(false);
        setSessionTimer(0);
        setAiFeedback(null);
    };

    const resetMusicMode = () => {
        setIsSessionActive(false);
        setSessionTimer(0);
        setStumbleCount(0);
        setMusicReport(null);
        setIsPausedForCoach(false);
    };

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const renderMetricBadge = (status: 'good' | 'average' | 'poor') => {
        switch(status) {
            case 'good': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'average': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'poor': return 'bg-red-100 text-red-700 border-red-200';
        }
    };

    return (
        <div className="h-full flex flex-col p-1 gap-4">
            
            {/* Tab Switcher */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 w-fit mx-auto flex space-x-2 shadow-sm overflow-x-auto">
                <button 
                    onClick={() => { setActiveTab('Music'); resetMusicMode(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                        activeTab === 'Music' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Music size={16} />
                    <span>{t('creative.tab_music')}</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('Art'); resetArtMode(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                        activeTab === 'Art' ? 'bg-pink-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Palette size={16} />
                    <span>{t('creative.tab_art')}</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('Logic'); resetArtMode(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                        activeTab === 'Logic' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Brain size={16} />
                    <span>{t('creative.tab_logic')}</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('Language'); resetArtMode(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                        activeTab === 'Language' ? 'bg-orange-500 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Mic2 size={16} />
                    <span>{t('creative.tab_language')}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                
                {/* --- LEFT COLUMN: INTERACTIVE WORKSPACE --- */}
                <div className={`rounded-2xl p-6 flex flex-col items-center justify-between text-white shadow-lg relative overflow-hidden transition-all duration-500 ${
                    activeTab === 'Music' ? 'bg-gradient-to-br from-indigo-900 to-slate-900' :
                    activeTab === 'Art' ? 'bg-gradient-to-br from-pink-900 to-slate-900' :
                    activeTab === 'Logic' ? 'bg-gradient-to-br from-slate-900 to-cyan-950' :
                    'bg-gradient-to-br from-orange-900 to-slate-900'
                }`}>
                    {/* Background Effect */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                         style={{backgroundImage: 'radial-gradient(circle at 50% 50%, white, transparent 70%)'}}></div>

                    {/* Header */}
                    <div className="z-10 flex flex-col items-center w-full h-full">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            {activeTab === 'Music' && <Headphones size={20} />}
                            {activeTab === 'Art' && <Video size={20} />}
                            {activeTab === 'Logic' && <Code size={20} />}
                            {activeTab === 'Language' && <Mic size={20} />}
                            <span className="uppercase tracking-widest text-xs font-bold">
                                {activeTab === 'Music' && t('creative.music_title')}
                                {activeTab === 'Art' && t('creative.art_title')}
                                {activeTab === 'Logic' && t('creative.logic_title')}
                                {activeTab === 'Language' && t('creative.language_title')}
                            </span>
                        </div>
                        <p className="text-xs opacity-60 mb-6 font-mono text-center max-w-xs">
                            {activeTab === 'Music' && t('creative.music_desc')}
                            {activeTab === 'Art' && t('creative.art_desc')}
                            {activeTab === 'Logic' && t('creative.logic_desc')}
                            {activeTab === 'Language' && t('creative.language_desc')}
                        </p>

                        {/* CENTRAL VISUALIZER */}
                        <div className="flex-1 w-full flex items-center justify-center relative min-h-[200px]">
                            {/* MUSIC VISUALIZER */}
                            {activeTab === 'Music' && (
                                <div className="w-full flex flex-col items-center gap-6">
                                    <div className="w-64 h-12 bg-black/40 rounded-full relative overflow-hidden border border-white/10">
                                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50"></div>
                                        <div 
                                            className={`absolute top-1 bottom-1 w-2 rounded-full transition-all duration-300 ${
                                                rhythmStatus === 'perfect' ? 'bg-emerald-400 box-shadow-[0_0_10px_#34d399]' :
                                                rhythmStatus === 'rush' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}
                                            style={{ 
                                                left: `calc(50% + ${rhythmOffset}px)`,
                                                boxShadow: rhythmStatus === 'perfect' ? '0 0 10px #34d399' : 'none'
                                            }}
                                        ></div>
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-bold uppercase text-blue-300 opacity-50">{t('creative.mh_drag')}</div>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold uppercase text-orange-300 opacity-50">{t('creative.mh_rush')}</div>
                                    </div>
                                    <div className="flex items-end gap-1 h-32 w-full justify-center">
                                        {audioLevels.map((vol, i) => (
                                            <div key={i} className="w-3 bg-indigo-400 rounded-t-sm transition-all duration-100" style={{ height: `${vol}%`, opacity: isSessionActive ? 1 : 0.3 }}></div>
                                        ))}
                                    </div>
                                    {isPausedForCoach && (
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
                                            <AlertCircle size={48} className="text-yellow-400 mb-3 animate-bounce" />
                                            <h3 className="text-xl font-bold text-white mb-2">{t('creative.mh_stumble')}</h3>
                                            <div className="bg-white/10 border border-white/20 p-4 rounded-xl mb-4">
                                                <p className="text-sm font-mono text-cyan-300">
                                                    "{coachMessage}"
                                                </p>
                                            </div>
                                            <button onClick={resumePractice} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all">Resume Practice</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* ART VISUALIZER */}
                            {activeTab === 'Art' && (
                                artImage ? (
                                    <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden border border-white/20 bg-black/40">
                                        <img src={artImage} alt="Uploaded Art" className="max-h-64 object-contain" />
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                                <RefreshCw size={32} className="animate-spin text-pink-400 mb-2" />
                                                <span className="text-xs font-bold uppercase">{t('creative.analyzing_artwork')}</span>
                                            </div>
                                        )}
                                        <button onClick={() => setArtImage(null)} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-red-500/80 transition-colors">
                                            <RefreshCw size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative w-full max-w-sm h-48 border-2 border-white/20 rounded-lg flex flex-col items-center justify-center bg-black/30">
                                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                            <Video size={48} className="opacity-50 mb-2" />
                                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                {t('creative.camera_overhead')}
                                            </div>
                                            {isSessionActive && (
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                    <span className="text-[10px] uppercase font-bold">REC</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}

                            {/* LOGIC VISUALIZER (Go / Code) */}
                            {activeTab === 'Logic' && (
                                <div className="w-full h-full flex flex-col">
                                    {logicMode === 'board' ? (
                                        // GO BOARD VISUALIZER
                                        <div className="relative w-full aspect-square max-h-[300px] bg-[#e3c498] rounded shadow-2xl p-2 mx-auto">
                                            {/* Grid */}
                                            <div className="w-full h-full grid grid-cols-[repeat(18,1fr)] grid-rows-[repeat(18,1fr)] border-t border-l border-black relative">
                                                {/* Stones */}
                                                {goBoard.map((row, y) => row.map((cell, x) => (
                                                    cell !== 0 && (
                                                        <div key={`${x}-${y}`} className="absolute w-[5%] h-[5%] rounded-full shadow-sm" style={{
                                                            backgroundColor: cell === 1 ? 'black' : 'white',
                                                            left: `${(x / 18) * 100 - 2.5}%`,
                                                            top: `${(y / 18) * 100 - 2.5}%`,
                                                            border: cell === 2 ? '1px solid #ddd' : 'none'
                                                        }}></div>
                                                    )
                                                )))}
                                                
                                                {/* Analysis Overlay */}
                                                {boardAnalysis?.suggestedMoves.map((move, i) => (
                                                    <div key={i} className={`absolute w-[5%] h-[5%] flex items-center justify-center rounded-full animate-pulse z-10 ${
                                                        move.type === 'good' ? 'bg-emerald-500/50 ring-2 ring-emerald-500' : 'bg-red-500/50 ring-2 ring-red-500'
                                                    }`} style={{
                                                        left: `${(move.x / 18) * 100 - 2.5}%`,
                                                        top: `${(move.y / 18) * 100 - 2.5}%`,
                                                    }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // CODE EDITOR VISUALIZER
                                        <div className="bg-[#1e1e1e] w-full h-full rounded-lg border border-slate-700 font-mono text-xs p-3 overflow-hidden flex flex-col">
                                            <div className="flex gap-2 mb-2 pb-2 border-b border-slate-700">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="ml-auto text-slate-500">main.py</span>
                                            </div>
                                            <textarea 
                                                className="flex-1 bg-transparent text-slate-300 resize-none outline-none"
                                                value={codeSnippet}
                                                onChange={(e) => setCodeSnippet(e.target.value)}
                                                spellCheck={false}
                                            />
                                            {consoleOutput && (
                                                <div className="mt-2 pt-2 border-t border-slate-700 text-red-400">
                                                    <div className="flex items-center gap-1 mb-1 text-[10px] uppercase font-bold text-slate-500">
                                                        <Terminal size={10} /> {t('creative.logic_console')}
                                                    </div>
                                                    {consoleOutput}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'Language' && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-orange-400 flex items-center justify-center relative">
                                        <Mic2 size={40} className="text-white" />
                                        {isSessionActive && <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-50"></div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls - DYNAMIC based on Tab */}
                        {activeTab === 'Art' ? (
                            <div className="mt-8 flex gap-4">
                                <button onClick={() => setIsSessionActive(!isSessionActive)} className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${isSessionActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}>
                                    {isSessionActive ? <Pause size={18} /> : <Play size={18} />} <span>{t('creative.mode_live')}</span>
                                </button>
                                <button onClick={() => artInputRef.current?.click()} className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
                                    <Upload size={18} /> <span>{t('creative.mode_eval')}</span>
                                </button>
                                <input type="file" ref={artInputRef} className="hidden" accept="image/*" onChange={handleArtUpload} />
                            </div>
                        ) : activeTab === 'Logic' ? (
                            <div className="mt-6 w-full px-4">
                                <div className="flex justify-center gap-3 mb-4">
                                    <button 
                                        onClick={() => { setLogicMode('board'); setBoardAnalysis(null); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${logicMode === 'board' ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-transparent text-slate-400 border-slate-600'}`}
                                    >
                                        {t('creative.logic_sub_board')}
                                    </button>
                                    <button 
                                        onClick={() => { setLogicMode('code'); setDebugHint(null); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${logicMode === 'code' ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-transparent text-slate-400 border-slate-600'}`}
                                    >
                                        {t('creative.logic_sub_code')}
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    {logicMode === 'board' ? (
                                        <button onClick={handleAnalyzeBoard} disabled={isAnalyzing} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-200 transition-all">
                                            {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Video size={18} />}
                                            <span>{t('creative.logic_capture_board')}</span>
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button onClick={handleRunCode} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                                                <Play size={16} /> {t('creative.logic_run_code')}
                                            </button>
                                            {consoleOutput && (
                                                <button onClick={handleDebugAssist} disabled={isAnalyzing} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700">
                                                    {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <Bug size={16} />}
                                                    {t('creative.logic_debug_assist')}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'Music' ? (
                            <div className="mt-8 flex flex-col items-center w-full">
                                <div className="flex justify-between items-center w-full px-8 mb-4">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase">Time</p>
                                        <p className="text-2xl font-mono font-bold">{formatTime(sessionTimer)}</p>
                                    </div>
                                    {isSessionActive && (
                                        <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                                            <Volume2 size={16} />
                                            <span className="text-xs font-bold uppercase">{t('creative.mh_ai_accompaniment')}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setIsSessionActive(!isSessionActive)} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border-4 ${isSessionActive ? 'bg-yellow-500 border-yellow-600' : 'bg-emerald-500 border-emerald-600'}`}>
                                        {isSessionActive ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                                    </button>
                                    {isSessionActive && (
                                        <button onClick={finishMusicSession} className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border-4 bg-red-500 border-red-600">
                                            <StopCircle size={24} fill="white" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 flex flex-col items-center">
                                <div className="text-6xl font-mono font-bold tracking-tighter mb-6">{formatTime(sessionTimer)}</div>
                                <button onClick={() => setIsSessionActive(!isSessionActive)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border-4 ${isSessionActive ? 'bg-red-500 border-red-600' : 'bg-emerald-500 border-emerald-600'}`}>
                                    {isSessionActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
                                </button>
                                <p className="mt-4 text-sm font-medium opacity-80">{isSessionActive ? t('creative.stop_session') : t('creative.start_session')}</p>
                            </div>
                        )}
                    </div>

                    {/* Sensor Status Badges */}
                    {isSessionActive && activeTab !== 'Art' && activeTab !== 'Logic' && (
                        <div className="z-10 mt-6 flex gap-2">
                            {activeTab === 'Music' && (
                                <div className="bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/50 flex items-center gap-1 animate-pulse">
                                    <Mic size={12} /> {t('creative.mic_array_active')}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN: AI FEEDBACK & METRICS --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 relative">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-500" />
                        {t('creative.ai_feedback')}
                    </h3>

                    {/* DYNAMIC CONTENT */}
                    
                    {/* 1. MUSIC REPORT */}
                    {activeTab === 'Music' && musicReport ? (
                        <div className="flex-1 animate-fade-in flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h4 className="font-bold text-slate-700">{t('creative.mh_report_title')}</h4>
                                <button onClick={() => setMusicReport(null)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-center">
                                    <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">{t('creative.mh_pitch')}</span>
                                    <span className="text-xl font-black text-indigo-700">{musicReport.pitchStability}</span>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                                    <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">{t('creative.mh_rhythm')}</span>
                                    <span className="text-xl font-black text-emerald-700">{musicReport.rhythmAccuracy}</span>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
                                    <span className="text-[10px] text-purple-400 uppercase font-bold block mb-1">{t('creative.mh_focus')}</span>
                                    <span className="text-xl font-black text-purple-700">{musicReport.focusScore}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                                <div className="mb-4">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Summary</h5>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">"{musicReport.summary}"</p>
                                </div>
                                <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Coach Tip</h5>
                                    <div className="flex gap-2">
                                        <Zap size={16} className="text-yellow-500 flex-shrink-0" />
                                        <p className="text-sm text-slate-700 leading-relaxed italic">"{musicReport.suggestion}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Art' && artAnalysis ? (
                        /* 2. ART ANALYSIS */
                        <div className="flex-1 animate-fade-in flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 text-center">
                                    <span className="text-xs font-bold text-pink-400 uppercase block mb-1">{t('creative.art_creativity')}</span>
                                    <span className="text-3xl font-black text-pink-700">{artAnalysis.creativityScore}</span>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                                    <span className="text-xs font-bold text-purple-400 uppercase block mb-1">{t('creative.art_technique')}</span>
                                    <span className="text-3xl font-black text-purple-700">{artAnalysis.techniqueScore}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{t('creative.art_composition')}</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">"{artAnalysis.compositionAnalysis}"</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{t('creative.art_color')}</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">"{artAnalysis.colorUsage}"</p>
                                </div>
                            </div>
                            <div className="mt-auto bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-xl border border-white">
                                <p className="text-sm font-bold text-pink-900 italic">"{artAnalysis.encouragement}"</p>
                            </div>
                        </div>
                    ) : activeTab === 'Logic' ? (
                        /* 3. LOGIC MODULE PANEL */
                        <div className="flex-1 animate-fade-in flex flex-col gap-4">
                            {logicMode === 'board' ? (
                                /* BOARD MODE */
                                boardAnalysis ? (
                                    <>
                                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-bold">{t('creative.logic_win_rate')}</p>
                                                <p className={`text-3xl font-black ${boardAnalysis.winProbability > 50 ? 'text-emerald-600' : 'text-slate-600'}`}>{boardAnalysis.winProbability}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 uppercase font-bold">{t('creative.logic_critical_move')}</p>
                                                <p className="text-3xl font-mono font-bold text-indigo-600">{boardAnalysis.criticalMove}</p>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles size={16} className="text-indigo-500" />
                                                <h4 className="font-bold text-indigo-900 text-sm">DeepSeek Analysis</h4>
                                            </div>
                                            <p className="text-sm text-indigo-800 leading-relaxed">"{boardAnalysis.moveExplanation}"</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center opacity-60">
                                        <Grid size={48} className="mb-2" strokeWidth={1}/>
                                        <p className="text-sm">Capture board to start analysis.</p>
                                    </div>
                                )
                            ) : (
                                /* CODE MODE */
                                <>
                                    {/* Mission / Challenge */}
                                    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1"><Cpu size={12}/> {t('creative.logic_mission')}</h4>
                                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Level 2</span>
                                        </div>
                                        <p className="font-bold text-lg mb-4">{t('creative.logic_mission_title')}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-emerald-300 opacity-50 line-through">
                                                <CheckCircle2 size={14}/> {t('creative.logic_step')} 1: Import Random
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-white font-medium animate-pulse">
                                                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/50"></div> {t('creative.logic_step')} 2: Define Whack Function
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700"></div> {t('creative.logic_step')} 3: Score Tracker
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Debug Hint */}
                                    {debugHint ? (
                                        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex-1 animate-fade-in">
                                            <div className="flex items-center gap-2 mb-2 text-purple-700">
                                                <Lightbulb size={18} fill="currentColor" className="text-yellow-400" />
                                                <h4 className="font-bold text-sm">{t('creative.logic_hint_title')}</h4>
                                            </div>
                                            <p className="text-xs text-purple-900 mb-2 font-medium">{t('creative.logic_hint_desc')}</p>
                                            <p className="text-sm text-slate-800 font-medium italic border-l-2 border-purple-300 pl-3">
                                                "{debugHint.hint}"
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <span className="text-[10px] bg-white text-purple-600 px-2 py-1 rounded border border-purple-100 font-bold uppercase">Line {debugHint.line}</span>
                                                <span className="text-[10px] bg-white text-purple-600 px-2 py-1 rounded border border-purple-100 font-bold uppercase">{debugHint.concept}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center opacity-60">
                                            <Bug size={48} className="mb-2" strokeWidth={1}/>
                                            <p className="text-sm">Run code to check for bugs.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        /* 4. DEFAULT / LIVE METRICS (For others) */
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center h-32">
                                    <span className="text-xs text-slate-400 uppercase font-bold mb-2">
                                        {activeTab === 'Music' && t('creative.pitch_accuracy')}
                                        {activeTab === 'Art' && t('creative.brushwork')}
                                        {activeTab === 'Logic' && t('creative.efficiency')}
                                        {activeTab === 'Language' && t('creative.fluency')}
                                    </span>
                                    <span className="text-2xl font-black text-slate-700">
                                        {aiFeedback ? aiFeedback.metrics[0]?.value : '--'}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center h-32">
                                    <span className="text-xs text-slate-400 uppercase font-bold mb-2">
                                        {activeTab === 'Music' && t('creative.rhythm_stability')}
                                        {activeTab === 'Art' && t('creative.composition')}
                                        {activeTab === 'Logic' && t('creative.strategy_depth')}
                                        {activeTab === 'Language' && t('creative.emotion')}
                                    </span>
                                    <span className="text-2xl font-black text-slate-700">
                                        {aiFeedback ? aiFeedback.metrics[1]?.value : '--'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 p-6 relative overflow-hidden">
                                {isAnalyzing ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                        <RefreshCw size={32} className="text-indigo-500 animate-spin mb-2" />
                                        <span className="text-xs text-indigo-500 font-bold uppercase tracking-widest">Analyzing...</span>
                                    </div>
                                ) : null}
                                {!isSessionActive && !aiFeedback && !artImage ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 text-center">
                                        <Layout size={48} strokeWidth={1} className="mb-4" />
                                        <p className="text-sm">{t('creative.session_active')}</p>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded">Score: {aiFeedback?.score || 0}</span>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed font-medium">"{aiFeedback?.feedback || (isSessionActive ? "Monitoring performance..." : "Session ended.")}"</p>
                                        {aiFeedback && aiFeedback.metrics.length > 2 && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                                {aiFeedback.metrics.slice(2).map((m, i) => (
                                                    <div key={i} className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">{m.label}</span>
                                                        <span className={`px-2 py-0.5 rounded border font-bold uppercase ${renderMetricBadge(m.status as any)}`}>{m.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};