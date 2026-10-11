import { EvaluationItem, FinancialProfile, Language, PaymentMethod, ProductCategory } from '../types';

export interface EvaluationInput {
  userId: string;
  productUrl?: string;
  productName: string;
  category: ProductCategory;
  price: number;
  paymentMethod: PaymentMethod;
  paylaterTenorMonths?: number;
  paylaterFeePercent?: number; // default e.g. 2.95% per month
  urgencyScore: number; // 1 - 5
  hasSimilarItem: boolean;
  usedFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  coolingOffPassed: boolean;
  // Enhanced 5 psychological test answers
  psyDiscountTrap?: 'just_because_sale' | 'planned_long_ago';
  psyFomoPressure?: 'saw_on_social' | 'personal_need';
  psyNeedVsWant?: 'essential_need' | 'lifestyle_want';
  psyDelayReady?: 'ready_to_wait' | 'urge_to_checkout_now';
  psyPostPurchaseMood?: 'guilt_potential' | 'confident_useful';
}

export function runRuleBasedEvaluation(
  input: EvaluationInput,
  finance: FinancialProfile,
  lang: Language = 'id'
): EvaluationItem {
  const {
    userId,
    productUrl,
    productName,
    category,
    price,
    paymentMethod,
    paylaterTenorMonths = 3,
    paylaterFeePercent = 2.95,
    urgencyScore,
    hasSimilarItem,
    usedFrequency,
    coolingOffPassed,
    psyDiscountTrap,
    psyFomoPressure,
    psyNeedVsWant,
    psyDelayReady,
    psyPostPurchaseMood,
  } = input;

  const monthlyIncome = finance.monthlyIncome || 1;
  const essentialExpenses = finance.essentialExpenses || 0;
  const lifestyleExpenses = finance.lifestyleExpenses || 0;
  const debtInstallments = finance.debtInstallments || 0;
  const savings = finance.savings || 0;
  const emergencyFund = finance.emergencyFund || 0;

  // 1. Calculations
  // Hourly wage (standard 20 days x 8 hours = 160 hours/month)
  const hourlyWage = Math.max(1, Math.round(monthlyIncome / 160));
  const workHoursNeeded = Number((price / hourlyWage).toFixed(1));

  // Current free cash / discretionary cash
  const committedExpenses = essentialExpenses + lifestyleExpenses + debtInstallments + savings;
  const discretionaryBefore = Math.max(0, monthlyIncome - committedExpenses);

  // Installment calculation if Paylater
  let monthlyInstallmentCost = 0;
  let effectiveTotalCost = price;

  if (paymentMethod === 'paylater') {
    const totalFeeRate = (paylaterFeePercent / 100) * paylaterTenorMonths;
    effectiveTotalCost = Math.round(price * (1 + totalFeeRate));
    monthlyInstallmentCost = Math.round(effectiveTotalCost / paylaterTenorMonths);
  }

  // Debt ratios
  const debtRatioBefore = Number(((debtInstallments / monthlyIncome) * 100).toFixed(1));
  const newMonthlyDebt = paymentMethod === 'paylater' 
    ? debtInstallments + monthlyInstallmentCost 
    : debtInstallments;
  const debtRatioAfter = Number(((newMonthlyDebt / monthlyIncome) * 100).toFixed(1));

  // Discretionary after purchase (if upfront cash/debit, price impacts this month; if paylater, installment impacts it)
  const cashImpactThisMonth = paymentMethod === 'paylater' ? monthlyInstallmentCost : price;
  const discretionaryAfter = Math.max(0, discretionaryBefore - cashImpactThisMonth);
  const discretionaryImpactPercent = discretionaryBefore > 0
    ? Number((((discretionaryBefore - discretionaryAfter) / discretionaryBefore) * 100).toFixed(1))
    : 100;

  // Emergency runway in months
  const monthlyEssentialBase = essentialExpenses > 0 ? essentialExpenses : (monthlyIncome * 0.5);
  const emergencyFundMonthsRatio = Number((emergencyFund / monthlyEssentialBase).toFixed(1));

  // 2. Deterministic Scoring Model (Starts at 50)
  let score = 50;
  const reasons: string[] = [];
  const recommendations: string[] = [];
  const educationalNotes: string[] = [];

  // Factor A: Discretionary Cash Flow & Price Impact
  if (paymentMethod !== 'paylater' && price > discretionaryBefore) {
    score -= 30;
    reasons.push(
      lang === 'id'
        ? `Harga barang (Rp ${price.toLocaleString('id-ID')}) melebihi sisa uang bebas bulananmu (Rp ${discretionaryBefore.toLocaleString('id-ID')}), sehingga akan memotong anggaran tabungan atau kebutuhan pokok.`
        : `Product price exceeds your remaining discretionary income (${discretionaryBefore.toLocaleString()}), meaning it forces cuts into savings or essentials.`
    );
  } else if (paymentMethod !== 'paylater' && price > discretionaryBefore * 0.5) {
    score -= 15;
    reasons.push(
      lang === 'id'
        ? `Pembelian ini menyerap lebih dari 50% uang bebas bulananmu (${discretionaryImpactPercent}%). Ruang gerak finansialmu bulan ini akan sangat sempit.`
        : `This purchase consumes over 50% of your remaining free cash buffer (${discretionaryImpactPercent}%). Leaves little margin for surprise expenses.`
    );
  } else {
    score += 15;
    reasons.push(
      lang === 'id'
        ? `Arus kas bulananmu mencukupi: barang ini hanya menyerap ${discretionaryImpactPercent}% dari sisa uang bebas bulanan.`
        : `Healthy cash flow headroom: this purchase takes only ${discretionaryImpactPercent}% of your discretionary buffer.`
    );
  }

  // Factor B: Emergency Fund Shield
  if (emergencyFundMonthsRatio < 1.0) {
    score -= 25;
    reasons.push(
      lang === 'id'
        ? `Dana daruratmu saat ini kritis (< 1 bulan kebutuhan dasar: hanya ${emergencyFundMonthsRatio} bulan). Sangat berisiko membelanjakan uang untuk pos non-esensial.`
        : `Critical emergency fund runway (< 1 month of basic living: only ${emergencyFundMonthsRatio} months). Any non-essential expense is high risk.`
    );
    recommendations.push(
      lang === 'id'
        ? `Prioritaskan mengamankan minimal 3 bulan dana darurat (Rp ${(monthlyEssentialBase * 3).toLocaleString('id-ID')}) sebelum membeli barang gaya hidup.`
        : `Build at least 3 months of emergency buffer before lifestyle purchases.`
    );
  } else if (emergencyFundMonthsRatio < 3.0) {
    score -= 10;
    reasons.push(
      lang === 'id'
        ? `Dana daruratmu belum ideal (${emergencyFundMonthsRatio} bulan, target aman 3-6 bulan). Pertimbangkan apakah barang ini pantas mengorbankan stabilitas masa depan.`
        : `Emergency fund is below recommended threshold (${emergencyFundMonthsRatio} months, target 3-6 months).`
    );
  } else {
    score += 10;
    reasons.push(
      lang === 'id'
        ? `Pondasi dana daruratmu kokoh (${emergencyFundMonthsRatio} bulan pengeluaran pokok tercukupi).`
        : `Solid emergency fund fortress (${emergencyFundMonthsRatio} months covered).`
    );
  }

  // Factor C: Payment Method Risk Evaluation
  if (paymentMethod === 'paylater') {
    if (debtRatioAfter > 35) {
      score -= 30;
      reasons.push(
        lang === 'id'
          ? `Cicilan paylater ini menaikkan rasio utangmu (DSR) menjadi ${debtRatioAfter}%, melampaui batas aman finansial 30%! Risiko terjebak gali lubang tutup lubang sangat tinggi.`
          : `This paylater pushes your Debt Service Ratio to ${debtRatioAfter}%, far above the 30% healthy ceiling! High risk of financial suffocating.`
      );
      recommendations.push(
        lang === 'id'
          ? `Hindari penggunaan paylater untuk barang konsumtif. Jika belum bisa beli tunai, tunda dulu dan gunakan sistem menabung (sinking fund).`
          : `Avoid paylater for discretionary goods. Save up with a sinking fund instead.`
      );
    } else {
      score -= 15;
      reasons.push(
        lang === 'id'
          ? `Penggunaan Paylater menambahkan beban bunga tersembunyi sebesar Rp ${(effectiveTotalCost - price).toLocaleString('id-ID')} dan komitmen cicilan ${paylaterTenorMonths} bulan ke depan.`
          : `Paylater adds extra financing costs and commits your income for the next ${paylaterTenorMonths} months.`
      );
    }
  } else if (paymentMethod === 'savings') {
    // Checking impact on user's savings buffer
    if (price > savings * 3 && savings > 0) {
      score -= 10;
      reasons.push(
        lang === 'id'
          ? `Menggunakan sumber tabungan untuk belanja konsumtif menggerus modal masa depanmu.`
          : `Drawing from your personal savings directly cuts into your long-term wealth compounding.`
      );
    } else {
      reasons.push(
        lang === 'id'
          ? `Pembayaran menggunakan alokasi tabungan bebas tanpa bunga utang.`
          : `Paid from saved funds with zero debt obligations.`
      );
    }
  } else if (paymentMethod === 'credit_card') {
    reasons.push(
      lang === 'id'
        ? `Pembayaran dengan kartu kredit wajib dilunasi penuh saat tanggal jatuh tempo bulan depan agar tidak terkena bunga bergulir.`
        : `Credit card purchases must be settled in full on the next due date to prevent interest accrual.`
    );
  }

  // Factor G: 5 Psychology & Mindset Checks
  if (psyDiscountTrap === 'just_because_sale') {
    score -= 12;
    reasons.push(
      lang === 'id'
        ? `Uji Diskon: Tertarik terutama karena ada potongan harga atau promo sesaat, bukan karena kebutuhan terencana.`
        : `Discount Trap: Triggered primarily by markdown marketing rather than a premeditated need.`
    );
  } else if (psyDiscountTrap === 'planned_long_ago') {
    score += 8;
  }

  if (psyFomoPressure === 'saw_on_social') {
    score -= 12;
    reasons.push(
      lang === 'id'
        ? `Uji FOMO: Keinginan dipicu oleh tren media sosial atau rasa takut ketinggalan (FOMO).`
        : `FOMO Check: Purchase intent stimulated by social media hype or peer pressure.`
    );
  } else if (psyFomoPressure === 'personal_need') {
    score += 6;
  }

  if (psyNeedVsWant === 'lifestyle_want') {
    score -= 8;
  } else if (psyNeedVsWant === 'essential_need') {
    score += 12;
  }

  if (psyDelayReady === 'urge_to_checkout_now') {
    score -= 10;
    reasons.push(
      lang === 'id'
        ? `Uji Menunda: Ada dorongan menggebu untuk checkout seketika tanpa jeda rasionalisasi.`
        : `Delay Resistance: High impatience indicating acute dopamine rush.`
    );
  } else if (psyDelayReady === 'ready_to_wait') {
    score += 8;
  }

  if (psyPostPurchaseMood === 'guilt_potential') {
    score -= 12;
    reasons.push(
      lang === 'id'
        ? `Refleksi Emosi: Kamu mengantisipasi potensi rasa bersalah setelah membuka paket.`
        : `Emotional Reflection: High anticipation of buyer remorse after unboxing.`
    );
  }

  // Factor D: Urgency & Utility
  if (urgencyScore >= 4) {
    score += 15;
  } else if (urgencyScore <= 2) {
    score -= 15;
    reasons.push(
      lang === 'id'
        ? `Tingkat urgensi dinilai rendah (skor ${urgencyScore}/5). Pembelian ini didorong oleh impuls atau diskon sementara, bukan kebutuhan riil.`
        : `Low urgency score (${urgencyScore}/5). Strongly indicates impulse driven by marketing or FOMO.`
    );
  }

  // Factor E: Redundancy & Frequency of Use
  if (hasSimilarItem) {
    score -= 20;
    reasons.push(
      lang === 'id'
        ? `Kamu sudah memiliki barang serupa yang masih berfungsi. Membeli barang sejenis adalah pemborosan tipikal dopamine-seeking.`
        : `You already own a working similar item. Purchasing another is a common dopamine-seeking duplicate trap.`
    );
    recommendations.push(
      lang === 'id'
        ? `Coba optimalkan barang yang sudah ada atau jual/preloved barang lamamu terlebih dahulu untuk menutup biaya barang baru.`
        : `Use what you have or sell the old one first before acquiring a replacement.`
    );
  }

  if (usedFrequency === 'rarely') {
    score -= 15;
    reasons.push(
      lang === 'id'
        ? `Frekuensi penggunaan jarang/musiman. Cost-per-use barang ini akan sangat mahal.`
        : `Rare estimated usage. The real cost-per-use will be exorbitantly high.`
    );
    recommendations.push(
      lang === 'id'
        ? `Pertimbangkan opsi menyewa atau meminjam jika hanya dipakai sesekali.`
        : `Consider renting or borrowing instead of outright buying.`
    );
  } else if (usedFrequency === 'daily') {
    score += 10;
  }

  // Factor F: 24-Hour Cooling Off Test
  if (!coolingOffPassed) {
    score -= 10;
    reasons.push(
      lang === 'id'
        ? `Barang baru dilihat hari ini dan belum melewati jeda 24 jam. Emosi belanja masih berada di puncak.`
        : `Item has not passed the 24-hour cooling-off rule. Shopping emotion is at its peak.`
    );
  } else {
    score += 8;
  }

  // Normalization
  score = Math.max(5, Math.min(98, score));

  // Determine Verdict
  let decision: 'BUY' | 'BYE' | 'COOLING_OFF';
  if (score >= 70) {
    decision = 'BUY';
  } else if (score >= 45) {
    decision = 'COOLING_OFF';
  } else {
    decision = 'BYE';
  }

  // Build Tailored Recommendations & Educational Notes
  if (decision === 'BUY') {
    recommendations.push(
      lang === 'id'
        ? `Pembelian ini rasional dan aman. Pastikan bayar tunai/debit secara lunas untuk menghindari biaya administrasi tambahan.`
        : `This purchase is rational and safe. Pay in full via cash/debit to avoid unnecessary interest or fees.`
    );
    recommendations.push(
      lang === 'id'
        ? `Catat pengeluaran ini langsung di pos gaya hidup agar alokasi bulanan tetap terpantau.`
        : `Record this expense in your lifestyle bucket immediately to keep monthly targets on track.`
    );
  } else if (decision === 'COOLING_OFF') {
    recommendations.push(
      lang === 'id'
        ? `Terapkan aturan 48 jam: tutup tab e-commerce, simpan ke wishlist, dan cek kembali 2 hari lagi apakah kamu masih menginginkannya.`
        : `Apply the 48-hour rule: close the checkout tab, save to wishlist, and revisit in 2 days with a cooler head.`
    );
    recommendations.push(
      lang === 'id'
        ? `Buat Sinking Fund: sisihkan Rp ${Math.round(price / 2).toLocaleString('id-ID')} selama 2 bulan ke depan daripada memaksakan bulan ini.`
        : `Create a sinking fund: set aside half the cost over 2 months instead of straining this month's budget.`
    );
  } else {
    recommendations.push(
      lang === 'id'
        ? `Putuskan BYE: Hapus barang ini dari keranjang belanja untuk menghindari checkout impulsif saat lelah atau larut malam.`
        : `Decide BYE: Remove this item from your cart right now to avoid late-night impulse checkout.`
    );
    recommendations.push(
      lang === 'id'
        ? `Alihkan uang Rp ${price.toLocaleString('id-ID')} ke pos Dana Darurat atau Tabungan Investasimu.`
        : `Reallocate this money into your Emergency Runway or High-Yield Savings.`
    );
  }

  // Educational Notes
  educationalNotes.push(
    lang === 'id'
      ? `Konversi Jam Kerja: Kamu harus bekerja selama ${workHoursNeeded} jam penuh hanya untuk membayar barang ini.`
      : `Life Energy: You must trade ${workHoursNeeded} hours of your life and labor to pay for this purchase.`
  );

  if (paymentMethod === 'paylater') {
    educationalNotes.push(
      lang === 'id'
        ? `Ingat: Paylater meminjam pendapatan masa depanmu untuk kenikmatan sesaat hari ini.`
        : `Remember: Paylater borrows your future freedom for a brief dopamine hit today.`
    );
  }

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    productUrl,
    productName,
    category,
    price,
    paymentMethod,
    paylaterTenorMonths: paymentMethod === 'paylater' ? paylaterTenorMonths : undefined,
    paylaterFeePercent: paymentMethod === 'paylater' ? paylaterFeePercent : undefined,
    urgencyScore,
    hasSimilarItem,
    usedFrequency,
    coolingOffPassed,
    evaluatedAt: new Date().toISOString(),
    decision,
    score,
    reasons,
    recommendations,
    educationalNotes,
    financialImpact: {
      discretionaryBefore,
      discretionaryAfter,
      discretionaryImpactPercent,
      debtRatioBefore,
      debtRatioAfter,
      workHoursNeeded,
      emergencyFundMonthsRatio,
      monthlyInstallmentCost: paymentMethod === 'paylater' ? monthlyInstallmentCost : undefined,
    }
  };
}
