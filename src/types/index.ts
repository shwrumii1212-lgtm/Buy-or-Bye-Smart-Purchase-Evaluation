export type Language = 'id' | 'en';

export type ProductCategory = 
  | 'fashion' 
  | 'gadget' 
  | 'beauty' 
  | 'hobbies' 
  | 'fnb' 
  | 'home' 
  | 'subscription' 
  | 'other';

export type PaymentMethod = 
  | 'cash' 
  | 'debit' 
  | 'credit_card' 
  | 'savings'
  | 'paylater';

export type DecisionVerdict = 'BUY' | 'BYE' | 'COOLING_OFF';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface FinancialProfile {
  monthlyIncome: number;
  essentialExpenses: number; // Kebutuhan Pokok (Sewa/Kos, Makan, Utilitas, Transport)
  lifestyleExpenses: number; // Wishlist / Lifestyle (Nongkrong, Hiburan, Hobi)
  debtInstallments: number; // Cicilan & Kewajiban (Paylater aktif, Pinjaman, Kartu Kredit)
  savings: number; // Tabungan rutin bulanan
  emergencyFund: number; // Saldo Dana Darurat yang sudah ada
  emergencyTargetMonths: number; // Target bulan dana darurat (e.g., 3-6 bulan)
  lastUpdated: string;
}

export interface EvaluationItem {
  id: string;
  userId: string;
  productUrl?: string;
  productName: string;
  category: ProductCategory;
  price: number;
  paymentMethod: PaymentMethod;
  paylaterTenorMonths?: number;
  paylaterFeePercent?: number; // per month
  urgencyScore: number; // 1 to 5
  hasSimilarItem: boolean;
  usedFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  coolingOffPassed: boolean; // sudah didiamkan > 24 jam?
  evaluatedAt: string;
  
  // Calculated outcomes
  decision: DecisionVerdict;
  score: number; // 0 - 100
  reasons: string[];
  recommendations: string[];
  educationalNotes: string[];
  financialImpact: {
    discretionaryBefore: number;
    discretionaryAfter: number;
    discretionaryImpactPercent: number;
    debtRatioBefore: number;
    debtRatioAfter: number;
    workHoursNeeded: number;
    emergencyFundMonthsRatio: number;
    monthlyInstallmentCost?: number;
  };
}

export interface ShoppingLogItem {
  id: string;
  userId: string;
  evaluationId?: string;
  productName: string;
  category: ProductCategory;
  price: number;
  status: 'bought' | 'saved_bye' | 'cooling_down';
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  savedAmount?: number; // if user chose BYE, how much was saved
}
