import React, { useState } from 'react';
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
  ArrowLeft,
  MessageSquare,
  Instagram,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface AboutUsViewProps {
  language: Language;
  onNavigate?: (view: string) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ language, onNavigate }) => {
  const t = translations[language];
  const [conversationOpen, setConversationOpen] = useState(false);
  const [conversationText, setConversationText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

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

        {/* Official Instagram Badge Banner */}
        <div className="pt-3 flex justify-center">
          <a
            href="https://www.instagram.com/buyorbye.site?psln=MW96NWsxeHg3OWJuZw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#CFDCE6] text-[#24303E] hover:text-[#C13584] hover:border-[#D8A4B8] text-xs font-semibold shadow-xs transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <Instagram className="w-3.5 h-3.5" />
            </div>
            <span>Instagram Resmi: <strong>@buyorbye.site</strong></span>
            <ExternalLink className="w-3.5 h-3.5 text-[#7A8C9E] group-hover:text-[#C13584]" />
          </a>
        </div>
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

      {/* Official Social Media Community Section */}
      <section className="p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EBEF] text-[#8E4362] text-xs font-semibold">
            <Instagram className="w-3.5 h-3.5 text-[#D8A4B8]" />
            <span>Official Community</span>
          </div>
          <h2 className="font-heading text-xl font-bold text-[#24303E]">
            Ikuti Instagram Kami @buyorbye.site
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6F80] leading-relaxed">
            Dapatkan tips harian menahan impulsivitas belanja, studi kasus paylater, infografis psikologi uang, serta diskusikan keraguan sebelum checkout langsung lewat DM atau komentar.
          </p>
        </div>
        <a
          href="https://www.instagram.com/buyorbye.site?psln=MW96NWsxeHg3OWJuZw=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white font-heading font-extrabold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Instagram className="w-4 h-4" />
          <span>Buka Instagram @buyorbye.site</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>
      </section>

      {/* Start Conversation Section */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-[#F8F6F2] via-white to-[#EAF0EB] border border-[#E2EAF0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80]">
              <MessageSquare className="w-3.5 h-3.5 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Komunitas & Diskusi Finansial' : 'Mindful Community & Q&A'}</span>
            </div>
            <h2 className="font-heading text-xl font-bold text-[#24303E]">
              {language === 'id' ? 'Punya Pertanyaan Seputar Kebiasaan Belanja?' : 'Questions About Mindful Spending Habits?'}
            </h2>
            <p className="text-xs text-[#5C6F80] max-w-xl">
              {language === 'id' 
                ? 'Diskusikan keraguan sebelum checkout, bagikan pengalaman menolak FOMO, atau konsultasikan pengelolaan dana darurat dengan tim kami.'
                : 'Share your questions on curbing impulse buys, navigating paylater debts, or personal finance coaching.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConversationOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-heading font-extrabold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.startConversation}</span>
          </button>
        </div>

        {conversationOpen && (
          <div className="mt-4 p-5 rounded-2xl bg-white border border-[#DCE4EC] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24303E]">
                {language === 'id' ? 'Kirim Pesan / Topik Diskusi:' : 'Submit Message / Discussion Topic:'}
              </span>
              <button
                type="button"
                onClick={() => setConversationOpen(false)}
                className="text-xs text-[#7A8C9E] hover:text-[#24303E] cursor-pointer"
              >
                ✕ {language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
            {messageSent ? (
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#10B981] text-xs font-bold text-[#065F46] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>
                  {language === 'id'
                    ? 'Pesan kamu telah terkirim! Terima kasih telah berkontribusi dalam gerakan belanja bijak.'
                    : 'Your message has been sent! Thank you for participating in the mindful spending movement.'}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={conversationText}
                  onChange={(e) => setConversationText(e.target.value)}
                  placeholder={language === 'id' ? 'Tuliskan unek-unek belanja impulsif, pertanyaan budgeting, atau masukanmu...' : 'Type your spending question, budgeting thoughts, or feedback...'}
                  className="w-full p-3 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!conversationText.trim()) return;
                    setMessageSent(true);
                    setTimeout(() => {
                      setMessageSent(false);
                      setConversationText('');
                      setConversationOpen(false);
                    }, 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  {language === 'id' ? 'Kirim Pesan' : 'Send Message'}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Privacy & Principles */}
      <section className="p-6 rounded-3xl bg-white border border-[#E2EAF0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF0EB] text-[#7E9383] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24303E]">
              {language === 'id' ? 'Privasi Terjaga & Data Lokal' : 'Complete Client-Side Privacy'}
            </h3>
            <p className="text-[11px] text-[#7A8C9E]">
              {language === 'id'
                ? 'Data profil finansial dan riwayat belanja tersimpan aman di perangkatmu secara terisolasi.'
                : 'Your financial profiles and shopping evaluations remain private and client-side.'}
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
