import { FinancialProfile, EvaluationItem, ShoppingLogItem, User } from '../types';

const USERS_KEY = 'buy_or_bye_users_v1';
const CURRENT_USER_KEY = 'buy_or_bye_current_user_v1';
const FINANCE_PREFIX = 'buy_or_bye_finance_v1_';
const EVALS_PREFIX = 'buy_or_bye_evals_v1_';
const HISTORY_PREFIX = 'buy_or_bye_history_v1_';

export const DEMO_USER: User = {
  id: 'usr_demo_alya',
  name: 'Alya Putri',
  email: 'alya@buyorbye.id',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '2026-01-15T09:00:00.000Z'
};

export const DEMO_FINANCE: FinancialProfile = {
  monthlyIncome: 7500000, // Rp 7.500.000 (Gaji first-jobber / fresh graduate)
  essentialExpenses: 3500000, // Sewa kos + makan harian + utilitas
  lifestyleExpenses: 1500000, // Nongkrong kafe + hobi + skincare
  debtInstallments: 750000, // Cicilan laptop kerja (10% DSR)
  savings: 1000000, // Tabungan bulanan
  emergencyFund: 12500000, // Dana darurat terkumpul ~3.5 bulan kebutuhan
  emergencyTargetMonths: 6,
  lastUpdated: new Date().toISOString()
};

export const DEMO_EVALUATIONS: EvaluationItem[] = [
  {
    id: 'eval_demo_1',
    userId: 'usr_demo_alya',
    productUrl: 'https://shopee.co.id/leather-vintage-jacket-oversized',
    productName: 'Leather Oversized Vintage Jacket',
    category: 'fashion',
    price: 890000,
    paymentMethod: 'paylater',
    paylaterTenorMonths: 3,
    paylaterFeePercent: 2.95,
    urgencyScore: 1,
    hasSimilarItem: true,
    usedFrequency: 'rarely',
    coolingOffPassed: false,
    evaluatedAt: '2026-03-01T14:20:00.000Z',
    decision: 'BYE',
    score: 32,
    reasons: [
      'Harga barang melebihi 50% alokasi uang bebas bulananmu.',
      'Kamu sudah memiliki jaket serupa yang masih berfungsi.',
      'Cicilan paylater menambah beban finansial dengan bunga tersembunyi.'
    ],
    recommendations: [
      'Batalkan pembelian dan hapus dari keranjang untuk hindari FOMO.',
      'Gunakan jaket lama yang sudah ada di lemarimu.'
    ],
    educationalNotes: [
      'Kamu harus bekerja selama 19.0 jam penuh hanya untuk jaket ini yang jarang dipakai.'
    ],
    financialImpact: {
      discretionaryBefore: 750000,
      discretionaryAfter: 430000,
      discretionaryImpactPercent: 42.7,
      debtRatioBefore: 10.0,
      debtRatioAfter: 14.3,
      workHoursNeeded: 19.0,
      emergencyFundMonthsRatio: 3.6,
      monthlyInstallmentCost: 320000
    }
  },
  {
    id: 'eval_demo_2',
    userId: 'usr_demo_alya',
    productUrl: 'https://tokopedia.com/ergonomic-wrist-rest-cushion',
    productName: 'Ergonomic Memory Foam Wrist Rest (Bantal Penyangga Kerja)',
    category: 'home',
    price: 185000,
    paymentMethod: 'debit',
    urgencyScore: 4,
    hasSimilarItem: false,
    usedFrequency: 'daily',
    coolingOffPassed: true,
    evaluatedAt: '2026-03-04T10:15:00.000Z',
    decision: 'BUY',
    score: 88,
    reasons: [
      'Sangat mendukung produktivitas kerja harian (ergonomis) dan mencegah cedera.',
      'Hanya menyerap sebagian kecil dari uang bebas bulanan.',
      'Dibayar tunai/debit tanpa risiko utang baru.'
    ],
    recommendations: [
      'Pembelian ini rasional dan bernilai investasi kesehatan jangka panjang.'
    ],
    educationalNotes: [
      'Hanya setara 3.9 jam kerja dan dipakai setiap hari saat bekerja.'
    ],
    financialImpact: {
      discretionaryBefore: 750000,
      discretionaryAfter: 565000,
      discretionaryImpactPercent: 24.7,
      debtRatioBefore: 10.0,
      debtRatioAfter: 10.0,
      workHoursNeeded: 3.9,
      emergencyFundMonthsRatio: 3.6
    }
  }
];

