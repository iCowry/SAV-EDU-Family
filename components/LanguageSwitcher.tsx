import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1"
      title="Switch Language"
    >
      <Languages size={20} />
      <span className="text-sm font-bold uppercase">{language}</span>
    </button>
  );
};