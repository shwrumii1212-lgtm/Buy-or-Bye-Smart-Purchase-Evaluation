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

  // Mini Quiz state for Needs vs Wants
  const [quizScore, setQuizScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, boolean>>({});

  const quizQuestions = [
    {
      id: 1,
      item: 'Laptop baru spesifikasi gaming seharga Rp 22 juta untuk mahasiswa jurusan sastra yang laptop lamanya masih berjalan normal.',
      itemEn: 'A high-end $1,500 gaming laptop for a literature student whose current laptop runs perfectly.',
      correct: 'wants',
      explanationId: 'Keinginan (Wants). Laptop lama masih memadai untuk tugas kuliah. Ini dorongan upgrade gaya hidup/hobi gaming.',
      explanationEn: 'Want. Current laptop functions well for literature studies. This is a lifestyle gaming upgrade.'
    },
    {
      id: 2,
      item: 'Servis rem dan ganti ban motor harian yang sudah gundul untuk berangkat kerja.',
      itemEn: 'Replacing worn-out motorcycle tires and brake pads used daily to commute to work.',
      correct: 'needs',
      explanationId: 'Kebutuhan (Needs). Terkait keselamatan nyawa dan mata pencaharian harian.',
      explanationEn: 'Need. Essential for personal safety and earning daily livelihood.'
    },
    {
      id: 3,
      item: 'Paket langganan 4 platform streaming film sekaligus (Netflix, Disney+, Prime, Max).',
      itemEn: 'Simultaneously subscribing to 4 movie streaming platforms.',
      correct: 'wants',
      explanationId: 'Keinginan (Wants). Cukup pilih 1 platform secara bergantian per bulan untuk menghemat ratusan ribu.',
      explanationEn: 'Want. Rotating between one platform per month saves considerable money.'
    },
    {
      id: 4,
      item: 'Kacamata resep baru karena lensa lama pecah dan minus bertambah.',
      itemEn: 'Prescription eyeglasses after old lenses cracked and vision deteriorated.',
      correct: 'needs',
      explanationId: 'Kebutuhan (Needs). Alat bantu kesehatan medis wajib untuk beraktivitas normal.',
      explanationEn: 'Need. Vital health aid necessary for everyday vision and work.'
    }
  ];

  // Paylater interactive calculator
  const [calcPrice, setCalcPrice] = useState(1500000);
  const [calcTenor, setCalcTenor] = useState(6);
  const [calcMonthlyRate, setCalcMonthlyRate] = useState(2.95);

  const paylaterTotalFee = Math.round(calcPrice * (calcMonthlyRate / 100) * calcTenor);
  const paylaterAdminFee = 25000; // biaya admin transaksi
  const paylaterGrandTotal = calcPrice + paylaterTotalFee + paylaterAdminFee;
  const paylaterMonthlyPayment = Math.round(paylaterGrandTotal / calcTenor);
  const paylaterOverpayPercent = Number((((paylaterGrandTotal - calcPrice) / calcPrice) * 100).toFixed(1));

  const handleAnswerQuiz = (questionId: number, answer: 'needs' | 'wants') => {
    if (answeredMap[questionId] !== undefined) return;
    const q = quizQuestions.find(item => item.id === questionId);
    if (!q) return;

    const isCorrect = q.correct === answer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setAnsweredMap(prev => ({ ...prev, [questionId]: isCorrect }));
  };

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
                const isAnswered = answeredMap[q.id] !== undefined;
                const wasCorrect = answeredMap[q.id] === true;

                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-white border border-[#E5ECF2] space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-[#24303E] leading-relaxed">
                      {language === 'id' ? q.item : q.itemEn}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleAnswerQuiz(q.id, 'needs')}
                        disabled={isAnswered}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isAnswered
                            ? (q.correct === 'needs' ? 'bg-[#EAF0EB] text-[#47634F] border-[#9EAEA2]' : 'opacity-40 border-[#E2EAF0]')
                            : 'bg-[#F8F6F2] hover:bg-[#EFECE6] border-[#DDE4EB] text-[#485C6E]'
                        }`}
                      >
                        Kebutuhan (Needs)
                      </button>

                      <button
                        onClick={() => handleAnswerQuiz(q.id, 'wants')}
                        disabled={isAnswered}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isAnswered
                            ? (q.correct === 'wants' ? 'bg-[#FBF1F5] text-[#8E4362] border-[#D8A4B8]' : 'opacity-40 border-[#E2EAF0]')
                            : 'bg-[#F8F6F2] hover:bg-[#EFECE6] border-[#DDE4EB] text-[#485C6E]'
                        }`}
                      >
                        Keinginan (Wants)
                      </button>

                      {isAnswered && (
                        <span className={`text-xs font-bold flex items-center gap-1 ml-2 ${
                          wasCorrect ? 'text-[#47634F]' : 'text-[#8E4362]'
                        }`}>
                          {wasCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {wasCorrect ? 'Tepat!' : 'Kurang Tepat'}
                        </span>
                      )}
                    </div>

                    {isAnswered && (
                      <p className="text-[11px] text-[#55697A] bg-[#F8F6F2] p-2.5 rounded-xl border border-[#EAEFF4]">
                        <strong>Penjelasan:</strong> {language === 'id' ? q.explanationId : q.explanationEn}
                      </p>
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
