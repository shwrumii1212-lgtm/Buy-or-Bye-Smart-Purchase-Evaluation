import React, { useState } from 'react';
import { 
  Wallet, 
  Edit3, 
  ShieldCheck, 
  TrendingDown, 
  CreditCard, 
  PiggyBank, 
  HeartHandshake, 
  AlertCircle, 
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  Download,
  FileText,
  BarChart3
} from 'lucide-react';
import { FinancialProfile, Language, ShoppingLogItem } from '../types';
import { translations } from '../utils/translations';
import { FinancialModal } from '../components/FinancialModal';
import { downloadMonthlyReportPdf } from '../utils/pdfGenerator';

interface FinancialDashboardViewProps {
  finance: FinancialProfile;
  language: Language;
  userName?: string;
  shoppingItems?: ShoppingLogItem[];
  onNavigate?: (view: string) => void;
  onUpdateFinance: (updated: FinancialProfile) => void;
}

export const FinancialDashboardView: React.FC<FinancialDashboardViewProps> = ({
  finance,
  language,
  userName = 'User',
  shoppingItems = [],
  onNavigate,
  onUpdateFinance,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloadingMonthly, setDownloadingMonthly] = useState(false);

  // Manual inline input states
  const [inlineIncome, setInlineIncome] = useState(finance.monthlyIncome);
  const [inlineEssentials, setInlineEssentials] = useState(finance.essentialExpenses);
  const [inlineLifestyle, setInlineLifestyle] = useState(finance.lifestyleExpenses);
  const [inlineDebts, setInlineDebts] = useState(finance.debtInstallments);
  const [inlineSavings, setInlineSavings] = useState(finance.savings);
  const [inlineEmergency, setInlineEmergency] = useState(finance.emergencyFund);
  const [inlineTargetMonths, setInlineTargetMonths] = useState(finance.emergencyTargetMonths || 6);

  const t = translations[language];

  // Calculated live metrics based on current inline inputs
  const currentIncome = inlineIncome || 1;
  const committedTotal = inlineEssentials + inlineLifestyle + inlineDebts + inlineSavings;
  const discretionaryCash = Math.max(0, currentIncome - committedTotal);
  const dsr = Number(((inlineDebts / currentIncome) * 100).toFixed(1));
  
  const monthlyEssentialBase = inlineEssentials > 0 ? inlineEssentials : currentIncome * 0.5;
  const emergencyMonthsCurrent = Number((inlineEmergency / monthlyEssentialBase).toFixed(1));
  const emergencyTargetAmount = monthlyEssentialBase * inlineTargetMonths;
  const emergencyProgressPercent = Math.min(100, Math.round((inlineEmergency / emergencyTargetAmount) * 100));

  // 50/30/20 proportions
  const needsPercent = Number(((inlineEssentials / currentIncome) * 100).toFixed(1));
  const wantsPercent = Number(((inlineLifestyle / currentIncome) * 100).toFixed(1));
  const savingsDebtPercent = Number((((inlineSavings + inlineDebts) / currentIncome) * 100).toFixed(1));

  // Overall financial health score (0 - 100)
  let healthScore = 70;
  if (dsr <= 20) healthScore += 10;
  else if (dsr > 30) healthScore -= 20;

  if (emergencyMonthsCurrent >= 6) healthScore += 15;
  else if (emergencyMonthsCurrent >= 3) healthScore += 8;
  else healthScore -= 20;

  if (discretionaryCash > currentIncome * 0.1) healthScore += 5;
  healthScore = Math.max(10, Math.min(100, healthScore));

  const healthStatusText = healthScore >= 80 
    ? t.healthStatusGood 
    : healthScore >= 55 
    ? t.healthStatusCaution 
    : t.healthStatusDanger;

  // Direct manual save handler
  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FinancialProfile = {
      monthlyIncome: inlineIncome,
      essentialExpenses: inlineEssentials,
      lifestyleExpenses: inlineLifestyle,
      debtInstallments: inlineDebts,
      savings: inlineSavings,
      emergencyFund: inlineEmergency,
      emergencyTargetMonths: inlineTargetMonths,
      lastUpdated: new Date().toISOString()
    };
    onUpdateFinance(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadMonthlyPdf = () => {
    setDownloadingMonthly(true);
    try {
      downloadMonthlyReportPdf(
        {
          monthlyIncome: inlineIncome,
          essentialExpenses: inlineEssentials,
          lifestyleExpenses: inlineLifestyle,
          debtInstallments: inlineDebts,
          savings: inlineSavings,
          emergencyFund: inlineEmergency,
          emergencyTargetMonths: inlineTargetMonths,
          lastUpdated: new Date().toISOString()
        },
        shoppingItems,
        userName,
        language
      );
    } finally {
      setTimeout(() => setDownloadingMonthly(false), 600);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back to Home Button */}
      {onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D5DFE7] bg-white hover:bg-[#F8F6F2] text-xs font-semibold text-[#506272] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#6B8BA4]" />
          <span>{language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}</span>
        </button>
      )}

      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80] mb-2">
            <Wallet className="w-3.5 h-3.5 text-[#6B8BA4]" />
            <span>Pondasi Finansial Pengguna</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E]">
            {t.financeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6F80] mt-1 max-w-xl">
            {t.financeSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onNavigate && (
            <button
              onClick={() => onNavigate('monthly-report')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{language === 'id' ? 'Dashboard Laporan Bulanan' : 'Monthly Report Dashboard'}</span>
            </button>
          )}

          <button
            onClick={handleDownloadMonthlyPdf}
            disabled={downloadingMonthly}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5DFE7] bg-[#F8F6F2] hover:bg-[#EFECE6] text-[#334657] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Unduh laporan keuangan dan performa belanja bulanan dalam format PDF"
          >
            <Download className="w-4 h-4 text-[#6B8BA4]" />
            <span>{downloadingMonthly ? 'Mencetak PDF...' : (language === 'id' ? 'Unduh Laporan Bulanan (PDF)' : 'Download Monthly Report (PDF)')}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5DFE7] bg-white hover:bg-[#F8F6F2] text-[#334657] text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#6B8BA4]" />
            <span>Buka Dialog</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Income Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#6B8BA4] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C9E]">Penghasilan Bulanan</span>
            <div className="w-8 h-8 rounded-lg bg-[#E2EAF0] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#6B8BA4]" />
            </div>
          </div>
          <p className="text-2xl font-heading font-black text-[#24303E]">
            Rp {inlineIncome.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-[#7A8C9E] mt-1">Take Home Pay bersih per bulan</p>
        </div>

        {/* Discretionary Free Cash */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#6B8BA4] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C9E]">{t.discretionaryIncome}</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF0EB] flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#7E9383]" />
            </div>
          </div>
          <p className="text-2xl font-heading font-black text-[#24303E]">
            Rp {discretionaryCash.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-[#7E9383] font-medium mt-1">
            Uang bebas untuk evaluasi belanja
          </p>
        </div>

        {/* Debt Service Ratio (DSR) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#6B8BA4] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C9E]">{t.debtToIncomeRatio}</span>
            <div className="w-8 h-8 rounded-lg bg-[#F5EBEF] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#D8A4B8]" />
            </div>
          </div>
          <p className="text-2xl font-heading font-black text-[#24303E]">
            {dsr}%
          </p>
          <p className="text-[11px] text-[#7A8C9E] mt-1">
            {dsr <= 30 ? 'Aman (Maks 30%) ✓' : 'Peringatan: Melebihi 30% ⚠️'}
          </p>
        </div>

        {/* Emergency Runway */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#6B8BA4] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C9E]">{t.emergencyFundProgress}</span>
            <div className="w-8 h-8 rounded-lg bg-[#EDE8F2] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#9B8EA9]" />
            </div>
          </div>
          <p className="text-2xl font-heading font-black text-[#24303E]">
            {emergencyMonthsCurrent} <span className="text-sm font-normal text-[#7A8C9E]">Bulan</span>
          </p>
          <p className="text-[11px] text-[#9B8EA9] font-medium mt-1">
            Target aman: {inlineTargetMonths} bulan pengeluaran
          </p>
        </div>

      </div>

      {/* DIRECT INLINE MANUAL FINANCIAL INPUT SECTION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEF3F7]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold">
                <Edit3 className="w-4 h-4" />
              </div>
              <h2 className="font-heading text-lg font-bold text-[#24303E]">
                Input & Perbarui Data Keuangan Manual
              </h2>
            </div>
            <p className="text-xs text-[#5C6F80] mt-1">
              Ubah angka-angka di bawah ini secara manual kapan saja. Hasil perhitungan akan langsung menyesuaikan secara real-time.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF0EB] text-[#47634F] text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Data Keuangan Berhasil Disimpan!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveInline} className="space-y-6">
          
          {/* Income field */}
          <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#24303E]">
                {t.monthlyIncome} (Take Home Pay) *
              </label>
              <span className="text-xs font-extrabold text-[#6B8BA4]">
                Rp {inlineIncome.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#7A8C9E]">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={inlineIncome ? inlineIncome.toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setInlineIncome(raw ? parseInt(raw, 10) : 0);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                required
              />
            </div>
            <p className="text-[11px] text-[#7A8C9E] mt-1">Total gaji bersih, honor, atau pemasukan bulanan rutin.</p>
          </div>

          {/* 4 Expense Buckets Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pos 1: Kebutuhan Pokok */}
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6B8BA4]" />
                  {t.essentialExpenses}
                </label>
                <span className="text-[11px] font-bold text-[#6B8BA4]">
                  Rp {inlineEssentials.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-[#7A8C9E]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inlineEssentials ? inlineEssentials.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setInlineEssentials(raw ? parseInt(raw, 10) : 0);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-lg border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E]">{t.essentialDesc}</p>
            </div>

            {/* Pos 2: Lifestyle / Wants */}
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D8A4B8]" />
                  {t.lifestyleExpenses}
                </label>
                <span className="text-[11px] font-bold text-[#D8A4B8]">
                  Rp {inlineLifestyle.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-[#7A8C9E]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inlineLifestyle ? inlineLifestyle.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setInlineLifestyle(raw ? parseInt(raw, 10) : 0);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-lg border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E]">{t.lifestyleDesc}</p>
            </div>

            {/* Pos 3: Cicilan & Kewajiban */}
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9B8EA9]" />
                  {t.debtInstallments}
                </label>
                <span className="text-[11px] font-bold text-[#9B8EA9]">
                  Rp {inlineDebts.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-[#7A8C9E]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inlineDebts ? inlineDebts.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setInlineDebts(raw ? parseInt(raw, 10) : 0);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-lg border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E]">{t.debtDesc}</p>
            </div>

            {/* Pos 4: Tabungan Rutin */}
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9EAEA2]" />
                  {t.savingsRoutinary}
                </label>
                <span className="text-[11px] font-bold text-[#7E9383]">
                  Rp {inlineSavings.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-[#7A8C9E]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inlineSavings ? inlineSavings.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setInlineSavings(raw ? parseInt(raw, 10) : 0);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-lg border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
              </div>
              <p className="text-[10px] text-[#7A8C9E]">{t.savingsDesc}</p>
            </div>

          </div>

          {/* Dana Darurat & Target */}
          <div className="p-5 rounded-2xl bg-[#F0F5F8] border border-[#D9E5EE] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#355268]">
              <ShieldCheck className="w-4 h-4 text-[#6B8BA4]" />
              <span>Benteng Keamanan & Saldo Dana Darurat</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#485C6E] mb-1">
                  {t.emergencyFund} (Saldo Saat Ini)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#7A8C9E]">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inlineEmergency ? inlineEmergency.toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setInlineEmergency(raw ? parseInt(raw, 10) : 0);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-lg border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#485C6E] mb-1">
                  Target Dana Darurat ({t.emergencyTargetMonths})
                </label>
                <select
                  value={inlineTargetMonths}
                  onChange={(e) => setInlineTargetMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-[#CFDCE6] bg-white focus:ring-2 focus:ring-[#6B8BA4]/30"
                >
                  <option value={3}>3 Bulan Pengeluaran (Minimal Lajang / First Jobber)</option>
                  <option value={6}>6 Bulan Pengeluaran (Standar Nyaman)</option>
                  <option value={12}>12 Bulan Pengeluaran (Freelancer / Berkeluarga)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Data Keuangan</span>
            </button>
          </div>
        </form>
      </section>

      {/* 50/30/20 Rule Comparison Visual Meter */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#24303E]">
              {t.budgetRuleComparison}
            </h2>
            <p className="text-xs text-[#5C6F80]">
              Perbandingan distribusi pengeluaranmu terhadap pedoman baku 50% Needs, 30% Wants, 20% Savings & Debt.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDE4EB] text-xs font-bold text-[#3E5568]">
            Status: {healthStatusText}
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#E5ECF2] rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${Math.min(100, needsPercent)}%` }}
              className="bg-[#6B8BA4] transition-all"
              title={`Kebutuhan: ${needsPercent}%`}
            />
            <div 
              style={{ width: `${Math.min(100, wantsPercent)}%` }}
              className="bg-[#D8A4B8] transition-all"
              title={`Gaya Hidup: ${wantsPercent}%`}
            />
            <div 
              style={{ width: `${Math.min(100, savingsDebtPercent)}%` }}
              className="bg-[#9EAEA2] transition-all"
              title={`Tabungan & Utang: ${savingsDebtPercent}%`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs pt-1 text-[#506272]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B8BA4]" />
              <span>Kebutuhan: <strong>{needsPercent}%</strong> (Ideal: ≤50%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8A4B8]" />
              <span>Gaya Hidup: <strong>{wantsPercent}%</strong> (Ideal: ≤30%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9EAEA2]" />
              <span>Tabungan & Cicilan: <strong>{savingsDebtPercent}%</strong> (Ideal: ≥20%)</span>
            </div>
          </div>
        </div>

        {/* Emergency Fund Progress Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#24303E]">Target Kesiapan Dana Darurat ({inlineTargetMonths} Bulan)</span>
            <span className="font-extrabold text-[#6B8BA4]">
              Rp {inlineEmergency.toLocaleString('id-ID')} / Rp {emergencyTargetAmount.toLocaleString('id-ID')} ({emergencyProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#EAEFF4] h-2.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${emergencyProgressPercent}%` }}
              className="bg-[#9EAEA2] h-full rounded-full transition-all"
            />
          </div>
          <p className="text-[11px] text-[#7A8C9E]">
            {inlineEmergency >= emergencyTargetAmount 
              ? 'Selamat! Target dana daruratmu sudah tercapai 100%.' 
              : `Masih membutuhkan Rp ${Math.max(0, emergencyTargetAmount - inlineEmergency).toLocaleString('id-ID')} untuk mencapai benteng keamanan ideal.`}
          </p>
        </div>
      </section>

      {/* Monthly Report Summary Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#24303E]">
                {language === 'id' ? 'Laporan & Ringkasan Performa Bulanan' : 'Monthly Financial & Decision Report'}
              </h2>
              <p className="text-xs text-[#5C6F80]">
                {language === 'id' 
                  ? 'Kompilasi menyeluruh antara arus kas dan riwayat keputusan belanja bulan berjalan.' 
                  : 'Comprehensive synthesis between your cash flow and current month shopping decisions.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {onNavigate && (
              <button
                onClick={() => onNavigate('monthly-report')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{language === 'id' ? 'Buka Dashboard Laporan' : 'Open Report Dashboard'}</span>
              </button>
            )}

            <button
              onClick={handleDownloadMonthlyPdf}
              disabled={downloadingMonthly}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5DFE7] bg-[#F8F6F2] hover:bg-[#EFECE6] text-[#334657] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#6B8BA4]" />
              <span>{downloadingMonthly ? 'Mencetak PDF...' : (language === 'id' ? 'Unduh PDF' : 'Download PDF')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C9E]">Total Uang Bebas Tersisa</p>
            <p className="text-xl font-heading font-extrabold text-[#24303E] mt-1">
              Rp {discretionaryCash.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-[#7E9383] mt-0.5">Setelah kebutuhan pokok, cicilan, dan tabungan</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C9E]">Uang Terselamatkan dari BYE</p>
            <p className="text-xl font-heading font-extrabold text-[#7E9383] mt-1">
              Rp {shoppingItems.filter(i => i.status === 'saved_bye').reduce((acc, c) => acc + (c.savedAmount || c.price), 0).toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-[#7A8C9E] mt-0.5">Terlindungi dari belanja impulsif bulan ini</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C9E]">Total Belanja Disetujui</p>
            <p className="text-xl font-heading font-extrabold text-[#D8A4B8] mt-1">
              Rp {shoppingItems.filter(i => i.status === 'bought').reduce((acc, c) => acc + c.price, 0).toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-[#7A8C9E] mt-0.5">Sesuai pertimbangan rule-based yang aman</p>
          </div>
        </div>
      </section>

      {/* Edit modal */}
      <FinancialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        finance={finance}
        language={language}
        onSave={(updated) => {
          setInlineIncome(updated.monthlyIncome);
          setInlineEssentials(updated.essentialExpenses);
          setInlineLifestyle(updated.lifestyleExpenses);
          setInlineDebts(updated.debtInstallments);
          setInlineSavings(updated.savings);
          setInlineEmergency(updated.emergencyFund);
          setInlineTargetMonths(updated.emergencyTargetMonths);
          onUpdateFinance(updated);
        }}
      />
    </div>
  );
};
