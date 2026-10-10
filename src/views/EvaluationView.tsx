import React, { useState, useEffect } from 'react';
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
  RefreshCw
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

  // Form states
  const [productUrl, setProductUrl] = useState('');
  const [parsedData, setParsedData] = useState<ParsedUrlData | null>(null);
  const [productName, setProductName] = useState('');
  
  // Price state as numeric value, and priceDisplay as formatted string
  const [price, setPrice] = useState<number>(389000);
  const [priceInputText, setPriceInputText] = useState('389.000');
  
  const [category, setCategory] = useState<ProductCategory>('fashion');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit');
  const [paylaterTenorMonths, setPaylaterTenorMonths] = useState<number>(3);
  const [paylaterFeePercent, setPaylaterFeePercent] = useState<number>(2.95);
  const [urgencyScore, setUrgencyScore] = useState<number>(3);
  const [hasSimilarItem, setHasSimilarItem] = useState<boolean>(false);
  const [usedFrequency, setUsedFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'rarely'>('weekly');
  const [coolingOffPassed, setCoolingOffPassed] = useState<boolean>(true);

  // Result modal state
  const [evaluating, setEvaluating] = useState(false);
  const [currentResult, setCurrentResult] = useState<EvaluationItem | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [autoLinkedAlert, setAutoLinkedAlert] = useState<string | null>(null);

  // Format number to Indonesian dot thousands separator
  const formatRupiah = (val: number): string => {
    if (isNaN(val) || val <= 0) return '';
    return val.toLocaleString('id-ID');
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

  const handleAddQuickPrice = (addAmount: number) => {
    const newPrice = (price || 0) + addAmount;
    setPrice(newPrice);
    setPriceInputText(newPrice.toLocaleString('id-ID'));
  };

  // Process & Link URL
  const processUrlAndAutofill = (inputUrl: string) => {
    if (!inputUrl || inputUrl.trim().length < 5) return;
    const parsed = parseEcommerceUrl(inputUrl);
    setParsedData(parsed);

    if (parsed.detectedName) {
      setProductName(parsed.detectedName);
    }
    if (parsed.detectedPrice) {
      setPrice(parsed.detectedPrice);
      setPriceInputText(parsed.detectedPrice.toLocaleString('id-ID'));
    }
    if (parsed.detectedCategory) {
      setCategory(parsed.detectedCategory);
    }

    setAutoLinkedAlert(
      `Berhasil terhubung dengan ${parsed.platform}! Nama, harga, dan kategori barang telah diperbarui otomatis.`
    );
    setTimeout(() => setAutoLinkedAlert(null), 4000);
  };

  // URL input change handler
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProductUrl(val);
    if (val.trim().length > 10) {
      processUrlAndAutofill(val);
    } else {
      setParsedData(null);
    }
  };

  // Fast demo product links that illustrate instant linking
  const handleSampleLink = (type: 'shopee' | 'tokopedia' | 'tiktok' | 'zalora') => {
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

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !price || price <= 0) return;

    setEvaluating(true);
    setTimeout(() => {
      const evaluation = runRuleBasedEvaluation(
        {
          userId,
          productUrl: productUrl.trim() || undefined,
          productName: productName.trim(),
          category,
          price,
          paymentMethod,
          paylaterTenorMonths: paymentMethod === 'paylater' ? paylaterTenorMonths : undefined,
          paylaterFeePercent: paymentMethod === 'paylater' ? paylaterFeePercent : undefined,
          urgencyScore,
          hasSimilarItem,
          usedFrequency,
          coolingOffPassed,
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EAF0] text-xs font-semibold text-[#506A80] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#6B8BA4]" />
          <span>Rule-Based Purchase Gatekeeper</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#24303E]">
          {t.evalTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6F80] mt-1 max-w-xl">
          {t.evalSubtitle}
        </p>

        {/* Quick Sample Links Bar */}
        <div className="mt-5 pt-4 border-t border-[#EEF3F7]">
          <span className="text-[11px] text-[#7A8C9E] font-bold uppercase tracking-wider block mb-2">
            Contoh Tautan E-Commerce Cepat:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSampleLink('shopee')}
              className="px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#DDE4EB] text-xs font-semibold text-[#485C6E] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🛒 Shopee (Sneakers)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSampleLink('tokopedia')}
              className="px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#DDE4EB] text-xs font-semibold text-[#485C6E] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⌨️ Tokopedia (Keyboard)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSampleLink('tiktok')}
              className="px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#DDE4EB] text-xs font-semibold text-[#485C6E] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>✨ TikTok Shop (Skincare)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSampleLink('zalora')}
              className="px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#DDE4EB] text-xs font-semibold text-[#485C6E] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🧥 Zalora (Hoodie)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleEvaluate} className="space-y-6">
        
        {/* Step 1: E-Commerce Link with Live Extraction */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E2EAF0] text-[#6B8BA4] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-heading text-sm font-bold text-[#24303E]">
                {t.urlInputLabel}
              </h2>
            </div>
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

          {/* Success Toast / Badge for linked product */}
          {autoLinkedAlert && (
            <div className="p-3 rounded-xl bg-[#EAF0EB] border border-[#C5D9C9] text-xs font-semibold text-[#3B5B41] flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#7E9383] shrink-0" />
              <span>{autoLinkedAlert}</span>
            </div>
          )}

          {/* Connected Link Preview Card */}
          {parsedData && parsedData.platform && (
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#6B8BA4] text-white text-[10px] font-bold uppercase tracking-wider">
                    {parsedData.platform}
                  </span>
                  <span className="text-[11px] font-semibold text-[#47634F] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tautan Terhubung
                  </span>
                </div>
                <p className="text-xs font-bold text-[#24303E]">
                  {productName || parsedData.detectedName}
                </p>
                <p className="text-[11px] text-[#7A8C9E]">
                  Estimasi Nilai: Rp {price.toLocaleString('id-ID')} · Kategori: {categoryLabels[category]?.[language]}
                </p>
              </div>

              {parsedData.cleanUrl && (
                <a
                  href={parsedData.cleanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5DFE7] text-xs font-semibold text-[#485C6E] hover:bg-[#F2F6F9] transition-colors shrink-0"
                >
                  <span>Buka Link Produk Asli</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B8BA4]" />
                </a>
              )}
            </div>
          )}

          <p className="text-[11px] text-[#7A8C9E] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#8CA8BF]" />
            <span>Tautan akan otomatis mengisi nama, harga estimasi, dan kategori. Kamu tetap bisa mengeditnya manual di bawah ini.</span>
          </p>
        </div>

        {/* Step 2: Product Name & Bulletproof Price Input */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E2EAF0] text-[#6B8BA4] font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="font-heading text-sm font-bold text-[#24303E]">
              Detail Barang & Nominal Harga
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.productNameLabel} *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t.productNamePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                required
              />
            </div>

            {/* Bulletproof Price Input (No HTML5 stepMismatch error!) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#24303E]">
                  {t.priceLabel} *
                </label>
                <span className="text-[11px] font-extrabold text-[#6B8BA4]">
                  Rp {price > 0 ? price.toLocaleString('id-ID') : '0'}
                </span>
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
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                  required
                />
              </div>

              {/* Quick Chip Adjusters */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handleAddQuickPrice(50000)}
                  className="px-2 py-0.5 rounded-md bg-[#F0F4F7] hover:bg-[#E2EAF0] text-[10px] font-semibold text-[#506272] transition-colors cursor-pointer"
                >
                  +50rb
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuickPrice(100000)}
                  className="px-2 py-0.5 rounded-md bg-[#F0F4F7] hover:bg-[#E2EAF0] text-[10px] font-semibold text-[#506272] transition-colors cursor-pointer"
                >
                  +100rb
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuickPrice(500000)}
                  className="px-2 py-0.5 rounded-md bg-[#F0F4F7] hover:bg-[#E2EAF0] text-[10px] font-semibold text-[#506272] transition-colors cursor-pointer"
                >
                  +500rb
                </button>
                <span className="text-[#C2CBD2] text-[10px]">|</span>
                <button
                  type="button"
                  onClick={() => handleSetQuickPrice(150000)}
                  className="px-2 py-0.5 rounded-md bg-[#F8F6F2] hover:bg-[#EFECE6] text-[10px] font-medium text-[#506272] transition-colors cursor-pointer"
                >
                  150rb
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickPrice(500000)}
                  className="px-2 py-0.5 rounded-md bg-[#F8F6F2] hover:bg-[#EFECE6] text-[10px] font-medium text-[#506272] transition-colors cursor-pointer"
                >
                  500rb
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickPrice(1000000)}
                  className="px-2 py-0.5 rounded-md bg-[#F8F6F2] hover:bg-[#EFECE6] text-[10px] font-medium text-[#506272] transition-colors cursor-pointer"
                >
                  1 Juta
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
              >
                {Object.entries(categoryLabels).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.paymentMethodLabel}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
              >
                <option value="debit">Kartu Debit / QRIS Tunai</option>
                <option value="cash">Tunai / Transfer Tabungan</option>
                <option value="credit_card">Kartu Kredit (Lunas Bulan Depan)</option>
                <option value="paylater">Paylater / Cicilan Multifinance</option>
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
                  <label className="block text-[11px] font-semibold text-[#5C6F80] mb-1">
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
                  <label className="block text-[11px] font-semibold text-[#5C6F80] mb-1">
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
                <div className="text-[11px] text-[#A8486A] bg-white p-2.5 rounded-lg border border-[#F5D5E0] flex justify-between">
                  <span>{t.monthlyInstallmentEst}:</span>
                  <strong>
                    Rp {Math.round((price * (1 + (paylaterFeePercent / 100) * paylaterTenorMonths)) / paylaterTenorMonths).toLocaleString('id-ID')} / bln
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Psychological & Urgency Checks */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E2EAF0] text-[#6B8BA4] font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="font-heading text-sm font-bold text-[#24303E]">
              Uji Psikologi & Kebiasaan Belanja
            </h2>
          </div>

          {/* Urgency Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="font-bold text-[#24303E]">
                {t.urgencyLabel}
              </label>
              <span className="font-semibold text-[#6B8BA4]">
                {urgencyScore === 1 && t.urgency1}
                {urgencyScore === 2 && t.urgency2}
                {urgencyScore === 3 && t.urgency3}
                {urgencyScore === 4 && t.urgency4}
                {urgencyScore === 5 && t.urgency5}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={urgencyScore}
              onChange={(e) => setUrgencyScore(Number(e.target.value))}
              className="w-full accent-[#6B8BA4] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7A8C9E] mt-1">
              <span>1 (Iseng / Diskon)</span>
              <span>3 (Bermanfaat)</span>
              <span>5 (Darurat / Wajib)</span>
            </div>
          </div>

          {/* Has similar item toggle */}
          <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] flex items-center justify-between">
            <div className="max-w-md">
              <p className="text-xs font-bold text-[#24303E]">{t.hasSimilarLabel}</p>
              <p className="text-[10px] text-[#7A8C9E]">Membeli duplikat barang yang sudah ada adalah tanda belanja impulsif.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHasSimilarItem(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  !hasSimilarItem ? 'bg-white text-[#24303E] shadow-xs' : 'text-[#7A8C9E]'
                }`}
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={() => setHasSimilarItem(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  hasSimilarItem ? 'bg-[#D8A4B8] text-white shadow-xs' : 'text-[#7A8C9E]'
                }`}
              >
                Punya
              </button>
            </div>
          </div>

          {/* Usage frequency */}
          <div>
            <label className="block text-xs font-bold text-[#24303E] mb-2">
              {t.frequencyLabel}
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
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    usedFrequency === f.val
                      ? 'border-[#6B8BA4] bg-[#E2EAF0] text-[#24303E]'
                      : 'border-[#E2EAF0] bg-white text-[#55697A] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 24h cooling off check */}
          <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E5ECF2] flex items-center justify-between">
            <div className="max-w-md">
              <p className="text-xs font-bold text-[#24303E]">{t.coolingOffLabel}</p>
              <p className="text-[10px] text-[#7A8C9E]">Aturan 24 jam mencegah checkout akibat stimulasi emosi sesaat.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCoolingOffPassed(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  !coolingOffPassed ? 'bg-[#D8A4B8] text-white shadow-xs' : 'text-[#7A8C9E]'
                }`}
              >
                Baru Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setCoolingOffPassed(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  coolingOffPassed ? 'bg-[#9EAEA2] text-white shadow-xs' : 'text-[#7A8C9E]'
                }`}
              >
                Sudah &gt;24 Jam
              </button>
            </div>
          </div>
        </div>

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
