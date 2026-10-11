import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  BookmarkPlus, 
  Briefcase, 
  TrendingDown, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { EvaluationItem, Language } from '../types';
import { translations } from '../utils/translations';
import { downloadEvaluationPdf } from '../utils/pdfGenerator';

interface EvaluationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: EvaluationItem | null;
  userName: string;
  language: Language;
  onSaveToHistory: (evalItem: EvaluationItem, chosenStatus: 'bought' | 'saved_bye' | 'cooling_down') => void;
}

export const EvaluationResultModal: React.FC<EvaluationResultModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  userName,
  language,
  onSaveToHistory,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !evaluation) return null;
  const t = translations[language];

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      downloadEvaluationPdf(evaluation, userName, language);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  const handleSaveAction = (status: 'bought' | 'saved_bye' | 'cooling_down') => {
    onSaveToHistory(evaluation, status);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  // Color scheme based on verdict (BUY always green, BYE always red - Soft Summer Palette)
  const isBuy = evaluation.decision === 'BUY';
  const isBye = evaluation.decision === 'BYE';
  const isCooling = evaluation.decision === 'COOLING_OFF';

  const verdictTheme = isBuy 
    ? {
        bgGradient: 'from-[#059669] via-[#10B981] to-[#047857]',
        badgeBg: 'bg-[#ECFDF5]',
        textColor: 'text-[#065F46]',
        borderColor: 'border-[#10B981]',
        title: t.verdictBuyTitle,
        subtitle: t.verdictBuySub,
        icon: CheckCircle2
      }
    : isBye
    ? {
        bgGradient: 'from-[#E11D48] via-[#F43F5E] to-[#BE123C]',
        badgeBg: 'bg-[#FFF1F2]',
        textColor: 'text-[#9F1239]',
        borderColor: 'border-[#F43F5E]',
        title: t.verdictByeTitle,
        subtitle: t.verdictByeSub,
        icon: XCircle
      }
    : {
        bgGradient: 'from-[#6366F1] via-[#818CF8] to-[#4F46E5]',
        badgeBg: 'bg-[#EEF2FF]',
        textColor: 'text-[#3730A3]',
        borderColor: 'border-[#818CF8]',
        title: t.verdictCoolingTitle,
        subtitle: t.verdictCoolingSub,
        icon: Clock
      };

  const VerdictIcon = verdictTheme.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24303E]/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2EAF0] my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner with Verdict Color */}
        <div className={`bg-gradient-to-r ${verdictTheme.bgGradient} p-6 sm:p-7 text-white relative`}>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Kembali ke Form Evaluasi' : 'Back to Evaluation Form'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {t.resultTitle}
              </div>
              <div className="flex items-center gap-2.5">
                <VerdictIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight">
                  {verdictTheme.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-lg">
                {verdictTheme.subtitle}
              </p>
            </div>

            {/* Score pill */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center min-w-[76px] sm:min-w-[88px] border border-white/20 shrink-0">
              <span className="text-[10px] uppercase font-semibold text-white/80 block">
                {t.evalScoreLabel}
              </span>
              <span className="text-2xl sm:text-3xl font-heading font-black">
                {evaluation.score}
              </span>
              <span className="text-[10px] text-white/70 block">/ 100</span>
            </div>
          </div>
        </div>

        {/* Product evaluated line */}
        <div className="bg-[#F8F6F2] px-6 py-3.5 border-b border-[#E8EFF5] flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A8C9E]">
              {evaluation.category.toUpperCase()} · {evaluation.paymentMethod.toUpperCase()}
            </span>
            <p className="text-sm font-bold text-[#24303E]">{evaluation.productName}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#7A8C9E] block">Harga:</span>
            <span className="text-base font-extrabold text-[#6B8BA4]">
              Rp {evaluation.price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Key Impact Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8C9E] mb-2.5">
              {t.reasonsTitle}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Work Hours */}
              <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
                <div className="flex items-center gap-1.5 text-xs text-[#6B8BA4] font-semibold mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t.impactHoursTitle}</span>
                </div>
                <p className="text-xl font-heading font-extrabold text-[#24303E]">
                  {evaluation.financialImpact.workHoursNeeded} <span className="text-xs font-normal text-[#7A8C9E]">Jam</span>
                </p>
                <p className="text-[10px] text-[#7A8C9E] mt-1 leading-tight">
                  {language === 'id' ? 'Waktu hidupmu yang harus ditukar untuk membeli ini.' : 'Life energy traded to afford this.'}
                </p>
              </div>

              {/* Card 2: Free Cash */}
              <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
                <div className="flex items-center gap-1.5 text-xs text-[#6B8BA4] font-semibold mb-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{t.impactCashTitle}</span>
                </div>
                <p className="text-base font-heading font-extrabold text-[#24303E]">
                  Rp {evaluation.financialImpact.discretionaryAfter.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-[#7A8C9E] mt-1 leading-tight">
                  {language === 'id' 
                    ? `Menyerap ${evaluation.financialImpact.discretionaryImpactPercent}% dari uang bebas bulananmu.`
                    : `Consumes ${evaluation.financialImpact.discretionaryImpactPercent}% of remaining buffer.`}
                </p>
              </div>

              {/* Card 3: Debt or Emergency */}
              <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2]">
                <div className="flex items-center gap-1.5 text-xs text-[#6B8BA4] font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{evaluation.paymentMethod === 'paylater' ? 'Dampak DSR (Utang)' : 'Dana Darurat'}</span>
                </div>
                <p className="text-xl font-heading font-extrabold text-[#24303E]">
                  {evaluation.paymentMethod === 'paylater' 
                    ? `${evaluation.financialImpact.debtRatioAfter}%` 
                    : `${evaluation.financialImpact.emergencyFundMonthsRatio} bln`}
                </p>
                <p className="text-[10px] text-[#7A8C9E] mt-1 leading-tight">
                  {evaluation.paymentMethod === 'paylater' 
                    ? (evaluation.financialImpact.debtRatioAfter > 30 ? 'Batas aman terlampaui (>30%)' : 'Masih dalam batas aman (<30%)')
                    : 'Kesiapan runway dana darurat saat ini.'}
                </p>
              </div>
            </div>
          </div>

          {/* Granular Factors & Reasons */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2EAF0] space-y-2">
            <h4 className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#6B8BA4]" />
              <span>{t.reasonsTitle}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#415364]">
              {evaluation.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#6B8BA4] font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-[#E2EAF0] space-y-2">
            <h4 className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#9EAEA2]" />
              <span>{t.recommendationsTitle}</span>
            </h4>
            <div className="space-y-1.5 text-xs text-[#415364]">
              {evaluation.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-white border border-[#EDE9E3]">
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B8BA4] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8F6F2] p-4 sm:p-5 border-t border-[#E8EFF5] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
            {/* Back button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#D5DFE7] bg-white hover:bg-[#F2F6F9] text-xs font-semibold text-[#506272] transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
            </button>

            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5DFE7] bg-white hover:bg-[#F2F6F9] text-xs font-semibold text-[#415364] transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#6B8BA4]" />
              <span>{downloading ? 'Memproses PDF...' : t.downloadPdfBtn}</span>
            </button>
          </div>

          {/* Save to History Actions */}
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-2">
            {savedSuccess ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#47634F] py-2 px-3 bg-[#EAF0EB] rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'id' ? 'Tersimpan ke Riwayat Belanja!' : 'Saved to shopping log!'}</span>
              </div>
            ) : (
              <>
                {isBuy && (
                  <button
                    onClick={() => handleSaveAction('bought')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.historyStatusBought}</span>
                  </button>
                )}

                {isBye && (
                  <button
                    onClick={() => handleSaveAction('saved_bye')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t.historyStatusSaved}</span>
                  </button>
                )}

                <button
                  onClick={() => handleSaveAction('cooling_down')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-semibold shadow-xs"
                >
                  <Clock className="w-4 h-4" />
                  <span>{t.historyStatusCooling}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
