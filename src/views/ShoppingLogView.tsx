import React, { useState } from 'react';
import { 
  History, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  TrendingDown, 
  Sparkles, 
  Filter, 
  Calendar,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  Download,
  BarChart3
} from 'lucide-react';
import { Language, ShoppingLogItem } from '../types';
import { translations, categoryLabels } from '../utils/translations';
import { AddShoppingItemModal } from '../components/AddShoppingItemModal';
import { downloadShoppingLogPdf } from '../utils/pdfGenerator';

interface ShoppingLogViewProps {
  userId: string;
  userName?: string;
  items: ShoppingLogItem[];
  language: Language;
  onNavigate?: (view: string) => void;
  onAddItem: (item: ShoppingLogItem) => void;
  onDeleteItem: (id: string) => void;
}

export const ShoppingLogView: React.FC<ShoppingLogViewProps> = ({
  userId,
  userName = 'User',
  items,
  language,
  onNavigate,
  onAddItem,
  onDeleteItem,
}) => {
  const monthsList = [
    { val: 'all' as const, labelId: 'Semua Bulan', labelEn: 'All Months' },
    { val: 0, labelId: 'Januari', labelEn: 'January' },
    { val: 1, labelId: 'Februari', labelEn: 'February' },
    { val: 2, labelId: 'Maret', labelEn: 'March' },
    { val: 3, labelId: 'April', labelEn: 'April' },
    { val: 4, labelId: 'Mei', labelEn: 'May' },
    { val: 5, labelId: 'Juni', labelEn: 'June' },
    { val: 6, labelId: 'Juli', labelEn: 'July' },
    { val: 7, labelId: 'Agustus', labelEn: 'August' },
    { val: 8, labelId: 'September', labelEn: 'September' },
    { val: 9, labelId: 'Oktober', labelEn: 'October' },
    { val: 10, labelId: 'November', labelEn: 'November' },
    { val: 11, labelId: 'Desember', labelEn: 'December' },
  ];
  const yearsList = [2024, 2025, 2026, 2027];

  const now = new Date();
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'bought' | 'saved_bye' | 'cooling_down'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const t = translations[language];

  const handleDownloadReport = () => {
    setDownloadingPdf(true);
    try {
      downloadShoppingLogPdf(items, userName, language);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 600);
    }
  };

  const filteredItems = items.filter((item) => {
    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Month & Year filter
    const itemDate = new Date(item.date);
    const yearMatch = itemDate.getFullYear() === selectedYear;
    const monthMatch = selectedMonth === 'all' || itemDate.getMonth() === selectedMonth;

    return yearMatch && monthMatch;
  });

  // Calculate totals
  const totalSavedFromBye = items
    .filter(i => i.status === 'saved_bye')
    .reduce((acc, curr) => acc + (curr.savedAmount || curr.price), 0);

  const totalSpentBought = items
    .filter(i => i.status === 'bought')
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalCoolingCount = items.filter(i => i.status === 'cooling_down').length;

  // Pattern Analysis: find top categories
  const categoryCounts: Record<string, { count: number; spend: number }> = {};
  items.forEach((item) => {
    if (!categoryCounts[item.category]) {
      categoryCounts[item.category] = { count: 0, spend: 0 };
    }
    categoryCounts[item.category].count += 1;
    if (item.status === 'bought') {
      categoryCounts[item.category].spend += item.price;
    }
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1].count - a[1].count);
  const topCategoryKey = sortedCategories[0]?.[0] || 'fashion';
  const topCategoryName = categoryLabels[topCategoryKey]?.[language] || topCategoryKey;

  // Habit Coaching Advice based on real behavior
  const byeRatio = items.length > 0 
    ? Math.round((items.filter(i => i.status === 'saved_bye').length / items.length) * 100) 
    : 0;

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80] mb-2">
            <History className="w-3.5 h-3.5 text-[#6B8BA4]" />
            <span>Shopping Pattern Tracker</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E]">
            {t.historyTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6F80] mt-1 max-w-xl">
            {t.historySubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onNavigate && (
            <button
              onClick={() => onNavigate('monthly-report')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5DFE7] bg-white hover:bg-[#F8F6F2] text-[#334657] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Dashboard Laporan Bulanan' : 'Monthly Report'}</span>
            </button>
          )}

          <button
            onClick={handleDownloadReport}
            disabled={downloadingPdf || items.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5DFE7] bg-[#F8F6F2] hover:bg-[#EFECE6] text-[#334657] text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Unduh riwayat transaksi dan rekomendasi kebiasaan belanja dalam format PDF"
          >
            <Download className="w-4 h-4 text-[#6B8BA4]" />
            <span>{downloadingPdf ? 'Mencetak PDF...' : (language === 'id' ? 'Unduh Riwayat & Saran (PDF)' : 'Download Log & Advice (PDF)')}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addManualItemBtn}</span>
          </button>
        </div>
      </div>

      {/* Hero Rescued Funds Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#9EAEA2] via-[#8AA090] to-[#768D7D] text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.savedMoneyCardTitle}
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold">
            Rp {totalSavedFromBye.toLocaleString('id-ID')}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg">
            {t.savedMoneyCardDesc}
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right min-w-[200px] shrink-0">
          <span className="text-[11px] text-white/80 uppercase font-semibold block">Total Dibelanja (Disetujui)</span>
          <span className="text-xl font-bold font-heading">Rp {totalSpentBought.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-white/70 block mt-1">
            {totalCoolingCount} barang masih dalam daftar tunda
          </span>
        </div>
      </div>

      {/* Habit Pattern & Smart Coaching Insights (Point 10: Real data or inform not enough data) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6B8BA4]" />
            <h2 className="font-heading text-base font-bold text-[#24303E]">
              {t.patternAnalysisTitle}
            </h2>
          </div>
          <span className="text-[11px] text-[#7A8C9E]">
            {items.length >= 3 
              ? (language === 'id' ? 'Berdasarkan Data Riil' : 'Based on Real Records') 
              : (language === 'id' ? 'Data Belum Cukup' : 'Insufficient Data')}
          </span>
        </div>

        {items.length < 3 ? (
          <div className="p-6 rounded-2xl bg-white border border-[#E5ECF2] text-center space-y-2">
            <Lightbulb className="w-6 h-6 text-[#6B8BA4] mx-auto" />
            <h3 className="font-heading font-bold text-sm text-[#24303E]">
              {language === 'id' ? 'Data Belum Cukup untuk Analisis Pola' : 'Not Enough Data for Pattern Analysis'}
            </h3>
            <p className="text-xs text-[#5C6F80] max-w-md mx-auto">
              {language === 'id'
                ? `Kamu baru memiliki ${items.length} catatan transaksi. Analisis kebiasaan belanja yang akurat membutuhkan minimal 3 transaksi nyata. Terus catat atau evaluasi barang baru untuk membuka rekomendasi cerdas!`
                : `You currently have ${items.length} logged transactions. Mindful pattern coaching requires at least 3 genuine records. Keep evaluating products to unlock personalized insights!`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C9E]">{t.patternHabit1}</p>
              <p className="text-xl font-heading font-extrabold text-[#24303E]">{byeRatio}% {language === 'id' ? 'Lolos dari Impuls' : 'Impulse Resisted'}</p>
              <p className="text-xs text-[#5C6F80]">
                {byeRatio >= 50 
                  ? (language === 'id' ? 'Disiplin sangat baik! Kamu berhasil membatalkan lebih dari separuh keinginan impulsif.' : 'High discipline! You successfully paused or skipped over half of impulse temptations.')
                  : (language === 'id' ? 'Masih sering tergiur. Berikan jeda 24 jam ekstra sebelum memutuskan checkout.' : 'Temptation rate is high. Enforce a strict 24-hour cooling-off window before checkout.')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C9E]">{t.patternHabit2}</p>
              <p className="text-xl font-heading font-extrabold text-[#E11D48]">{topCategoryName}</p>
              <p className="text-xs text-[#5C6F80]">
                {language === 'id'
                  ? 'Kategori yang paling sering menarik perhatianmu. Berikan perhatian khusus pada kategori ini saat ada flash sale.'
                  : 'Your most frequent category. Pay special attention to this category during seasonal sales.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5ECF2] space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C9E]">{t.patternHabit3}</p>
              <p className="text-sm font-bold text-[#6B8BA4]">{language === 'id' ? 'Aturan 30 Hari Sinking Fund' : '30-Day Sinking Fund Rule'}</p>
              <p className="text-xs text-[#5C6F80]">
                {language === 'id'
                  ? 'Bila ada barang non-pokok berharga >Rp 500.000, tabung dulu 50% selama 1 bulan sebelum mengevaluasinya kembali.'
                  : 'For discretionary items over IDR 500,000, accumulate 50% in advance over 30 days before checkout.'}
              </p>
            </div>

          </div>
        )}
      </section>

      {/* Filter and Table List */}
      <div className="space-y-4">
        
        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2EAF0]">
          
          {/* Status filters (BUY green, BYE red) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#6B8BA4] text-white' : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
              }`}
            >
              {t.filterAll} ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter('bought')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'bought' ? 'bg-[#059669] text-white font-bold' : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
              }`}
            >
              {t.filterBought} ({items.filter(i => i.status === 'bought').length})
            </button>
            <button
              onClick={() => setStatusFilter('saved_bye')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'saved_bye' ? 'bg-[#E11D48] text-white font-bold' : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
              }`}
            >
              {t.filterSaved} ({items.filter(i => i.status === 'saved_bye').length})
            </button>
            <button
              onClick={() => setStatusFilter('cooling_down')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'cooling_down' ? 'bg-[#6366F1] text-white font-bold' : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
              }`}
            >
              {t.filterCooling} ({items.filter(i => i.status === 'cooling_down').length})
            </button>
          </div>

          {/* Month & Year filter (Point 10) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Year */}
            <div className="flex items-center gap-1 bg-[#F8F6F2] px-2.5 py-1.5 rounded-lg border border-[#D5DFE7]">
              <Calendar className="w-3.5 h-3.5 text-[#6B8BA4]" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-[#24303E] outline-none cursor-pointer"
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="bg-[#F8F6F2] px-2.5 py-1.5 rounded-lg border border-[#D5DFE7]">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedMonth(val === 'all' ? 'all' : Number(val));
                }}
                className="bg-transparent text-xs font-semibold text-[#24303E] outline-none cursor-pointer"
              >
                {monthsList.map(m => (
                  <option key={String(m.val)} value={m.val}>
                    {language === 'id' ? m.labelId : m.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Transactions Table (Desktop) & Cards (Mobile) */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E2EAF0] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F6F2] text-[#7A8C9E] flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#24303E]">{t.noHistory}</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl border border-[#E2EAF0] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F6F2] border-b border-[#E8EFF5] text-[#7A8C9E] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">{t.tableColProduct}</th>
                      <th className="px-6 py-3.5">{t.tableColPrice}</th>
                      <th className="px-6 py-3.5">{t.tableColMethod}</th>
                      <th className="px-6 py-3.5">{t.tableColDecision}</th>
                      <th className="px-6 py-3.5">{t.tableColDate}</th>
                      <th className="px-6 py-3.5 text-right">{t.tableColAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F7]">
                    {filteredItems.map((item) => {
                      const isBought = item.status === 'bought';
                      const isSaved = item.status === 'saved_bye';
                      const isCooling = item.status === 'cooling_down';

                      return (
                        <tr key={item.id} className="hover:bg-[#FBFBFA] transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#24303E]">{item.productName}</p>
                            <span className="text-[11px] text-[#7A8C9E]">
                              {categoryLabels[item.category]?.[language] || item.category}
                            </span>
                            {item.notes && (
                              <p className="text-[10px] text-[#607485] italic mt-0.5">"{item.notes}"</p>
                            )}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#24303E]">
                            Rp {item.price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 uppercase text-[#55697A] font-semibold text-[11px]">
                            {item.paymentMethod}
                          </td>
                          <td className="px-6 py-4">
                            {isBought && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#065F46] border border-[#10B981] font-bold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-[#059669]" /> {language === 'id' ? 'DIBELI (BUY)' : 'BOUGHT'}
                              </span>
                            )}
                            {isSaved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF1F2] text-[#9F1239] border border-[#F43F5E] font-bold text-[11px]">
                                <XCircle className="w-3 h-3 text-[#E11D48]" /> {language === 'id' ? 'BYE (HEMAT)' : 'BYE (SAVED)'}
                              </span>
                            )}
                            {isCooling && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#3730A3] border border-[#818CF8] font-bold text-[11px]">
                                <Clock className="w-3 h-3 text-[#6366F1]" /> {language === 'id' ? 'TUNDA (COOLING)' : 'COOLING OFF'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[#7A8C9E] text-[11px]">
                            {new Date(item.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1.5 rounded-lg text-[#9AA8B3] hover:text-[#D8A4B8] hover:bg-[#FFF5F8] transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {filteredItems.map((item) => {
                const isBought = item.status === 'bought';
                const isSaved = item.status === 'saved_bye';
                const isCooling = item.status === 'cooling_down';

                return (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#7A8C9E] tracking-wider">
                          {categoryLabels[item.category]?.[language] || item.category} · {item.paymentMethod.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-sm text-[#24303E] leading-snug mt-0.5">
                          {item.productName}
                        </h4>
                      </div>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 rounded-lg text-[#9AA8B3] hover:text-[#D8A4B8] hover:bg-[#FFF5F8] transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#F0F4F7]">
                      <div>
                        <span className="text-[10px] text-[#7A8C9E] block">Nominal:</span>
                        <span className="text-sm font-extrabold text-[#24303E]">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="text-right">
                        {isBought && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#065F46] border border-[#10B981] font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-[#059669]" /> {language === 'id' ? 'DIBELI' : 'BOUGHT'}
                          </span>
                        )}
                        {isSaved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF1F2] text-[#9F1239] border border-[#F43F5E] font-bold text-[10px]">
                            <XCircle className="w-3 h-3 text-[#E11D48]" /> {language === 'id' ? 'BYE' : 'BYE'}
                          </span>
                        )}
                        {isCooling && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#3730A3] border border-[#818CF8] font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-[#6366F1]" /> {language === 'id' ? 'TUNDA' : 'PAUSED'}
                          </span>
                        )}
                        <span className="text-[10px] text-[#7A8C9E] block mt-0.5">
                          {new Date(item.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-[#607485] italic bg-[#F8F6F2] p-2 rounded-xl border border-[#EDE9E3]">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Add Item Modal */}
      <AddShoppingItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={userId}
        language={language}
        onAdd={onAddItem}
      />
    </div>
  );
};
