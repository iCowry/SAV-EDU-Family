
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Music, Palette, Mic, Play, Pause, Upload, Sparkles, 
    Zap, Headphones, Clock, RefreshCw, Maximize2, 
    Code, MessageSquare, Video, Mic2, Grid, Brain, Layout, Image as ImageIcon, CheckCircle2,
    Volume2, AlertCircle, StopCircle, BarChart3, X, Terminal, Cpu, Bug, Lightbulb, ChevronLeft, Lock, FileText, Share2, Target, RefreshCcw, ChevronDown, Book, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { GeminiService } from '../services/geminiService';
import { QualityEduAnalysis, QualityEducationCategory, ArtAnalysis, MusicReport, BoardAnalysis, CodeDebugHint, WeeklyReportData, WeeklyAIInsight } from '../types';

// Mock Data for Weekly Report
const MOCK_WEEKLY_DATA: WeeklyReportData = {
    music: { sessions: 3, duration: 90, rhythmScore: 85, rhythmImprovement: 5 },
    art: { pages: 2, postureAlerts: 5, penAccuracy: 95 },
    logic: { wins: 2, losses: 3, tacticalAnalysis: "Improved layout, weak endgame" },
    language: { emotionScore: 70, speedIssue: true },
    academic: { strongSubject: "Math", weakSubject: "English Vocabulary" }
};

type CodeLanguage = 'python' | 'javascript' | 'cpp';

interface CodingChallenge {
    id: string;
    title: string;
    description: string;
    hint: string;
    initialCode: string;
}

