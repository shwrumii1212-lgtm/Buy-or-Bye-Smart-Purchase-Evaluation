import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';
import { DEMO_USER, getUsers, saveUser, setCurrentUser } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
  const t = translations[language];

  const handleUseDemo = () => {
    setLoading(true);
    setTimeout(() => {
      saveUser(DEMO_USER);
      setCurrentUser(DEMO_USER);
      onAuthSuccess(DEMO_USER);
      setLoading(false);
      onClose();
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t.authErrorEmail);
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError(language === 'id' ? 'Nama lengkap wajib diisi.' : 'Full name is required.');
        return;
      }
      if (password !== confirmPassword) {
        setError(t.authErrorPasswordMatch);
        return;
      }
      if (password.length < 6) {
        setError(language === 'id' ? 'Kata sandi minimal 6 karakter.' : 'Password must be at least 6 characters.');
        return;
      }
      if (!agreeTerms) {
        setError(language === 'id' ? 'Harap setujui prinsip evaluasi.' : 'Please accept the principles.');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
        };
        saveUser(newUser);
        setCurrentUser(newUser);
        onAuthSuccess(newUser);
        setLoading(false);
        onClose();
      }, 400);
    } else {
      // Login
      setLoading(true);
      setTimeout(() => {
        const users = getUsers();
        const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        
        if (found) {
          setCurrentUser(found);
          onAuthSuccess(found);
          setLoading(false);
          onClose();
        } else {
          // If not registered yet, create seamless account for good UX or prompt
          const newUser: User = {
            id: `usr_${Date.now()}`,
            name: email.split('@')[0],
            email: email.trim().toLowerCase(),
            createdAt: new Date().toISOString()
          };
          saveUser(newUser);
          setCurrentUser(newUser);
          onAuthSuccess(newUser);
          setLoading(false);
          onClose();
        }
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24303E]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2EAF0] overflow-hidden">
        
        {/* Header styling */}
        <div className="bg-gradient-to-r from-[#6B8BA4] via-[#8CA8BF] to-[#B8D5E5] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            Buy or Bye Account
          </div>
          <h2 className="font-heading text-xl font-bold">
            {isRegister ? t.registerTitle : t.loginTitle}
          </h2>
          <p className="text-xs text-white/85 mt-1">
            {isRegister ? t.registerSubtitle : t.loginSubtitle}
          </p>
        </div>

        {/* Quick Demo Fill button */}
        <div className="px-6 pt-5 pb-1">
          <button
            type="button"
            onClick={handleUseDemo}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#DDE4EB] transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6B8BA4]/15 flex items-center justify-center text-[#6B8BA4]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#24303E]">{t.demoAccount}</p>
                <p className="text-[11px] text-[#718597]">Alya Putri (First Jobber · Data Lengkap)</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6B8BA4] transition-transform group-hover:translate-x-1" />
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8EFF5]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-[#8A9BA8] font-medium">
                {language === 'id' ? 'atau isi formulir' : 'or enter credentials'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-[#FFF2F5] border border-[#F4C8D6] text-[11px] text-[#A8486A]">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-[#485C6E] uppercase mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8CA8BF] absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alya Putri"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CFDCE6] focus:outline-hidden focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] bg-[#FBFBFA]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#485C6E] uppercase mb-1">
              {t.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8CA8BF] absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CFDCE6] focus:outline-hidden focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] bg-[#FBFBFA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#485C6E] uppercase mb-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8CA8BF] absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CFDCE6] focus:outline-hidden focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] bg-[#FBFBFA]"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-[#485C6E] uppercase mb-1">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8CA8BF] absolute left-3 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CFDCE6] focus:outline-hidden focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] bg-[#FBFBFA]"
                />
              </div>
            </div>
          )}

          {isRegister && (
            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#6B8BA4] focus:ring-[#6B8BA4]"
              />
              <span className="text-[11px] text-[#637688]">
                {t.termsAgreement}
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? '...' : (isRegister ? t.register : t.login)}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-[#6B8BA4] hover:underline font-medium"
            >
              {isRegister ? t.alreadyHaveAccount : t.needAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
