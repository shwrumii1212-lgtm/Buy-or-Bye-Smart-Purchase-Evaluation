import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Link as LinkIcon, 
  Sparkles, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Info,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { EvaluationItem, FinancialProfile, Language, PaymentMethod, ProductCategory } from '../types';
import { translations, categoryLabels } from '../utils/translations';
import { parseEcommerceUrl, ParsedUrlData } from '../utils/urlParser';
import { runRuleBasedEvaluation } from '../utils/evaluationEngine';
import { EvaluationResultModal } from '../components/EvaluationResultModal';

interface EvaluationViewProps {
  userId: string;
  userName: string;
  finance: FinancialProfile;
  language: Language;
  onNavigate?: (view: string) => void;
  onSaveEvaluation: (evaluation: EvaluationItem) => void;
  onSaveToHistory: (evaluation: EvaluationItem, status: 'bought' | 'saved_bye' | 'cooling_down') => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  userId,
  userName,
  finance,
  language,
  onNavigate,
  onSaveEvaluation,
  onSaveToHistory,
}) => {
  const t = translations[language];

  // Mode input barang: bisa langsung murni manual tanpa link, atau tempel link produk jika ada
  const [inputMode, setInputMode] = useState<'link' | 'manual'>('manual');

  // Form states

  const [productUrl, setProductUrl] = useState('');
  const [parsedData, setParsedData] = useState<ParsedUrlData | null>(null);
  const [productName, setProductName] = useState('');
  
  // Price state as numeric value, and priceDisplay as formatted string
  const [price, setPrice] = useState<number>(0);
  const [priceInputText, setPriceInputText] = useState('');
  
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [paylaterTenorMonths, setPaylaterTenorMonths] = useState<number>(3);
  const [paylaterFeePercent, setPaylaterFeePercent] = useState<number>(2.95);

  // Behavioral questions - initialized to NULL (unanswered by default)
  const [urgencyScore, setUrgencyScore] = useState<number | null>(null);
  const [hasSimilarItem, setHasSimilarItem] = useState<boolean | null>(null);
  const [usedFrequency, setUsedFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'rarely' | null>(null);
  const [coolingOffPassed, setCoolingOffPassed] = useState<boolean | null>(null);

  // 5 Psychological / Mindset questions state - initialized to NULL (unanswered by default)
  const [psyNeedVsWant, setPsyNeedVsWant] = useState<'essential_need' | 'lifestyle_want' | null>(null);
  const [psyDiscountTrap, setPsyDiscountTrap] = useState<'just_because_sale' | 'planned_long_ago' | null>(null);
  const [psyFomoPressure, setPsyFomoPressure] = useState<'saw_on_social' | 'personal_need' | null>(null);
  const [psyDelayReady, setPsyDelayReady] = useState<'ready_to_wait' | 'urge_to_checkout_now' | null>(null);
  const [psyPostPurchaseMood, setPsyPostPurchaseMood] = useState<'guilt_potential' | 'confident_useful' | null>(null);

  // Hitung pertanyaan pertama yang belum terjawab (active question pointer 1-9)
  const getActiveQuestionIndex = () => {
    if (psyNeedVsWant === null) return 1;
    if (psyDiscountTrap === null) return 2;
    if (psyFomoPressure === null) return 3;
    if (psyDelayReady === null) return 4;
    if (psyPostPurchaseMood === null) return 5;
    if (urgencyScore === null) return 6;
    if (hasSimilarItem === null) return 7;
    if (usedFrequency === null) return 8;
    if (coolingOffPassed === null) return 9;
    return 10; // Semua sudah terjawab
  };
  const activeQ = getActiveQuestionIndex();

  // Validation state when user attempts to submit
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result modal state
  const [evaluating, setEvaluating] = useState(false);
  const [currentResult, setCurrentResult] = useState<EvaluationItem | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [autoLinkedAlert, setAutoLinkedAlert] = useState<string | null>(null);

  // Reset form when user explicitly wants to start a fresh test
  const handleResetTest = () => {
    setProductUrl('');
    setParsedData(null);
    setProductName('');
    setPrice(0);
    setPriceInputText('');
    setCategory('');
    setPaymentMethod('');
    setPaylaterTenorMonths(3);
    setPaylaterFeePercent(2.95);
    setUrgencyScore(null);
    setHasSimilarItem(null);
    setUsedFrequency(null);
    setCoolingOffPassed(null);
    setPsyNeedVsWant(null);
    setPsyDiscountTrap(null);
    setPsyFomoPressure(null);
    setPsyDelayReady(null);
    setPsyPostPurchaseMood(null);
    setValidationError(null);
    setAutoLinkedAlert(
      language === 'id' 
        ? 'Formulir tes baru telah disiapkan. Semua pertanyaan telah dikosongkan.' 
        : 'Fresh test initiated. All question answers cleared.'
    );
    setTimeout(() => setAutoLinkedAlert(null), 3500);
  };

  // Safe handler for price input (strips dots, letters, spaces, prevents NaN or stepMismatch)
  const handlePriceChange = (valStr: string) => {
    const numericOnly = valStr.replace(/[^0-9]/g, '');
    if (!numericOnly) {
      setPrice(0);
      setPriceInputText('');
      return;
    }
    const num = parseInt(numericOnly, 10);
    setPrice(num);
    setPriceInputText(num.toLocaleString('id-ID'));
  };

  // Quick preset amount buttons
  const handleSetQuickPrice = (amount: number) => {
    setPrice(amount);
    setPriceInputText(amount.toLocaleString('id-ID'));
  };

  // Process & Link URL
  const processUrlAndAutofill = (inputUrl: string) => {
    if (!inputUrl || inputUrl.trim().length < 5) return;
    const parsed = parseEcommerceUrl(inputUrl);
    setParsedData(parsed);

    if (parsed.detectedName) {
      setProductName(parsed.detectedName);
    }
    if (parsed.isReliablePrice && parsed.detectedPrice) {
      setPrice(parsed.detectedPrice);
      setPriceInputText(parsed.detectedPrice.toLocaleString('id-ID'));
    }
    // Kategori dan metode pembayaran tetap dikosongkan agar pengguna menentukan sendiri

    if (parsed.hasExactData) {
      setAutoLinkedAlert(
        language === 'id'
          ? `Data produk terverifikasi dari ${parsed.platform}. Nama dan harga telah tersinkronisasi.`
          : `Product data verified from ${parsed.platform}. Details synchronized.`
      );
    } else {
      setAutoLinkedAlert(parsed.message || null);
    }
    setTimeout(() => setAutoLinkedAlert(null), 12000);
  };

  // URL input change handler
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProductUrl(val);
    if (val.trim()) setInputMode('link');
    if (val.trim()) {
      setInputMode('link');
    }
    if (val.trim().length > 10) {
      processUrlAndAutofill(val);
    } else {
      setParsedData(null);
    }
  };

  // Fast demo product links
  const handleSampleLink = (type: 'shopee' | 'tokopedia' | 'tiktok' | 'zalora') => {
    setInputMode('link');
    setInputMode('link');
    let url = '';
    if (type === 'shopee') {
      url = 'https://shopee.co.id/Sepatu-Sneakers-Casual-Canvas-Low-Top-i.12847.928172';
    } else if (type === 'tokopedia') {
      url = 'https://tokopedia.com/tech/mechanical-keyboard-wireless-rgb-hot-swappable';
    } else if (type === 'tiktok') {
      url = 'https://shop.tiktok.com/view/product/skincare-serum-niacinamide-10-percent';
    } else {
      url = 'https://zalora.co.id/p/vintage-oversized-fleece-hoodie-jacket';
    }
    setProductUrl(url);
    processUrlAndAutofill(url);
  };

  // Check whether all required questions are answered
  const areAllQuestionsAnswered = Boolean(
    psyNeedVsWant !== null &&
    psyDiscountTrap !== null &&
    psyFomoPressure !== null &&
    psyDelayReady !== null &&
    psyPostPurchaseMood !== null &&
    urgencyScore !== null &&
    hasSimilarItem !== null &&
    usedFrequency !== null &&
    coolingOffPassed !== null
  );

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      setValidationError(language === 'id' ? 'Mohon isi nama produk terlebih dahulu.' : 'Please provide product name.');
      return;
    }

    if (!price || price <= 0) {
      setValidationError(language === 'id' ? 'Mohon masukkan nominal harga riil produk.' : 'Please enter valid product price.');
      return;
    }

    if (!areAllQuestionsAnswered) {
      setValidationError(
        language === 'id'
          ? 'Harap jawab semua pertanyaan uji psikologi & kebiasaan belanja terlebih dahulu sebelum menghitung hasil.'
          : 'Please answer all psychological and habit assessment questions before evaluating.'
      );
      return;
    }

    setValidationError(null);
    setEvaluating(true);

    setTimeout(() => {
      const evaluation = runRuleBasedEvaluation(
        {
          userId,
          productUrl: productUrl.trim() || undefined,
          productName: productName.trim(),
          category: category as ProductCategory,
          paymentMethod: paymentMethod as PaymentMethod,
          price,
          paylaterTenorMonths: paymentMethod === 'paylater' ? paylaterTenorMonths : undefined,
          paylaterFeePercent: paymentMethod === 'paylater' ? paylaterFeePercent : undefined,
          urgencyScore: urgencyScore ?? 3,
          hasSimilarItem: hasSimilarItem ?? false,
          usedFrequency: usedFrequency ?? 'weekly',
          coolingOffPassed: coolingOffPassed ?? false,
          psyDiscountTrap: psyDiscountTrap ?? undefined,
          psyFomoPressure: psyFomoPressure ?? undefined,
          psyNeedVsWant: psyNeedVsWant ?? undefined,
          psyDelayReady: psyDelayReady ?? undefined,
          psyPostPurchaseMood: psyPostPurchaseMood ?? undefined,
        },
        finance,
        language
      );

      onSaveEvaluation(evaluation);
      setCurrentResult(evaluation);
      setEvaluating(false);
      setResultModalOpen(true);
    }, 450);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Top action bar: Back + Reset */}
      <div className="flex items-center justify-between">
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

        <button
          type="button"
          onClick={handleResetTest}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D8A4B8] bg-[#FFF8FA] hover:bg-[#FCEEF3] text-xs font-semibold text-[#8E4362] transition-all cursor-pointer shadow-xs ml-auto"
          title="Kosongkan seluruh pertanyaan dan mulai evaluasi baru dari awal"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#C487A0]" />
          <span>{language === 'id' ? 'Mulai Tes Baru (Kosongkan)' : 'Start Fresh Test (Clear All)'}</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#6B8BA4]" />
          <span>Rule-Based Purchase Gatekeeper</span>
        </div>
        <h1 className="font-berkshire text-2xl sm:text-3xl font-extrabold text-[#24303E]">
          {t.evalTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6F80] mt-1 max-w-xl">
          {t.evalSubtitle}
        </p>


      </div>

      {/* Main Form */}
            {/* Warning banner if financial profile has not been set up */}
      {(!finance || finance.monthlyIncome <= 0) && (
        <div className="p-5 rounded-3xl bg-[#FFF8FA] border-2 border-[#D8A4B8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5EBEF] text-[#8E4362] flex items-center justify-center font-bold shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-[#D8A4B8]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#8E4362]">
                {language === "id" ? "Profil Keuangan Belum Diatur (Pemasukan Rp 0)" : "Financial Profile Not Yet Configured"}
              </h3>
              <p className="text-xs text-[#5C6F80] mt-0.5 leading-relaxed max-w-xl">
                {language === "id"
                  ? "Tanpa data pemasukan & pos pengeluaran, sisa uang bebasmu terdeteksi Rp 0 sehingga barang sewajar apapun akan otomatis terbaca \"BYE\" karena dinilai tidak mampu beli. Atur profil keuanganmu terlebih dahulu agar evaluasi akurat!"
                  : "Without your income and expense data, your free cash buffer is $0, meaning every purchase automatically verdicts as \"BYE\". Please set up your financial profile first for accurate evaluation!"}
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("finance")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-heading font-extrabold shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <span>{language === "id" ? "Atur Profil Keuangan Sekarang →" : "Set Up Finances Now →"}</span>
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleEvaluate} className="space-y-6">
        
        {/* Bagian 1: Data Barang & Mode Input */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEF3F7]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E2EAF0] text-[#6B8BA4] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-heading text-sm font-bold text-[#24303E]">
                {language === 'id' ? 'Informasi Barang' : 'Item Information'}
              </h2>
            </div>

            {/* Toggle Tab Buttons */}
            <div className="flex items-center bg-[#F2F6F9] p-1 rounded-2xl border border-[#DCE4EC] shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  inputMode === 'manual'
                    ? 'bg-white text-[#24303E] shadow-xs ring-1 ring-[#CBD7E2]'
                    : 'text-[#617485] hover:text-[#24303E]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#6B8BA4]" />
                <span>{language === 'id' ? 'Input Manual' : 'Manual Input'}</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('link')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  inputMode === 'link'
                    ? 'bg-white text-[#24303E] shadow-xs ring-1 ring-[#CBD7E2]'
                    : 'text-[#617485] hover:text-[#24303E]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#6B8BA4]" />
                <span>{language === 'id' ? 'Pakai Link' : 'Use Link'}</span>
              </button>
            </div>
          </div>

          {/* Jika Mode Link dipilih, tampilkan input field URL e-commerce */}
          {inputMode === 'link' && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#24303E]">
                  {t.urlInputLabel}
                </label>
                {productUrl && (
                  <button
                    type="button"
                    onClick={() => processUrlAndAutofill(productUrl)}
                    className="text-xs font-semibold text-[#6B8BA4] hover:text-[#527189] flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ekstrak Ulang</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <LinkIcon className="w-4 h-4 text-[#8CA8BF] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={productUrl}
                  onChange={handleUrlChange}
                  placeholder={t.urlInputPlaceholder}
                  className="w-full pl-10 pr-4 py-3 text-xs font-medium rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] transition-all"
                />
              </div>

              {/* Notifikasi Transparan Terkait Limit Enkripsi E-Commerce */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#F3DFC1] text-xs text-[#7A531C] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#694411]">
                  <AlertTriangle className="w-4 h-4 text-[#C9822B] shrink-0" />
                  <span>
                    {language === 'id' 
                      ? 'Pemberitahuan Proteksi Enkripsi E-Commerce:' 
                      : 'E-Commerce Encryption Notice:'}
                  </span>
                </div>
                <p className="leading-relaxed text-[#7A531C]">
                  {language === 'id'
                    ? 'Marketplace (Shopee, Tokopedia, TikTok Shop, dll.) menerapkan sistem proteksi anti-bot & enkripsi dinamis pada halaman mereka, sehingga nama barang atau harga diskon/varian terkadang tidak dapat dibaca 100% akurat. Mohon selalu pastikan dan sesuaikan nama barang serta nominal harga riil pada kolom di bawah.'
                    : 'Major marketplaces use anti-bot encryption and dynamic rendering, which may prevent full automated extraction of product titles or variant prices. Please verify and adjust the product name and actual price in the fields below.'}
                </p>
              </div>

              {/* Connected Link Preview Card */}
              {parsedData && parsedData.platform && (
                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#6B8BA4] text-white text-xs font-bold uppercase tracking-wider">
                        {parsedData.platform}
                      </span>
                      <span className="text-xs font-semibold text-[#47634F] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tautan Terhubung
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#24303E]">
                      {productName || parsedData.detectedName || 'Produk E-Commerce'}
                    </p>
                    <p className="text-xs text-[#7A8C9E]">
                      {price > 0 ? `Nominal: Rp ${price.toLocaleString('id-ID')}` : 'Nominal: Silakan isi pada kolom harga di bawah'}
                    </p>
                  </div>
                  {parsedData.cleanUrl && (
                    <a
                      href={parsedData.cleanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5DFE7] text-xs font-semibold text-[#485C6E] hover:bg-[#F2F6F9] hover:border-[#6B8BA4] transition-all shrink-0 cursor-pointer shadow-2xs"
                    >
                      <span>Buka URL Asli</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#6B8BA4]" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dynamic Alert / Status Notice for link extraction */}
          {autoLinkedAlert && (
            <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#CFDFEB] text-xs text-[#243E56] flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#6B8BA4] shrink-0 mt-0.5" />
                <div className="leading-relaxed text-xs font-medium">{autoLinkedAlert}</div>
              </div>
              <button
                type="button"
                onClick={() => setAutoLinkedAlert(null)}
                className="text-[#88A0B5] hover:text-[#243E56] text-xs font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Product Name & Price Fields */}
          <div className="pt-1 space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name Input */}
              <div>
                <label className="block text-xs font-bold text-[#24303E] mb-1">
                  {t.productNameLabel} *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={language === 'id' ? 'Misal: Sepatu Sneakers Canvas, Smartwatch Pro...' : 'e.g. Retro Canvas Sneakers, Mechanical Keyboard...'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                  required
                />
              </div>

              {/* Price Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#24303E]">
                    {t.priceLabel} *
                  </label>
                  {price > 0 && (
                    <span className="text-xs font-semibold text-[#6B8BA4]">
                      Rp {price.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#7A8C9E]">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceInputText}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="Contoh: 350.000"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] font-semibold"
                    required
                  />
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs text-[#7A8C9E]">Pilihan Cepat:</span>
                  {[100000, 250000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSetQuickPrice(amt)}
                      className="px-2 py-0.5 text-xs rounded-md bg-[#F2F6F9] hover:bg-[#E2EAF0] text-[#55697A] font-semibold transition-colors cursor-pointer"
                    >
                      {amt >= 1000000 ? `${amt / 1000000}jt` : `${amt / 1000}rb`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Category: Empty by default */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.categoryLabel} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] ${
                  !category ? 'border-[#D5DFE7] text-[#8CA8BF]' : 'border-[#CFDCE6] text-[#24303E] font-medium'
                }`}
                required
              >
                <option value="" disabled>
                  {language === 'id' ? '-- Pilih Kategori Produk --' : '-- Select Product Category --'}
                </option>
                <option value="fashion">{categoryLabels.fashion[language]}</option>
                <option value="gadget">{categoryLabels.gadget[language]}</option>
                <option value="beauty">{categoryLabels.beauty[language]}</option>
                <option value="fnb">{categoryLabels.fnb[language]}</option>
                <option value="home">{categoryLabels.home[language]}</option>
                <option value="hobbies">{categoryLabels.hobbies[language]}</option>
                <option value="subscription">{categoryLabels.subscription[language]}</option>
                <option value="other">{categoryLabels.other[language]}</option>
              </select>
            </div>

            {/* Payment Method: Empty by default */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.paymentMethodLabel} *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] ${
                  !paymentMethod ? 'border-[#D5DFE7] text-[#8CA8BF]' : 'border-[#CFDCE6] text-[#24303E] font-medium'
                }`}
                required
              >
                <option value="" disabled>
                  {language === 'id' ? '-- Pilih Metode Pembayaran --' : '-- Select Payment Method --'}
                </option>
                <option value="cash">
                  {language === 'id' ? 'Uang Tunai (Cash)' : 'Cash'}
                </option>
                <option value="debit">
                  {language === 'id' ? 'Kartu Debit / QRIS' : 'Debit Card / QRIS'}
                </option>
                <option value="credit_card">
                  {language === 'id' ? 'Kartu Kredit' : 'Credit Card'}
                </option>
                <option value="savings">
                  {language === 'id' ? 'Tabungan (Tarik Tabungan)' : 'Savings (Withdraw)'}
                </option>
                <option value="paylater">
                  {language === 'id' ? 'PayLater' : 'PayLater'}
                </option>
              </select>
            </div>
          </div>

          {/* Paylater Extra Parameters */}
          {paymentMethod === 'paylater' && (
            <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F5D5E0] space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A8486A]">
                <AlertTriangle className="w-4 h-4 text-[#D8A4B8]" />
                <span>Simulasi Cicilan Paylater</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5C6F80] mb-1">
                    {t.paylaterTenorLabel}
                  </label>
                  <select
                    value={paylaterTenorMonths}
                    onChange={(e) => setPaylaterTenorMonths(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D5DFE7] bg-white"
                  >
                    <option value={1}>1 Bulan (Bayar Bulan Depan)</option>
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C6F80] mb-1">
                    {t.paylaterFeeLabel} (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={paylaterFeePercent}
                    onChange={(e) => setPaylaterFeePercent(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D5DFE7] bg-white"
                  />
                </div>
              </div>
              {price > 0 && (
                <div className="text-xs text-[#A8486A] bg-white p-2.5 rounded-lg border border-[#F5D5E0] flex justify-between">
                  <span>{t.monthlyInstallmentEst}:</span>
                  <strong>
                    Rp {Math.round((price * (1 + (paylaterFeePercent / 100) * paylaterTenorMonths)) / paylaterTenorMonths).toLocaleString('id-ID')} / bln
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bagian 2: Uji Psikologi & Kebiasaan Belanja */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E2EAF0] text-[#6B8BA4] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-heading text-sm font-bold text-[#24303E]">
                {language === 'id' ? 'Uji Psikologi & Kebiasaan Belanja' : 'Psychology & Habit Assessment'}
              </h2>
            </div>

            {/* Answered Counter Badge */}
            <div className="px-3 py-1 rounded-full text-xs font-bold border border-[#DCE4EC] bg-[#F8F6F2] text-[#55697A]">
              {[
                psyNeedVsWant,
                psyDiscountTrap,
                psyFomoPressure,
                psyDelayReady,
                psyPostPurchaseMood,
                urgencyScore,
                hasSimilarItem,
                usedFrequency,
                coolingOffPassed
              ].filter(v => v !== null).length} / 9 Terjawab
            </div>
          </div>

          {/* Pertanyaan 1: Kebutuhan Pokok vs Keinginan */}
          <div className={`p-4.5 rounded-2xl transition-all duration-300 space-y-2.5 border ${
            activeQ === 1
              ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
              : psyNeedVsWant !== null
                ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                : 'bg-[#FAF8F5] border-[#E8EFF5]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B8BA4] uppercase tracking-wider flex items-center gap-1.5">
                {activeQ === 1 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                )}
                <span>{language === 'id' ? 'Pertanyaan 1 · Kebutuhan vs Keinginan' : 'Question 1 · Need vs Want'}</span>
              </span>
              {psyNeedVsWant !== null && (
                <span className="text-xs font-bold text-[#2D4A33] bg-[#EAF0EB] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5B41]" />
                  <span>{language === 'id' ? 'Terjawab' : 'Answered'}</span>
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#24303E]">
              {language === 'id'
                ? 'Apakah barang ini merupakan kebutuhan primer yang jika tidak dibeli akan mengganggu kelangsungan hidup/bekerja?'
                : 'Is this an essential necessity without which your daily life or work will be severely disrupted?'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPsyNeedVsWant('essential_need')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyNeedVsWant === 'essential_need'
                    ? 'bg-[#EAF0EB] border-[#9EAEA2] text-[#2D4A33] shadow-xs ring-2 ring-[#9EAEA2]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Ya, Kebutuhan Mendesak/Primer' : 'Yes, Urgent Essential Need'}</span>
                {psyNeedVsWant === 'essential_need' && <CheckCircle2 className="w-4 h-4 text-[#3B5B41]" />}
              </button>

              <button
                type="button"
                onClick={() => setPsyNeedVsWant('lifestyle_want')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyNeedVsWant === 'lifestyle_want'
                    ? 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] shadow-xs ring-2 ring-[#D8A4B8]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Bukan, Ini Keinginan / Gaya Hidup' : 'No, It is a Lifestyle Want'}</span>
                {psyNeedVsWant === 'lifestyle_want' && <CheckCircle2 className="w-4 h-4 text-[#C487A0]" />}
              </button>
            </div>
          </div>

          {/* Pertanyaan 2: Jebakan Diskon / Promo */}
          <div className={`p-4.5 rounded-2xl transition-all duration-300 space-y-2.5 border ${
            activeQ === 2
              ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
              : psyDiscountTrap !== null
                ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                : 'bg-[#FAF8F5] border-[#E8EFF5]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B8BA4] uppercase tracking-wider flex items-center gap-1.5">
                {activeQ === 2 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                )}
                <span>{language === 'id' ? 'Pertanyaan 2 · Jebakan Diskon & Promo' : 'Question 2 · Discount Trap'}</span>
              </span>
              {psyDiscountTrap !== null && (
                <span className="text-xs font-bold text-[#2D4A33] bg-[#EAF0EB] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5B41]" />
                  <span>{language === 'id' ? 'Terjawab' : 'Answered'}</span>
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#24303E]">
              {language === 'id'
                ? 'Jika barang ini sedang TIDAK diskon atau dijual harga normal, apakah kamu tetap berencana membelinya?'
                : 'If this item were NOT on sale and sold at full retail price, would you still intend to buy it?'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPsyDiscountTrap('just_because_sale')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyDiscountTrap === 'just_because_sale'
                    ? 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] shadow-xs ring-2 ring-[#D8A4B8]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Mungkin Tidak, Tertarik karena Diskon' : 'Probably Not, Tempted by the Discount'}</span>
                {psyDiscountTrap === 'just_because_sale' && <CheckCircle2 className="w-4 h-4 text-[#C487A0]" />}
              </button>

              <button
                type="button"
                onClick={() => setPsyDiscountTrap('planned_long_ago')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyDiscountTrap === 'planned_long_ago'
                    ? 'bg-[#EAF0EB] border-[#9EAEA2] text-[#2D4A33] shadow-xs ring-2 ring-[#9EAEA2]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Tetap Beli, Sudah Direncanakan Lama' : 'Still Buy, Planned Well in Advance'}</span>
                {psyDiscountTrap === 'planned_long_ago' && <CheckCircle2 className="w-4 h-4 text-[#3B5B41]" />}
              </button>
            </div>
          </div>

          {/* Pertanyaan 3: Tekanan FOMO & Media Sosial */}
          <div className={`p-4.5 rounded-2xl transition-all duration-300 space-y-2.5 border ${
            activeQ === 3
              ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
              : psyFomoPressure !== null
                ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                : 'bg-[#FAF8F5] border-[#E8EFF5]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B8BA4] uppercase tracking-wider flex items-center gap-1.5">
                {activeQ === 3 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs">
                    <span className="text-xs">👉</span>
                  </span>
                )}
                <span>{language === 'id' ? 'Pertanyaan 3 · Pengaruh FOMO & Tren Sosial' : 'Question 3 · FOMO & Social Trends'}</span>
              </span>
              {psyFomoPressure !== null && (
                <span className="text-xs font-bold text-[#2D4A33] bg-[#EAF0EB] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5B41]" />
                  <span>{language === 'id' ? 'Terjawab' : 'Answered'}</span>
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#24303E]">
              {language === 'id'
                ? 'Dari mana awal mula keinginan membeli barang ini muncul?'
                : 'Where did the initial urge to buy this item originate?'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPsyFomoPressure('saw_on_social')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyFomoPressure === 'saw_on_social'
                    ? 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] shadow-xs ring-2 ring-[#D8A4B8]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Melihat Tren di TikTok/IG/Teman (FOMO)' : 'Saw on TikTok/IG/Friends (FOMO)'}</span>
                {psyFomoPressure === 'saw_on_social' && <CheckCircle2 className="w-4 h-4 text-[#C487A0]" />}
              </button>

              <button
                type="button"
                onClick={() => setPsyFomoPressure('personal_need')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyFomoPressure === 'personal_need'
                    ? 'bg-[#EAF0EB] border-[#9EAEA2] text-[#2D4A33] shadow-xs ring-2 ring-[#9EAEA2]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Kebutuhan Pribadi Mandiri' : 'Genuine Personal Utility Need'}</span>
                {psyFomoPressure === 'personal_need' && <CheckCircle2 className="w-4 h-4 text-[#3B5B41]" />}
              </button>
            </div>
          </div>

          {/* Pertanyaan 4: Uji Menunda Pembelian (Dopamine Delay) */}
          <div className={`p-4.5 rounded-2xl transition-all duration-300 space-y-2.5 border ${
            activeQ === 4
              ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
              : psyDelayReady !== null
                ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                : 'bg-[#FAF8F5] border-[#E8EFF5]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B8BA4] uppercase tracking-wider flex items-center gap-1.5">
                {activeQ === 4 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                )}
                <span>{language === 'id' ? 'Pertanyaan 4 · Kesiapan Menunda (Cooling Off)' : 'Question 4 · Delay Readiness'}</span>
              </span>
              {psyDelayReady !== null && (
                <span className="text-xs font-bold text-[#2D4A33] bg-[#EAF0EB] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5B41]" />
                  <span>{language === 'id' ? 'Terjawab' : 'Answered'}</span>
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#24303E]">
              {language === 'id'
                ? 'Bisakah kamu menunda pembelian ini selama 3–7 hari tanpa merasa cemas atau rugi?'
                : 'Can you delay this purchase for 3–7 days without feeling severe anxiety or loss?'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPsyDelayReady('ready_to_wait')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyDelayReady === 'ready_to_wait'
                    ? 'bg-[#EAF0EB] border-[#9EAEA2] text-[#2D4A33] shadow-xs ring-2 ring-[#9EAEA2]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Bisa, Tidak Masalah Menunggu' : 'Yes, Happy to Wait and Reflect'}</span>
                {psyDelayReady === 'ready_to_wait' && <CheckCircle2 className="w-4 h-4 text-[#3B5B41]" />}
              </button>

              <button
                type="button"
                onClick={() => setPsyDelayReady('urge_to_checkout_now')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyDelayReady === 'urge_to_checkout_now'
                    ? 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] shadow-xs ring-2 ring-[#D8A4B8]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Sulit, Ingin Checkout Sekarang' : 'Difficult, Urge to Checkout Now'}</span>
                {psyDelayReady === 'urge_to_checkout_now' && <CheckCircle2 className="w-4 h-4 text-[#C487A0]" />}
              </button>
            </div>
          </div>

          {/* Pertanyaan 5: Emosi Pasca Pembelian (Buyer Remorse) */}
          <div className={`p-4.5 rounded-2xl transition-all duration-300 space-y-2.5 border ${
            activeQ === 5
              ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
              : psyPostPurchaseMood !== null
                ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                : 'bg-[#FAF8F5] border-[#E8EFF5]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B8BA4] uppercase tracking-wider flex items-center gap-1.5">
                {activeQ === 5 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                )}
                <span>{language === 'id' ? 'Pertanyaan 5 · Prediksi Emosi Pasca Checkout' : 'Question 5 · Post-Purchase Remorse'}</span>
              </span>
              {psyPostPurchaseMood !== null && (
                <span className="text-xs font-bold text-[#2D4A33] bg-[#EAF0EB] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5B41]" />
                  <span>{language === 'id' ? 'Terjawab' : 'Answered'}</span>
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#24303E]">
              {language === 'id'
                ? 'Bayangkan 2 minggu setelah paket tiba: apakah kamu akan tetap senang menggunakannya atau mulai merasa menyesal uang berkurang?'
                : 'Imagine 2 weeks after delivery: will you still happily use it or feel regret over lost funds?'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPsyPostPurchaseMood('confident_useful')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyPostPurchaseMood === 'confident_useful'
                    ? 'bg-[#EAF0EB] border-[#9EAEA2] text-[#2D4A33] shadow-xs ring-2 ring-[#9EAEA2]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Yakin Bermanfaat & Puas' : 'Confident It Will Be Useful'}</span>
                {psyPostPurchaseMood === 'confident_useful' && <CheckCircle2 className="w-4 h-4 text-[#3B5B41]" />}
              </button>

              <button
                type="button"
                onClick={() => setPsyPostPurchaseMood('guilt_potential')}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  psyPostPurchaseMood === 'guilt_potential'
                    ? 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] shadow-xs ring-2 ring-[#D8A4B8]/30 font-bold'
                    : 'bg-white border-[#DDE4EB] text-[#55697A] hover:bg-[#F2F6F9]'
                }`}
              >
                <span>{language === 'id' ? 'Ada Potensi Menyesal / Bersalah' : 'Potential Buyer Remorse'}</span>
                {psyPostPurchaseMood === 'guilt_potential' && <CheckCircle2 className="w-4 h-4 text-[#C487A0]" />}
              </button>
            </div>
          </div>

          {/* Urgency Slider & Similar Item Toggle */}
          <div className="pt-2 border-t border-[#EEF3F7] space-y-4">
            
            {/* Urgency selection */}
            <div className={`p-4 rounded-2xl transition-all duration-300 border ${
              activeQ === 6
                ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
                : urgencyScore !== null
                  ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                  : 'bg-[#FAF8F5] border-[#E8EFF5]'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-bold text-[#24303E] flex items-center gap-1.5">
                  {activeQ === 6 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                  )}
                  <span>{t.urgencyLabel} *</span>
                </label>
                <span className="font-semibold text-[#6B8BA4]">
                  {urgencyScore === null && (language === 'id' ? 'Pilih tingkat urgensi (1-5)' : 'Select urgency level (1-5)')}
                  {urgencyScore === 1 && t.urgency1}
                  {urgencyScore === 2 && t.urgency2}
                  {urgencyScore === 3 && t.urgency3}
                  {urgencyScore === 4 && t.urgency4}
                  {urgencyScore === 5 && t.urgency5}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgencyScore(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      urgencyScore === lvl
                        ? 'bg-[#E2EAF0] border-[#6B8BA4] text-[#24303E] ring-2 ring-[#6B8BA4]/30'
                        : 'bg-white border-[#DDE4EB] text-[#7A8C9E] hover:bg-[#F8F6F2]'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#7A8C9E] mt-1">
                <span>1 ({language === 'id' ? 'Iseng / Diskon' : 'Casual / Sale'})</span>
                <span>3 ({language === 'id' ? 'Bermanfaat' : 'Useful'})</span>
                <span>5 ({language === 'id' ? 'Darurat / Wajib' : 'Urgent / Essential'})</span>
              </div>
            </div>

            {/* Has similar item toggle (Pilihan 'Tidak' = merah soft) */}
            <div className={`p-4 rounded-2xl transition-all duration-300 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              activeQ === 7
                ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
                : hasSimilarItem !== null
                  ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                  : 'bg-[#FAF8F5] border-[#E8EFF5]'
            }`}>
              <div className="max-w-md">
                <p className="text-xs font-bold text-[#24303E] flex items-center gap-1.5">
                  {activeQ === 7 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                  )}
                  <span>{t.hasSimilarLabel} *</span>
                </p>
                <p className="text-xs text-[#7A8C9E]">
                  {language === 'id' ? 'Membeli duplikat barang yang sudah ada adalah tanda belanja impulsif.' : 'Buying duplicate items you already own is a common impulse symptom.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasSimilarItem(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    hasSimilarItem === false
                      ? 'bg-[#FFF1F2] border-[#F43F5E] text-[#9F1239] shadow-xs font-bold'
                      : 'bg-white border-[#DDE4EB] text-[#7A8C9E] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {language === 'id' ? 'Tidak' : 'No'}
                </button>
                <button
                  type="button"
                  onClick={() => setHasSimilarItem(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    hasSimilarItem === true
                      ? 'bg-[#F9E8EE] border-[#D8A4B8] text-[#8E4362] shadow-xs font-bold'
                      : 'bg-white border-[#DDE4EB] text-[#7A8C9E] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {language === 'id' ? 'Punya' : 'Yes'}
                </button>
              </div>
            </div>

            {/* Usage frequency */}
            <div className={`p-4 rounded-2xl transition-all duration-300 border ${
              activeQ === 8
                ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
                : usedFrequency !== null
                  ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                  : 'bg-[#FAF8F5] border-[#E8EFF5]'
            }`}>
              <label className="block text-xs font-bold text-[#24303E] mb-2 flex items-center gap-1.5">
                {activeQ === 8 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                )}
                <span>{t.frequencyLabel} *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { val: 'daily', label: t.freqDaily },
                  { val: 'weekly', label: t.freqWeekly },
                  { val: 'monthly', label: t.freqMonthly },
                  { val: 'rarely', label: t.freqRarely },
                ].map((f) => (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setUsedFrequency(f.val as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      usedFrequency === f.val
                        ? 'border-[#6B8BA4] bg-[#E2EAF0] text-[#24303E] font-bold shadow-xs ring-2 ring-[#6B8BA4]/30'
                        : 'border-[#E2EAF0] bg-white text-[#55697A] hover:bg-[#F8F6F2]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 24h cooling off check ('Sudah lebih dari 24 jam' = hijau Soft Summer) */}
            <div className={`p-4 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
              activeQ === 9
                ? 'bg-[#FFFFFF] border-[#6B8BA4] ring-2 ring-[#6B8BA4]/20 shadow-md animate-pulse-glow relative'
                : coolingOffPassed !== null
                  ? 'bg-[#F8F6F2] border-[#DCE6ED] opacity-95'
                  : 'bg-[#FAF8F5] border-[#E8EFF5]'
            }`}>
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  {activeQ === 9 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2EAF0] text-[#527189] animate-gentle-bounce-x shrink-0 select-none shadow-2xs"><span className="text-xs">👉</span></span>
                  )}
                  <p className="text-xs font-bold text-[#24303E]">{t.coolingOffLabel} *</p>
                </div>
                <p className="text-xs text-[#7A8C9E]">
                  {language === 'id' ? 'Aturan 24 jam mencegah checkout akibat stimulasi emosi sesaat.' : 'The 24-hour rule cools down transient emotional spikes.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoolingOffPassed(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    coolingOffPassed === false
                      ? 'bg-[#FFF1F2] border-[#F43F5E] text-[#9F1239] shadow-xs font-bold'
                      : 'bg-white border-[#DDE4EB] text-[#7A8C9E] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {language === 'id' ? 'Baru Hari Ini' : 'Just Today'}
                </button>
                <button
                  type="button"
                  onClick={() => setCoolingOffPassed(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    coolingOffPassed === true
                      ? 'bg-[#EAF0EB] border-[#9EAEA2] text-[#2D4A33] shadow-xs font-bold'
                      : 'bg-white border-[#DDE4EB] text-[#7A8C9E] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {language === 'id' ? 'Sudah >24 Jam' : '>24h Passed'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Validation warning */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#E11D48]" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={evaluating || !productName.trim() || price <= 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6B8BA4] via-[#8CA8BF] to-[#9EAEA2] hover:opacity-95 text-white font-heading font-extrabold text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{evaluating ? t.evaluating : t.evaluateBtn}</span>
          </button>
        </div>
      </form>

      {/* Result Modal */}
      <EvaluationResultModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        evaluation={currentResult}
        userName={userName}
        language={language}
        onSaveToHistory={onSaveToHistory}
      />

    </div>
  );
};
