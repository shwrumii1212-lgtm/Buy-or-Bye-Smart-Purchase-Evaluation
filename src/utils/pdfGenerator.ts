import { jsPDF } from 'jspdf';
import { EvaluationItem, FinancialProfile, Language, ShoppingLogItem } from '../types';
import { categoryLabels } from './translations';

// Helper color palette constants (Soft Summer)
const COLORS = {
  dustyBlue: [107, 139, 164] as [number, number, number],
  powderBlue: [184, 213, 229] as [number, number, number],
  sageGreen: [158, 174, 162] as [number, number, number],
  softRose: [216, 164, 184] as [number, number, number],
  mutedLavender: [155, 142, 169] as [number, number, number],
  coolBeige: [248, 246, 242] as [number, number, number],
  darkNavy: [36, 48, 62] as [number, number, number],
  slateGray: [85, 105, 122] as [number, number, number],
  borderGray: [225, 232, 238] as [number, number, number],
};

/**
 * 1. POLISHED PRODUCT EVALUATION PDF
 */
export function downloadEvaluationPdf(item: EvaluationItem, userName: string, lang: Language = 'id'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(...COLORS.dustyBlue);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Decorative subtle bottom line for banner
  doc.setFillColor(...COLORS.powderBlue);
  doc.rect(0, 40, pageWidth, 2, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('BUY OR BYE', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const subtitle = lang === 'id' 
    ? 'BUKTI EVALUASI KEPUTUSAN BELANJA RASIONAL' 
    : 'PURCHASE DECISION EVALUATION REPORT';
  doc.text(subtitle, margin, 26);

  const dateStr = new Date(item.evaluatedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(8);
  doc.setTextColor(235, 242, 248);
  doc.text(`${lang === 'id' ? 'Tanggal & Jam' : 'Timestamp'}: ${dateStr}`, margin, 34);

  let y = 50;

  // Evaluator Card
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'D');

  doc.setTextColor(...COLORS.slateGray);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(lang === 'id' ? 'PENGGUNA TERVERIFIKASI' : 'VERIFIED USER', margin + 6, y + 7);

  doc.setTextColor(...COLORS.darkNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(userName || 'User', margin + 6, y + 16);

  doc.setTextColor(...COLORS.slateGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ID Referensi: ${item.id}`, pageWidth - margin - 6, y + 15, { align: 'right' });

  y += 28;

  // Evaluated Product Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 34, 2.5, 2.5, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, contentWidth, 34, 2.5, 2.5, 'D');

  doc.setTextColor(...COLORS.darkNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const truncatedProductName = item.productName.length > 55 
    ? item.productName.substring(0, 52) + '...' 
    : item.productName;
  doc.text(truncatedProductName, margin + 6, y + 10);

  const categoryName = categoryLabels[item.category]?.[lang] || item.category;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(`${lang === 'id' ? 'Kategori' : 'Category'}: ${categoryName}`, margin + 6, y + 18);
  doc.text(`${lang === 'id' ? 'Metode Bayar' : 'Payment'}: ${item.paymentMethod.toUpperCase()}`, margin + 6, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.dustyBlue);
  doc.text(`Rp ${item.price.toLocaleString('id-ID')}`, pageWidth - margin - 6, y + 20, { align: 'right' });

  y += 40;

  // Verdict Banner
  let verdictColor = COLORS.sageGreen;
  let verdictText = lang === 'id' ? 'VONIS: BUY (AMAN & LAYAK DIBELI)' : 'VERDICT: BUY (SAFE TO PURCHASE)';

  if (item.decision === 'BYE') {
    verdictColor = COLORS.softRose;
    verdictText = lang === 'id' ? 'VONIS: BYE (HINDARI & BATALKAN)' : 'VERDICT: BYE (AVOID / SKIP)';
  } else if (item.decision === 'COOLING_OFF') {
    verdictColor = COLORS.mutedLavender;
    verdictText = lang === 'id' ? 'VONIS: COOLING OFF (TAHAN 24-48 JAM)' : 'VERDICT: COOLING OFF (PAUSE 24-48H)';
  }

  doc.setFillColor(...verdictColor);
  doc.roundedRect(margin, y, contentWidth, 20, 2.5, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(verdictText, margin + 8, y + 13);

  doc.setFontSize(11);
  doc.text(`${lang === 'id' ? 'Skor' : 'Score'}: ${item.score}/100`, pageWidth - margin - 8, y + 13, { align: 'right' });

  y += 27;

  // Financial Impact Triple Metrics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'DAMPAK FINANSIAL & ENERGI KERJA' : 'FINANCIAL & LABOR IMPACT', margin, y);
  y += 5;

  const colWidth = (contentWidth - 6) / 3;

  // Metric 1: Work Hours
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, colWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, colWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Setara Jam Kerja' : 'Labor Hours', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`${item.financialImpact.workHoursNeeded} Jam`, margin + 4, y + 16);

  // Metric 2: Discretionary Cash
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 24, 2, 2, 'F');
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Sisa Uang Bebas' : 'Discretionary Cash', margin + colWidth + 7, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${item.financialImpact.discretionaryAfter.toLocaleString('id-ID')}`, margin + colWidth + 7, y + 16);

  // Metric 3: Debt / Emergency Ratio
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 24, 2, 2, 'F');
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(item.paymentMethod === 'paylater' ? 'Rasio Utang (DSR)' : 'Dana Darurat', margin + (colWidth * 2) + 10, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(
    item.paymentMethod === 'paylater' 
      ? `${item.financialImpact.debtRatioAfter}%` 
      : `${item.financialImpact.emergencyFundMonthsRatio} bln`,
    margin + (colWidth * 2) + 10, 
    y + 16
  );

  y += 32;

  // Reasons Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'FAKTOR PENILAIAN OBJEKTIF' : 'OBJECTIVE EVALUATION FACTORS', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.darkNavy);
  for (const reason of item.reasons.slice(0, 3)) {
    const lines = doc.splitTextToSize(`• ${reason}`, contentWidth);
    doc.text(lines, margin + 2, y);
    y += (lines.length * 4.5) + 1.5;
  }

  y += 4;

  // Recommendations Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'SARAN & MASUKAN TINDAKAN' : 'ACTIONABLE RECOMMENDATIONS', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.darkNavy);
  for (const rec of item.recommendations.slice(0, 2)) {
    const lines = doc.splitTextToSize(`→ ${rec}`, contentWidth);
    doc.text(lines, margin + 2, y);
    y += (lines.length * 4.5) + 1.5;
  }

  // Footer Disclaimer
  doc.setDrawColor(...COLORS.borderGray);
  doc.line(margin, 278, pageWidth - margin, 278);
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? 'Buy or Bye © 2026. Laporan ini dievaluasi secara objektif dengan formula rule-based tanpa bias komersial.' 
      : 'Buy or Bye © 2026. Evaluated objectively via transparent rule-based financial models.',
    margin, 
    284
  );

  const sanitizedName = item.productName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 18);
  doc.save(`BuyOrBye_${sanitizedName}_${item.decision}.pdf`);
}

/**
 * 2. POLISHED SHOPPING LOG & HABIT COACHING PDF
 */
export function downloadShoppingLogPdf(
  items: ShoppingLogItem[], 
  userName: string, 
  lang: Language = 'id'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(...COLORS.dustyBlue);
  doc.rect(0, 0, pageWidth, 38, 'F');
  doc.setFillColor(...COLORS.powderBlue);
  doc.rect(0, 38, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('BUY OR BYE', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    lang === 'id' ? 'LAPORAN RIWAYAT & POLA KEPUTUSAN BELANJA' : 'SHOPPING DECISION & HABIT REPORT',
    margin,
    26
  );

  const nowStr = new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.setFontSize(8);
  doc.setTextColor(235, 242, 248);
  doc.text(`Pengguna: ${userName} · Dicetak: ${nowStr}`, margin, 33);

  let y = 48;

  // Executive Metrics (Total Saved vs Total Bought)
  const totalSaved = items.filter(i => i.status === 'saved_bye').reduce((acc, c) => acc + (c.savedAmount || c.price), 0);
  const totalBought = items.filter(i => i.status === 'bought').reduce((acc, c) => acc + c.price, 0);
  const byeCount = items.filter(i => i.status === 'saved_bye').length;
  const byeRatio = items.length > 0 ? Math.round((byeCount / items.length) * 100) : 0;

  const cardWidth = (contentWidth - 4) / 2;

  // Box 1: Saved Money
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, cardWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, cardWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'UANG TERSELAMATKAN DARI BYE' : 'MONEY RESCUED VIA BYE', margin + 5, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.sageGreen);
  doc.text(`Rp ${totalSaved.toLocaleString('id-ID')}`, margin + 5, y + 17);

  // Box 2: Total Spent
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + cardWidth + 4, y, cardWidth, 24, 2, 2, 'F');
  doc.roundedRect(margin + cardWidth + 4, y, cardWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'TOTAL PENGELUARAN DISETUJUI' : 'TOTAL APPROVED PURCHASES', margin + cardWidth + 9, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${totalBought.toLocaleString('id-ID')}`, margin + cardWidth + 9, y + 17);

  y += 32;

  // Table of Recent Transactions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'DAFTAR TRANSAKSI & KEPUTUSAN TERAKHIR' : 'RECENT TRANSACTIONS & DECISIONS', margin, y);
  y += 5;

  // Table Header
  doc.setFillColor(...COLORS.dustyBlue);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TANGGAL', margin + 3, y + 5);
  doc.text('PRODUK & KATEGORI', margin + 28, y + 5);
  doc.text('METODE', margin + 105, y + 5);
  doc.text('STATUS', margin + 130, y + 5);
  doc.text('HARGA (RP)', pageWidth - margin - 3, y + 5, { align: 'right' });
  y += 7;

  // Table Rows (Up to 8 items to fit nicely)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  const displayItems = items.slice(0, 8);
  displayItems.forEach((it, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }

    const rowDate = new Date(it.date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
    doc.setTextColor(...COLORS.slateGray);
    doc.text(rowDate, margin + 3, y + 4.8);

    doc.setTextColor(...COLORS.darkNavy);
    const prodTitle = it.productName.length > 36 ? it.productName.substring(0, 34) + '...' : it.productName;
    doc.text(prodTitle, margin + 28, y + 4.8);

    doc.setTextColor(...COLORS.slateGray);
    doc.text(it.paymentMethod.toUpperCase(), margin + 105, y + 4.8);

    let statusText = it.status === 'bought' ? 'DIBELI' : it.status === 'saved_bye' ? 'BYE (HEMAT)' : 'TUNDA';
    doc.setTextColor(
      it.status === 'bought' ? COLORS.sageGreen[0] : it.status === 'saved_bye' ? COLORS.softRose[0] : COLORS.mutedLavender[0],
      it.status === 'bought' ? COLORS.sageGreen[1] : it.status === 'saved_bye' ? COLORS.softRose[1] : COLORS.mutedLavender[1],
      it.status === 'bought' ? COLORS.sageGreen[2] : it.status === 'saved_bye' ? COLORS.softRose[2] : COLORS.mutedLavender[2]
    );
    doc.text(statusText, margin + 130, y + 4.8);

    doc.setTextColor(...COLORS.darkNavy);
    doc.text(it.price.toLocaleString('id-ID'), pageWidth - margin - 3, y + 4.8, { align: 'right' });

    y += 7;
  });

  y += 8;

  // Habit Coaching & Recommendations Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'SARAN & MASUKAN KEBIASAAN BELANJA (REKOMENDASI)' : 'SHOPPING HABIT COACHING & RECOMMENDATIONS', margin, y);
  y += 5;

  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkNavy);

  const tips = [
    `• Konsistensi Penahanan Impuls: Kamu berhasil menahan ${byeRatio}% keputusan belanja. ${byeRatio >= 50 ? 'Disiplin kamu sangat prima dalam menolak godaan konsumtif!' : 'Tingkatkan jeda 24 jam sebelum checkout agar tidak mudah tergiur promo.'}`,
    '• Sinking Fund vs Paylater: Jika ada barang di atas Rp 500.000 yang ingin dibeli, alokasikan pos tabungan 2 bulan daripada tergiur cicilan.',
    '• Evaluasi Kategori Paling Sering: Jadwalkan audit bulanan untuk membatasi belanja fashion dan gadget agar sisa uang bebas tetap aman.'
  ];

  let tipY = y + 7;
  tips.forEach(tp => {
    const lines = doc.splitTextToSize(tp, contentWidth - 10);
    doc.text(lines, margin + 5, tipY);
    tipY += (lines.length * 4.5) + 2;
  });

  // Footer Disclaimer
  doc.setDrawColor(...COLORS.borderGray);
  doc.line(margin, 278, pageWidth - margin, 278);
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? 'Buy or Bye © 2026. Laporan riwayat transaksi dan pembinaan kebiasaan belanja mandiri.' 
      : 'Buy or Bye © 2026. Automated shopping pattern and mindful consumer progress statement.',
    margin, 
    284
  );

  doc.save(`BuyOrBye_Riwayat_Belanja_${userName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}

/**
 * 3. POLISHED MONTHLY REPORT PDF
 */
export function downloadMonthlyReportPdf(
  finance: FinancialProfile,
  shoppingItems: ShoppingLogItem[],
  userName: string,
  lang: Language = 'id'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(...COLORS.dustyBlue);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(...COLORS.powderBlue);
  doc.rect(0, 40, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('BUY OR BYE', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    lang === 'id' ? 'LAPORAN KEUANGAN & KEPUTUSAN BELANJA BULANAN' : 'MONTHLY FINANCIAL & PURCHASE DECISION REPORT',
    margin,
    26
  );

  const monthYearStr = new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });
  doc.setFontSize(8);
  doc.setTextColor(235, 242, 248);
  doc.text(`Periode: ${monthYearStr} · Pengguna: ${userName}`, margin, 34);

  let y = 50;

  // Income & Free Cash Row
  const income = finance.monthlyIncome || 0;
  const committed = finance.essentialExpenses + finance.lifestyleExpenses + finance.debtInstallments + finance.savings;
  const freeCash = Math.max(0, income - committed);
  const dsr = income > 0 ? Number(((finance.debtInstallments / income) * 100).toFixed(1)) : 0;
  const emergencyRunway = finance.essentialExpenses > 0 
    ? Number((finance.emergencyFund / finance.essentialExpenses).toFixed(1)) 
    : 0;

  const colWidth = (contentWidth - 6) / 3;

  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, colWidth, 22, 2, 2, 'F');
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 22, 2, 2, 'F');
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text('Pemasukan Bulanan', margin + 4, y + 6);
  doc.text('Sisa Uang Bebas', margin + colWidth + 7, y + 6);
  doc.text('Beban Utang (DSR)', margin + (colWidth * 2) + 10, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${income.toLocaleString('id-ID')}`, margin + 4, y + 15);
  doc.text(`Rp ${freeCash.toLocaleString('id-ID')}`, margin + colWidth + 7, y + 15);
  doc.text(`${dsr}% ${dsr <= 30 ? '(Aman)' : '(Tinggi)'}`, margin + (colWidth * 2) + 10, y + 15);

  y += 30;

  // 4 Buckets Breakdown Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'RINCIAN 4 POS ANGGARAN BULANAN' : '4 MONTHLY BUDGET ALLOCATIONS', margin, y);
  y += 5;

  const rowH = 9;
  const buckets = [
    { label: 'Kebutuhan Pokok (Needs)', val: finance.essentialExpenses, pct: Number(((finance.essentialExpenses / income) * 100).toFixed(1)), ideal: 'Maks 50%' },
    { label: 'Wishlist & Gaya Hidup (Wants)', val: finance.lifestyleExpenses, pct: Number(((finance.lifestyleExpenses / income) * 100).toFixed(1)), ideal: 'Maks 30%' },
    { label: 'Cicilan & Kewajiban (Debts)', val: finance.debtInstallments, pct: dsr, ideal: 'Maks 30%' },
    { label: 'Tabungan Rutin (Savings)', val: finance.savings, pct: Number(((finance.savings / income) * 100).toFixed(1)), ideal: 'Min 20%' }
  ];

  doc.setFillColor(...COLORS.dustyBlue);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('POS PENGELUARAN', margin + 4, y + 4.5);
  doc.text('NOMINAL (RP)', margin + 70, y + 4.5);
  doc.text('PORSI REAL', margin + 115, y + 4.5);
  doc.text('PEDOMAN IDEAL', pageWidth - margin - 4, y + 4.5, { align: 'right' });
  y += 6;

  buckets.forEach((b, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }
    doc.setTextColor(...COLORS.darkNavy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(b.label, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.text(`Rp ${b.val.toLocaleString('id-ID')}`, margin + 70, y + 5.5);
    doc.text(`${b.pct}%`, margin + 115, y + 5.5);
    doc.setTextColor(...COLORS.slateGray);
    doc.text(b.ideal, pageWidth - margin - 4, y + 5.5, { align: 'right' });

    y += rowH;
  });

  y += 8;

  // Shopping Decisions Summary for the month
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'RINGKASAN KEPUTUSAN BELANJA BULAN INI' : 'MONTHLY SHOPPING VERDICTS', margin, y);
  y += 5;

  const totalSavedMonth = shoppingItems.filter(i => i.status === 'saved_bye').reduce((acc, c) => acc + (c.savedAmount || c.price), 0);
  const totalBoughtMonth = shoppingItems.filter(i => i.status === 'bought').reduce((acc, c) => acc + c.price, 0);

  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`• Total Uang Terselamatkan dari Keputusan BYE: Rp ${totalSavedMonth.toLocaleString('id-ID')}`, margin + 5, y + 7);
  doc.text(`• Total Pengeluaran Belanja yang Lolos Evaluasi: Rp ${totalBoughtMonth.toLocaleString('id-ID')}`, margin + 5, y + 14);
  doc.text(`• Kesiapan Saldo Dana Darurat Saat Ini: ${emergencyRunway} Bulan Kebutuhan Pokok`, margin + 5, y + 21);

  y += 32;

  // Monthly Recommendations Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(lang === 'id' ? 'REKOMENDASI KEUANGAN BULAN DEPAN' : 'ACTION PLAN FOR NEXT MONTH', margin, y);
  y += 5;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text('1. Pertahankan rasio tabungan rutin minimal 20% dan prioritaskan pengisian Dana Darurat hingga 6 bulan.', margin + 5, y + 7);
  doc.text('2. Hindari menambah komitmen cicilan baru (Paylater/Kartu Kredit) untuk menjaga DSR tetap di bawah 30%.', margin + 5, y + 14);
  doc.text('3. Gunakan filter Buy or Bye untuk setiap rencana belanja non-esensial di atas Rp 150.000.', margin + 5, y + 21);

  // Footer Disclaimer
  doc.setDrawColor(...COLORS.borderGray);
  doc.line(margin, 278, pageWidth - margin, 278);
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? 'Buy or Bye © 2026. Laporan Keuangan Bulanan & Evaluasi Belanja Terpadu.' 
      : 'Buy or Bye © 2026. Comprehensive Monthly Financial & Spending Health Statement.',
    margin, 
    284
  );

  doc.save(`BuyOrBye_Laporan_Bulanan_${monthYearStr.replace(/\s+/g, '_')}.pdf`);
}
