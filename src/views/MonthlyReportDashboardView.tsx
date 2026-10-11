import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  Download, 
  Wallet, 
  PieChart as PieIcon, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Lightbulb, 
  Filter, 
  Layers, 
  DollarSign, 
  Clock, 
  ShoppingBag, 
  HelpCircle,
  Percent,
  Sliders,
  Check,
  ArrowUpRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FinancialProfile, Language, ShoppingLogItem, ProductCategory } from '../types';
import { translations, categoryLabels } from '../utils/translations';
import { downloadMonthlyReportPdf } from '../utils/pdfGenerator';

interface MonthlyReportDashboardViewProps {
  finance: FinancialProfile;
  shoppingItems?: ShoppingLogItem[];
  userName?: string;
  language: Language;
  onNavigate: (view: string) => void;
}

export const MonthlyReportDashboardView: React.FC<MonthlyReportDashboardViewProps> = ({
  finance,
  shoppingItems = [],
  userName = 'User',
  language,
  onNavigate,
}) => {
  const t = translations[language];
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

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [downloading, setDownloading] = useState(false);
  const [whatIfPercent, setWhatIfPercent] = useState<number>(15); // What-if simulation discount percent on lifestyle
  
  // Interactive action plan checkboxes state
  const [actionChecks, setActionChecks] = useState<Record<string, boolean>>({
    audit_subscriptions: false,
    autopay_savings: true,
    paylater_freeze: false,
    cooling_off_discipline: true,
  });

  const toggleActionCheck = (key: string) => {
    setActionChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedPeriodLabel = useMemo(() => {
    if (selectedMonth === 'all') {
      return `${language === 'id' ? 'Seluruh Bulan' : 'All Months'} ${selectedYear}`;
    }
    const m = monthsList.find(item => item.val === selectedMonth);
    return `${language === 'id' ? m?.labelId : m?.labelEn} ${selectedYear}`;
  }, [selectedMonth, selectedYear, language]);

  // Base financial figures
  const income = finance.monthlyIncome || 0;
  const essentials = finance.essentialExpenses || 0;
  const lifestyle = finance.lifestyleExpenses || 0;
  const debts = finance.debtInstallments || 0;
  const savings = finance.savings || 0;
  const emergencyFund = finance.emergencyFund || 0;
  const targetMonths = finance.emergencyTargetMonths || 6;

  const totalCommitted = essentials + lifestyle + debts + savings;
  const discretionaryCash = Math.max(0, income - totalCommitted);
  const isDeficit = totalCommitted > income;
  const deficitAmount = isDeficit ? totalCommitted - income : 0;

  // Percentage shares of income
  const essentialsPercent = income > 0 ? Number(((essentials / income) * 100).toFixed(1)) : 0;
  const lifestylePercent = income > 0 ? Number(((lifestyle / income) * 100).toFixed(1)) : 0;
  const debtsPercent = income > 0 ? Number(((debts / income) * 100).toFixed(1)) : 0;
  const savingsPercent = income > 0 ? Number(((savings / income) * 100).toFixed(1)) : 0;
  const freeCashPercent = income > 0 ? Number(((discretionaryCash / income) * 100).toFixed(1)) : 0;

  // Debt Service Ratio (DSR)
  const dsr = debtsPercent;

  // Emergency runway
  const monthlyEssentialBase = essentials > 0 ? essentials : (income > 0 ? income * 0.5 : 1);
  const emergencyMonthsCurrent = essentials > 0 ? Number((emergencyFund / monthlyEssentialBase).toFixed(1)) : 0;
  const emergencyTargetAmount = monthlyEssentialBase * targetMonths;
  const emergencyProgressPercent = emergencyTargetAmount > 0 
    ? Math.min(100, Math.round((emergencyFund / emergencyTargetAmount) * 100))
    : 0;

  // Filter shopping items strictly based on chosen year and month
  const filteredItems = useMemo(() => {
    return shoppingItems.filter(item => {
      const itemDate = new Date(item.date);
      const yearMatch = itemDate.getFullYear() === selectedYear;
      const monthMatch = selectedMonth === 'all' || itemDate.getMonth() === selectedMonth;
      return yearMatch && monthMatch;
    });
  }, [shoppingItems, selectedYear, selectedMonth]);

  // Shopping stats
  const totalBoughtItems = filteredItems.filter(i => i.status === 'bought');
  const totalBoughtAmount = totalBoughtItems.reduce((acc, curr) => acc + curr.price, 0);

  const totalByeItems = filteredItems.filter(i => i.status === 'saved_bye');
  const totalSavedByeAmount = totalByeItems.reduce((acc, curr) => acc + (curr.savedAmount || curr.price), 0);

  const totalCoolingItems = filteredItems.filter(i => i.status === 'cooling_down');

  const totalDecisionsCount = filteredItems.length;
  const impulseResistanceRate = totalDecisionsCount > 0 
    ? Math.round((totalByeItems.length / totalDecisionsCount) * 100) 
    : 70;

  // Category breakdown from shopping items
  const categorySpending = useMemo(() => {
    const map: Record<ProductCategory, number> = {
      fashion: 0,
      gadget: 0,
      beauty: 0,
      hobbies: 0,
      fnb: 0,
      home: 0,
      subscription: 0,
      other: 0,
    };
    totalBoughtItems.forEach(item => {
      if (map[item.category] !== undefined) {
        map[item.category] += item.price;
      } else {
        map.other += item.price;
      }
    });
    return map;
  }, [totalBoughtItems]);

  const maxCategorySpend = Math.max(...Object.values(categorySpending), 1);

  // Overall Financial Health Score calculation
  let healthScore = 70;
  if (dsr <= 20) healthScore += 10;
  else if (dsr > 30) healthScore -= 20;

  if (emergencyMonthsCurrent >= 6) healthScore += 15;
  else if (emergencyMonthsCurrent >= 3) healthScore += 8;
  else healthScore -= 20;

  if (lifestylePercent <= 30) healthScore += 5;
  else healthScore -= 10;

  if (discretionaryCash > income * 0.1) healthScore += 5;
  healthScore = Math.max(10, Math.min(100, healthScore));

  const healthGrade = healthScore >= 80 
    ? { title: language === 'id' ? 'Sangat Sehat & Terkendali' : 'Very Healthy & Controlled', badgeColor: 'bg-[#9EAEA2]/20 text-[#396348]', iconColor: 'text-[#588B6A]' }
    : healthScore >= 55 
    ? { title: language === 'id' ? 'Cukup Baik (Perlu Waspada)' : 'Fair (Needs Caution)', badgeColor: 'bg-[#E5D7A3]/30 text-[#826E2B]', iconColor: 'text-[#9C8230]' }
    : { title: language === 'id' ? 'Beresiko Tinggi (Segera Evaluasi)' : 'High Risk (Immediate Action)', badgeColor: 'bg-[#D8A4B8]/30 text-[#8A3A5A]', iconColor: 'text-[#B84E75]' };

  // What-if calculation
  const whatIfSavedPerMonth = (lifestyle * (whatIfPercent / 100));
  const whatIfSavedPerYear = whatIfSavedPerMonth * 12;
  const whatIfEmergencyMonthsAdded = Number((whatIfSavedPerYear / monthlyEssentialBase).toFixed(1));

  // PDF download handler
  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      downloadMonthlyReportPdf(
        finance,
        filteredItems.length > 0 ? filteredItems : shoppingItems,
        userName,
        language
      );
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Header & Navigation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('finance')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] text-[#506272] hover:text-[#24303E] text-xs font-semibold border border-[#E2EAF0] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Kembali ke Finansial' : 'Back to Finance'}</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-[#506A80] text-xs font-semibold">
              <BarChart3 className="w-3.5 h-3.5 text-[#6B8BA4]" />
              {language === 'id' ? 'Laporan Analisis Bulanan' : 'Monthly Financial Analytics'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E] tracking-tight">
            {language === 'id' ? 'Dashboard Laporan Bulanan' : 'Monthly Financial Report'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6F80] max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Pantau visualisasi grafik alokasi anggaran, audit rasio utang & tabungan, serta saran masukan cerdas untuk mengevaluasi keputusan belanjamu.'
              : 'Monitor visual budget allocations, audit debt & emergency ratios, and receive intelligent advice to optimize your purchasing decisions.'}
          </p>
        </div>

        {/* Action Controls: Complete Month and Year selector & Download PDF */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start md:self-center">
          
          {/* Year selector */}
          <div className="flex items-center gap-1.5 bg-[#F8F6F2] px-2.5 py-1.5 rounded-xl border border-[#E2EAF0]">
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

          {/* Month selector */}
          <div className="bg-[#F8F6F2] px-2.5 py-1.5 rounded-xl border border-[#E2EAF0]">
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

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading 
                ? (language === 'id' ? 'Menyiapkan...' : 'Generating...') 
                : (language === 'id' ? 'Unduh Laporan PDF' : 'Download Report PDF')}
            </span>
          </button>
        </div>
      </div>

      {/* Top 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Monthly Income */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B8BA4]">
            <span className="text-xs font-semibold text-[#5C6F80]">
              {language === 'id' ? 'Total Pemasukan' : 'Monthly Income'}
            </span>
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl font-heading font-extrabold text-[#24303E]">
            Rp {income.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#7A8C9E]">
            {language === 'id' ? 'Take Home Pay bulanan' : 'Monthly verified base'}
          </p>
        </div>

        {/* Metric 2: Committed Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8CA8BF]">
            <span className="text-xs font-semibold text-[#5C6F80]">
              {language === 'id' ? 'Total Pengeluaran' : 'Total Expenses'}
            </span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl font-heading font-extrabold text-[#24303E]">
            Rp {totalCommitted.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-[#5C6F80]">
              {Math.round((totalCommitted / income) * 100)}%
            </span>
            <span className="text-[#7A8C9E]">{language === 'id' ? 'dari pemasukan' : 'of income'}</span>
          </div>
        </div>

        {/* Metric 3: Discretionary Free Cash */}
        <div className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
          isDeficit ? 'bg-[#D8A4B8]/10 border-[#D8A4B8]/40' : 'bg-[#9EAEA2]/10 border-[#9EAEA2]/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6F80]">
              {language === 'id' ? 'Sisa Uang Bebas' : 'Discretionary Cash'}
            </span>
            {isDeficit ? (
              <AlertTriangle className="w-4 h-4 text-[#B84E75]" />
            ) : (
              <TrendingUp className="w-4 h-4 text-[#588B6A]" />
            )}
          </div>
          <div className={`text-lg sm:text-xl font-heading font-extrabold ${
            isDeficit ? 'text-[#B84E75]' : 'text-[#396348]'
          }`}>
            {isDeficit ? `- Rp ${deficitAmount.toLocaleString('id-ID')}` : `Rp ${discretionaryCash.toLocaleString('id-ID')}`}
          </div>
          <p className="text-[11px] text-[#5C6F80]">
            {isDeficit 
              ? (language === 'id' ? 'Defisit! Kurangi pengeluaran' : 'Deficit! Reduce spending')
              : `${freeCashPercent}% ${language === 'id' ? 'dana likuid fleksibel' : 'liquid free cash'}`}
          </p>
        </div>

        {/* Metric 4: Debt Service Ratio (DSR) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#9B8EA9]">
            <span className="text-xs font-semibold text-[#5C6F80]">
              {language === 'id' ? 'Rasio Utang (DSR)' : 'Debt Ratio (DSR)'}
            </span>
            <Percent className="w-4 h-4" />
          </div>
          <div className={`text-lg sm:text-xl font-heading font-extrabold ${
            dsr > 30 ? 'text-[#B84E75]' : dsr > 20 ? 'text-[#9C8230]' : 'text-[#24303E]'
          }`}>
            {dsr}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${
              dsr > 30 ? 'bg-[#D8A4B8]' : dsr > 20 ? 'bg-[#E5D7A3]' : 'bg-[#9EAEA2]'
            }`} />
            <span className="text-[#7A8C9E]">
              {dsr <= 20 
                ? (language === 'id' ? 'Zona Ideal (< 20%)' : 'Ideal Zone (< 20%)') 
                : dsr <= 30 
                ? (language === 'id' ? 'Waspada (20-30%)' : 'Caution (20-30%)') 
                : (language === 'id' ? 'Bahaya (> 30%)' : 'High Risk (> 30%)')}
            </span>
          </div>
        </div>

        {/* Metric 5: Rescued Shopping Money */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B8BA4]">
            <span className="text-xs font-semibold text-[#5C6F80]">
              {language === 'id' ? 'Dana Terselamatkan' : 'Rescued Money'}
            </span>
            <Sparkles className="w-4 h-4 text-[#8CA8BF]" />
          </div>
          <div className="text-lg sm:text-xl font-heading font-extrabold text-[#6B8BA4]">
            Rp {totalSavedByeAmount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#7A8C9E]">
            {language === 'id' 
              ? `${totalByeItems.length} keputusan BYE sukses` 
              : `${totalByeItems.length} successful BYE decisions`}
          </p>
        </div>

      </div>

      {/* Financial Health Score Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-white via-[#F8F6F2] to-white border border-[#E2EAF0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-[#24303E] text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-md shrink-0">
            {healthScore}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#9EAEA2] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${healthGrade.badgeColor}`}>
                {healthGrade.title}
              </span>
              <span className="text-xs text-[#7A8C9E] font-medium">
                {language === 'id' ? 'Skor Kesehatan Finansial' : 'Financial Health Index'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-[#24303E] mt-1">
              {language === 'id' 
                ? `Kondisi Arus Kas Periode ${selectedPeriodLabel}`
                : `Cash Flow State for ${selectedPeriodLabel}`}
            </h3>
            <p className="text-xs text-[#5C6F80] max-w-xl">
              {healthScore >= 80 
                ? (language === 'id' 
                    ? 'Struktur keuanganmu sangat seimbang. Beban cicilan terkontrol dan bantalan dana darurat memberikan keamanan ekstra.' 
                    : 'Your financial structure is well balanced. Installment loads are tightly controlled with an adequate emergency cushion.')
                : healthScore >= 55 
                ? (language === 'id' 
                    ? 'Keuangan masih stabil, namun perlu pengawasan pada pos lifestyle atau percepatan akumulasi dana darurat.' 
                    : 'Finances are fairly stable, but keep an eye on lifestyle expenses and accelerate emergency fund accumulation.')
                : (language === 'id' 
                    ? 'Beban cicilan atau pengeluaran melebihi batas aman. Sangat disarankan menunda belanja non-pokok.' 
                    : 'Debt burden or expenses exceed safe thresholds. Postpone non-essential shopping immediately.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('evaluate')}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#24303E] hover:bg-[#1A2530] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#B8D5E5]" />
            <span>{language === 'id' ? 'Evaluasi Barang Baru' : 'Evaluate New Item'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: VISUAL CHARTS & GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Donut Allocation Budget Composition */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#6B8BA4] uppercase tracking-wider">
                {language === 'id' ? 'Grafik Visual 1' : 'Visual Chart 1'}
              </span>
              <h3 className="font-heading text-lg font-bold text-[#24303E] flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-[#6B8BA4]" />
                {language === 'id' ? 'Alokasi Anggaran Bulanan' : 'Monthly Budget Breakdown'}
              </h3>
            </div>
            <span className="text-xs text-[#7A8C9E] font-medium">
              100% {language === 'id' ? 'Total Pemasukan' : 'Income Share'}
            </span>
          </div>

          {/* SVG Custom Donut Chart & Legend */}
          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
            {/* Donut representation */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#F0EFEB]"
                  strokeWidth="15"
                  fill="transparent"
                />
                {/* Segment 1: Essentials */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#6B8BA4"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={`${Math.max(0, essentialsPercent * 2.387)} 238.7`}
                  strokeDashoffset="0"
                />
                {/* Segment 2: Lifestyle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#D8A4B8"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={`${Math.max(0, lifestylePercent * 2.387)} 238.7`}
                  strokeDashoffset={`${-essentialsPercent * 2.387}`}
                />
                {/* Segment 3: Debts */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#9B8EA9"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={`${Math.max(0, debtsPercent * 2.387)} 238.7`}
                  strokeDashoffset={`${-(essentialsPercent + lifestylePercent) * 2.387}`}
                />
                {/* Segment 4: Savings */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#9EAEA2"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={`${Math.max(0, savingsPercent * 2.387)} 238.7`}
                  strokeDashoffset={`${-(essentialsPercent + lifestylePercent + debtsPercent) * 2.387}`}
                />
                {/* Segment 5: Discretionary Free Cash */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#B8D5E5"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={`${Math.max(0, freeCashPercent * 2.387)} 238.7`}
                  strokeDashoffset={`${-(essentialsPercent + lifestylePercent + debtsPercent + savingsPercent) * 2.387}`}
                />
              </svg>
              
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                <span className="text-[10px] text-[#7A8C9E] font-medium leading-none">
                  {language === 'id' ? 'Sisa Bebas' : 'Free Cash'}
                </span>
                <span className="font-heading font-extrabold text-sm text-[#24303E] mt-1">
                  {freeCashPercent}%
                </span>
                <span className="text-[9px] text-[#9EAEA2] font-semibold mt-0.5">
                  Rp {(discretionaryCash / 1000).toLocaleString('id-ID')}k
                </span>
              </div>
            </div>

            {/* Interactive Color Legend */}
            <div className="space-y-2.5 w-full sm:w-auto text-xs">
              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-[#F8F6F2]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#6B8BA4]" />
                  <span className="font-semibold text-[#24303E]">
                    {language === 'id' ? 'Kebutuhan Pokok' : 'Essentials'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#24303E]">{essentialsPercent}%</span>
                  <span className="text-[10px] text-[#7A8C9E] block">Rp {essentials.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-[#F8F6F2]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#D8A4B8]" />
                  <span className="font-semibold text-[#24303E]">
                    {language === 'id' ? 'Wishlist & Lifestyle' : 'Lifestyle'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#24303E]">{lifestylePercent}%</span>
                  <span className="text-[10px] text-[#7A8C9E] block">Rp {lifestyle.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-[#F8F6F2]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#9B8EA9]" />
                  <span className="font-semibold text-[#24303E]">
                    {language === 'id' ? 'Cicilan & Utang' : 'Installments'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#24303E]">{debtsPercent}%</span>
                  <span className="text-[10px] text-[#7A8C9E] block">Rp {debts.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-[#F8F6F2]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#9EAEA2]" />
                  <span className="font-semibold text-[#24303E]">
                    {language === 'id' ? 'Tabungan Rutin' : 'Savings'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#24303E]">{savingsPercent}%</span>
                  <span className="text-[10px] text-[#7A8C9E] block">Rp {savings.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] text-xs text-[#5C6F80] flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#8CA8BF] shrink-0" />
            <span>
              {language === 'id'
                ? 'Idealnya sisa uang bebas berada di atas 10% untuk menjaga bantalan pengeluaran tak terduga harian.'
                : 'Ideally, maintain free cash above 10% to preserve a cushion for unexpected daily expenses.'}
            </span>
          </div>
        </div>

        {/* Chart 2: 50/30/20 Rule Comparison Bars */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#6B8BA4] uppercase tracking-wider">
                {language === 'id' ? 'Grafik Visual 2' : 'Visual Chart 2'}
              </span>
              <h3 className="font-heading text-lg font-bold text-[#24303E] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#6B8BA4]" />
                {language === 'id' ? 'Perbandingan Kaidah 50/30/20' : '50/30/20 Benchmark Comparison'}
              </h3>
            </div>
            <span className="text-xs text-[#7A8C9E] font-medium">
              {language === 'id' ? 'Target vs Realita' : 'Target vs Actual'}
            </span>
          </div>

          {/* Bar comparisons */}
          <div className="space-y-6 py-2">
            
            {/* Needs comparison */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#24303E]">
                  {language === 'id' ? 'Kebutuhan Pokok (Target: Maks 50%)' : 'Needs (Target: Max 50%)'}
                </span>
                <span className={`font-bold ${essentialsPercent > 50 ? 'text-[#B84E75]' : 'text-[#396348]'}`}>
                  {essentialsPercent}% {essentialsPercent > 50 ? '(Overbudget)' : '(Aman)'}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F0EFEB] overflow-hidden flex">
                <div 
                  className="h-full bg-[#6B8BA4] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, essentialsPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#7A8C9E]">
                <span>Rp {essentials.toLocaleString('id-ID')}</span>
                <span>Batas target 50%: Rp {(income * 0.5).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Lifestyle comparison */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#24303E]">
                  {language === 'id' ? 'Wishlist & Gaya Hidup (Target: Maks 30%)' : 'Wants & Lifestyle (Target: Max 30%)'}
                </span>
                <span className={`font-bold ${lifestylePercent > 30 ? 'text-[#B84E75]' : 'text-[#396348]'}`}>
                  {lifestylePercent}% {lifestylePercent > 30 ? '(Waspada)' : '(Sesuai)'}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F0EFEB] overflow-hidden flex">
                <div 
                  className="h-full bg-[#D8A4B8] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, lifestylePercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#7A8C9E]">
                <span>Rp {lifestyle.toLocaleString('id-ID')}</span>
                <span>Batas target 30%: Rp {(income * 0.3).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Savings & Debt combined comparison */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#24303E]">
                  {language === 'id' ? 'Tabungan & Kewajiban (Target: Min 20%)' : 'Savings & Debts (Target: Min 20%)'}
                </span>
                <span className={`font-bold ${(savingsPercent + debtsPercent) < 20 ? 'text-[#9C8230]' : 'text-[#396348]'}`}>
                  {(savingsPercent + debtsPercent).toFixed(1)}% {(savingsPercent + debtsPercent) < 20 ? '(Kurang)' : '(Tercapai)'}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F0EFEB] overflow-hidden flex">
                <div 
                  className="h-full bg-[#9EAEA2] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, savingsPercent + debtsPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#7A8C9E]">
                <span>Tabungan Rp {savings.toLocaleString('id-ID')} + Cicilan Rp {debts.toLocaleString('id-ID')}</span>
                <span>Target 20%: Rp {(income * 0.2).toLocaleString('id-ID')}</span>
              </div>
            </div>

          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] text-xs text-[#5C6F80] flex items-center justify-between">
            <span>
              {language === 'id' 
                ? 'Ingin menyesuaikan alokasi pos keuanganmu?' 
                : 'Need to adjust your financial buckets?'}
            </span>
            <button
              onClick={() => onNavigate('finance')}
              className="font-bold text-[#6B8BA4] hover:text-[#587893] underline cursor-pointer"
            >
              {language === 'id' ? 'Edit Anggaran' : 'Edit Budget'}
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 2: SHOPPING SPENDING CATEGORIES & IMPULSE RATIO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Shopping Spending Category Distribution */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#6B8BA4] uppercase tracking-wider">
                {language === 'id' ? 'Grafik Visual 3' : 'Visual Chart 3'}
              </span>
              <h3 className="font-heading text-lg font-bold text-[#24303E] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#6B8BA4]" />
                {language === 'id' ? 'Distribusi Belanja Berdasarkan Kategori' : 'Shopping Spending by Category'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#6B8BA4]">
              Rp {totalBoughtAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <p className="text-xs text-[#5C6F80]">
            {language === 'id'
              ? 'Rincian nominal barang yang telah dibeli pada riwayat belanjamu berdasarkan kategori produk.'
              : 'Breakdown of purchased items in your shopping log sorted by product category.'}
          </p>

          {/* Horizontal Category Bars */}
          <div className="space-y-3 pt-2">
            {(Object.keys(categorySpending) as ProductCategory[]).map((catKey) => {
              const amount = categorySpending[catKey];
              const percentOfBought = totalBoughtAmount > 0 
                ? Math.round((amount / totalBoughtAmount) * 100) 
                : 0;
              const barWidth = Math.max(0, Math.min(100, (amount / maxCategorySpend) * 100));

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#24303E]">
                      {categoryLabels[catKey]?.[language] || catKey}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#7A8C9E] font-medium">{percentOfBought}%</span>
                      <span className="font-semibold text-[#24303E]">
                        Rp {amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F0EFEB] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        catKey === 'gadget' || catKey === 'fashion' 
                          ? 'bg-[#6B8BA4]' 
                          : catKey === 'fnb' || catKey === 'hobbies'
                          ? 'bg-[#8CA8BF]'
                          : 'bg-[#9EAEA2]'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#7A8C9E] pt-2 border-t border-[#EEF3F7] flex items-center justify-between">
            <span>{language === 'id' ? 'Total item dibeli bulan ini:' : 'Total items bought this month:'} {totalBoughtItems.length} item</span>
            <button
              onClick={() => onNavigate('history')}
              className="text-[#6B8BA4] hover:underline font-semibold"
            >
              {language === 'id' ? 'Lihat Riwayat Lengkap' : 'View Full History'}
            </button>
          </div>
        </div>

        {/* Chart 4: Decision Ratio & Emergency Fund Runway Gauge */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#6B8BA4] uppercase tracking-wider">
                {language === 'id' ? 'Grafik Visual 4' : 'Visual Chart 4'}
              </span>
              <h3 className="font-heading text-lg font-bold text-[#24303E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#9EAEA2]" />
                {language === 'id' ? 'Ketahanan Finansial & Disiplin Belanja' : 'Financial Runway & Discipline Rate'}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#9EAEA2]">
              {impulseResistanceRate}% {language === 'id' ? 'Resistensi' : 'Discipline'}
            </span>
          </div>

          {/* Emergency Fund Runway Gauge Card */}
          <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#24303E]">
                  {language === 'id' ? 'Ketahanan Dana Darurat' : 'Emergency Fund Runway'}
                </span>
                <span className="text-[11px] text-[#5C6F80] block">
                  {emergencyMonthsCurrent} {language === 'id' ? 'bulan dari target' : 'months of'} {targetMonths} {language === 'id' ? 'bulan' : 'months'}
                </span>
              </div>
              <span className="font-heading font-extrabold text-lg text-[#24303E]">
                {emergencyProgressPercent}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-white overflow-hidden p-0.5 border border-[#E2EAF0]">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  emergencyProgressPercent >= 100 
                    ? 'bg-[#9EAEA2]' 
                    : emergencyProgressPercent >= 50 
                    ? 'bg-[#6B8BA4]' 
                    : 'bg-[#D8A4B8]'
                }`}
                style={{ width: `${emergencyProgressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7A8C9E]">
              <span>Rp {emergencyFund.toLocaleString('id-ID')}</span>
              <span>Target: Rp {emergencyTargetAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Decision Outcome Distribution */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#24303E]">
              {language === 'id' ? 'Rasio Keputusan Evaluasi Belanja' : 'Evaluation Decision Distribution'}
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#10B981]">
                <span className="text-xs font-bold text-[#065F46] block">BUY</span>
                <span className="font-heading font-extrabold text-lg text-[#065F46]">
                  {totalBoughtItems.length}
                </span>
                <span className="text-[10px] text-[#047857] block font-medium">
                  {language === 'id' ? 'Layak Dibeli' : 'Approved'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]">
                <span className="text-xs font-bold text-[#9F1239] block">BYE</span>
                <span className="font-heading font-extrabold text-lg text-[#9F1239]">
                  {totalByeItems.length}
                </span>
                <span className="text-[10px] text-[#BE123C] block font-medium">
                  {language === 'id' ? 'Ditolak / Hemat' : 'Skipped / Saved'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF2FF] border border-[#818CF8]">
                <span className="text-xs font-bold text-[#3730A3] block">COOLING</span>
                <span className="font-heading font-extrabold text-lg text-[#3730A3]">
                  {totalCoolingItems.length}
                </span>
                <span className="text-[10px] text-[#4F46E5] block font-medium">
                  {language === 'id' ? 'Tahan 24-48 Jam' : 'Paused 24-48h'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E2EAF0]/40 text-xs text-[#506A80] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#6B8BA4] shrink-0" />
            <span>
              {language === 'id'
                ? `Setiap keputusan BYE rata-rata menyelamatkan Rp ${totalByeItems.length > 0 ? Math.round(totalSavedByeAmount / totalByeItems.length).toLocaleString('id-ID') : '0'} ke dompetmu.`
                : `Each BYE decision saved an average of Rp ${totalByeItems.length > 0 ? Math.round(totalSavedByeAmount / totalByeItems.length).toLocaleString('id-ID') : '0'} in your wallet.`}
            </span>
          </div>

        </div>

      </div>

      {/* SECTION 3: SARAN DAN MASUKAN (SMART ADVICE & RECOMMENDATIONS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B8BA4]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B8BA4]">
                {language === 'id' ? 'Advisory Engine' : 'Advisory Engine'}
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#24303E] flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#9EAEA2]" />
              {language === 'id' ? 'Saran & Masukan Cerdas Finansial' : 'Smart Financial Feedback & Actionable Advice'}
            </h2>
          </div>
          <span className="text-xs text-[#7A8C9E] font-medium">
            {language === 'id' ? 'Disesuaikan dengan Profil & Belanja' : 'Customized to your real numbers'}
          </span>
        </div>

        {/* 3 Core Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Recommendation 1: Lifestyle optimization */}
          <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-3 relative overflow-hidden group hover:border-[#6B8BA4] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#D8A4B8]/30 text-[#8A3A5A] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-heading font-bold text-base text-[#24303E]">
              {language === 'id' ? 'Optimasi Pos Lifestyle & Keinginan' : 'Lifestyle & Wishlist Optimization'}
            </h3>
            <p className="text-xs text-[#5C6F80] leading-relaxed">
              {lifestylePercent > 30 
                ? (language === 'id' 
                    ? `Pos lifestyle kamu mencapai ${lifestylePercent}%, melampaui batas aman 30%. Batasi checkout fnb delivery dan barang sekunder minggu ini untuk memulihkan sisa uang bebas.` 
                    : `Your lifestyle share is at ${lifestylePercent}%, surpassing the safe 30% limit. Cap food deliveries and impulse goods this week to restore liquid cash.`)
                : (language === 'id' 
                    ? `Pos lifestyle kamu berada di ${lifestylePercent}%, sangat proporsional! Pertahankan disiplin ini dengan selalu menyisihkan tabungan di awal gajian (Pay Yourself First).` 
                    : `Your lifestyle spending sits at a healthy ${lifestylePercent}%. Maintain this discipline by applying the Pay Yourself First principle at month-start.`)}
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#6B8BA4] flex items-center gap-1">
              <span>{language === 'id' ? 'Rekomendasi Tindakan' : 'Action Target'}:</span>
              <span className="text-[#24303E]">
                {lifestylePercent > 30 
                  ? (language === 'id' ? 'Turunkan ke 25-30%' : 'Lower to 25-30%') 
                  : (language === 'id' ? 'Pertahankan < 30%' : 'Keep under 30%')}
              </span>
            </div>
          </div>

          {/* Recommendation 2: Debt & Paylater Mitigation */}
          <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-3 relative overflow-hidden group hover:border-[#6B8BA4] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#9B8EA9]/30 text-[#5F4E73] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-heading font-bold text-base text-[#24303E]">
              {language === 'id' ? 'Mitigasi Cicilan & Paylater' : 'Debt & Paylater Risk Mitigation'}
            </h3>
            <p className="text-xs text-[#5C6F80] leading-relaxed">
              {dsr > 25 
                ? (language === 'id' 
                    ? `Rasio cicilanmu (${dsr}%) menyita porsi signifikan dari pemasukan bulanan. Hindari mengambil tenor cicilan baru hingga beban berjalan tuntas dilunasi.` 
                    : `Your installment ratio (${dsr}%) absorbs a hefty portion of monthly cash. Avoid taking any new installment tenors until current ones are settled.`)
                : (language === 'id' 
                    ? `Beban cicilanmu (${dsr}%) berada di zona aman. Jika hendak membeli barang bernilai tinggi, prioritaskan sinking fund (tabungan terencana) daripada tenor paylater berbunga.` 
                    : `Your installment load (${dsr}%) is safe. For future high-ticket items, prioritize sinking funds over interest-bearing buy-now-pay-later plans.`)}
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#6B8BA4] flex items-center gap-1">
              <span>{language === 'id' ? 'Ambang Batas Sehat' : 'Safe Benchmark'}:</span>
              <span className="text-[#24303E]">Maksimal 20-30%</span>
            </div>
          </div>

          {/* Recommendation 3: Emergency Fund Acceleration */}
          <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-3 relative overflow-hidden group hover:border-[#6B8BA4] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#9EAEA2]/30 text-[#396348] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-heading font-bold text-base text-[#24303E]">
              {language === 'id' ? 'Akselerasi Bantalan Dana Darurat' : 'Emergency Runway Acceleration'}
            </h3>
            <p className="text-xs text-[#5C6F80] leading-relaxed">
              {emergencyMonthsCurrent < 3 
                ? (language === 'id' 
                    ? `Dana daruratmu saat ini baru meng-cover ${emergencyMonthsCurrent} bulan pengeluaran pokok. Salurkan sebagian penghematan dari keputusan BYE langsung ke instrumen pasar uang likuid.` 
                    : `Your emergency fund currently covers ${emergencyMonthsCurrent} months of essentials. Channel savings from BYE decisions directly into liquid money market funds.`)
                : (language === 'id' 
                    ? `Bagus! Ketahanan dana daruratmu mencapai ${emergencyMonthsCurrent} bulan. Kamu memiliki kebebasan finansial dan keamanan psikologis yang kuat saat menghadapi kejadian mendadak.` 
                    : `Excellent! Your emergency runway covers ${emergencyMonthsCurrent} months. You possess strong financial security against unexpected life events.`)}
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#6B8BA4] flex items-center gap-1">
              <span>{language === 'id' ? 'Target Minimal' : 'Target Buffer'}:</span>
              <span className="text-[#24303E]">3 - 6 {language === 'id' ? 'bulan pengeluaran' : 'months expenses'}</span>
            </div>
          </div>

        </div>

        {/* Interactive "What-If" Scenario Simulator */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#F8F6F2] via-white to-[#F8F6F2] border border-[#E2EAF0] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#6B8BA4]/15 text-[#587893] text-[11px] font-bold">
                <Sliders className="w-3.5 h-3.5" />
                {language === 'id' ? 'Simulator Skenario Hemat' : 'What-If Savings Simulator'}
              </span>
              <h3 className="font-heading font-bold text-base text-[#24303E]">
                {language === 'id' 
                  ? 'Bagaimana jika kamu memangkas pengeluaran gaya hidup?' 
                  : 'What if you trimmed your lifestyle spending?'}
              </h3>
            </div>

            {/* Percentage selector pills */}
            <div className="flex items-center gap-2">
              {[10, 15, 20, 30].map(pct => (
                <button
                  key={pct}
                  onClick={() => setWhatIfPercent(pct)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    whatIfPercent === pct 
                      ? 'bg-[#6B8BA4] text-white shadow-xs' 
                      : 'bg-white text-[#5C6F80] border border-[#E2EAF0] hover:bg-[#F8F6F2]'
                  }`}
                >
                  -{pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-[#E2EAF0]">
              <span className="text-[11px] text-[#7A8C9E] font-medium block">
                {language === 'id' ? 'Penghematan Ekstra / Bulan' : 'Extra Monthly Savings'}
              </span>
              <span className="font-heading font-extrabold text-base text-[#396348]">
                + Rp {Math.round(whatIfSavedPerMonth).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2EAF0]">
              <span className="text-[11px] text-[#7A8C9E] font-medium block">
                {language === 'id' ? 'Tambahan Dana / Tahun' : 'Annual Accumulated Surplus'}
              </span>
              <span className="font-heading font-extrabold text-base text-[#6B8BA4]">
                + Rp {Math.round(whatIfSavedPerYear).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2EAF0]">
              <span className="text-[11px] text-[#7A8C9E] font-medium block">
                {language === 'id' ? 'Percepatan Runway Darurat' : 'Extra Runway Acceleration'}
              </span>
              <span className="font-heading font-extrabold text-base text-[#9EAEA2]">
                +{whatIfEmergencyMonthsAdded} {language === 'id' ? 'bulan tambahan' : 'extra months'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Action Plan Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#24303E] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9EAEA2]" />
              {language === 'id' ? 'Checklist Rencana Tindakan Bulan Ini' : 'This Month Action Plan Checklist'}
            </h3>
            <span className="text-[11px] text-[#7A8C9E]">
              {Object.values(actionChecks).filter(Boolean).length}/4 {language === 'id' ? 'Tercapai' : 'Done'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'audit_subscriptions',
                title: language === 'id' ? 'Audit Langganan Digital & Aplikasi' : 'Audit App Subscriptions',
                desc: language === 'id' ? 'Batalkan langganan streaming atau tools yang tidak dipakai 30 hari terakhir.' : 'Cancel recurring charges unused in the last 30 days.'
              },
              {
                id: 'autopay_savings',
                title: language === 'id' ? 'Autodebet Tabungan di Awal Bulan' : 'Auto-Transfer Savings on Payday',
                desc: language === 'id' ? 'Sisihkan 10-20% pendapatan sebelum mulai membelanjakan pos keinginan.' : 'Save 10-20% before spending any discretionary money.'
              },
              {
                id: 'paylater_freeze',
                title: language === 'id' ? 'Bekukan Transaksi Paylater Baru' : 'Freeze New Paylater Charges',
                desc: language === 'id' ? 'Fokus lunasi tagihan berjalan tanpa menambah tenor atau beban bunga baru.' : 'Focus on active balance without rolling into new installments.'
              },
              {
                id: 'cooling_off_discipline',
                title: language === 'id' ? 'Terapkan Aturan 24 Jam Sebelum Checkout' : 'Apply 24-Hour Rule Before Checkout',
                desc: language === 'id' ? 'Diamkan keranjang belanja online minimal satu malam untuk redam impuls emosional.' : 'Let cart rest overnight to diffuse emotional triggers.'
              }
            ].map(item => {
              const checked = !!actionChecks[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleActionCheck(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    checked 
                      ? 'bg-white border-[#9EAEA2] shadow-xs' 
                      : 'bg-[#F8F6F2] border-[#E2EAF0] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    checked ? 'bg-[#9EAEA2] text-white' : 'border border-[#D5DFE7] bg-white'
                  }`}>
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${checked ? 'text-[#24303E]' : 'text-[#5C6F80]'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#7A8C9E] mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SECTION 4: DATA-DATA KEUANGAN LAINNYA (DETAILED AUDIT TABLE & RECENT LOGS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Full Financial Buckets Table */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-[#24303E] flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#6B8BA4]" />
              {language === 'id' ? 'Rincian Lengkap Data Keuangan' : 'Detailed Financial Breakdown'}
            </h3>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs font-bold text-[#6B8BA4] hover:underline"
            >
              {language === 'id' ? 'Perbarui Data' : 'Update Values'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#EEF3F7] text-[#7A8C9E]">
                  <th className="pb-3 font-semibold">{language === 'id' ? 'POS ANGGARAN' : 'BUDGET BUCKET'}</th>
                  <th className="pb-3 font-semibold text-right">{language === 'id' ? 'NOMINAL (RP)' : 'AMOUNT (IDR)'}</th>
                  <th className="pb-3 font-semibold text-right">{language === 'id' ? 'PORSI' : 'SHARE'}</th>
                  <th className="pb-3 font-semibold text-right">{language === 'id' ? 'STATUS AMBANG' : 'THRESHOLD'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3F7]">
                
                <tr>
                  <td className="py-3 font-bold text-[#24303E]">
                    {language === 'id' ? 'Pemasukan Bulanan (Inflow)' : 'Monthly Inflow'}
                  </td>
                  <td className="py-3 font-bold text-right text-[#24303E]">
                    Rp {income.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right text-[#7A8C9E]">100%</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-[#E2EAF0] text-[#506A80] text-[10px] font-bold">
                      Base
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 text-[#24303E]">
                    {language === 'id' ? 'Kebutuhan Pokok (Living Needs)' : 'Living Needs (Essentials)'}
                  </td>
                  <td className="py-3 text-right font-medium text-[#24303E]">
                    Rp {essentials.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right text-[#7A8C9E]">{essentialsPercent}%</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      essentialsPercent <= 50 ? 'bg-[#9EAEA2]/20 text-[#396348]' : 'bg-[#D8A4B8]/30 text-[#8A3A5A]'
                    }`}>
                      {essentialsPercent <= 50 ? 'Ideal (≤50%)' : 'Melebihi (>50%)'}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 text-[#24303E]">
                    {language === 'id' ? 'Wishlist & Gaya Hidup (Wants)' : 'Wishlist & Lifestyle'}
                  </td>
                  <td className="py-3 text-right font-medium text-[#24303E]">
                    Rp {lifestyle.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right text-[#7A8C9E]">{lifestylePercent}%</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lifestylePercent <= 30 ? 'bg-[#9EAEA2]/20 text-[#396348]' : 'bg-[#D8A4B8]/30 text-[#8A3A5A]'
                    }`}>
                      {lifestylePercent <= 30 ? 'Ideal (≤30%)' : 'Waspada (>30%)'}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 text-[#24303E]">
                    {language === 'id' ? 'Cicilan & Kewajiban (Debts)' : 'Debts & Installments'}
                  </td>
                  <td className="py-3 text-right font-medium text-[#24303E]">
                    Rp {debts.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right text-[#7A8C9E]">{debtsPercent}%</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      debtsPercent <= 20 ? 'bg-[#9EAEA2]/20 text-[#396348]' : debtsPercent <= 30 ? 'bg-[#E5D7A3]/30 text-[#826E2B]' : 'bg-[#D8A4B8]/30 text-[#8A3A5A]'
                    }`}>
                      {debtsPercent <= 20 ? 'Aman (≤20%)' : debtsPercent <= 30 ? 'Perhatian' : 'Bahaya (>30%)'}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 text-[#24303E]">
                    {language === 'id' ? 'Tabungan Rutin (Savings)' : 'Routine Savings'}
                  </td>
                  <td className="py-3 text-right font-medium text-[#24303E]">
                    Rp {savings.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right text-[#7A8C9E]">{savingsPercent}%</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      savingsPercent >= 10 ? 'bg-[#9EAEA2]/20 text-[#396348]' : 'bg-[#E5D7A3]/30 text-[#826E2B]'
                    }`}>
                      {savingsPercent >= 10 ? 'Bagus (≥10%)' : 'Tingkatkan'}
                    </span>
                  </td>
                </tr>

                <tr className="bg-[#F8F6F2]">
                  <td className="py-3 font-bold text-[#24303E]">
                    {language === 'id' ? 'Sisa Uang Bebas (Discretionary)' : 'Net Discretionary Surplus'}
                  </td>
                  <td className={`py-3 font-bold text-right ${isDeficit ? 'text-[#B84E75]' : 'text-[#396348]'}`}>
                    {isDeficit ? `- Rp ${deficitAmount.toLocaleString('id-ID')}` : `Rp ${discretionaryCash.toLocaleString('id-ID')}`}
                  </td>
                  <td className="py-3 text-right text-[#7A8C9E]">{freeCashPercent}%</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      !isDeficit ? 'bg-[#9EAEA2]/20 text-[#396348]' : 'bg-[#D8A4B8]/30 text-[#8A3A5A]'
                    }`}>
                      {!isDeficit ? 'Surplus' : 'Defisit'}
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#7A8C9E]">
            <span>
              {language === 'id' ? 'Dana Darurat Tersimpan:' : 'Accumulated Emergency Fund:'}{' '}
              <strong className="text-[#24303E]">Rp {emergencyFund.toLocaleString('id-ID')}</strong> ({emergencyMonthsCurrent} bulan)
            </span>
            <span>
              {language === 'id' ? 'Target Runway:' : 'Target Runway:'}{' '}
              <strong className="text-[#24303E]">{targetMonths} bulan</strong>
            </span>
          </div>
        </div>

        {/* Shopping Decision Activity Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2EAF0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-[#24303E] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8CA8BF]" />
              {language === 'id' ? 'Aktivitas Belanja' : 'Shopping Activity'}
            </h3>
            <span className="text-xs text-[#7A8C9E]">
              {filteredItems.length} {language === 'id' ? 'Catatan' : 'Logs'}
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7A8C9E] space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#D5DFE7] mx-auto" />
              <p>{language === 'id' ? 'Belum ada catatan belanja di periode ini.' : 'No shopping activity recorded for this period.'}</p>
              <button
                onClick={() => onNavigate('evaluate')}
                className="font-bold text-[#6B8BA4] hover:underline"
              >
                {language === 'id' ? 'Mulai Evaluasi Barang' : 'Evaluate an Item'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.slice(0, 5).map((it) => (
                <div 
                  key={it.id}
                  className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#24303E] truncate">
                      {it.productName}
                    </p>
                    <p className="text-[10px] text-[#7A8C9E]">
                      {categoryLabels[it.category]?.[language] || it.category} · {it.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#24303E] block">
                      Rp {it.price.toLocaleString('id-ID')}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      it.status === 'bought' ? 'text-[#396348]' : it.status === 'saved_bye' ? 'text-[#8A3A5A]' : 'text-[#5F4E73]'
                    }`}>
                      {it.status === 'bought' ? 'DIBELI' : it.status === 'saved_bye' ? 'BYE (HEMAT)' : 'TUNDA'}
                    </span>
                  </div>
                </div>
              ))}

              {filteredItems.length > 5 && (
                <button
                  onClick={() => onNavigate('history')}
                  className="w-full py-2 text-center text-xs font-bold text-[#6B8BA4] hover:text-[#587893] transition-colors"
                >
                  {language === 'id' ? `Lihat ${filteredItems.length - 5} transaksi lainnya →` : `View remaining ${filteredItems.length - 5} items →`}
                </button>
              )}
            </div>
          )}

          {/* Quick PDF button */}
          <div className="pt-2 border-t border-[#EEF3F7]">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E2EAF0] text-[#24303E] font-semibold text-xs border border-[#D5DFE7] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Cetak Laporan Lengkap (PDF)' : 'Print Full Statement (PDF)'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Educational Callout & Navigation Helper */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#6B8BA4]/10 via-[#8CA8BF]/15 to-[#B8D5E5]/20 border border-[#B8D5E5]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B8BA4] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#24303E]">
              {language === 'id' ? 'Perdalam Literasi Finansialmu' : 'Expand Your Financial Literacy'}
            </h4>
            <p className="text-xs text-[#5C6F80]">
              {language === 'id'
                ? 'Pelajari bahaya paylater, cara membedakan kebutuhan vs keinginan, dan artikel finansial terkini.'
                : 'Master impulse control, real paylater interest calculations, and updated financial articles.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('education')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8F6F2] text-[#24303E] text-xs font-semibold border border-[#D5DFE7] shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>{language === 'id' ? 'Buka Edukasi Finansial' : 'Explore Education'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#6B8BA4]" />
        </button>
      </div>

    </div>
  );
};
