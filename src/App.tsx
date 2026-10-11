import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { FinancialDashboardView } from './views/FinancialDashboardView';
import { EvaluationView } from './views/EvaluationView';
import { ShoppingLogView } from './views/ShoppingLogView';
import { EducationDashboardView } from './views/EducationDashboardView';
import { AboutUsView } from './views/AboutUsView';
import { MonthlyReportDashboardView } from './views/MonthlyReportDashboardView';
import { 
  Language, 
  User, 
  FinancialProfile, 
  EvaluationItem, 
  ShoppingLogItem 
} from './types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getUserFinance, 
  saveUserFinance, 
  getUserEvaluations, 
  saveUserEvaluation, 
  getUserShoppingLog, 
  saveUserShoppingLog, 
  deleteShoppingLogItem,
  GUEST_USER,
  resetGuestSession,
  getUsers,
  saveUser 
} from './utils/storage';
import { translations } from './utils/translations';
import { 
  ShoppingBag, 
  Sparkles, 
  Lock, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('id');
  const [currentView, setCurrentView] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [finance, setFinance] = useState<FinancialProfile | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [shoppingLog, setShoppingLog] = useState<ShoppingLogItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[language];

  // Helper toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initialize user from storage on mount
  useEffect(() => {
    const existing = getCurrentUser();
    if (existing) {
      setUser(existing);
      loadUserData(existing.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const userFin = getUserFinance(userId);
    setFinance(userFin);
    const userEvals = getUserEvaluations(userId);
    setEvaluations(userEvals);
    const userLogs = getUserShoppingLog(userId);
    setShoppingLog(userLogs);
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    loadUserData(loggedUser.id);
    showToast(t.authSuccessLogin);
  };

  const handleLogout = () => {
    resetGuestSession();
    setCurrentUser(null);
    setUser(null);
    setFinance(null);
    setEvaluations([]);
    setShoppingLog([]);
    showToast(language === 'id' ? 'Berhasil keluar.' : 'Logged out.');
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'id' ? 'en' : 'id'));
  };

  const handleUpdateFinance = (updated: FinancialProfile) => {
    if (!user) return;
    setFinance(updated);
    saveUserFinance(user.id, updated);
    showToast(t.updateFinanceSuccess);
  };

  const handleSaveEvaluation = (evalItem: EvaluationItem) => {
    if (!user) return;
    saveUserEvaluation(user.id, evalItem);
    setEvaluations(prev => [evalItem, ...prev]);
  };

  const handleSaveToHistory = (
    evalItem: EvaluationItem, 
    status: 'bought' | 'saved_bye' | 'cooling_down'
  ) => {
    if (!user) return;

    // Guard against accidental double clicks: update if same evaluationId already exists in recent history
    setShoppingLog(prev => {
      const existingIndex = prev.findIndex(item => item.evaluationId && item.evaluationId === evalItem.id);
      
      const newLog: ShoppingLogItem = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `log_${Date.now()}`,
        userId: user.id,
        evaluationId: evalItem.id,
        productName: evalItem.productName,
        category: evalItem.category,
        price: evalItem.price,
        status,
        date: existingIndex >= 0 ? prev[existingIndex].date : new Date().toISOString(),
        paymentMethod: evalItem.paymentMethod,
        savedAmount: status === 'saved_bye' ? evalItem.price : 0,
        notes: evalItem.reasons[0] || 'Tersimpan dari evaluasi Buy or Bye.'
      };

      saveUserShoppingLog(user.id, newLog);

      if (existingIndex >= 0) {
        // Update in-place so one evaluation action strictly yields one history entry
        const updated = [...prev];
        updated[existingIndex] = newLog;
        return updated;
      }
      return [newLog, ...prev];
    });
  };

  const handleAddManualShoppingItem = (item: ShoppingLogItem) => {
    if (!user) return;
    saveUserShoppingLog(user.id, item);
    setShoppingLog(prev => [item, ...prev]);
    showToast(language === 'id' ? 'Transaksi manual berhasil dicatat!' : 'Manual transaction logged!');
  };

  const handleDeleteShoppingLogItem = (id: string) => {
    if (!user) return;
    deleteShoppingLogItem(user.id, id);
    setShoppingLog(prev => prev.filter(i => i.id !== id));
    showToast(language === 'id' ? 'Catatan berhasil dihapus.' : 'Record deleted.');
  };

  // Total saved calculation for Home
  const totalSavedMoney = shoppingLog
    .filter(i => i.status === 'saved_bye')
    .reduce((acc, curr) => acc + (curr.savedAmount || curr.price), 0);

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#24303E] flex flex-col font-sans selection:bg-[#B8D5E5] selection:text-[#1A2530]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#24303E] text-white text-xs font-semibold shadow-xl border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#9EAEA2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        user={user}
        finance={finance}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 lg:pb-12">
        
        {/* If user is NOT logged in: Requirement says user must login or register before entering Home */}
        {!user ? (
          <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6B8BA4] via-[#8CA8BF] to-[#B8D5E5] flex items-center justify-center text-white mx-auto shadow-md">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80]">
                <Lock className="w-3.5 h-3.5 text-[#6B8BA4]" />
                Autentikasi Diperlukan
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E]">
                Selamat Datang di <span className="text-[#16A34A]">Buy</span> <span className="text-black font-semibold">or</span> <span className="text-[#EC4899]">Bye</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5C6F80] max-w-md mx-auto leading-relaxed">
                Silakan masuk atau buat akun terlebih dahulu untuk mengakses dashboard keuangan, evaluasi belanja, dan riwayat keputusanmu.
              </p>
            </div>

            {/* Quick Guest Access and Auth Triggers */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => {
                  handleAuthSuccess(GUEST_USER);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'id' ? 'Masuk sebagai Guest (Coba Fitur Tanpa Registrasi)' : 'Continue as Guest (Try Features Without Sign-Up)'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#D5DFE7] hover:bg-[#F8F6F2] text-[#24303E] font-semibold text-xs transition-colors cursor-pointer"
                >
                  {t.login} / {t.register}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EEF3F7] text-[11px] text-[#7A8C9E] flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9EAEA2]" />
              <span>Data tersimpan aman & terpisah di browser Anda.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Authenticated View Routing */}
            {currentView === 'home' && (
              <HomeView
                language={language}
                onNavigate={setCurrentView}
                finance={finance}
                savedMoneyTotal={totalSavedMoney}
              />
            )}

            {currentView === 'evaluate' && finance && (
              <EvaluationView
                userId={user.id}
                userName={user.name}
                finance={finance}
                language={language}
                onNavigate={setCurrentView}
                onSaveEvaluation={handleSaveEvaluation}
                onSaveToHistory={handleSaveToHistory}
              />
            )}

            {currentView === 'finance' && finance && (
              <FinancialDashboardView
                finance={finance}
                language={language}
                userName={user.name}
                shoppingItems={shoppingLog}
                onNavigate={setCurrentView}
                onUpdateFinance={handleUpdateFinance}
              />
            )}

            {currentView === 'history' && (
              <ShoppingLogView
                userId={user.id}
                userName={user.name}
                items={shoppingLog}
                language={language}
                onNavigate={setCurrentView}
                onAddItem={handleAddManualShoppingItem}
                onDeleteItem={handleDeleteShoppingLogItem}
              />
            )}

            {(currentView === 'monthly-report' || currentView === 'report') && finance && (
              <MonthlyReportDashboardView
                finance={finance}
                shoppingItems={shoppingLog}
                userName={user.name}
                language={language}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'education' && (
              <EducationDashboardView
                language={language}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'about' && (
              <AboutUsView
                language={language}
                onNavigate={setCurrentView}
              />
            )}
          </>
        )}

      </main>

      {/* Global Footer */}
      <Footer
        language={language}
        onNavigate={setCurrentView}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Mobile Bottom Navigation Bar (Phone-Optimized) */}
      {user && (
        <MobileBottomNav
          currentView={currentView}
          onNavigate={setCurrentView}
          language={language}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
