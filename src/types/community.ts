export interface CommunityReply {
  id: string;
  authorName: string;
  authorRole?: string;
  content: string;
  createdAt: string;
}

export interface CommunityDiscussion {
  id: string;
  title: string;
  category: 'pengelolaan_uang' | 'menabung' | 'budgeting' | 'utang_paylater' | 'investasi_dasar' | 'belanja_impulsif';
  authorName: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  replies: CommunityReply[];
}

export const COMMUNITY_CATEGORIES = [
  { id: 'all', label: 'Semua Topik', labelEn: 'All Topics' },
  { id: 'pengelolaan_uang', label: 'Pengelolaan Uang', labelEn: 'Money Management', icon: 'Coins' },
  { id: 'menabung', label: 'Menabung & Dana Darurat', labelEn: 'Savings & Emergency', icon: 'PiggyBank' },
  { id: 'budgeting', label: 'Budgeting & Gaji', labelEn: 'Budgeting & Salary', icon: 'Wallet' },
  { id: 'utang_paylater', label: 'Utang & PayLater', labelEn: 'Debt & PayLater', icon: 'CreditCard' },
  { id: 'belanja_impulsif', label: 'Belanja Impulsif', labelEn: 'Impulse Spending', icon: 'ShoppingBag' },
  { id: 'investasi_dasar', label: 'Investasi Dasar', labelEn: 'Basic Investing', icon: 'TrendingUp' },
];
