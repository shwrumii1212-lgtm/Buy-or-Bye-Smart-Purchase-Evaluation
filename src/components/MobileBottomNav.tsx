import React from 'react';
import { ShoppingBag, Wallet, History, BookOpen, Info, BarChart3 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  language,
}) => {
  const t = translations[language];

  // Consistent Navigation order: Finansial, Evaluasi, Laporan Bulanan, Riwayat, Edukasi, Tentang Kami
  const items = [
    { id: 'finance', label: t.navFinance, icon: Wallet },
    { id: 'evaluate', label: t.navEvaluate, icon: ShoppingBag, isCenter: true },
    { id: 'monthly-report', label: t.navMonthlyReport, icon: BarChart3 },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'education', label: t.navEducation, icon: BookOpen },
    { id: 'about', label: t.navAbout, icon: Info },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F6F2]/95 backdrop-blur-lg border-t border-[#E2EAF0] shadow-lg px-2 py-1.5">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center -mt-4 relative group cursor-pointer"
                title={item.label}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all ${
                  isActive 
                    ? 'bg-gradient-to-tr from-[#587893] to-[#6B8BA4] text-white ring-2 ring-white scale-105' 
                    : 'bg-[#6B8BA4] text-white ring-2 ring-white hover:scale-105'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-[9px] font-bold mt-1 tracking-tight truncate max-w-[48px] ${
                  isActive ? 'text-[#24303E]' : 'text-[#6B8BA4]'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#24303E]' : 'text-[#7A8C9E] hover:text-[#415364]'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-[#E2EAF0]' : 'bg-transparent'
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#6B8BA4]' : 'text-[#8CA8BF]'}`} />
              </div>
              <span className={`text-[8px] font-semibold mt-0.5 leading-tight truncate max-w-[50px] text-center ${
                isActive ? 'font-bold text-[#24303E]' : 'text-[#7A8C9E]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
