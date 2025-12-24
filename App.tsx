import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Activity, 
  Utensils, 
  HeartHandshake, 
  Menu,
  X,
  Hexagon,
  FolderOpen,
  Briefcase,
  Palette
} from 'lucide-react';
import { Quadrant } from './types';
import { HardwareStatus } from './components/HardwareStatus';
import { Dashboard } from './components/Dashboard';
import { CognitiveView } from './components/CognitiveView';
import { PhysicalView } from './components/PhysicalView';
import { BiologicalView } from './components/BiologicalView';
import { RelationalView } from './components/RelationalView';
import { ArchivesView } from './components/ArchivesView';
import { EduManagerView } from './components/EduManagerView';
import { CreativeView } from './components/CreativeView';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: Quadrant.COGNITIVE, label: t('nav.cognitive'), icon: BrainCircuit },
    { id: Quadrant.PHYSICAL, label: t('nav.physical'), icon: Activity },
    { id: Quadrant.BIOLOGICAL, label: t('nav.biological'), icon: Utensils },
    { id: Quadrant.RELATIONAL, label: t('nav.relational'), icon: HeartHandshake },
    { id: Quadrant.CREATIVE, label: t('nav.creative'), icon: Palette },
    { id: Quadrant.EDU_MANAGER, label: t('nav.edu_manager'), icon: Briefcase },
    { id: Quadrant.ARCHIVES, label: t('nav.archives'), icon: FolderOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case Quadrant.COGNITIVE: return <CognitiveView />;
      case Quadrant.PHYSICAL: return <PhysicalView />;
      case Quadrant.BIOLOGICAL: return <BiologicalView />;
      case Quadrant.RELATIONAL: return <RelationalView />;
      case Quadrant.CREATIVE: return <CreativeView />;
      case Quadrant.EDU_MANAGER: return <EduManagerView />;
      case Quadrant.ARCHIVES: return <ArchivesView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden text-slate-900 font-sans">
      
      {/* Top Hardware Status Bar */}
      <HardwareStatus />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-20 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-xl text-white">
                    <Hexagon size={24} fill="white" className="text-slate-900"/>
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight text-slate-900">{t('nav.app_name')}</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t('nav.growth_os')}</p>
                </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex-1 mr-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">{t('nav.system_status')}</p>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-semibold text-slate-700 truncate">{t('nav.nominal')}</span>
                    </div>
                </div>
            </div>
            <LanguageSwitcher />
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden absolute top-[45px] left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30">
            <div className="flex items-center space-x-2">
                 <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                    <Hexagon size={18} fill="white" className="text-slate-900"/>
                </div>
                <span className="font-bold text-slate-900">{t('nav.app_name')}</span>
            </div>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[109px] left-0 w-full bg-white z-40 border-b border-slate-200 shadow-xl animate-fade-in-down">
                <nav className="p-4 space-y-2">
                     {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl ${
                            activeTab === item.id 
                                ? 'bg-slate-900 text-white' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative pt-16 md:pt-0">
            <div className={`absolute inset-0 overflow-y-auto ${activeTab === Quadrant.EDU_MANAGER ? 'p-0' : 'p-4 md:p-8'}`}>
                <div className={`mx-auto h-full ${activeTab === Quadrant.EDU_MANAGER ? 'max-w-full' : 'max-w-7xl'}`}>
                    {renderContent()}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
