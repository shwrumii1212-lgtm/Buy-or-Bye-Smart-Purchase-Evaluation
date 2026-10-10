import React, { useState } from 'react';
import { X, Wallet, ShieldAlert, PiggyBank, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { FinancialProfile, Language } from '../types';
import { translations } from '../utils/translations';

interface FinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
  finance: FinancialProfile;
  language: Language;
  onSave: (updated: FinancialProfile) => void;
}

export const FinancialModal: React.FC<FinancialModalProps> = ({
  isOpen,
  onClose,
  finance,
  language,
  onSave,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState(finance.monthlyIncome);
  const [essentialExpenses, setEssentialExpenses] = useState(finance.essentialExpenses);
  const [lifestyleExpenses, setLifestyleExpenses] = useState(finance.lifestyleExpenses);
  const [debtInstallments, setDebtInstallments] = useState(finance.debtInstallments);
  const [savings, setSavings] = useState(finance.savings);
  const [emergencyFund, setEmergencyFund] = useState(finance.emergencyFund);
  const [emergencyTargetMonths, setEmergencyTargetMonths] = useState(finance.emergencyTargetMonths || 6);

  if (!isOpen) return null;
  const t = translations[language];

  // Calculated live metrics
  const totalCommitted = essentialExpenses + lifestyleExpenses + debtInstallments + savings;
  const discretionary = Math.max(0, monthlyIncome - totalCommitted);
  const dsr = monthlyIncome > 0 ? Number(((debtInstallments / monthlyIncome) * 100).toFixed(1)) : 0;
  const emergencyMonths = essentialExpenses > 0 ? Number((emergencyFund / essentialExpenses).toFixed(1)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      monthlyIncome,
      essentialExpenses,
      lifestyleExpenses,
      debtInstallments,
      savings,
      emergencyFund,
      emergencyTargetMonths,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24303E]/45 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2EAF0] my-8 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B8BA4] via-[#8CA8BF] to-[#B8D5E5] p-5 sm:p-6 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <Wallet className="w-3 h-3" />
              {t.financeTitle}
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold">{t.editFinanceBtn}</h2>
            <p className="text-xs text-white/85">
              {language === 'id' ? 'Kustomisasi data finansial riilmu untuk akurasi evaluasi belanja.' : 'Tune your real numbers for objective purchase evaluations.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Mini Preview Bar */}
        <div className="bg-[#F8F6F2] px-6 py-3 border-b border-[#E8EFF5] grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-[10px] text-[#718597] uppercase font-semibold">Uang Bebas</p>
            <p className={`font-bold ${discretionary > 0 ? 'text-[#6B8BA4]' : 'text-[#D8A4B8]'}`}>
              Rp {discretionary.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#718597] uppercase font-semibold">Beban Utang (DSR)</p>
            <p className={`font-bold ${dsr > 30 ? 'text-[#D8A4B8]' : 'text-[#9EAEA2]'}`}>
              {dsr}% {dsr > 30 ? '⚠️' : '✓'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#718597] uppercase font-semibold">Dana Darurat</p>
            <p className="font-bold text-[#6B8BA4]">
              {emergencyMonths} bln {emergencyMonths < 3 ? '⚠️' : '🛡️'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Income */}
          <div>
            <label className="block text-xs font-bold text-[#24303E] mb-1">
              {t.monthlyIncome}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#7A8C9E]">Rp</span>
              <input
                type="number"
                min="0"
                step="any"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                required
              />
            </div>
            <p className="text-[10px] text-[#7A8C9E] mt-0.5">Penghasilan bersih bulanan setelah pajak / potongan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Essential Expenses */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6B8BA4]" />
                {t.essentialExpenses}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#7A8C9E]">Rp</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={essentialExpenses}
                  onChange={(e) => setEssentialExpenses(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 text-xs font-medium rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E] mt-0.5">{t.essentialDesc}</p>
            </div>

            {/* Lifestyle Expenses */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D8A4B8]" />
                {t.lifestyleExpenses}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#7A8C9E]">Rp</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={lifestyleExpenses}
                  onChange={(e) => setLifestyleExpenses(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 text-xs font-medium rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E] mt-0.5">{t.lifestyleDesc}</p>
            </div>

            {/* Debt Installments */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9B8EA9]" />
                {t.debtInstallments}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#7A8C9E]">Rp</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={debtInstallments}
                  onChange={(e) => setDebtInstallments(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 text-xs font-medium rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E] mt-0.5">{t.debtDesc}</p>
            </div>

            {/* Routine Savings */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9EAEA2]" />
                {t.savingsRoutinary}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#7A8C9E]">Rp</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 text-xs font-medium rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E] mt-0.5">{t.savingsDesc}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F0F5F8] border border-[#D9E5EE] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#355268]">
              <ShieldAlert className="w-4 h-4 text-[#6B8BA4]" />
              <span>Benteng Keamanan (Dana Darurat)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#485C6E] mb-1">
                  {t.emergencyFund}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-[#7A8C9E]">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(Number(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CFDCE6] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#485C6E] mb-1">
                  {t.emergencyTarget} ({t.emergencyTargetMonths})
                </label>
                <select
                  value={emergencyTargetMonths}
                  onChange={(e) => setEmergencyTargetMonths(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#CFDCE6] bg-white"
                >
                  <option value={3}>3 Bulan (Minimal Single / Fresh Grad)</option>
                  <option value={6}>6 Bulan (Ideal Standar)</option>
                  <option value={12}>12 Bulan (Freelancer / Berkeluarga)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D5DFE7] text-[#55697A] hover:bg-[#F2F6F9]"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white shadow-xs"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
