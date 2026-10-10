import React from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Clock, 
  HelpCircle, 
  Heart,
  TrendingUp,
  Brain,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface AboutUsViewProps {
  language: Language;
  onNavigate?: (view: string) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      
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

      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#E2EAF0] via-[#EFECE6] to-[#F5EBEF] border border-[#DCE4EC] text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#CBD7E2] text-xs font-semibold text-[#527189] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#6B8BA4]" />
          <span>Mindful Consumer Movement</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#24303E]">
          {t.aboutTitle}
        </h1>
        <p className="text-xs sm:text-base text-[#55697A] max-w-xl mx-auto leading-relaxed">
          {t.aboutSubtitle}
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#24303E]">
            {t.missionTitle}
          </h2>
        </div>
        <p className="text-sm text-[#506272] leading-relaxed">
          {t.missionDesc}
        </p>
        <p className="text-sm text-[#506272] leading-relaxed">
          Di era e-commerce serba satu kali klik, algoritma rekomendasi terus membanjiri kita dengan diskon semu dan flash sale. Kami menciptakan <strong>Buy or Bye</strong> sebagai lapisan pertahanan rasional—sebuah "gatekeeper" yang berdiri di antara keranjang belanjamu dan rekening bankmu.
        </p>
      </section>

      {/* Transparent Rule-Based Methodology */}
      <section className="p-8 rounded-3xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B8BA4]">Transparansi Total</span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#24303E] mt-1">
            {t.howWeDecideTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6F80] mt-1">
            {t.howWeDecideDesc}
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24303E]">{t.rule1}</h3>
              <p className="text-xs text-[#5C6F80] mt-0.5 leading-relaxed">{t.rule1Detail}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5EBEF] text-[#D8A4B8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24303E]">{t.rule2}</h3>
              <p className="text-xs text-[#5C6F80] mt-0.5 leading-relaxed">{t.rule2Detail}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF0EB] text-[#9EAEA2] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24303E]">{t.rule3}</h3>
              <p className="text-xs text-[#5C6F80] mt-0.5 leading-relaxed">{t.rule3Detail}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE8F2] text-[#9B8EA9] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24303E]">{t.rule4}</h3>
              <p className="text-xs text-[#5C6F80] mt-0.5 leading-relaxed">{t.rule4Detail}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              5
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24303E]">{t.rule5}</h3>
              <p className="text-xs text-[#5C6F80] mt-0.5 leading-relaxed">{t.rule5Detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Principles */}
      <section className="p-6 rounded-3xl bg-white border border-[#E2EAF0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF0EB] text-[#7E9383] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24303E]">Privasi Terjaga & Data Lokal</h3>
            <p className="text-[11px] text-[#7A8C9E]">
              Data profil finansial dan riwayat belanja tersimpan aman di perangkatmu secara terisolasi.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-[#6B8BA4]">100% Client-Side Privacy</span>
        </div>
      </section>

    </div>
  );
};
