import React from 'react';
import { ShoppingBag, Heart, Shield, Globe, Instagram } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FooterProps {
  language: Language;
  onNavigate: (view: string) => void;
  onToggleLanguage: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onToggleLanguage,
}) => {
  const t = translations[language];

  return (
    <footer className="bg-white border-t border-[#E2EAF0] text-[#55697A] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Social */}
          <div className="space-y-3 md:col-span-1">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#6B8BA4] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-berkshire text-2xl tracking-wide flex items-center gap-1.5 leading-none">
                <span className="text-[#16A34A]">Buy</span> <span className="text-[#24303E] font-normal text-lg">or</span> <span className="text-[#EC4899]">Bye</span>
              </span>
            </div>
            <p className="text-[11px] text-[#7A8C9E] leading-relaxed">
              Platform evaluasi keputusan belanja cerdas untuk menyelamatkan generasi masa kini dari jebakan konsumerisme impulsif.
            </p>

            {/* Social Media Link */}
            <div className="pt-1">
              <a
                href="https://www.instagram.com/buyorbye.site?psln=MW96NWsxeHg3OWJuZw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2EAF0] bg-[#F8F6F2] hover:bg-[#F2EFF7] text-[#C13584] hover:text-[#9B2C6B] font-semibold text-[11px] transition-all group shadow-2xs"
              >
                <Instagram className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                <span>@buyorbye.site</span>
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-[#24303E] text-xs uppercase tracking-wider mb-3">Navigasi Utama</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('evaluate')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.navEvaluate}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('finance')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.navFinance}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.navHistory}
                </button>
              </li>
            </ul>
          </div>

          {/* Education & About */}
          <div>
            <h4 className="font-bold text-[#24303E] text-xs uppercase tracking-wider mb-3">Literasi & Edukasi</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.tabNeedsWants}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.tabPaylater}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#6B8BA4] transition-colors cursor-pointer">
                  {t.navAbout}
                </button>
              </li>
            </ul>
          </div>

          {/* Settings & Language */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#24303E] text-xs uppercase tracking-wider mb-3">Pengaturan Bahasa</h4>
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#D5DFE7] bg-[#F8F6F2] hover:bg-[#EFECE6] text-xs font-semibold text-[#24303E] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#6B8BA4]" />
              <span>Bahasa: <strong>{language === 'id' ? 'Bahasa Indonesia' : 'English'}</strong></span>
            </button>
            <p className="text-[10px] text-[#8CA0B2]">
              Ubah bahasa kapan saja untuk menyesuaikan teks antarmuka dan laporan PDF.
            </p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-[#E8EFF5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7A8C9E]">
          <p>
            © 2026 Buy or Bye. Smart Purchase Evaluation Platform.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/buyorbye.site?psln=MW96NWsxeHg3OWJuZw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#7A8C9E] hover:text-[#C13584] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram @buyorbye.site</span>
            </a>
            <span className="flex items-center gap-1 text-[#7A8C9E]">
              <Shield className="w-3.5 h-3.5 text-[#9EAEA2]" /> Client-side Secure
            </span>
            <span>Rule-Based Decision Logic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
