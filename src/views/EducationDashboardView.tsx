import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck, 
  PiggyBank, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  ArrowRight, 
  ArrowLeft, 
  TrendingUp, 
  Brain,
  Newspaper,
  ExternalLink,
  Search,
  X,
  Tag
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { EDUCATIONAL_ARTICLES, EducationalArticle } from '../utils/articlesData';

interface EducationDashboardViewProps {
  language: Language;
  onNavigate?: (view: string) => void;
}

export const EducationDashboardView: React.FC<EducationDashboardViewProps> = ({
  language,
  onNavigate,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'needs_wants' | 'paylater' | 'emergency' | 'impulse' | 'articles'>('needs_wants');
  
  // Articles state
  const [articleCategory, setArticleCategory] = useState<string>('all');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);

  // Mini Quiz state for 5 Key Financial & Behavioral Literacy Domains
  const [quizScore, setQuizScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, { selectedId: string; isCorrect: boolean }>>({});

  const quizQuestions = [
    {
      id: 1,
      topic: 'Kebutuhan vs Keinginan',
      topicEn: 'Needs vs Wants',
      question: 'Manakah dari daftar pengeluaran berikut yang merupakan KEBUTUHAN POKOK (Needs) esensial yang wajib diprioritaskan?',
      questionEn: 'Which of the following expenses represents a genuine ESSENTIAL NEED that must be prioritized?',
      options: [
        { id: 'opt_1', text: 'Upgrade smartphone model terbaru saat ponsel lama masih lancar', textEn: 'Upgrading to the newest smartphone while your current phone runs fine' },
        { id: 'opt_2', text: 'Servis rem dan ganti ban motor harian untuk keselamatan berangkat kerja', textEn: 'Servicing brakes and replacing worn tires on a daily commuter vehicle' },
        { id: 'opt_3', text: 'Langganan 4 platform video streaming sekaligus setiap bulan', textEn: 'Simultaneously subscribing to 4 video streaming platforms' },
        { id: 'opt_4', text: 'Beli blind box hiasan meja saat checkout online shop', textEn: 'Adding trendy collectible blind boxes to your online shopping cart' }
      ],
      correctId: 'opt_2',
      explanationId: 'Kebutuhan (Needs) adalah pengeluaran vital yang menyangkut keselamatan fisik, kesehatan, dan kelangsungan mencari nafkah harian.',
      explanationEn: 'Needs are critical expenses directly tied to physical safety, basic health, and your ability to earn a livelihood.'
    },
    {
      id: 2,
      topic: 'Budgeting (Aturan 50 / 30 / 20)',
      topicEn: 'Budgeting (50/30/20 Rule)',
      question: 'Berdasarkan pedoman budgeting 50/30/20 yang sehat, berapa persentase maksimal penghasilan bulanan untuk pos Keinginan & Gaya Hidup (Wants)?',
      questionEn: 'Under the healthy 50/30/20 budget framework, what is the maximum recommended allocation for Lifestyle & Wants?',
      options: [
        { id: 'opt_1', text: 'Maksimal 50% dari penghasilan bulanan', textEn: 'Up to 50% of monthly income' },
        { id: 'opt_2', text: 'Maksimal 30% dari penghasilan bulanan', textEn: 'Maximum 30% of monthly income' },
        { id: 'opt_3', text: 'Maksimal 10% saja', textEn: 'Only 10% maximum' },
        { id: 'opt_4', text: 'Bebas selama uang di tabungan belum habis', textEn: 'As much as desired until the bank account empties' }
      ],
      correctId: 'opt_2',
      explanationId: 'Aturan 50/30/20 menganjurkan maksimal 30% untuk gaya hidup/wishlist, 50% untuk kebutuhan pokok (needs), dan minimal 20% untuk tabungan/investasi serta cicilan produktif.',
      explanationEn: 'The 50/30/20 rule designates a maximum of 30% for lifestyle wants, 50% for core living needs, and at least 20% for routine savings and debt management.'
    },
    {
      id: 3,
      topic: 'Impulsive Buying & Dopamine',
      topicEn: 'Impulsive Buying & Dopamine Triggers',
      question: 'Saat melihat promo flash sale dengan countdown timer "Sisa 5 Menit", langkah paling rasional untuk mengendalikan nafsu checkout adalah...',
      questionEn: 'When confronted with a flash sale timer counting down "5 Minutes Left", what is the most mindful step to prevent impulse buying?',
      options: [
        { id: 'opt_1', text: 'Langsung klik bayar dengan PayLater agar diskon tidak hangus', textEn: 'Immediately checkout with PayLater before the timer expires' },
        { id: 'opt_2', text: 'Terapkan Aturan Jeda 24 Jam (Cooling-off) dan tinggalkan keranjang belanja', textEn: 'Apply the 24-Hour Cooling-Off Rule and step away from the cart' },
        { id: 'opt_3', text: 'Beli 2 barang sekaligus agar mendapat diskon bundling tambahan', textEn: 'Purchase 2 items to unlock an extra bundling discount' },
        { id: 'opt_4', text: 'Tanyakan ke media sosial sambil menunggu diskon berikutnya', textEn: 'Ask on social media while hunting for more vouchers' }
      ],
      correctId: 'opt_2',
      explanationId: 'Aturan Cooling-off 24–48 jam terbukti meredakan lonjakan dopamin sesaat akibat manipulasi marketing e-commerce. Setelah 24 jam, lebih dari 70% dorongan checkout akan mereda dengan sendirinya.',
      explanationEn: 'The 24-48 hour cooling-off period allows emotional dopamine spikes to normalize. Over 70% of impulse buying urges disappear once the artificial urgency fades.'
    },
    {
      id: 4,
      topic: 'Dana Darurat (Emergency Runway)',
      topicEn: 'Emergency Fund Runway',
      question: 'Berapa besaran Dana Darurat ideal yang wajib disiapkan pekerja lajang sebelum mengalokasikan uang ke barang hobi bernilai besar?',
      questionEn: 'What is the ideal emergency reserve a single professional should maintain before spending on high-ticket discretionary hobbies?',
      options: [
        { id: 'opt_1', text: 'Cukup 1 minggu uang jajan', textEn: 'Just 1 week of pocket cash' },
        { id: 'opt_2', text: 'Minimal 3 hingga 6 bulan pengeluaran kebutuhan pokok', textEn: 'At least 3 to 6 months of basic living expenses' },
        { id: 'opt_3', text: 'Tidak perlu simpan uang tunai, andalkan pinjaman online', textEn: 'No cash needed, rely on revolving digital loans' },
        { id: 'opt_4', text: '12 tahun gaji tahunan', textEn: '12 years of full gross income' }
      ],
      correctId: 'opt_2',
      explanationId: 'Dana darurat sebesar 3–6 bulan pengeluaran pokok adalah benteng perlindungan finansial jika terjadi PHK, sakit, atau darurat keluarga tanpa harus terjebak utang berbunga.',
      explanationEn: 'A 3 to 6 month emergency fund provides a solid financial runway against unforeseen medical crises or job loss without having to resort to predatory debt.'
    },
    {
      id: 5,
      topic: 'PayLater & Risiko Utang (DSR)',
      topicEn: 'PayLater & Debt Service Ratio (DSR)',
      question: 'Berapa batas aman maksimal rasio total cicilan utang bulanan (Debt Service Ratio / DSR) terhadap penghasilan bersih agar tidak terancam gagal bayar?',
      questionEn: 'What is the safe ceiling for your monthly Debt Service Ratio (DSR) relative to your take-home pay to prevent debt traps?',
      options: [
        { id: 'opt_1', text: 'Maksimal 30% dari pemasukan bulanan', textEn: 'Maximum 30% of net monthly income' },
        { id: 'opt_2', text: 'Maksimal 75% dari pemasukan bulanan', textEn: 'Up to 75% of monthly income' },
        { id: 'opt_3', text: 'Bebas selama limit aplikasi PayLater masih ada', textEn: 'Unlimited as long as digital credit limit remains' },
        { id: 'opt_4', text: 'Maksimal 90% dari sisa saldo rekening', textEn: 'Up to 90% of available bank balance' }
      ],
      correctId: 'opt_1',
      explanationId: 'Batas DSR maksimal yang sehat adalah 30%. Jika cicilan melebihi 30%, kamu rentan kehabisan kas operasional dan terpaksa menggunakan utang baru untuk membayar utang lama (gali lubang tutup lubang).',
      explanationEn: 'A healthy DSR ceiling is 30%. Exceeding 30% severely constricts routine living cash flow and frequently spirals into dangerous revolving debt cycles.'
    }
  ];

  const handleAnswerQuiz = (questionId: number, selectedOptionId: string) => {
    if (answeredMap[questionId] !== undefined) return;
    const q = quizQuestions.find(item => item.id === questionId);
    if (!q) return;

    const isCorrect = q.correctId === selectedOptionId;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setAnsweredMap(prev => ({
      ...prev,
      [questionId]: { selectedId: selectedOptionId, isCorrect }
    }));
  };

  // Paylater interactive calculator
  const [calcPrice, setCalcPrice] = useState(1500000);
  const [calcTenor, setCalcTenor] = useState(6);
  const [calcMonthlyRate, setCalcMonthlyRate] = useState(2.95);

  const paylaterTotalFee = Math.round(calcPrice * (calcMonthlyRate / 100) * calcTenor);
  const paylaterAdminFee = 25000; // biaya admin transaksi
  const paylaterGrandTotal = calcPrice + paylaterTotalFee + paylaterAdminFee;
  const paylaterMonthlyPayment = Math.round(paylaterGrandTotal / calcTenor);
  const paylaterOverpayPercent = Number((((paylaterGrandTotal - calcPrice) / calcPrice) * 100).toFixed(1));

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

      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#6B8BA4]" />
          <span>Mindset & Literacy</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E]">
          {t.eduTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6F80] mt-1 max-w-xl">
          {t.eduSubtitle}
        </p>

        {/* Tab switchers */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#EEF3F7]">
          <button
            onClick={() => setActiveTab('needs_wants')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'needs_wants'
                ? 'bg-[#6B8BA4] text-white shadow-xs'
                : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
            }`}
          >
            {t.tabNeedsWants}
          </button>
          <button
            onClick={() => setActiveTab('paylater')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'paylater'
                ? 'bg-[#D8A4B8] text-white shadow-xs'
                : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
            }`}
          >
            {t.tabPaylater}
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'emergency'
                ? 'bg-[#9EAEA2] text-white shadow-xs'
                : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
            }`}
          >
            {t.tabEmergency}
          </button>
          <button
            onClick={() => setActiveTab('impulse')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'impulse'
                ? 'bg-[#9B8EA9] text-white shadow-xs'
                : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
            }`}
          >
            {t.tabTraps}
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'articles'
                ? 'bg-[#6B8BA4] text-white shadow-xs'
                : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Artikel Finansial Terkini' : 'Latest Financial Articles'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#9EAEA2] text-white text-[9px] font-bold">Baru</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Needs vs Wants Interactive Sorter */}
      {activeTab === 'needs_wants' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold">
                50%
              </div>
              <h3 className="font-heading text-lg font-bold text-[#24303E]">
                Kebutuhan Pokok (Needs)
              </h3>
              <p className="text-xs text-[#55697A] leading-relaxed">
                Segala sesuatu yang jika dihilangkan akan mengganggu kelangsungan hidup, kesehatan mendasar, keselamatan fisik, atau kemampuanmu bekerja mencari nafkah (contoh: makanan pokok bergizi, sewa tempat tinggal, obat-obatan rutin, listrik, kuota kerja).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5EBEF] text-[#D8A4B8] flex items-center justify-center font-bold">
                30%
              </div>
              <h3 className="font-heading text-lg font-bold text-[#24303E]">
                Keinginan & Gaya Hidup (Wants)
              </h3>
              <p className="text-xs text-[#55697A] leading-relaxed">
                Barang atau pengalaman yang membuat hidup lebih menyenangkan atau meningkatkan status sosial, tetapi ketiadaannya tidak mengancam kelangsungan hidupmu (contoh: baju baru setiap bulan saat lemari masih penuh, kopi kekinian harian, ganti smartphone tiap rilis baru).
              </p>
            </div>
          </div>

          {/* Interactive Quiz Sorter */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B8BA4]">Latihan Interaktif</span>
                <h3 className="font-heading text-lg font-bold text-[#24303E] mt-0.5">
                  {t.quizTitle}
                </h3>
                <p className="text-xs text-[#5C6F80]">{t.quizDesc}</p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DDE4EB] text-xs font-bold text-[#24303E]">
                Skor Kamu: {quizScore} / {quizQuestions.length}
              </div>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q) => {
                const answerState = answeredMap[q.id];
                const isAnswered = answerState !== undefined;
                const wasCorrect = answerState?.isCorrect;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-white border border-[#E5ECF2] shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E2EAF0] text-[#506A80] text-[10px] font-bold uppercase tracking-wider">
                        {language === 'id' ? q.topic : q.topicEn}
                      </span>
                      {isAnswered && (
                        <span className={`text-xs font-bold flex items-center gap-1 ${
                          wasCorrect ? 'text-[#059669]' : 'text-[#E11D48]'
                        }`}>
                          {wasCorrect ? <CheckCircle2 className="w-4 h-4 text-[#059669]" /> : <XCircle className="w-4 h-4 text-[#E11D48]" />}
                          <span>{wasCorrect ? (language === 'id' ? 'Benar!' : 'Correct!') : (language === 'id' ? 'Kurang Tepat' : 'Incorrect')}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-[#24303E] leading-relaxed">
                      {q.id}. {language === 'id' ? q.question : q.questionEn}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = answerState?.selectedId === opt.id;
                        const isThisCorrect = opt.id === q.correctId;

                        let btnStyle = 'bg-[#FBFBFA] border-[#DDE4EB] text-[#485C6E] hover:bg-[#F2F6F9]';
                        if (isAnswered) {
                          if (isThisCorrect) {
                            btnStyle = 'bg-[#ECFDF5] border-[#10B981] text-[#065F46] font-bold ring-2 ring-[#10B981]/20';
                          } else if (isSelected && !wasCorrect) {
                            btnStyle = 'bg-[#FFF1F2] border-[#F43F5E] text-[#9F1239] font-bold';
                          } else {
                            btnStyle = 'opacity-40 border-[#E2EAF0] text-[#7A8C9E] bg-[#F8F6F2]';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] font-bold ring-2 ring-[#D8A4B8]/30';
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleAnswerQuiz(q.id, opt.id)}
                            disabled={isAnswered}
                            className={`p-3 rounded-xl text-xs text-left border transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white/80 border border-current text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {opt.id.replace('opt_', '')}
                            </span>
                            <span className="leading-snug">
                              {language === 'id' ? opt.text : opt.textEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="text-[11px] text-[#485C6E] bg-[#F8F6F2] p-3 rounded-xl border border-[#EAEFF4] space-y-1 animate-in fade-in">
                        <strong className="text-[#24303E] block">
                          💡 {language === 'id' ? 'Penjelasan Edukasi' : 'Educational Insight'}:
                        </strong>
                        <p className="leading-relaxed">
                          {language === 'id' ? q.explanationId : q.explanationEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: The Real Cost of Paylater */}
      {activeTab === 'paylater' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input params */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D8A4B8]">Simulator Interaktif</span>
                <h3 className="font-heading text-xl font-bold text-[#24303E] mt-0.5">
                  {t.paylaterCalcTitle}
                </h3>
                <p className="text-xs text-[#5C6F80] mt-1">
                  {t.paylaterCalcDesc}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24303E] mb-1">
                  Harga Asli Produk (Tunai)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#7A8C9E]">Rp</span>
                  <input
                    type="number"
                    step="100000"
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#24303E] mb-1">
                    Tenor Cicilan
                  </label>
                  <select
                    value={calcTenor}
                    onChange={(e) => setCalcTenor(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
                  >
                    <option value={1}>1 Bulan</option>
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24303E] mb-1">
                    Bunga per Bulan (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcMonthlyRate}
                    onChange={(e) => setCalcMonthlyRate(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F5D5E0] text-xs text-[#A8486A] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Psikologi Jebakan Paylater:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Otak manusia merespons nominal kecil cicilan bulanan (e.g., Rp 200rb/bulan terasa enteng), padahal total uang yang hilang jauh lebih mahal dan membebani arus kas berbulan-bulan.
                </p>
              </div>
            </div>

            {/* Calculated Visual Result Box */}
            <div className="p-6 rounded-3xl bg-[#F8F6F2] border border-[#E5ECF2] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E0E7ED]">
                  <span className="text-xs text-[#7A8C9E]">Harga Asli (Tunai)</span>
                  <span className="text-sm font-bold text-[#24303E]">Rp {calcPrice.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#E0E7ED]">
                  <span className="text-xs text-[#7A8C9E]">Total Bunga & Biaya Layanan</span>
                  <span className="text-sm font-bold text-[#D8A4B8]">
                    + Rp {(paylaterTotalFee + paylaterAdminFee).toLocaleString('id-ID')} ({paylaterOverpayPercent}%)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#E0E7ED]">
                  <span className="text-xs font-bold text-[#24303E]">Total yang Sebenarnya Kamu Bayar</span>
                  <span className="text-xl font-heading font-black text-[#24303E]">
                    Rp {paylaterGrandTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DCE5ED] text-center">
                  <p className="text-[11px] text-[#7A8C9E] uppercase font-bold">Cicilan Wajib Tiap Bulan ({calcTenor}x)</p>
                  <p className="text-2xl font-heading font-extrabold text-[#6B8BA4] mt-0.5">
                    Rp {paylaterMonthlyPayment.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#7A8C9E]">/ bulan</span>
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#7A8C9E] text-center italic">
                *Simpan uangmu dan bayar lunas tunai untuk menghemat Rp {(paylaterTotalFee + paylaterAdminFee).toLocaleString('id-ID')}.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Emergency Runway */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9EAEA2]">Benteng Pertahanan</span>
              <h3 className="font-heading text-xl font-bold text-[#24303E] mt-0.5">
                {t.emergencyRuleTitle}
              </h3>
              <p className="text-xs text-[#5C6F80] mt-1 max-w-2xl">
                {t.emergencyRuleDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#9EAEA2] text-white">Tahap 1: Minimal</span>
                <h4 className="font-heading text-base font-bold text-[#24303E]">3 Bulan Pengeluaran Pokok</h4>
                <p className="text-xs text-[#5C6F80] leading-relaxed">
                  Wajib untuk pekerja lajang / first jobber. Melindungimu jika jatuh sakit atau mendadak ganti tempat tinggal.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#6B8BA4] text-white">Tahap 2: Ideal</span>
                <h4 className="font-heading text-base font-bold text-[#24303E]">6 Bulan Pengeluaran Pokok</h4>
                <p className="text-xs text-[#5C6F80] leading-relaxed">
                  Standar kenyamanan finansial. Memberimu waktu mencari pekerjaan baru yang berkualitas tanpa panik menerima tawaran apa pun.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#9B8EA9] text-white">Tahap 3: Maksimal</span>
                <h4 className="font-heading text-base font-bold text-[#24303E]">12 Bulan Pengeluaran Pokok</h4>
                <p className="text-xs text-[#5C6F80] leading-relaxed">
                  Sangat dianjurkan bagi pekerja lepas (freelancer), wirausahawan, atau pencari nafkah tunggal keluarga dengan tanggungan.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF0EB] border border-[#D0DFD3] text-xs text-[#3E5C44] space-y-1">
              <p className="font-bold">Di mana menyimpan Dana Darurat?</p>
              <p className="text-[11px] leading-relaxed">
                Di instrumen likuid berisiko rendah yang bisa ditarik kapan saja 24/7 tanpa penalti: Reksa Dana Pasar Uang (RDPU) atau Bank Digital dengan bunga kompetitif. Jangan simpan di saham, kripto, atau didepositokan terkunci.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Impulse Buying Triggers */}
      {activeTab === 'impulse' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#F5EBEF] text-[#D8A4B8] flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="font-heading text-base font-bold text-[#24303E]">Doom Spending & Retail Therapy</h4>
              <p className="text-xs text-[#5C6F80] leading-relaxed">
                Membeli barang untuk meredakan stres pekerjaan atau kesepian. Belanja memberi suntikan dopamin cepat yang bertahan 15 menit, namun meninggalkan rasa bersalah dan saldo berkurang.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#EDE8F2] text-[#9B8EA9] flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="font-heading text-base font-bold text-[#24303E]">Flash Sale & Countdown Timer FOMO</h4>
              <p className="text-xs text-[#5C6F80] leading-relaxed">
                Timer hitung mundur "Promo berakhir dalam 01:23:45" sengaja mematikan bagian otak logis kita (prefrontal cortex) agar kita checkout secara terburu-buru karena takut rugi.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="font-heading text-base font-bold text-[#24303E]">The Diderot Effect (Spiral Belanja)</h4>
              <p className="text-xs text-[#5C6F80] leading-relaxed">
                Membeli satu barang baru (misal: meja kerja baru) membuat barang lama terlihat usang, lalu memicu keinginan membeli lampu baru, keyboard baru, dan kursi baru hingga uang habis.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF0EB] text-[#9EAEA2] flex items-center justify-center font-bold">
                04
              </div>
              <h4 className="font-heading text-base font-bold text-[#24303E]">Ilusi Diskon: "Hemat Rp 500.000"</h4>
              <p className="text-xs text-[#5C6F80] leading-relaxed">
                Jika barang seharga Rp 1.000.000 diskon menjadi Rp 700.000 dan kamu tidak membutuhkannya, kamu BUKAN menghemat Rp 300.000 — kamu baru saja menghabiskan Rp 700.000 sia-sia!
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 5: Latest Educational Articles */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          
          {/* Header & Search Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B8BA4]">Pembaruan Rutin</span>
                <h3 className="font-heading text-xl font-bold text-[#24303E] mt-0.5">
                  {language === 'id' ? 'Artikel & Wawasan Finansial Terkini' : 'Curated Financial Articles & Insights'}
                </h3>
                <p className="text-xs text-[#5C6F80]">
                  {language === 'id' 
                    ? 'Baca wawasan terkini seputar psikologi konsumen, strategi menabung, dan pertahanan terhadap konsumerisme.' 
                    : 'Stay updated with psychological insights, smart budgeting mechanics, and anti-impulse strategies.'}
                </p>
              </div>

              {/* Search bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#8CA8BF] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder={language === 'id' ? 'Cari judul atau topik...' : 'Search articles...'}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EEF3F7]">
              {[
                { id: 'all', label: language === 'id' ? 'Semua Topik' : 'All Topics' },
                { id: 'mindset', label: language === 'id' ? 'Psikologi & FOMO' : 'Psychology & FOMO' },
                { id: 'paylater', label: language === 'id' ? 'Bahaya Paylater' : 'Paylater Trap' },
                { id: 'budgeting', label: language === 'id' ? 'Sinking Fund & Budget' : 'Sinking Funds' },
                { id: 'emergency', label: language === 'id' ? 'Dana Darurat' : 'Emergency Fund' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setArticleCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    articleCategory === c.id
                      ? 'bg-[#6B8BA4] text-white shadow-xs'
                      : 'bg-[#F8F6F2] text-[#55697A] hover:bg-[#EFECE6]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EDUCATIONAL_ARTICLES
              .filter((art) => {
                if (articleCategory !== 'all' && art.category !== articleCategory) return false;
                if (articleSearch.trim()) {
                  const q = articleSearch.toLowerCase();
                  const matchId = art.title.toLowerCase().includes(q) || art.summary.toLowerCase().includes(q);
                  const matchEn = art.titleEn.toLowerCase().includes(q) || art.summaryEn.toLowerCase().includes(q);
                  return matchId || matchEn;
                }
                return true;
              })
              .map((article) => {
                const title = language === 'id' ? article.title : article.titleEn;
                const summary = language === 'id' ? article.summary : article.summaryEn;

                return (
                  <div
                    key={article.id}
                    className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs hover:border-[#6B8BA4]/60 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-[#E2EAF0] text-[#506A80]">
                          {article.category.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[#7A8C9E]">
                          {article.readTime} · {article.date}
                        </span>
                      </div>

                      <h4 className="font-heading text-base font-bold text-[#24303E] group-hover:text-[#6B8BA4] transition-colors leading-snug">
                        {title}
                      </h4>

                      <p className="text-xs text-[#5C6F80] leading-relaxed line-clamp-3">
                        {summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0F4F7] flex items-center justify-between">
                      <span className="text-[11px] text-[#7A8C9E] font-medium">
                        Oleh: {article.author}
                      </span>

                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#6B8BA4] hover:text-[#527189] transition-colors cursor-pointer"
                      >
                        <span>{language === 'id' ? 'Baca Selengkapnya' : 'Read Article'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* Interactive Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24303E]/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2EAF0] my-8 overflow-hidden animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6B8BA4] via-[#8CA8BF] to-[#B8D5E5] p-6 text-white relative">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Newspaper className="w-3 h-3" />
                {selectedArticle.category.toUpperCase()} · {selectedArticle.readTime}
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold leading-snug">
                {language === 'id' ? selectedArticle.title : selectedArticle.titleEn}
              </h2>
              <p className="text-xs text-white/85 mt-1">
                Ditulis oleh {selectedArticle.author} · {selectedArticle.date}
              </p>
            </div>

            {/* Scrollable Article Body */}
            <div className="p-6 sm:p-8 space-y-5 max-h-[65vh] overflow-y-auto">
              
              {/* Content Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm text-[#384A5C] leading-relaxed">
                {(language === 'id' ? selectedArticle.content : selectedArticle.contentEn).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] space-y-2">
                <h4 className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#9EAEA2]" />
                  <span>Poin Utama Pembelajaran (Key Takeaways):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#506272]">
                  {(language === 'id' ? selectedArticle.keyTakeaways : selectedArticle.keyTakeawaysEn).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#6B8BA4] font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* External source reference link if exists */}
              {selectedArticle.sourceUrl && (
                <div className="pt-2 text-right">
                  <a
                    href={selectedArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B8BA4] hover:underline"
                  >
                    <span>{language === 'id' ? 'Buka Referensi Tambahan Luar' : 'Read External Source'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-[#F8F6F2] px-6 py-4 border-t border-[#E8EFF5] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white shadow-xs cursor-pointer"
              >
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
