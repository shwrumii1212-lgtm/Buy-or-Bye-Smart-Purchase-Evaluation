import React from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Flame, 
  FileText, 
  Scale, 
  CheckCircle2, 
  TrendingUp,
  Brain,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Language, FinancialProfile } from '../types';
import { translations } from '../utils/translations';

interface HomeViewProps {
  language: Language;
  onNavigate: (view: string) => void;
  finance: FinancialProfile | null;
  savedMoneyTotal: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onNavigate,
  finance,
  savedMoneyTotal,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E2EAF0] via-[#EFECE6] to-[#F5EBEF] border border-[#DCE4EC] p-6 sm:p-12 lg:p-16">
        
        {/* Soft background decor orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#B8D5E5]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#D8A4B8]/30 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#CBD7E2] text-xs font-semibold text-[#527189] mb-5 shadow-xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#9EAEA2] animate-pulse" />
            <span>{t.heroBadge}</span>
            <span className="text-[#A4B5C4]">·</span>
            <span className="text-[#847594]">Gen Z Mindful Spending</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#24303E] leading-[1.15]">
            {t.heroTitle}
            <span className="block mt-1 bg-gradient-to-r from-[#6B8BA4] via-[#9B8EA9] to-[#D8A4B8] bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#55697A] leading-relaxed max-w-2xl font-normal">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate('evaluate')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.heroCtaEvaluate}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('finance')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F8F6F2] text-[#334657] border border-[#CBD7E2] font-semibold text-sm transition-all shadow-xs hover:border-[#6B8BA4] cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-[#6B8BA4]" />
              <span>{t.heroCtaFinance}</span>
            </button>

            <button
              onClick={() => onNavigate('monthly-report')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F8F6F2] text-[#334657] border border-[#CBD7E2] font-semibold text-sm transition-all shadow-xs hover:border-[#6B8BA4] cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Laporan Bulanan' : 'Monthly Report'}</span>
            </button>
          </div>

          {/* User Financial Snapshot Badge if exists */}
          {finance && (
            <div className="mt-8 pt-6 border-t border-[#D5DFE7]/70 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-[#506272]">
              <div>
                <span className="text-[11px] text-[#7A8C9E] block">Pemasukan Bulanan</span>
                <span className="font-bold text-[#24303E] text-sm">
                  Rp {finance.monthlyIncome.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="hidden sm:block w-px h-7 bg-[#D5DFE7]" />
              <div>
                <span className="text-[11px] text-[#7A8C9E] block">Dana Darurat Terkumpul</span>
                <span className="font-bold text-[#47634F] text-sm">
                  Rp {finance.emergencyFund.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="hidden sm:block w-px h-7 bg-[#D5DFE7]" />
              <div>
                <span className="text-[11px] text-[#7A8C9E] block">Sisa Uang Bebas</span>
                <span className="font-bold text-[#6B8BA4] text-sm">
                  Rp {Math.max(0, finance.monthlyIncome - (finance.essentialExpenses + finance.lifestyleExpenses + finance.debtInstallments + finance.savings)).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Counter & Metrics Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EAF0EB] text-[#7E9383] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-[#7A8C9E]">{t.quickStatsSaved}</p>
            <p className="text-2xl font-heading font-extrabold text-[#24303E] mt-0.5">
              Rp {savedMoneyTotal > 0 ? savedMoneyTotal.toLocaleString('id-ID') : '1.230.000'}
            </p>
            <p className="text-[11px] text-[#7E9383] font-medium mt-0.5">Terlindungi dari keputusan impulsif</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-[#7A8C9E]">{t.quickStatsDecisions}</p>
            <p className="text-2xl font-heading font-extrabold text-[#24303E] mt-0.5">100% Rule-Based</p>
            <p className="text-[11px] text-[#6B8BA4] font-medium mt-0.5">Tanpa tebakan acak, murni kalkulasi objektif</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBEF] text-[#D8A4B8] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-[#7A8C9E]">Dopamine Delay</p>
            <p className="text-2xl font-heading font-extrabold text-[#24303E] mt-0.5">24 - 48 Jam</p>
            <p className="text-[11px] text-[#C487A0] font-medium mt-0.5">Metode efektif redam nafsu checkout promo</p>
          </div>
        </div>

      </section>

      {/* 3 Step Process */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E]">
            {t.howItWorksTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6F80] mt-2">
            {t.howItWorksDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs hover:border-[#6B8BA4]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] font-heading font-extrabold flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="font-heading text-base font-bold text-[#24303E]">{t.step1Title}</h3>
            <p className="text-xs text-[#55697A] mt-2 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs hover:border-[#6B8BA4]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EDE8F2] text-[#9B8EA9] font-heading font-extrabold flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="font-heading text-base font-bold text-[#24303E]">{t.step2Title}</h3>
            <p className="text-xs text-[#55697A] mt-2 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs hover:border-[#6B8BA4]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0EB] text-[#7E9383] font-heading font-extrabold flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="font-heading text-base font-bold text-[#24303E]">{t.step3Title}</h3>
            <p className="text-xs text-[#55697A] mt-2 leading-relaxed">{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Why Choose Buy or Bye */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#F8F6F2] border border-[#E2EAF0]">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B8BA4]">Value Proposition</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E] mt-1">
            {t.whyChooseTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E5ECF2]">
            <div className="w-9 h-9 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center mb-3">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#24303E]">{t.whyCard1Title}</h3>
            <p className="text-xs text-[#5C6F80] mt-1.5 leading-relaxed">{t.whyCard1Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5ECF2]">
            <div className="w-9 h-9 rounded-xl bg-[#EDE8F2] text-[#9B8EA9] flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#24303E]">{t.whyCard2Title}</h3>
            <p className="text-xs text-[#5C6F80] mt-1.5 leading-relaxed">{t.whyCard2Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5ECF2]">
            <div className="w-9 h-9 rounded-xl bg-[#F5EBEF] text-[#D8A4B8] flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#24303E]">{t.whyCard3Title}</h3>
            <p className="text-xs text-[#5C6F80] mt-1.5 leading-relaxed">{t.whyCard3Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5ECF2]">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0EB] text-[#7E9383] flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#24303E]">{t.whyCard4Title}</h3>
            <p className="text-xs text-[#5C6F80] mt-1.5 leading-relaxed">{t.whyCard4Desc}</p>
          </div>
        </div>
      </section>

      {/* Impulse Sanity Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6B8BA4] to-[#8CA8BF] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Belanja Bukan Pelarian Emosi</span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold">
            Punya Keranjang Belanja yang Menunggu di-Checkout?
          </h3>
          <p className="text-xs sm:text-sm text-white/85 max-w-xl">
            Luangkan 60 detik untuk menguji kelayakannya sekarang sebelum uangmu keluar sia-sia.
          </p>
        </div>
        <button
          onClick={() => onNavigate('evaluate')}
          className="shrink-0 px-6 py-3 rounded-xl bg-white text-[#24303E] font-bold text-xs hover:bg-[#F8F6F2] transition-colors shadow-sm cursor-pointer"
        >
          Tes Kelayakan Sekarang →
        </button>
      </section>

    </div>
  );
};
