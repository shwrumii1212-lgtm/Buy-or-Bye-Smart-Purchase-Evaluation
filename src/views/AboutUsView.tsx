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
  ExternalLink,
  Users,
  ArrowRight,
  X
} from 'lucide-react';
import { Language, User } from '../types';
import { CommunityForum } from '../components/CommunityForum';
import { translations } from '../utils/translations';

interface AboutUsViewProps {
  language: Language;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ language, onNavigate, user = null }) => {
  const t = translations[language];
  const [showForumModal, setShowForumModal] = useState<boolean>(false);


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
        <h1 className="font-berkshire text-3xl sm:text-4xl font-extrabold text-[#24303E]">
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

      {/* Cerita di Balik Kehadiran Buy or Bye (Tanpa kata 'Misi' / Tanpa kata 'Our Story') */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-[#6B8BA4]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#24303E]">
            {language === 'id' 
              ? 'Mengapa Buy or Bye Hadir untuk Menemanimu' 
              : 'Why Buy or Bye Was Created for You'}
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-[#475A6C] leading-relaxed">
          <p>
            Pernahkah kamu scrolling marketplace tengah malam, memasukkan barang ke keranjang karena label diskon merah menyala, lalu checkout hanya karena takut kehabisan? Keesokan harinya ketika kurir tiba, yang tersisa seringkali bukan rasa puas, melainkan sedikit rasa bersalah saat melihat mutasi rekening atau tagihan paylater yang mulai menumpuk.
          </p>
          <p>
            Kita hidup di era di mana algoritma e-commerce sengaja dirancang untuk memicu dopamin instan lewat flash sale, countdown timer, dan kemudahan tombol sekali klik. <strong>Buy or Bye</strong> lahir dari keresahan nyata sehari-hari generasi muda: bagaimana caranya tetap bisa menikmati hasil kerja keras dan membeli barang yang disukai, tanpa harus terjebak dalam siklus konsumerisme impulsif.
          </p>
          <p>
            Platform ini bukan tentang melarangmu bersenang-senang, melainkan menjadi teman berpikir rasional—sebuah <em>gatekeeper</em> kecil yang memberimu jeda bernapas sejenak sebelum checkout, menghitung nilai nyata barang terhadap jam kerja hidupmu, dan memastikan masa depan finansialmu tetap aman serta terjaga.
          </p>
        </div>
      </section>

      {/* Quote Motivasi Berkelas - Terinspirasi dari Referensi Desain */}
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

      {/* Komunitas & Forum Diskusi Finansial: Kotak Ringkas & Elegan */}
      <section id="community-forum" className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#F8F6F2] to-[#EAF0EB] border border-[#E2EAF0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-[#6B8BA4]/40">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80]">
            <MessageSquare className="w-3.5 h-3.5 text-[#6B8BA4]" />
            <span>{language === 'id' ? 'Komunitas & Diskusi Finansial' : 'Mindful Community & Q&A'}</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#24303E]">
            {language === 'id' ? 'Forum Komunitas & Diskusi Finansial' : 'Community Forum & Discussions'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6F80] leading-relaxed">
            {language === 'id' 
              ? 'Ruang saling dukung untuk menahan dorongan belanja impulsif, berbagi cerita melunasi paylater, hingga berdiskusi sebelum checkout bersama teman sefrekuensi.'
              : 'A supportive community space to curb impulse buys, navigate paylater habits, and discuss purchasing dilemmas with peers.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForumModal(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-heading font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 hover:-translate-y-0.5 active:translate-y-0 ring-2 ring-[#6B8BA4]/20"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'id' ? 'Buka Diskusi' : 'Open Discussions'}</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </section>

      {/* Modal / Dialog Forum Komunitas Lengkap */}
      {showForumModal && (
        <div className="fixed inset-0 z-50 bg-[#24303E]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#FAF9F6] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#CBD7E2] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-white border-b border-[#E2EAF0] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#24303E]">
                    {language === 'id' ? 'Forum Komunitas Buy or Bye' : 'Buy or Bye Community Forum'}
                  </h3>
                  <p className="text-[11px] text-[#7A8C9E]">
                    {language === 'id' ? 'Diskusi terbuka, bebas julgmen & saling menguatkan' : 'Supportive and judgment-free discussions'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowForumModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F4F8] hover:bg-[#E2EAF0] text-[#55697A] hover:text-[#24303E] flex items-center justify-center transition-colors cursor-pointer"
                title={language === 'id' ? 'Tutup' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Container with Scroll */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <CommunityForum language={language} user={user} />
            </div>
          </div>
        </div>
      )}

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
            <p className="text-xs text-[#7A8C9E]">
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
