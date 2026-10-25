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

          <h1 className="font-berkshire text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#24303E] leading-[1.15]">
            {t.heroTitle}
            <span className="block mt-2 tracking-wide">
              <span className="text-[#16A34A]">Buy</span> <span className="text-[#24303E] font-normal text-3xl sm:text-5xl lg:text-6xl mx-1.5">or</span> <span className="text-[#EC4899]">Bye?</span>
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#55697A] leading-relaxed max-w-2xl font-normal">
            {t.heroSubtitle}
          </p>

          {/* Notice to setup financial profile first if not set */}
          {(!finance || finance.monthlyIncome <= 0) && (
            <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-[#DCE4EC] shadow-xs flex items-start gap-3 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center shrink-0 mt-0.5">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-[#24303E]">
                  {language === 'id' ? 'Langkah 1 Wajib: Atur Profil Keuangan Dahulu' : 'Step 1 Required: Set Up Financial Profile First'}
                </p>
                <p className="text-[#55697A] leading-relaxed">
                  {language === 'id' 
                    ? 'Mesin evaluasi kami membutuhkan data pemasukan & pengeluaranmu. Jika belum diisi, sisa uang bebas terdeteksi Rp 0 sehingga barang sewajar apapun otomatis akan dinilai "BYE".'
                    : 'Our evaluation engine requires your income & expense foundation. Without this, your free cash is detected as $0 and every item automatically scores as "BYE".'}
                </p>
              </div>
            </div>
          )}

          {/* Action CTAs: Highlighting Atur Profil Keuangan first, all sharing identical font-heading typography */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            {/* Primary Highlighted Button: Atur Profil Keuangan */}
            <button
              onClick={() => onNavigate('finance')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-heading font-extrabold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ring-2 ring-[#6B8BA4]/30"
            >
              <Wallet className="w-4 h-4" />
              <span>{t.heroCtaFinance}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white ml-0.5">
                {language === 'id' ? 'Langkah 1' : 'Step 1'}
              </span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Secondary Button: Mulai Evaluasi Barang */}
            <button
              onClick={() => onNavigate('evaluate')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border font-heading font-extrabold text-sm transition-all shadow-xs cursor-pointer ${
                finance && finance.monthlyIncome > 0
                  ? 'bg-white hover:bg-[#F8F6F2] text-[#24303E] border-[#CBD7E2] hover:border-[#6B8BA4]'
                  : 'bg-white/70 hover:bg-white text-[#506272] border-[#D5DFE7]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#6B8BA4]" />
              <span>{t.heroCtaEvaluate}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E2EAF0] text-[#527189] ml-0.5">
                {language === 'id' ? 'Langkah 2' : 'Step 2'}
              </span>
            </button>

            {/* Tertiary Button: Laporan Bulanan */}
            <button
              onClick={() => onNavigate('monthly-report')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F8F6F2] text-[#334657] border border-[#CBD7E2] font-heading font-extrabold text-sm transition-all shadow-xs hover:border-[#6B8BA4] cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Laporan Bulanan' : 'Monthly Report'}</span>
            </button>
          </div>

          {/* User Financial Snapshot Badge: only display when user has filled financial data */}
          {finance && finance.monthlyIncome > 0 && (
            <div className="mt-8 pt-6 border-t border-[#D5DFE7]/70 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-[#506272]">
              <div>
                <span className="text-[11px] text-[#7A8C9E] block">
                  {language === 'id' ? 'Pemasukan Bulanan' : 'Monthly Income'}
                </span>
                <span className="font-bold text-[#24303E] text-sm">
                  {finance.monthlyIncome > 0 ? `Rp ${finance.monthlyIncome.toLocaleString('id-ID')}` : '-'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-7 bg-[#D5DFE7]" />
              <div>
                <span className="text-[11px] text-[#7A8C9E] block">
                  {language === 'id' ? 'Dana Darurat Terkumpul' : 'Emergency Fund'}
                </span>
                <span className="font-bold text-[#47634F] text-sm">
                  {finance.emergencyFund > 0 ? `Rp ${finance.emergencyFund.toLocaleString('id-ID')}` : '-'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-7 bg-[#D5DFE7]" />
              <div>
                <span className="text-[11px] text-[#7A8C9E] block">
                  {language === 'id' ? 'Sisa Uang Bebas' : 'Free Cash'}
                </span>
                <span className="font-bold text-[#6B8BA4] text-sm">
                  {finance.monthlyIncome > 0 
                    ? `Rp ${Math.max(0, finance.monthlyIncome - (finance.essentialExpenses + finance.lifestyleExpenses + finance.debtInstallments + finance.savings)).toLocaleString('id-ID')}` 
                    : '-'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Motivation Quote Section (Inspired by Design Reference) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm">
        <div className="relative pl-6 sm:pl-8 py-2 border-l-[3.5px] border-[#D4A359]">
          <blockquote className="font-quote text-xl sm:text-2xl md:text-[26px] text-[#1E2B37] leading-relaxed md:leading-[1.7] tracking-normal font-normal">
            &ldquo;We believe a household budget should be a five-minute weekly habit, not a spreadsheet you avoid until the end of the month.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs font-semibold text-[#8C7A62] tracking-wider uppercase">
            — Mindful Financial Philosophy
          </p>
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
            {language === 'id' ? 'Belanja Bukan Pelarian Emosi' : 'Mindful Decision Gatekeeper'}
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold">
            {language === 'id' ? 'Punya Keranjang Belanja yang Menunggu di-Checkout?' : 'Have an Item Waiting in Your Shopping Cart?'}
          </h3>
          <p className="text-xs sm:text-sm text-white/85 max-w-xl">
            {language === 'id' 
              ? 'Luangkan 60 detik untuk menguji kelayakannya sekarang sebelum uangmu keluar sia-sia.' 
              : 'Take 60 seconds to evaluate its impact objectively before parting with your hard-earned funds.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('finance')}
            className="px-5 py-3 rounded-xl bg-white text-[#24303E] font-bold text-xs hover:bg-[#F8F6F2] transition-colors shadow-sm cursor-pointer"
          >
            {language === 'id' ? 'Atur Profil Keuangan' : 'Set Up Finances'}
          </button>
          <button
            onClick={() => onNavigate('evaluate')}
            className="px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold text-xs transition-colors cursor-pointer"
          >
            {language === 'id' ? 'Tes Barang →' : 'Evaluate Item →'}
          </button>
        </div>
      </section>

      {/* Quick Access Banner: Teman Finansial AI in Edukasi Finansial */}
      <section className="p-7 sm:p-8 rounded-3xl bg-gradient-to-r from-[#24303E] via-[#314254] to-[#40566D] text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8D5E5]" />
            <span>{language === 'id' ? 'Asisten Cerdas di Edukasi Finansial' : 'Smart AI in Financial Education'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
            {language === 'id' ? 'Ada Keraguan Belanja? Diskusi Bareng Teman Finansial' : 'Money Questions? Chat with Financial Buddy'}
          </h2>
          <p className="text-xs sm:text-sm text-[#D5DFE7] leading-relaxed">
            {language === 'id'
              ? 'Tanyakan tips budgeting, cara menahan lapar mata saat diskon, atau simulasi cicilan paylater dengan bahasa santai, ramah, dan tanpa dihakimi.'
              : 'Ask anything about budgeting, curbing impulse buys, or loans in a friendly, zero-judgment chat.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('teman-finansial')}
          className="z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-heading font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 hover:-translate-y-0.5 active:translate-y-0 ring-2 ring-white/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'id' ? 'Buka Teman Finansial' : 'Open Financial Buddy'}</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </section>

    </div>
  );
};