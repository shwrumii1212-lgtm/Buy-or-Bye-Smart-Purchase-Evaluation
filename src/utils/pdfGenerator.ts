import { jsPDF } from 'jspdf';
import { EvaluationItem, FinancialProfile, Language, ShoppingLogItem } from '../types';
import { categoryLabels } from './translations';

// Premium Color Palette (Soft Summer - BUY always emerald green, BYE always crimson red)
const COLORS = {
  emeraldGreen: [5, 150, 105] as [number, number, number], // BUY always green #059669
  emeraldBg: [236, 253, 245] as [number, number, number], // #ECFDF5 light mint
  crimsonRed: [225, 29, 72] as [number, number, number], // BYE always red #E11D48
  crimsonBg: [255, 241, 242] as [number, number, number], // #FFF1F2 light rose
  lavenderPurple: [124, 58, 237] as [number, number, number], // COOLING OFF #7C3AED
  lavenderBg: [245, 243, 255] as [number, number, number],
  dustyBlue: [107, 139, 164] as [number, number, number], // Primary accent #6B8BA4
  powderBlue: [184, 213, 229] as [number, number, number], // Banner highlight #B8D5E5
  babyBlue: [208, 228, 242] as [number, number, number], // Soft light baby blue #D0E4F2
  babyBlueAccent: [142, 178, 204] as [number, number, number], // #8EB2CC
  babyBlueText: [24, 48, 70] as [number, number, number], // Deep navy #183046 for ultra crisp contrast
  babyBlueMuted: [55, 82, 106] as [number, number, number], // Muted deep blue #37526A
  headerSoftBlue: [208, 228, 242] as [number, number, number], // Light baby blue
  headerSoftAccent: [142, 178, 204] as [number, number, number],
  headerNavy: [208, 228, 242] as [number, number, number],
  coolBeige: [248, 246, 242] as [number, number, number], // Clean card background #F8F6F2
  cardTint: [241, 245, 249] as [number, number, number], // Alternate card tint #F1F5F9
  darkNavy: [36, 48, 62] as [number, number, number], // Body text #24303E
  slateGray: [100, 116, 139] as [number, number, number], // Muted text #64748B
  borderGray: [226, 232, 240] as [number, number, number], // Card border #E2E8F0
  amberGold: [217, 119, 6] as [number, number, number], // Caution alert #D97706
};

// Typography standards: Times New Roman 12 pt, spasi 1.25 (rentang 1.15 - 1.5), Justify
const FONT_NAME = 'times';
const BODY_FONT_SIZE = 12;
const SPACING_FACTOR = 1.25;

/**
 * Helper to render justified paragraphs with Times New Roman 12 and 1.15-1.5 line spacing
 */
function renderJustifiedBlock(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options?: {
    fontSize?: number;
    fontStyle?: 'normal' | 'bold' | 'italic';
    textColor?: [number, number, number];
    spacingFactor?: number;
    extraBottomPadding?: number;
  }
): number {
  const fontSize = options?.fontSize ?? BODY_FONT_SIZE;
  const fontStyle = options?.fontStyle ?? 'normal';
  const textColor = options?.textColor ?? COLORS.darkNavy;
  const factor = options?.spacingFactor ?? SPACING_FACTOR;
  const extraPadding = options?.extraBottomPadding ?? 3;

  doc.setFont(FONT_NAME, fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...textColor);
  doc.setLineHeightFactor(factor);

  const lines = doc.splitTextToSize(text, maxWidth);
  const singleLineMm = (fontSize * 0.352778) * factor;

  // Render justified lines across full width
  doc.text(lines, x, y, { align: 'justify', maxWidth });

  return y + (lines.length * singleLineMm) + extraPadding;
}

/**
 * Helper to draw a decorative section title with colored indicator tag
 */
function drawSectionHeading(doc: jsPDF, title: string, x: number, y: number, width: number): number {
  // Little vertical tag
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(x, y - 3.8, 2.5, 5, 0.8, 0.8, 'F');

  // Title in Times Bold 12pt
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(title, x + 5, y);

  // Subtle accent line under title
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.line(x, y + 2.5, x + width, y + 2.5);

  return y + 6.5;
}

/**
 * Helper to draw a mini horizontal progress bar for visual budget allocation
 */
function drawAllocationBar(
  doc: jsPDF, 
  x: number, 
  y: number, 
  barWidth: number, 
  barHeight: number, 
  actualPct: number, 
  maxScalePct: number, 
  isHealthy: boolean
): void {
  // Background track
  doc.setFillColor(230, 235, 240);
  doc.roundedRect(x, y, barWidth, barHeight, 1, 1, 'F');

  // Filled progress
  const fillWidth = Math.min(barWidth, Math.max(1.5, (actualPct / maxScalePct) * barWidth));
  const fillColor = isHealthy ? COLORS.emeraldGreen : COLORS.crimsonRed;
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, fillWidth, barHeight, 1, 1, 'F');
}

/**
 * Renders the official Buy or Bye logo badge:
 * "Buy" (green), "or" (black), "Bye" (pink) inside a crisp white pill badge
 */
