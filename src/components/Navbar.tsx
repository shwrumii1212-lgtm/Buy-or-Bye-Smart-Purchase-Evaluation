import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  Sparkles, 
  History, 
  BookOpen, 
  Info, 
  Globe, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Language, User, FinancialProfile } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  user: User | null;
  finance: FinancialProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
  user,
  finance,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'finance', label: t.navFinance, icon: Wallet },
    { id: 'evaluate', label: t.navEvaluate, icon: ShoppingBag },
    { id: 'monthly-report', label: t.navMonthlyReport, icon: BarChart3 },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'education', label: t.navEducation, icon: BookOpen },
    { id: 'about', label: t.navAbout, icon: Info },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#E2EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6B8BA4] via-[#8CA8BF] to-[#B8D5E5] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight">
                <span className="text-[#16A34A]">Buy</span> <span className="text-black font-normal">or</span> <span className="text-[#EC4899]">Bye</span>
              </span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-[#6B8BA4] hidden sm:block">
                Decision Gatekeeper
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive 
                      ? 'bg-[#E2EAF0] text-[#24303E] font-semibold shadow-xs' 
                      : 'text-[#506272] hover:text-[#24303E] hover:bg-[#EFECE6]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#6B8BA4]' : 'text-[#8CA8BF]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D5DFE7] bg-white text-xs font-semibold text-[#415364] hover:bg-[#F2F6F9] transition-colors shadow-xs"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#6B8BA4]" />
              <span className="uppercase">{language}</span>
            </button>

            {/* User Session */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#D5DFE7] bg-white hover:bg-[#F2F6F9] transition-all shadow-xs"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#6B8BA4]/30" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-[#24303E] leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#718597] flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-[#9EAEA2]" /> Active
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu - Profil hanya menampilkan nama, email, dan Logout */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-[#E2EAF0] shadow-lg py-2 z-50 text-xs animate-in fade-in">
                    <div className="px-3.5 py-2 border-b border-[#F0F4F7]">
                      <p className="font-bold text-[#24303E] text-sm leading-tight">{user.name}</p>
                      <p className="text-[11px] text-[#7A8C9E] truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3.5 py-2 text-[#C487A0] hover:bg-[#FFF5F8] flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#D8A4B8]" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6B8BA4] text-white text-xs font-semibold hover:bg-[#587893] transition-colors shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#506272] hover:bg-[#EFECE6]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2EAF0] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive 
                    ? 'bg-[#E2EAF0] text-[#24303E] font-semibold' 
                    : 'text-[#506272] hover:bg-[#F8F6F2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#6B8BA4]' : 'text-[#8CA8BF]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