export const DEMO_SHOPPING_LOG: ShoppingLogItem[] = [
  {
    id: 'log_demo_1',
    userId: 'usr_demo_alya',
    evaluationId: 'eval_demo_1',
    productName: 'Leather Oversized Vintage Jacket',
    category: 'fashion',
    price: 890000,
    status: 'saved_bye',
    date: '2026-03-01T14:30:00.000Z',
    paymentMethod: 'paylater',
    savedAmount: 890000,
    notes: 'Berhasil dihindari setelah lihat hasil evaluasi Buy or Bye! Uangnya dialihkan ke dana darurat.'
  },
  {
    id: 'log_demo_2',
    userId: 'usr_demo_alya',
    evaluationId: 'eval_demo_2',
    productName: 'Ergonomic Memory Foam Wrist Rest',
    category: 'home',
    price: 185000,
    status: 'bought',
    date: '2026-03-04T11:00:00.000Z',
    paymentMethod: 'debit',
    notes: 'Dibeli lunas via debit. Pergelangan tangan tidak pegal lagi saat lembur.'
  },
  {
    id: 'log_demo_3',
    userId: 'usr_demo_alya',
    productName: 'Blind Box Pop Mart Vinyl Figure',
    category: 'hobbies',
    price: 340000,
    status: 'saved_bye',
    date: '2026-02-18T16:45:00.000Z',
    paymentMethod: 'cash',
    savedAmount: 340000,
    notes: 'Awalnya ingin checkout saat flash sale, lalu tersadar hanya FOMO di media sosial.'
  },
  {
    id: 'log_demo_4',
    userId: 'usr_demo_alya',
    productName: 'Kemeja Katun Basic Kantor',
    category: 'fashion',
    price: 260000,
    status: 'bought',
    date: '2026-02-10T13:00:00.000Z',
    paymentMethod: 'cash',
    notes: 'Kebutuhan pengganti seragam kerja yang sudah robek.'
  }
];

// Local Storage Helper Functions
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const initial = [DEMO_USER];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEMO_USER];
  }
}

export function saveUser(user: User): void {
  const users = getUsers();
  const existingIdx = users.findIndex(u => u.id === user.id);
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getUserFinance(userId: string): FinancialProfile {
  try {
    const raw = localStorage.getItem(`${FINANCE_PREFIX}${userId}`);
    if (!raw) {
      if (userId === DEMO_USER.id) {
        saveUserFinance(userId, DEMO_FINANCE);
        return DEMO_FINANCE;
      }
      const defaultFinance: FinancialProfile = {
        monthlyIncome: 6000000,
        essentialExpenses: 3000000,
        lifestyleExpenses: 1200000,
        debtInstallments: 500000,
        savings: 800000,
        emergencyFund: 8000000,
        emergencyTargetMonths: 6,
        lastUpdated: new Date().toISOString()
      };
      saveUserFinance(userId, defaultFinance);
      return defaultFinance;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_FINANCE;
  }
}

export function saveUserFinance(userId: string, profile: FinancialProfile): void {
  localStorage.setItem(`${FINANCE_PREFIX}${userId}`, JSON.stringify(profile));
}

export function getUserEvaluations(userId: string): EvaluationItem[] {
  try {
    const raw = localStorage.getItem(`${EVALS_PREFIX}${userId}`);
    if (!raw) {
      if (userId === DEMO_USER.id) {
        localStorage.setItem(`${EVALS_PREFIX}${userId}`, JSON.stringify(DEMO_EVALUATIONS));
        return DEMO_EVALUATIONS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserEvaluation(userId: string, evaluation: EvaluationItem): void {
  const evals = getUserEvaluations(userId);
  evals.unshift(evaluation); // add newest to front
  localStorage.setItem(`${EVALS_PREFIX}${userId}`, JSON.stringify(evals));
}

export function getUserShoppingLog(userId: string): ShoppingLogItem[] {
  try {
    const raw = localStorage.getItem(`${HISTORY_PREFIX}${userId}`);
    if (!raw) {
      if (userId === DEMO_USER.id) {
        localStorage.setItem(`${HISTORY_PREFIX}${userId}`, JSON.stringify(DEMO_SHOPPING_LOG));
        return DEMO_SHOPPING_LOG;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserShoppingLog(userId: string, item: ShoppingLogItem): void {
  const logs = getUserShoppingLog(userId);
  logs.unshift(item);
  localStorage.setItem(`${HISTORY_PREFIX}${userId}`, JSON.stringify(logs));
}

export function deleteShoppingLogItem(userId: string, logId: string): void {
  const logs = getUserShoppingLog(userId).filter(item => item.id !== logId);
  localStorage.setItem(`${HISTORY_PREFIX}${userId}`, JSON.stringify(logs));
}