function drawBrandLogo(doc: jsPDF, x: number, y: number): void {
  // Clean pill background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y - 5.5, 42, 8, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y - 5.5, 42, 8, 2, 2, 'D');

  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(11);

  // "Buy" in emerald green #16A34A
  doc.setTextColor(22, 163, 74);
  doc.text('Buy', x + 4, y);
  const buyWidth = doc.getTextWidth('Buy');

  // "or" in black #111827
  doc.setFont(FONT_NAME, 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(' or ', x + 4 + buyWidth, y);
  const orWidth = doc.getTextWidth(' or ');

  // "Bye" in vibrant pink #EC4899
  doc.setFont(FONT_NAME, 'bold');
  doc.setTextColor(236, 72, 153);
  doc.text('Bye', x + 4 + buyWidth + orWidth, y);
}

/**
 * 1. POLISHED PRODUCT EVALUATION PDF
 * Format: Times New Roman 12, Spasi 1.25, Isi Justify, Visual Menarik & Rapi
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

  const badgeWidth = 58;
  const badgeHeight = 20;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = 8.5;

  // Header Banner with Dual Layer
  doc.setFillColor(...COLORS.babyBlue);
  doc.rect(0, 0, pageWidth, 38, "F");
  doc.setFillColor(...COLORS.babyBlueAccent);
  doc.rect(0, 38, pageWidth, 2, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 40, pageWidth, 1, "F");

  // Brand Logo in Header (Left Column - Buy in green, or in black, Bye in pink)
  drawBrandLogo(doc, margin, 13.5);

  // Document Title (Concise and clear - safely stays within the left column)
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.babyBlueText);
  doc.text(
    lang === 'id' ? 'HASIL EVALUASI BELANJA' : 'PURCHASE EVALUATION REPORT',
    margin,
    21
  );

  // Document Subtitle
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(
    lang === 'id' ? 'Uji Kelayakan Keputusan Rasional' : 'Rational Decision Feasibility Test',
    margin,
    26.5
  );

  const dateStr = new Date(item.evaluatedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(`${lang === 'id' ? 'Waktu Evaluasi' : 'Timestamp'}: ${dateStr}`, margin, 32);

  // Official Verified Seal Badge in Header Top Right (Right Column - completely separate)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "F");
  doc.setDrawColor(...COLORS.babyBlueAccent);
  doc.setLineWidth(0.5);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "D");
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.babyBlueText);
  doc.text(lang === 'id' ? 'LAPORAN TERVERIFIKASI' : 'VERIFIED STATEMENT', badgeX + (badgeWidth / 2), badgeY + 8, { align: 'center' });
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(`ID: ${item.id.substring(0, 18)}`, badgeX + (badgeWidth / 2), badgeY + 15, { align: 'center' });

  let y = 47;

  // Evaluator User Card
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'D');

  // Left accent line on user card
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(margin, y, 2.5, 16, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'PENGGUNA / EVALUATOR' : 'EVALUATOR', margin + 7, y + 6);

  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(BODY_FONT_SIZE);
  doc.setTextColor(...COLORS.darkNavy);
  let safeUser = userName || 'User';
  while (doc.getTextWidth(safeUser) > 80 && safeUser.length > 5) {
    safeUser = safeUser.substring(0, safeUser.length - 4) + '...';
  }
  doc.text(safeUser, margin + 7, y + 12);

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Status: Evaluasi Mandiri Objektif' : 'Status: Independent Evaluation', pageWidth - margin - 6, y + 10, { align: 'right' });

  y += 22;

  // Evaluated Product Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 27, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 27, 2, 2, 'D');

  // Price highlight badge on right (Width 48mm)
  const priceBadgeW = 48;
  const priceBadgeH = 16;
  const priceBadgeX = pageWidth - margin - priceBadgeW - 4;
  const priceBadgeY = y + 5.5;

  doc.setFillColor(...COLORS.cardTint);
  doc.roundedRect(priceBadgeX, priceBadgeY, priceBadgeW, priceBadgeH, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(priceBadgeX, priceBadgeY, priceBadgeW, priceBadgeH, 2, 2, 'D');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Total Harga' : 'Total Price', priceBadgeX + (priceBadgeW / 2), priceBadgeY + 5.5, { align: 'center' });

  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.dustyBlue);
  doc.text(`Rp ${item.price.toLocaleString('id-ID')}`, priceBadgeX + (priceBadgeW / 2), priceBadgeY + 12, { align: 'center' });

  // Safe left content width - guaranteed to never collide with price badge
  const maxProductTextWidth = priceBadgeX - (margin + 6) - 5;

  // Product Name (Safely truncated to fit before the price badge)
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.darkNavy);
  let safeProductName = item.productName;
  while (doc.getTextWidth(safeProductName) > maxProductTextWidth && safeProductName.length > 5) {
    safeProductName = safeProductName.substring(0, safeProductName.length - 4) + '...';
  }
  doc.text(safeProductName, margin + 6, y + 8.5);

  // Category and Payment details
  const categoryName = categoryLabels[item.category]?.[lang] || item.category;
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.slateGray);
  let safeMetaText = `${lang === 'id' ? 'Kategori' : 'Category'}: ${categoryName}  ·  ${lang === 'id' ? 'Metode' : 'Method'}: ${item.paymentMethod.toUpperCase()}`;
  while (doc.getTextWidth(safeMetaText) > maxProductTextWidth && safeMetaText.length > 10) {
    safeMetaText = safeMetaText.substring(0, safeMetaText.length - 4) + '...';
  }
  doc.text(safeMetaText, margin + 6, y + 16);

  if (item.productUrl) {
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.dustyBlue);
    let safeUrlText = `Tautan: ${item.productUrl}`;
    while (doc.getTextWidth(safeUrlText) > maxProductTextWidth && safeUrlText.length > 10) {
      safeUrlText = safeUrlText.substring(0, safeUrlText.length - 4) + '...';
    }
    doc.text(safeUrlText, margin + 6, y + 22.5);
  }

  y += 33;

  // Prominent Verdict Banner (BUY always green, BYE always red)
  const isBuy = item.decision === 'BUY';
  const isBye = item.decision === 'BYE';
  
  const verdictBannerColor = isBuy ? COLORS.emeraldGreen : isBye ? COLORS.crimsonRed : COLORS.lavenderPurple;
  const verdictIcon = isBuy ? '✔' : isBye ? '✖' : '⏱';
  const verdictTitle = isBuy 
    ? (lang === 'id' ? 'KEPUTUSAN: BUY' : 'VERDICT: BUY')
    : isBye
    ? (lang === 'id' ? 'KEPUTUSAN: BYE' : 'VERDICT: BYE')
    : (lang === 'id' ? 'KEPUTUSAN: COOLING OFF' : 'VERDICT: COOLING OFF');

  const verdictSub = isBuy
    ? (lang === 'id' ? 'Layak & Aman Dibeli' : 'Safe & Approved to Buy')
    : isBye
    ? (lang === 'id' ? 'Batalkan & Hindari Pembelian' : 'Reject & Avoid Purchase')
    : (lang === 'id' ? 'Tahan Dulu 24-48 Jam' : 'Pause 24-48 Hours');

  doc.setFillColor(...verdictBannerColor);
  doc.roundedRect(margin, y, contentWidth, 20, 2.5, 2.5, 'F');

  // Left verdict label
  doc.setTextColor(255, 255, 255);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(12);
  doc.text(`${verdictIcon}  ${verdictTitle}`, margin + 8, y + 8.5);

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(240, 245, 250);
  doc.text(verdictSub, margin + 8, y + 15);

  // Score badge inside verdict banner: REFINED & SMALLER as requested by user
  const scoreBadgeW = 26;
  const scoreBadgeH = 8;
  const scoreBadgeX = pageWidth - margin - scoreBadgeW - 6;
  const scoreBadgeY = y + 6;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(scoreBadgeX, scoreBadgeY, scoreBadgeW, scoreBadgeH, 1.5, 1.5, 'F');
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...verdictBannerColor);
  doc.text(
    `${lang === 'id' ? 'Skor' : 'Score'}: ${item.score}/100`, 
    scoreBadgeX + (scoreBadgeW / 2), 
    scoreBadgeY + 5.5, 
    { align: 'center' }
  );

  y += 26;

  // Financial Impact Triple Cards with Left Accent
  y = drawSectionHeading(doc, lang === 'id' ? 'DAMPAK FINANSIAL & ENERGI KERJA' : 'FINANCIAL & LABOR IMPACT', margin, y, contentWidth);

  const colWidth = (contentWidth - 6) / 3;

  // Card 1: Work Hours
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, colWidth, 21, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, colWidth, 21, 2, 2, 'D');
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(margin, y, 2.5, 21, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Setara Jam Kerja' : 'Labor Hours Needed', margin + 6, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(BODY_FONT_SIZE);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`${item.financialImpact.workHoursNeeded} Jam Kerja`, margin + 6, y + 15.5);

  // Card 2: Discretionary Cash
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 21, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 21, 2, 2, 'D');
  doc.setFillColor(...COLORS.emeraldGreen);
  doc.roundedRect(margin + colWidth + 3, y, 2.5, 21, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Sisa Uang Bebas' : 'Discretionary Cash', margin + colWidth + 9, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(BODY_FONT_SIZE);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${item.financialImpact.discretionaryAfter.toLocaleString('id-ID')}`, margin + colWidth + 9, y + 15.5);

  // Card 3: Debt Ratio / Emergency Runway
  const card3Color = item.paymentMethod === 'paylater' ? COLORS.amberGold : COLORS.dustyBlue;
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 21, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 21, 2, 2, 'D');
  doc.setFillColor(...card3Color);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, 2.5, 21, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(item.paymentMethod === 'paylater' ? 'Beban Utang (DSR)' : 'Kesiapan Dana Darurat', margin + (colWidth * 2) + 12, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(BODY_FONT_SIZE);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(
    item.paymentMethod === 'paylater' 
      ? `${item.financialImpact.debtRatioAfter}%` 
      : `${item.financialImpact.emergencyFundMonthsRatio} Bulan`,
    margin + (colWidth * 2) + 12, 
    y + 15.5
  );

  y += 28;

  // Objective Evaluation Factors (Times New Roman 12, Spasi 1.25, Justify)
  y = drawSectionHeading(doc, lang === 'id' ? 'FAKTOR PENILAIAN OBJEKTIF' : 'OBJECTIVE EVALUATION FACTORS', margin, y, contentWidth);

  for (let i = 0; i < Math.min(item.reasons.length, 3); i++) {
    // Stylized bullet number tag
    doc.setFillColor(...COLORS.cardTint);
    doc.roundedRect(margin, y - 3.2, 5, 5, 1, 1, 'F');
    doc.setFont(FONT_NAME, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.dustyBlue);
    doc.text(`${i + 1}`, margin + 2.5, y + 0.5, { align: 'center' });

    // Justified paragraph
    y = renderJustifiedBlock(doc, item.reasons[i], margin + 8, y, contentWidth - 8, {
      fontSize: BODY_FONT_SIZE,
      fontStyle: 'normal',
      textColor: COLORS.darkNavy,
      spacingFactor: SPACING_FACTOR,
      extraBottomPadding: 2.5,
    });
  }

  y += 3;

  // Actionable Recommendations (Times New Roman 12, Spasi 1.25, Justify)
  y = drawSectionHeading(doc, lang === 'id' ? 'SARAN & REKOMENDASI TINDAKAN' : 'ACTIONABLE RECOMMENDATIONS', margin, y, contentWidth);

  for (let i = 0; i < Math.min(item.recommendations.length, 2); i++) {
    // Arrow bullet tag
    doc.setFillColor(...COLORS.emeraldBg);
    doc.roundedRect(margin, y - 3.2, 5, 5, 1, 1, 'F');
    doc.setFont(FONT_NAME, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.emeraldGreen);
    doc.text('→', margin + 2.5, y + 0.5, { align: 'center' });

    // Justified recommendation paragraph
    y = renderJustifiedBlock(doc, item.recommendations[i], margin + 8, y, contentWidth - 8, {
      fontSize: BODY_FONT_SIZE,
      fontStyle: 'normal',
      textColor: COLORS.darkNavy,
      spacingFactor: SPACING_FACTOR,
      extraBottomPadding: 2.5,
    });
  }

  // Official Footer
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.4);
  doc.line(margin, 281, pageWidth - margin, 281);

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? 'Buy or Bye Financial Intelligence · Dokumen Hasil Evaluasi Belanja Resmi & Mandiri' 
      : 'Buy or Bye Financial Intelligence · Official Rational Purchase Decision Statement',
    margin, 
    286.5
  );

  doc.text(
    lang === 'id' ? 'Pribadi & Rahasia · Halaman 1 dari 1' : 'Confidential · Page 1 of 1',
    pageWidth - margin,
    286.5,
    { align: 'right' }
  );

  const sanitizedName = item.productName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 18);
  doc.save(`BuyOrBye_${sanitizedName}_${item.decision}.pdf`);
}

/**
 * 2. POLISHED SHOPPING LOG & HABIT COACHING PDF
 * Format: Times New Roman 12, Spasi 1.25, Isi Justify, Visual Menarik & Rapi
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

  const badgeWidth = 58;
  const badgeHeight = 20;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = 8.5;

  // Header Banner with Dual Layer
  doc.setFillColor(...COLORS.babyBlue);
  doc.rect(0, 0, pageWidth, 38, "F");
  doc.setFillColor(...COLORS.babyBlueAccent);
  doc.rect(0, 38, pageWidth, 2, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 40, pageWidth, 1, "F");

  // Brand Logo in Header (Left Column - Buy in green, or in black, Bye in pink)
  drawBrandLogo(doc, margin, 13.5);

  // Document Title (Concise and clear - safely stays within the left column)
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.babyBlueText);
  doc.text(
    lang === 'id' ? 'LAPORAN RIWAYAT BELANJA' : 'SHOPPING LOG REPORT',
    margin,
    21
  );

  // Document Subtitle
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(
    lang === 'id' ? 'Pembinaan Kebiasaan & Audit Rasional' : 'Habit Coaching & Rational Audit',
    margin,
    26.5
  );

  const nowStr = new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const sanitizedUser = userName.length > 26 ? userName.substring(0, 24) + '...' : userName;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(
    `${lang === 'id' ? 'Pengguna' : 'User'}: ${sanitizedUser} · ${lang === 'id' ? 'Dicetak' : 'Printed'}: ${nowStr}`,
    margin,
    32
  );

  // Official Seal Badge in Header (Right Column - completely separate, zero overlap)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "F");
  doc.setDrawColor(...COLORS.babyBlueAccent);
  doc.setLineWidth(0.5);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "D");
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.babyBlueText);
  doc.text(lang === 'id' ? 'AUDIT BELANJA MANDIRI' : 'SELF SHOPPING AUDIT', badgeX + (badgeWidth / 2), badgeY + 8, { align: 'center' });
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(`${items.length} ${lang === 'id' ? 'Item Tercatat' : 'Items Logged'}`, badgeX + (badgeWidth / 2), badgeY + 15, { align: 'center' });

  let y = 47;

  // Executive Metrics (Total Saved vs Total Bought)
  const totalSaved = items.filter(i => i.status === 'saved_bye').reduce((acc, c) => acc + (c.savedAmount || c.price), 0);
  const totalBought = items.filter(i => i.status === 'bought').reduce((acc, c) => acc + c.price, 0);
  const byeCount = items.filter(i => i.status === 'saved_bye').length;
  const byeRatio = items.length > 0 ? Math.round((byeCount / items.length) * 100) : 0;

  const cardWidth = (contentWidth - 4) / 2;

  // Box 1: Saved Money (Emerald Accent Strip)
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, cardWidth, 23, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, cardWidth, 23, 2, 2, 'D');
  doc.setFillColor(...COLORS.emeraldGreen);
  doc.roundedRect(margin, y, 3, 23, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'DANA TERSELAMATKAN DARI VONIS BYE' : 'FUNDS RESCUED VIA BYE VERDICTS', margin + 7, y + 7);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.emeraldGreen);
  doc.text(`Rp ${totalSaved.toLocaleString('id-ID')}`, margin + 7, y + 17);

  // Box 2: Total Spent (Navy Accent Strip)
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + cardWidth + 4, y, cardWidth, 23, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin + cardWidth + 4, y, cardWidth, 23, 2, 2, 'D');
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(margin + cardWidth + 4, y, 3, 23, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'TOTAL PENGELUARAN DISETUJUI (BUY)' : 'APPROVED SPENDING (BUY)', margin + cardWidth + 11, y + 7);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${totalBought.toLocaleString('id-ID')}`, margin + cardWidth + 11, y + 17);

  y += 31;

  // Table of Recent Transactions
  y = drawSectionHeading(doc, lang === 'id' ? 'DAFTAR KEPUTUSAN TRANSAKSI TERAKHIR' : 'RECENT TRANSACTION VERDICTS', margin, y, contentWidth);

  // Table Header with strictly non-overlapping column positions
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(8.5);
  doc.text(lang === 'id' ? 'TANGGAL' : 'DATE', margin + 4, y + 5);
  doc.text(lang === 'id' ? 'NAMA PRODUK' : 'PRODUCT NAME', margin + 26, y + 5);
  doc.text(lang === 'id' ? 'METODE' : 'METHOD', margin + 86, y + 5);
  doc.text(lang === 'id' ? 'KEPUTUSAN' : 'DECISION', margin + 110, y + 5);
  doc.text(lang === 'id' ? 'HARGA (RP)' : 'PRICE (IDR)', pageWidth - margin - 4, y + 5, { align: 'right' });
  y += 7.5;

  // Table Rows (Up to 6 rows to leave generous room for justified coaching)
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(9);

  const displayItems = items.slice(0, 6);
  displayItems.forEach((it, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 6.5, 0.5, 0.5, 'F');
    }

    const rowDate = new Date(it.date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
    doc.setTextColor(...COLORS.slateGray);
    doc.text(rowDate, margin + 4, y + 4.5);

    doc.setTextColor(...COLORS.darkNavy);
    // Safely fit product name within 56mm without overlapping next column
    let prodTitle = it.productName;
    while (doc.getTextWidth(prodTitle) > 56 && prodTitle.length > 5) {
      prodTitle = prodTitle.substring(0, prodTitle.length - 4) + '...';
    }
    doc.text(prodTitle, margin + 26, y + 4.5);

    doc.setTextColor(...COLORS.slateGray);
    doc.text(it.paymentMethod.toUpperCase(), margin + 86, y + 4.5);

    // Colored badge for status
    let statusText = it.status === 'bought' 
      ? (lang === 'id' ? 'DIBELI' : 'BOUGHT') 
      : it.status === 'saved_bye' 
      ? (lang === 'id' ? 'BYE (HEMAT)' : 'BYE (SAVED)') 
      : (lang === 'id' ? 'TUNDA' : 'COOLING');
    
    const badgeColor = it.status === 'bought' ? COLORS.emeraldGreen : it.status === 'saved_bye' ? COLORS.crimsonRed : COLORS.lavenderPurple;
    doc.setTextColor(...badgeColor);
    doc.setFont(FONT_NAME, 'bold');
    doc.text(statusText, margin + 110, y + 4.5);
    doc.setFont(FONT_NAME, 'normal');

    doc.setTextColor(...COLORS.darkNavy);
    doc.text(it.price.toLocaleString('id-ID'), pageWidth - margin - 4, y + 4.5, { align: 'right' });

    y += 6.5;
  });

  y += 8;

  // Habit Coaching Section (Times New Roman 12, Spasi 1.25, Justify)
  y = drawSectionHeading(doc, lang === 'id' ? 'SARAN & MASUKAN KEBIASAAN BELANJA' : 'SHOPPING HABIT COACHING & RECOMMENDATIONS', margin, y, contentWidth);

  const coachingTips = lang === 'id' ? [
    `1. Konsistensi Penahanan Impuls: Anda telah berhasil menahan ${byeRatio}% godaan belanja konsumtif melalui keputusan penolakan (BYE). ${byeRatio >= 50 ? 'Disiplin finansial Anda sangat solid dan terbukti mampu mencegah pengeluaran bocor halus.' : 'Terapkan aturan jeda pendinginan minimal 24 hingga 48 jam sebelum checkout barang yang bersifat sekunder.'}`,
    '2. Sinking Fund Sebagai Solusi Utang: Untuk setiap barang dengan nominal di atas Rp 500.000 yang ingin dibeli, alokasikan tabungan terencana selama dua bulan berturut-turut dibandingkan mengambil cicilan PayLater berbunga tinggi.',
    '3. Audit Rutin Pengeluaran Bulanan: Lakukan tinjauan menyeluruh terhadap barang-barang yang sering lolos evaluasi agar proporsi sisa uang bebas tetap terjaga dengan aman di atas 15% dari total pemasukan.'
  ] : [
    `1. Impulse Resistance Consistency: You successfully resisted ${byeRatio}% of impulsive shopping urges through BYE decisions. ${byeRatio >= 50 ? 'Your financial discipline is exemplary in protecting your disposable cash flow.' : 'Implement an enforced cooling-off pause of 24 to 48 hours before committing to non-urgent checkouts.'}`,
    '2. Sinking Funds over Installments: For target purchases exceeding IDR 500,000, build a designated sinking fund across consecutive months rather than committing to recurring installment debt.',
    '3. Regular Expenditure Audits: Conduct an audit of your lifestyle purchases each month to ensure discretionary funds remain safely above 15% of your total income.'
  ];

  coachingTips.forEach(tip => {
    y = renderJustifiedBlock(doc, tip, margin, y, contentWidth, {
      fontSize: BODY_FONT_SIZE,
      fontStyle: 'normal',
      textColor: COLORS.darkNavy,
      spacingFactor: SPACING_FACTOR,
      extraBottomPadding: 3,
    });
  });

  // Official Footer
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.4);
  doc.line(margin, 281, pageWidth - margin, 281);

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? 'Buy or Bye · Laporan Riwayat Transaksi & Kebiasaan Belanja' 
      : 'Buy or Bye · Official Shopping Habit & Decision Record',
    margin, 
    286.5
  );

  doc.text(
    lang === 'id' ? 'Pribadi & Rahasia · Halaman 1 dari 1' : 'Confidential · Page 1 of 1',
    pageWidth - margin,
    286.5,
    { align: 'right' }
  );

  doc.save(`BuyOrBye_Riwayat_Belanja_${userName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}

/**
 * 3. POLISHED MONTHLY REPORT PDF
 * Format: Times New Roman 12, Spasi 1.25, Isi Justify, Visual Menarik & Rapi
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

  const badgeWidth = 58;
  const badgeHeight = 20;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = 8.5;

  // Header Banner with Dual Layer
  doc.setFillColor(...COLORS.babyBlue);
  doc.rect(0, 0, pageWidth, 38, "F");
  doc.setFillColor(...COLORS.babyBlueAccent);
  doc.rect(0, 38, pageWidth, 2, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 40, pageWidth, 1, "F");

  // Brand Logo in Header (Left Column - Buy in green, or in black, Bye in pink)
  drawBrandLogo(doc, margin, 13.5);

  // Document Title (Concise and clear - will never extend into the badge area)
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.babyBlueText);
  doc.text(
    lang === 'id' ? 'LAPORAN KEUANGAN BULANAN' : 'MONTHLY FINANCIAL REPORT',
    margin,
    21
  );

  // Document Subtitle
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(
    lang === 'id' ? 'Kesehatan Finansial & Evaluasi Belanja' : 'Financial Health & Purchase Evaluation',
    margin,
    26.5
  );

  const monthYearStr = new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });
  const sanitizedUser = userName.length > 26 ? userName.substring(0, 24) + '...' : userName;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(
    `${lang === 'id' ? 'Periode' : 'Period'}: ${monthYearStr} · ${lang === 'id' ? 'Pengguna' : 'User'}: ${sanitizedUser}`,
    margin,
    32
  );

  // Official Seal Badge in Header (Right Column - completely separate, zero overlap)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "F");
  doc.setDrawColor(...COLORS.babyBlueAccent);
  doc.setLineWidth(0.5);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "D");
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.babyBlueText);
  doc.text(
    lang === 'id' ? 'LAPORAN RESMI BULANAN' : 'OFFICIAL MONTHLY REPORT',
    badgeX + (badgeWidth / 2),
    badgeY + 8,
    { align: 'center' }
  );

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.babyBlueMuted);
  doc.text(
    lang === 'id' ? 'Audit Keuangan Mandiri' : 'Automated Financial Audit',
    badgeX + (badgeWidth / 2),
    badgeY + 15,
    { align: 'center' }
  );

  let y = 47;

  // Financial Calculations
  const income = finance.monthlyIncome || 0;
  const committed = finance.essentialExpenses + finance.lifestyleExpenses + finance.debtInstallments + finance.savings;
  const freeCash = Math.max(0, income - committed);
  const dsr = income > 0 ? Number(((finance.debtInstallments / income) * 100).toFixed(1)) : 0;
  const emergencyRunway = finance.essentialExpenses > 0 
    ? Number((finance.emergencyFund / finance.essentialExpenses).toFixed(1)) 
    : 0;

  const colWidth = (contentWidth - 9) / 4;

  // Executive Metric Cards (Income, Total Expenses, Free Cash, Debt Ratio)
  // Card 1: Pemasukan Bulanan
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, colWidth, 22, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin, y, colWidth, 22, 2, 2, 'D');
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(margin, y, 2.5, 22, 1, 1, 'F');
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Pemasukan' : 'Income', margin + 5, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${income.toLocaleString('id-ID')}`, margin + 5, y + 16);

  // Card 2: Total Pengeluaran Bulanan
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 22, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 22, 2, 2, 'D');
  doc.setFillColor(180, 140, 160);
  doc.roundedRect(margin + colWidth + 3, y, 2.5, 22, 1, 1, 'F');
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Total Pengeluaran' : 'Total Expenses', margin + colWidth + 8, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${committed.toLocaleString('id-ID')}`, margin + colWidth + 8, y + 16);

  // Card 3: Sisa Uang Bebas
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 22, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, colWidth, 22, 2, 2, 'D');
  doc.setFillColor(...COLORS.emeraldGreen);
  doc.roundedRect(margin + (colWidth * 2) + 6, y, 2.5, 22, 1, 1, 'F');
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Sisa Uang Bebas' : 'Free Buffer', margin + (colWidth * 2) + 11, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${freeCash.toLocaleString('id-ID')}`, margin + (colWidth * 2) + 11, y + 16);

  // Card 4: Rasio Beban Utang (DSR)
  const isDsrSafe = dsr <= 30;
  const dsrStatusColor = isDsrSafe ? COLORS.emeraldGreen : COLORS.crimsonRed;
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin + (colWidth * 3) + 9, y, colWidth, 22, 2, 2, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.roundedRect(margin + (colWidth * 3) + 9, y, colWidth, 22, 2, 2, 'D');
  doc.setFillColor(...dsrStatusColor);
  doc.roundedRect(margin + (colWidth * 3) + 9, y, 2.5, 22, 1, 1, 'F');
  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'Beban Utang' : 'Debt (DSR)', margin + (colWidth * 3) + 14, y + 6.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...dsrStatusColor);
  const dsrStatusText = isDsrSafe
    ? (lang === 'id' ? 'Aman' : 'Safe')
    : (lang === 'id' ? 'Tinggi' : 'High');
  doc.text(`${dsr}% (${dsrStatusText})`, margin + (colWidth * 3) + 14, y + 16);

  y += 29;

  // 4 Pos Anggaran Bulanan dengan Visual Progress Bar
  y = drawSectionHeading(doc, lang === 'id' ? 'RINCIAN 4 POS ANGGARAN BULANAN (DENGAN INDIKATOR VISUAL)' : '4 MONTHLY BUDGET ALLOCATIONS & VISUAL BARS', margin, y, contentWidth);

  const rowH = 7.5;
  const buckets = lang === 'id' ? [
    { label: 'Kebutuhan Pokok (Needs)', val: finance.essentialExpenses, pct: Number(((finance.essentialExpenses / income) * 100).toFixed(1)), idealPct: 50, ideal: 'Maks 50%' },
    { label: 'Gaya Hidup & Wishlist (Wants)', val: finance.lifestyleExpenses, pct: Number(((finance.lifestyleExpenses / income) * 100).toFixed(1)), idealPct: 30, ideal: 'Maks 30%' },
    { label: 'Cicilan & Kewajiban (Debts)', val: finance.debtInstallments, pct: dsr, idealPct: 30, ideal: 'Maks 30%' },
    { label: 'Tabungan Rutin (Savings)', val: finance.savings, pct: Number(((finance.savings / income) * 100).toFixed(1)), idealPct: 20, ideal: 'Min 20%' }
  ] : [
    { label: 'Essential Needs', val: finance.essentialExpenses, pct: Number(((finance.essentialExpenses / income) * 100).toFixed(1)), idealPct: 50, ideal: 'Max 50%' },
    { label: 'Lifestyle & Wants', val: finance.lifestyleExpenses, pct: Number(((finance.lifestyleExpenses / income) * 100).toFixed(1)), idealPct: 30, ideal: 'Max 30%' },
    { label: 'Debt Installments', val: finance.debtInstallments, pct: dsr, idealPct: 30, ideal: 'Max 30%' },
    { label: 'Monthly Savings', val: finance.savings, pct: Number(((finance.savings / income) * 100).toFixed(1)), idealPct: 20, ideal: 'Min 20%' }
  ];

  // Table Header with strictly non-overlapping column positions
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(8.5);
  doc.text(lang === 'id' ? 'POS PENGELUARAN' : 'EXPENSE BUCKET', margin + 4, y + 4.5);
  doc.text(lang === 'id' ? 'NOMINAL (RP)' : 'AMOUNT (IDR)', margin + 60, y + 4.5);
  doc.text(lang === 'id' ? 'PORSI REAL' : 'ACTUAL %', margin + 98, y + 4.5);
  doc.text(lang === 'id' ? 'INDIKATOR VISUAL' : 'VISUAL BAR', margin + 120, y + 4.5);
  doc.text(lang === 'id' ? 'TARGET' : 'TARGET', pageWidth - margin - 4, y + 4.5, { align: 'right' });
  y += 6.5;

  buckets.forEach((b, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, rowH, 0.5, 0.5, 'F');
    }
    doc.setTextColor(...COLORS.darkNavy);
    doc.setFont(FONT_NAME, 'bold');
    doc.setFontSize(8.5);
    doc.text(b.label, margin + 4, y + 5);

    doc.setFont(FONT_NAME, 'normal');
    doc.text(`Rp ${b.val.toLocaleString('id-ID')}`, margin + 60, y + 5);
    doc.text(`${b.pct}%`, margin + 98, y + 5);

    // Mini visual bar
    const isHealthy = idx === 3 ? b.pct >= b.idealPct : b.pct <= b.idealPct;
    drawAllocationBar(doc, margin + 120, y + 2.5, 22, 2.5, b.pct, 60, isHealthy);

    doc.setTextColor(...COLORS.slateGray);
    doc.text(b.ideal, pageWidth - margin - 4, y + 5, { align: 'right' });

    y += rowH;
  });

  y += 7;

  // Ringkasan Keputusan Belanja Bulan Ini (Times New Roman 12, Spasi 1.25, Justify)
  y = drawSectionHeading(doc, lang === 'id' ? 'RINGKASAN KEPUTUSAN BELANJA BULAN INI' : 'MONTHLY SHOPPING VERDICTS & RESCUED FUNDS', margin, y, contentWidth);

  const totalSavedMonth = shoppingItems.filter(i => i.status === 'saved_bye').reduce((acc, c) => acc + (c.savedAmount || c.price), 0);
  const totalBoughtMonth = shoppingItems.filter(i => i.status === 'bought').reduce((acc, c) => acc + c.price, 0);

  // Two dedicated side-by-side cards (Zero chance of text overlap)
  const halfCardW = (contentWidth - 4) / 2;

  // Left card: Dana Terselamatkan (BYE)
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(margin, y, halfCardW, 16, 1.5, 1.5, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, halfCardW, 16, 1.5, 1.5, 'D');
  doc.setFillColor(...COLORS.emeraldGreen);
  doc.roundedRect(margin, y, 2.5, 16, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'DANA TERSELAMATKAN (VONIS BYE)' : 'FUNDS RESCUED (BYE VERDICTS)', margin + 6, y + 5.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.emeraldGreen);
  doc.text(`Rp ${totalSavedMonth.toLocaleString('id-ID')}`, margin + 6, y + 12);

  // Right card: Belanja Lolos (BUY)
  const rightCardX = margin + halfCardW + 4;
  doc.setFillColor(...COLORS.coolBeige);
  doc.roundedRect(rightCardX, y, halfCardW, 16, 1.5, 1.5, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(rightCardX, y, halfCardW, 16, 1.5, 1.5, 'D');
  doc.setFillColor(...COLORS.dustyBlue);
  doc.roundedRect(rightCardX, y, 2.5, 16, 1, 1, 'F');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(lang === 'id' ? 'TOTAL BELANJA DISETUJUI (BUY)' : 'APPROVED SPENDING (BUY)', rightCardX + 6, y + 5.5);
  doc.setFont(FONT_NAME, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.darkNavy);
  doc.text(`Rp ${totalBoughtMonth.toLocaleString('id-ID')}`, rightCardX + 6, y + 12);

  y += 19;

  // Emergency runway status strip (Dedicated row below the 2 metric boxes)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 7.5, 1, 1, 'F');
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, contentWidth, 7.5, 1, 1, 'D');

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? `Ketahanan Finansial: Cadangan Dana Darurat Menopang ${emergencyRunway} Bulan Kebutuhan Pokok`
      : `Financial Runway: Emergency Reserves Support ${emergencyRunway} Months of Essential Needs`,
    margin + 6,
    y + 5
  );

  y += 11;

  // Justified Analysis Paragraph
  const summaryParagraph = lang === 'id'
    ? `Berdasarkan evaluasi sepanjang periode ini, Anda berhasil melindungi arus kas dengan menahan keputusan belanja konsumtif (vonis BYE) senilai total Rp ${totalSavedMonth.toLocaleString('id-ID')}. Total pengeluaran belanja yang disetujui setelah melalui uji kelayakan objektif tercatat sebesar Rp ${totalBoughtMonth.toLocaleString('id-ID')}. Cadangan dana darurat Anda saat ini dapat menopang pengeluaran kebutuhan pokok selama ${emergencyRunway} bulan ke depan.`
    : `Throughout this evaluation cycle, you preserved personal liquidity by rejecting non-essential impulse purchases (BYE verdicts) totaling IDR ${totalSavedMonth.toLocaleString('id-ID')}. Approved purchases meeting objective financial criteria stood at IDR ${totalBoughtMonth.toLocaleString('id-ID')}. Your current emergency reserves provide an operating runway of approximately ${emergencyRunway} months of essential monthly expenditures.`;

  y = renderJustifiedBlock(doc, summaryParagraph, margin, y, contentWidth, {
    fontSize: BODY_FONT_SIZE,
    fontStyle: 'normal',
    textColor: COLORS.darkNavy,
    spacingFactor: SPACING_FACTOR,
    extraBottomPadding: 3.5,
  });

  // Rekomendasi Keuangan Bulan Depan (Times New Roman 12, Spasi 1.25, Justify)
  y = drawSectionHeading(doc, lang === 'id' ? 'REKOMENDASI KEUANGAN BULAN DEPAN' : 'ACTION PLAN FOR NEXT MONTH', margin, y, contentWidth);

  const actionPlans = lang === 'id' ? [
    '1. Pertahankan alokasi tabungan rutin minimal 20% dari seluruh penghasilan bulanan dan prioritaskan pemenuhan pos Dana Darurat hingga mencapai batas aman minimal enam bulan pengeluaran pokok.',
    '2. Batasi penambahan komitmen cicilan baru (baik PayLater maupun kartu kredit) agar rasio beban utang (DSR) tetap terkendali secara konsisten di bawah ambang batas 30%.',
    '3. Lakukan penyaringan dengan kalkulator Buy or Bye untuk setiap rencana belanja non-esensial yang bernilai di atas Rp 150.000 guna menghindari akumulasi pengeluaran impulsif.'
  ] : [
    '1. Maintain a regular savings allocation of at least 20% of monthly earnings and direct surplus funds toward expanding the emergency reserve to six months of essential living expenses.',
    '2. Strictly limit taking on new installment commitments via PayLater or credit cards to ensure your aggregate debt service ratio (DSR) remains safely under the 30% prudential threshold.',
    '3. Screen all non-essential shopping items exceeding IDR 150,000 through the Buy or Bye evaluation engine prior to completing checkout to curb creeping lifestyle expenditures.'
  ];

  actionPlans.forEach(plan => {
    y = renderJustifiedBlock(doc, plan, margin, y, contentWidth, {
      fontSize: BODY_FONT_SIZE,
      fontStyle: 'normal',
      textColor: COLORS.darkNavy,
      spacingFactor: SPACING_FACTOR,
      extraBottomPadding: 2.5,
    });
  });

  // Official Footer (No font meta labels)
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.4);
  doc.line(margin, 281, pageWidth - margin, 281);

  doc.setFont(FONT_NAME, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.slateGray);
  doc.text(
    lang === 'id' 
      ? 'Buy or Bye · Laporan Analisis Kesehatan Keuangan Bulanan' 
      : 'Buy or Bye · Official Monthly Personal Financial Health Statement',
    margin, 
    286.5
  );

  doc.text(
    lang === 'id' ? 'Pribadi & Rahasia · Halaman 1 dari 1' : 'Confidential · Page 1 of 1',
    pageWidth - margin,
    286.5,
    { align: 'right' }
  );

  doc.save(`BuyOrBye_Laporan_Bulanan_${monthYearStr.replace(/\s+/g, '_')}.pdf`);
}