const CODING_CHALLENGES: Record<CodeLanguage, CodingChallenge[]> = {
    python: [
        {
            id: 'py_1',
            title: 'Lv.1 Guess the Number',
            description: 'Fix the syntax error in the conditional statement.',
            hint: 'Python requires a colon at the end of if/else statements.',
            initialCode: `def check_guess(target, guess):
    print(f"Target is {target}, User guessed {guess}")
    
    # Intentional Error: Missing colon
    if guess == target
        return "Correct! You win."
    elif guess < target:
        return "Too low!"
    else:
        return "Too high!"

print(check_guess(42, 42))`
        },
        {
            id: 'py_2',
            title: 'Lv.2 List Iteration',
            description: 'Print only the even numbers from the list.',
            hint: 'The modulo operator % returns the remainder. Even numbers have remainder 0 when divided by 2.',
            initialCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8]
print("Finding even numbers...")

for n in numbers:
    # Intentional Error: Logic is checking for odd numbers
    if n % 2 == 1:
        print(f"Found even: {n}")`
        },
        {
            id: 'py_3',
            title: 'Lv.3 String Reversal',
            description: 'Reverse the string using slicing.',
            hint: 'Slice syntax is [start:stop:step]. To go backwards, step should be negative.',
            initialCode: `s = "SAV Edu"
# Intentional Error: Step is positive 1 (forward)
reversed_s = s[::1] 

print(f"Original: {s}")
print(f"Reversed: {reversed_s}")`
        }
    ],
    javascript: [
        {
            id: 'js_1',
            title: 'Lv.1 Grade Calculator',
            description: 'Fix the logic bug in the comparison.',
            hint: 'A single equals sign (=) assigns a value. Triple equals (===) compares values.',
            initialCode: `function calculateGrade(score) {
    console.log("Calculating grade for: " + score);

    // Intentional Error: Assignment instead of comparison
    if (score = 100) {
        return "Perfect Score! (A+)";
    } else if (score >= 90) {
        return "Excellent (A)";
    } else {
        return "Keep practicing";
    }
}

console.log(calculateGrade(85)); // Should not be Perfect Score`
        },
        {
            id: 'js_2',
            title: 'Lv.2 Array Filtering',
            description: 'Filter the array to keep only numbers greater than 10.',
            hint: 'The filter condition needs to return true for items you want to KEEP.',
            initialCode: `const numbers = [5, 12, 8, 130, 44];

// Intentional Error: Logic keeps numbers less than 10
const bigNumbers = numbers.filter(n => n < 10);

console.log("Original:", numbers);
console.log("Big Numbers (>10):", bigNumbers);`
        },
        {
            id: 'js_3',
            title: 'Lv.3 Object Access',
            description: 'Access the user\'s name property correctly.',
            hint: 'Check for typos in property names. "nam" vs "name".',
            initialCode: `const user = {
    id: 101,
    name: "Alex",
    role: "Student"
};

// Intentional Error: Typo in property name
console.log("User Name: " + user.nam);
console.log("User Role: " + user.role);`
        }
    ],
    cpp: [
        {
            id: 'cpp_1',
            title: 'Lv.1 Array Loops',
            description: 'Fix the loop boundary error (Index Out of Bounds).',
            hint: 'Arrays are 0-indexed. If size is 5, valid indices are 0 to 4.',
            initialCode: `#include <iostream>
using namespace std;

int main() {
    int numbers[] = {10, 20, 30, 40, 50}; // Size is 5
    int sum = 0;

    // Intentional Error: Loop goes to <= 5 (index 5 is out of bounds)
    for (int i = 0; i <= 5; i++) {
        sum += numbers[i];
    }

    cout << "Sum of array: " << sum << endl;
    return 0;
}`
        },
        {
            id: 'cpp_2',
            title: 'Lv.2 Pointer Logic',
            description: 'Print the value pointed to, not the memory address.',
            hint: 'Use the dereference operator (*) to get the value stored at a pointer\'s address.',
            initialCode: `#include <iostream>
using namespace std;

int main() {
    int score = 95;
    int* ptr = &score;

    cout << "The score is: ";
    // Intentional Error: Printing the pointer (address) instead of value
    cout << ptr << endl; 
    
    return 0;
}`
        },
        {
            id: 'cpp_3',
            title: 'Lv.3 Syntax Strictness',
            description: 'Fix the syntax error to compile.',
            hint: 'In C++, every statement must end with a semicolon.',
            initialCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to Logic Lab" << endl
    // Intentional Error: Missing semicolon above
    
    int x = 5;
    int y = 10;
    cout << "Result: " << x + y << endl;
    
    return 0;
}`
        }
    ]
};

export const CreativeView: React.FC = () => {
    const { t, language } = useLanguage();
    const [viewMode, setViewMode] = useState<'hub' | 'detail'>('hub');
    const [activeTab, setActiveTab] = useState<QualityEducationCategory>('Music');
    const [showReportModal, setShowReportModal] = useState(false);
    const [weeklyReport, setWeeklyReport] = useState<WeeklyAIInsight | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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
    const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('python');
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [codeSnippet, setCodeSnippet] = useState(CODING_CHALLENGES['python'][0].initialCode);
    const [consoleOutput, setConsoleOutput] = useState<string>('');
    const [debugHint, setDebugHint] = useState<CodeDebugHint | null>(null);

    const currentChallenge = CODING_CHALLENGES[codeLanguage][currentChallengeIndex];

    // --- MOCK VISUALIZERS ---
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(10));
    
    // --- EFFECTS ---
    useEffect(() => {
        let interval: any;
        if (isSessionActive && !isPausedForCoach && viewMode === 'detail') {
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
    }, [isSessionActive, sessionTimer, activeTab, isPausedForCoach, rhythmOffset, viewMode]);

    // Initialize Go Board
    useEffect(() => {
        if (activeTab === 'Logic' && logicMode === 'board' && viewMode === 'detail') {
            const size = 19;
            const newBoard = Array(size).fill(0).map(() => Array(size).fill(0));
            // Simulate some stones
            for(let i=0; i<30; i++) {
                newBoard[Math.floor(Math.random()*size)][Math.floor(Math.random()*size)] = 1; // Black
                newBoard[Math.floor(Math.random()*size)][Math.floor(Math.random()*size)] = 2; // White
            }
            setGoBoard(newBoard);
        }
    }, [activeTab, logicMode, viewMode]);

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

    const handleLanguageChange = (lang: CodeLanguage) => {
        setCodeLanguage(lang);
        setCurrentChallengeIndex(0); // Reset to first challenge of new language
        setCodeSnippet(CODING_CHALLENGES[lang][0].initialCode);
        setConsoleOutput('');
        setDebugHint(null);
    };

    const handleChallengeChange = (direction: 'next' | 'prev') => {
        let newIndex = currentChallengeIndex;
        if (direction === 'next') {
            newIndex = (currentChallengeIndex + 1) % CODING_CHALLENGES[codeLanguage].length;
        } else {
            newIndex = (currentChallengeIndex - 1 + CODING_CHALLENGES[codeLanguage].length) % CODING_CHALLENGES[codeLanguage].length;
        }
        setCurrentChallengeIndex(newIndex);
        setCodeSnippet(CODING_CHALLENGES[codeLanguage][newIndex].initialCode);
        setConsoleOutput('');
        setDebugHint(null);
    };

    const handleRunCode = async () => {
        setConsoleOutput('Running...');
        setIsAnalyzing(true);
        const output = await GeminiService.runCodeSimulation(codeSnippet, codeLanguage);
        setConsoleOutput(output);
        setDebugHint(null);
        setIsAnalyzing(false);
    };

    const handleDebugAssist = async () => {
        setIsAnalyzing(true);
        // Use the challenge specific hint as fallback or context
        const hint = await GeminiService.getCodeDebugHint(codeSnippet, consoleOutput, language);
        setDebugHint(hint);
        setIsAnalyzing(false);
    };

    // --- REPORT GENERATION ---
    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        const report = await GeminiService.generateWeeklyReport(MOCK_WEEKLY_DATA, "Commander", language);
        setWeeklyReport(report);
        setIsGeneratingReport(false);
    };

    const enterPlanet = (category: QualityEducationCategory) => {
        setActiveTab(category);
        setViewMode('detail');
        // Reset sub-states if needed
        if (category === 'Music') resetMusicMode();
        if (category === 'Art') resetArtMode();
        if (category === 'Logic') { setLogicMode('board'); setBoardAnalysis(null); }
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

    const getRadarData = () => [
        { subject: t('creative.tab_music'), A: MOCK_WEEKLY_DATA.music.rhythmScore, fullMark: 100 },
        { subject: t('creative.tab_art'), A: MOCK_WEEKLY_DATA.art.penAccuracy, fullMark: 100 },
        { subject: t('creative.tab_logic'), A: 60, fullMark: 100 },
        { subject: t('creative.tab_language'), A: MOCK_WEEKLY_DATA.language.emotionScore, fullMark: 100 },
        { subject: t('cognitive.subjects.Math'), A: 95, fullMark: 100 },
        { subject: t('cognitive.subjects.English'), A: 40, fullMark: 100 },
    ];

    // --- GALAXY HUB RENDER ---
    if (viewMode === 'hub') {
        return (
            <div className="h-full w-full relative overflow-hidden bg-slate-950 rounded-2xl shadow-2xl flex flex-col">
                {/* Starry Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black"></div>
                    <div className="absolute w-full h-full opacity-30" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
                    <div className="absolute w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '120px 120px', backgroundPosition: '20px 20px'}}></div>
                </div>

                {/* Top Bar: Energy & Title */}
                <div className="relative z-10 flex justify-between items-center p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <Sparkles size={20} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">{t('creative.hub_title')}</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/30">
                            <Zap size={16} className="text-yellow-400 fill-current animate-pulse" />
                            <span className="text-white font-mono font-bold">450</span>
                            <span className="text-xs text-indigo-300 uppercase">{t('creative.energy_balance')}</span>
                        </div>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                            <Lock size={14} /> {t('creative.unlock_skin')}
                        </button>
                    </div>
                </div>

                {/* Planets Grid */}
                <div className="relative z-10 flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 p-8 items-center justify-center">
                    
                    {/* Planet: Music */}
                    <div onClick={() => enterPlanet('Music')} className="group cursor-pointer flex flex-col items-center gap-6 transition-transform hover:scale-105">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 rounded-full bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-400 via-purple-600 to-slate-900 shadow-inner flex items-center justify-center border-2 border-indigo-300/30 overflow-hidden">
                                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                <Music size={48} className="text-white drop-shadow-lg" />
                            </div>
                            {/* Orbit Ring */}
                            <div className="absolute inset-[-10px] rounded-full border border-white/10 w-[calc(100%+20px)] h-[calc(100%+20px)] animate-[spin_10s_linear_infinite]">
                                <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_white]"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg mb-1">{t('creative.planet_music')}</h3>
                            <div className="flex flex-col gap-1 text-xs text-indigo-200">
                                <span>{t('creative.stat_week_time')}: <span className="font-mono text-white">120m</span></span>
                                <span>{t('creative.stat_rhythm')}: <span className="font-mono text-emerald-400">85%</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Planet: Art */}
                    <div onClick={() => enterPlanet('Art')} className="group cursor-pointer flex flex-col items-center gap-6 transition-transform hover:scale-105">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 rounded-full bg-pink-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-pink-400 via-rose-600 to-slate-900 shadow-inner flex items-center justify-center border-2 border-pink-300/30 overflow-hidden">
                                <Palette size={48} className="text-white drop-shadow-lg" />
                                {/* Mock Scrolling Timelapse */}
                                <div className="absolute bottom-4 flex gap-1 opacity-50">
                                    <div className="w-4 h-4 bg-white/50 rounded-sm"></div>
                                    <div className="w-4 h-4 bg-white/30 rounded-sm"></div>
                                    <div className="w-4 h-4 bg-white/10 rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg mb-1">{t('creative.planet_art')}</h3>
                            <div className="flex flex-col gap-1 text-xs text-pink-200">
                                <span>{t('creative.stat_timelapse')}</span>
                                <div className="flex justify-center gap-1 mt-1">
                                    <div className="w-6 h-6 bg-slate-800 rounded border border-slate-600"></div>
                                    <div className="w-6 h-6 bg-slate-800 rounded border border-slate-600"></div>
                                    <div className="w-6 h-6 bg-slate-800 rounded border border-slate-600"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Planet: Logic */}
                    <div onClick={() => enterPlanet('Logic')} className="group cursor-pointer flex flex-col items-center gap-6 transition-transform hover:scale-105">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 rounded-full bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-slate-900 shadow-inner flex items-center justify-center border-2 border-cyan-300/30 overflow-hidden">
                                <Grid size={48} className="text-white drop-shadow-lg" />
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] bg-[length:10px_10px]"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg mb-1">{t('creative.planet_logic')}</h3>
                            <div className="flex flex-col gap-1 text-xs text-cyan-200">
                                <span>{t('creative.stat_win_rate')}: <span className="font-mono text-emerald-400">60%</span></span>
                                <span>{t('creative.stat_projects')}: <span className="font-mono text-white">3</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Planet: Language */}
                    <div onClick={() => enterPlanet('Language')} className="group cursor-pointer flex flex-col items-center gap-6 transition-transform hover:scale-105">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 rounded-full bg-orange-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-400 via-amber-600 to-slate-900 shadow-inner flex items-center justify-center border-2 border-orange-300/30 overflow-hidden">
                                <Mic2 size={48} className="text-white drop-shadow-lg" />
                                <div className="absolute w-full h-full border-4 border-white/10 rounded-full scale-75"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg mb-1">{t('creative.planet_language')}</h3>
                            <div className="flex flex-col gap-1 text-xs text-orange-200">
                                <span>{t('creative.stat_expressiveness')}: <span className="font-mono text-yellow-400">92/100</span></span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Floating Report Button */}
                <button 
                    onClick={() => { setShowReportModal(true); if (!weeklyReport) handleGenerateReport(); }}
                    className="absolute bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 z-20"
                >
                    <FileText size={20} />
                    {t('creative.wr_btn')}
                </button>

                {/* Report Modal */}
                {showReportModal && (
                    <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl h-[90%] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                            {/* Header */}
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('creative.wr_title')}</h2>
                                    <p className="text-slate-500 text-sm">{t('creative.wr_subtitle')}</p>
                                </div>
                                <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <X size={24} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Visuals */}
                                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <div className="w-full h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData()}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Skills" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.4} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                            <span className="text-xs text-slate-400 uppercase font-bold">{t('creative.wr_total_time')}</span>
                                            <span className="block text-xl font-black text-indigo-600">3.5h</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                            <span className="text-xs text-slate-400 uppercase font-bold">{t('creative.wr_focus_avg')}</span>
                                            <span className="block text-xl font-black text-emerald-500">88%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: AI Insight */}
                                <div className="flex flex-col gap-6">
                                    {isGeneratingReport ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-indigo-500 gap-4">
                                            <RefreshCw size={48} className="animate-spin" />
                                            <span className="font-bold animate-pulse">{t('creative.wr_generating')}</span>
                                        </div>
                                    ) : weeklyReport ? (
                                        <div className="animate-fade-in space-y-6 flex-1 flex flex-col">
                                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl relative flex-1">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Sparkles size={64} className="text-indigo-900" />
                                                </div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-indigo-900 font-bold flex items-center gap-2">
                                                        <Zap size={18} className="text-yellow-500" /> {t('creative.wr_consultant')}
                                                    </h3>
                                                    <button 
                                                        onClick={handleGenerateReport} 
                                                        className="p-1.5 bg-white rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors shadow-sm"
                                                        title={t('creative.wr_regenerate')}
                                                    >
                                                        <RefreshCcw size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-slate-700 leading-relaxed text-sm">
                                                    {weeklyReport.summary}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                                    <Target size={14} /> {t('creative.wr_focus')}
                                                </h4>
                                                <div className="space-y-3">
                                                    {weeklyReport.suggestions.map((s, i) => (
                                                        <div key={i} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                            <div className="mt-0.5 bg-emerald-100 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                {i + 1}
                                                            </div>
                                                            <p className="text-sm text-slate-700 font-medium">{s}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center">
                                            <button 
                                                onClick={handleGenerateReport}
                                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                                            >
                                                <Sparkles size={18} />
                                                {t('creative.wr_btn')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-3">
                                <button className="px-6 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors">
                                    {t('creative.wr_archive')}
                                </button>
                                <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm transition-colors flex items-center gap-2 shadow-lg">
                                    <Share2 size={16} /> {t('creative.wr_share')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- DETAIL VIEW (Original Implementation) ---
    return (
        <div className="h-full flex flex-col p-1 gap-4">
            
            {/* Navigation Header */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                <button 
                    onClick={() => setViewMode('hub')}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-bold text-sm"
                >
                    <ChevronLeft size={18} />
                    {t('creative.back_to_galaxy')}
                </button>

                <div className="flex space-x-2">
                    <button 
                        onClick={() => { setActiveTab('Music'); resetMusicMode(); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                            activeTab === 'Music' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Music size={16} />
                        <span className="hidden sm:inline">{t('creative.tab_music')}</span>
                    </button>
                    <button 
                        onClick={() => { setActiveTab('Art'); resetArtMode(); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                            activeTab === 'Art' ? 'bg-pink-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Palette size={16} />
                        <span className="hidden sm:inline">{t('creative.tab_art')}</span>
                    </button>
                    <button 
                        onClick={() => { setActiveTab('Logic'); resetArtMode(); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                            activeTab === 'Logic' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Brain size={16} />
                        <span className="hidden sm:inline">{t('creative.tab_logic')}</span>
                    </button>
                    <button 
                        onClick={() => { setActiveTab('Language'); resetArtMode(); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                            activeTab === 'Language' ? 'bg-orange-500 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Mic2 size={16} />
                        <span className="hidden sm:inline">{t('creative.tab_language')}</span>
                    </button>
                </div>
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
                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                
                                                {/* Challenge Navigation */}
                                                <div className="flex items-center gap-1 ml-4 bg-slate-800 rounded px-1">
                                                    <button 
                                                        onClick={() => handleChallengeChange('prev')}
                                                        className="text-slate-400 hover:text-white p-1"
                                                    >
                                                        <ArrowLeft size={12}/>
                                                    </button>
                                                    <span className="text-[10px] text-slate-300 font-mono px-1">
                                                        {currentChallengeIndex + 1}/{CODING_CHALLENGES[codeLanguage].length}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleChallengeChange('next')}
                                                        className="text-slate-400 hover:text-white p-1"
                                                    >
                                                        <ArrowRight size={12}/>
                                                    </button>
                                                </div>

                                                {/* Language Selector */}
                                                <div className="ml-auto relative group">
                                                    <button className="flex items-center gap-1 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 uppercase font-bold">
                                                        {codeLanguage}
                                                        <ChevronDown size={10} />
                                                    </button>
                                                    {/* Dropdown */}
                                                    <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded shadow-lg hidden group-hover:block z-20">
                                                        <div onClick={() => handleLanguageChange('python')} className="px-3 py-1 hover:bg-slate-700 cursor-pointer text-slate-300 text-[10px] uppercase font-bold">Python</div>
                                                        <div onClick={() => handleLanguageChange('javascript')} className="px-3 py-1 hover:bg-slate-700 cursor-pointer text-slate-300 text-[10px] uppercase font-bold">JavaScript</div>
                                                        <div onClick={() => handleLanguageChange('cpp')} className="px-3 py-1 hover:bg-slate-700 cursor-pointer text-slate-300 text-[10px] uppercase font-bold">C++</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea 
                                                className="flex-1 bg-transparent text-slate-300 resize-none outline-none font-mono leading-relaxed"
                                                value={codeSnippet}
                                                onChange={(e) => setCodeSnippet(e.target.value)}
                                                spellCheck={false}
                                            />
                                            {consoleOutput && (
                                                <div className="mt-2 pt-2 border-t border-slate-700 text-slate-300">
                                                    <div className="flex items-center gap-1 mb-1 text-[10px] uppercase font-bold text-slate-500">
                                                        <Terminal size={10} /> {t('creative.logic_console')}
                                                    </div>
                                                    <pre className="whitespace-pre-wrap text-[10px] font-mono">{consoleOutput}</pre>
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
                                            <button onClick={handleRunCode} disabled={isAnalyzing} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 disabled:opacity-50">
                                                {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />} 
                                                {t('creative.logic_run_code')}
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
                                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 uppercase">{codeLanguage}</span>
                                        </div>
                                        <p className="font-bold text-lg mb-2">{currentChallenge.title}</p>
                                        <div className="space-y-3 text-sm">
                                            <p className="text-slate-300 leading-snug">{currentChallenge.description}</p>
                                            <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex items-start gap-2">
                                                <Book size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-slate-400 italic">Hint: {currentChallenge.hint}</p>
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
