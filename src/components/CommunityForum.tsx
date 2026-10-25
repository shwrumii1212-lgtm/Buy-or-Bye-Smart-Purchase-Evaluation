import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Send, 
  ArrowLeft, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  Filter, 
  CornerDownRight, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Tag,
  RefreshCw
} from 'lucide-react';
import { Language, User } from '../types';
import { CommunityDiscussion, CommunityReply, COMMUNITY_CATEGORIES } from '../types/community';

interface CommunityForumProps {
  language: Language;
  user: User | null;
}

const DEFAULT_COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-1',
    title: 'Gaji UMR mau mulai budgeting 50/30/20 tapi biaya kos mahal, gimana solusinya?',
    category: 'budgeting',
    authorName: 'Dina K.',
    authorRole: 'Community Member',
    content: 'Halo teman-teman Buy or Bye! Penghasilan saya sekitar Rp 4,5 juta/bulan di kota besar. Sekarang biaya kosan + listrik habis Rp 1,6 juta sendiri (hampir 36%). Mau terapkan 50/30/20 susah banget di pos kebutuhan pokok (50%). Adakah yang punya formula alternatif budgeting yang lebih realistis untuk perantau?',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-1-1',
        authorName: 'Rian Pratama',
        authorRole: 'Budgeting Enthusiast',
        content: 'Halo Dina! Rumus 50/30/20 dari Elizabeth Warren memang aslinya dirancang untuk kondisi biaya hidup seimbang. Buat perantau kota besar, kamu bisa pakai formula adaptif 60/20/20 atau 65/20/15: 60-65% Kebutuhan Pokok, 20% Tabungan/Dana Darurat, dan 15-20% Gaya Hidup & Self-Reward terukur.',
        createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-1-2',
        authorName: 'Siti Rahma',
        authorRole: 'Community Member',
        content: 'Setuju banget sama Kak Rian. Dulu kos sendirian bikin boncos, tahun kedua aku ajak teman sekantor buat sewa kamar berdua (twin bed). Biaya kos langsung kepotong 40%!',
        createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-2',
    title: 'Pengalaman lepas dari jeratan PayLater 4 aplikasi berbeda dalam 6 bulan',
    category: 'utang_paylater',
    authorName: 'Kevin Wardhana',
    authorRole: 'Financial Survivor',
    content: 'Tahun lalu saya sempat punya tagihan paylater menumpuk sampai total 14 juta karena kebiasaan checkout makanan pesan antar & beli sneakers dicicil 12 bulan. Tiap awal bulan gaji numpang lewat buat bayar cicilan. Saya berhasil lunas pakai metode Snowball Debt. Mau berbagi cerita sekaligus kasih semangat buat yang lagi berjuang lunasin cicilan!',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-2-1',
        authorName: 'Amanda Putri',
        authorRole: 'Community Member',
        content: 'Keren banget Kak Kevin! Boleh sharing urutan langkah Snowball Debt-nya? Aku lagi ada 2 tagihan paylater kecil dan 1 pinjaman gadget yang lumayan bikin pusing.',
        createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-2-2',
        authorName: 'Kevin Wardhana',
        authorRole: 'Financial Survivor',
        content: 'Hai Amanda! Urutkan utang dari saldo nominal pokok paling KECIL sampai paling BESAR, tanpa lihat bunganya dulu. Bayar batas minimum untuk semua akun, tapi semua sisa uang bebas difokuskan babat habis akun terkecil pertama.',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-3',
    title: 'Trik ampuh menahan "Checkout Tengah Malam" pas lagi doom scrolling diskon',
    category: 'belanja_impulsif',
    authorName: 'Nadia S.',
    authorRole: 'Community Member',
    content: 'Tiap jam 11 malam ke atas rasanya jari gatal pengen buka marketplace. Algoritma rekomendasi racun banget dan sering berakhir checkout barang gak penting. Ada tips konkrit selain hapus aplikasi?',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-3-1',
        authorName: 'Fajar Nugraha',
        authorRole: 'Mindful Spender',
        content: 'Trik terbaik: hapus fitur One-Click Checkout dan unlink kartu kredit/debit instan dari aplikasi. Setiap mau bayar, paksa dirimu bayar via transfer manual. Hambatan (friction) 2 menit ini 90% efektif bikin sadar dan batal checkout!',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-4',
    title: 'Berapa idealnya dana darurat sebelum mulai beli instrumen investasi?',
    category: 'menabung',
    authorName: 'Bima Satria',
    authorRole: 'Community Member',
    content: 'Banyak teman seumuran langsung fomo beli saham atau kripto padahal rekening tabungan tipis. Sebenarnya kapan saat yang tepat dan aman buat mulai investasi bagi pemula yang baru bekerja?',
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-4-1',
        authorName: 'Buy or Bye Mentor',
        authorRole: 'Financial Educator',
        content: 'Hai Bima! Fondasi piramida finansial adalah Dana Darurat minimal 3 bulan biaya hidup pokok (untuk lajang) atau 6 bulan (jika sudah berkeluarga). Dana darurat harus disimpan di instrumen likuid bebas fluktuasi pasar modal (RDPU/deposito). Setelah dana darurat aman, baru mulai investasi.',
        createdAt: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-5',
    title: 'Strategi memisahkan rekening bank: Berapa rekening yang kalian pakai sehari-hari?',
    category: 'pengelolaan_uang',
    authorName: 'Aulia Rahmani',
    authorRole: 'Community Member',
    content: 'Dulu saya cuma pakai 1 rekening untuk gaji, jajan, dan tabungan. Akhirnya saldo selalu habis tanpa jejak. Sekarang mau coba metode multiple bank account. Teman-teman di sini biasanya bagi jadi berapa rekening?',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-5-1',
        authorName: 'Gita Saraswati',
        authorRole: 'Community Member',
        content: 'Aku pakai sistem 3 Rekening: 1. Rekening Gaji & Kebutuhan Rutin, 2. Rekening Tabungan & Dana Darurat (tanpa ATM), 3. Rekening Jajan / Operasional Harian dengan jatah kuota mingguan.',
        createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-6',
    title: 'Mau beli laptop gaming 12 juta tapi ragu: Kebutuhan atau sekadar Keinginan?',
    category: 'investasi_dasar',
    authorName: 'Eko Prasetyo',
    authorRole: 'Community Member',
    content: 'Pekerjaan saya freelance graphic design & video editor. Laptop lama sudah 5 tahun dan render video suka ngelag parah. Harga laptop incaran 12 juta. Tabungan ada 18 juta. Apakah ini pembelian yang bijak?',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-6-1',
        authorName: 'Hendra Saputra',
        authorRole: 'Mindful Creator',
        content: 'Kalau laptop tersebut adalah alat produksi primer yang langsung menghasilkan uang dan laptop lama memakan waktu kerja, ini masuk kategori Belanja Produktif / Kebutuhan Kerja. Tapi pastikan sisa tabungan masih cukup untuk dana darurat!',
        createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
      }
    ]
  }
];

export const CommunityForum: React.FC<CommunityForumProps> = ({ language, user }) => {
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active discussion view (Detail mode)
  const [activeDiscussion, setActiveDiscussion] = useState<CommunityDiscussion | null>(null);
  
  // New discussion modal state
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityDiscussion['category']>('pengelolaan_uang');
  const [newContent, setNewContent] = useState('');
  const [newAuthorName, setNewAuthorName] = useState(user?.name || '');
  const [createError, setCreateError] = useState('');
  const [isSubmittingDisc, setIsSubmittingDisc] = useState(false);

  // Reply state
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState(user?.name || '');
  const [replyError, setReplyError] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Fetch discussions from API
  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/discussions?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal memuat diskusi');
      const data = await res.json();
      if (data.discussions && data.discussions.length > 0) {
        setDiscussions(data.discussions);
      } else {
        // Fallback default sample discussions filtered by category
        let fallback = [...DEFAULT_COMMUNITY_DISCUSSIONS];
        if (selectedCategory !== 'all') {
          fallback = fallback.filter(d => d.category === selectedCategory);
        }
        setDiscussions(fallback);
      }
    } catch (err) {
      console.error('Fetch discussions error, using default seed:', err);
      let fallback = [...DEFAULT_COMMUNITY_DISCUSSIONS];
      if (selectedCategory !== 'all') {
        fallback = fallback.filter(d => d.category === selectedCategory);
      }
      setDiscussions(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiscussions();
  };

  // Open single discussion
  const handleOpenDiscussion = async (discId: string) => {
    try {
      const res = await fetch(`/api/discussions/${discId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveDiscussion(data.discussion);
      }
    } catch (err) {
      console.error('Failed to open discussion:', err);
    }
  };

  // Submit new discussion
  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newTitle.trim()) {
      setCreateError(language === 'id' ? 'Judul diskusi wajib diisi.' : 'Discussion title is required.');
      return;
    }
    if (!newContent.trim()) {
      setCreateError(language === 'id' ? 'Isi pertanyaan atau cerita diskusi wajib diisi.' : 'Discussion content is required.');
      return;
    }

    setIsSubmittingDisc(true);
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          content: newContent,
          authorName: newAuthorName.trim() || user?.name || (language === 'id' ? 'Teman Bijak' : 'Mindful Peer'),
          authorRole: user ? 'Registered Member' : 'Community Member'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal membuat diskusi');
      }

      const data = await res.json();
      // Reset form
      setNewTitle('');
      setNewContent('');
      setIsCreatingDiscussion(false);
      
      // Refresh list & open newly created discussion
      await fetchDiscussions();
      if (data.discussion) {
        setActiveDiscussion(data.discussion);
      }
    } catch (err: any) {
      setCreateError(err.message || 'Gagal mengirim diskusi.');
    } finally {
      setIsSubmittingDisc(false);
    }
  };

  // Submit reply
  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDiscussion) return;
    setReplyError('');

    if (!replyContent.trim()) {
      setReplyError(language === 'id' ? 'Balasan tidak boleh kosong.' : 'Reply cannot be empty.');
      return;
    }

    setIsSubmittingReply(true);
    try {
      const res = await fetch(`/api/discussions/${activeDiscussion.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          authorName: replyAuthorName.trim() || user?.name || (language === 'id' ? 'Sahabat Finansial' : 'Community Friend'),
          authorRole: user ? 'Verified Member' : 'Member'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengirim balasan');
      }

      const data = await res.json();
      setReplyContent('');
      setActiveDiscussion(data.discussion);
      
      // Also update in list in background
      fetchDiscussions();
    } catch (err: any) {
      setReplyError(err.message || 'Gagal membalas diskusi.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getCategoryLabel = (catId: string) => {
    const found = COMMUNITY_CATEGORIES.find(c => c.id === catId);
    if (!found) return catId;
    return language === 'id' ? found.label : found.labelEn;
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (3600 * 1000));
    if (diffHours < 1) return language === 'id' ? 'Baru saja' : 'Just now';
    if (diffHours < 24) return language === 'id' ? `${diffHours} jam yang lalu` : `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return language === 'id' ? `${diffDays} hari yang lalu` : `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Detail Discussion View Mode */}
      {activeDiscussion ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-6 animate-in fade-in">
          {/* Top Bar: Back to discussions list */}
          <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-4">
            <button
              type="button"
              onClick={() => setActiveDiscussion(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#CBD7E2] bg-[#F8F6F2] hover:bg-[#EFECE6] text-xs font-semibold text-[#506272] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#6B8BA4]" />
              <span>{language === 'id' ? 'Kembali ke Semua Diskusi' : 'Back to Discussions'}</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E2EAF0] text-[#527189]">
              {getCategoryLabel(activeDiscussion.category)}
            </span>
          </div>

          {/* Main Question / Topic Details */}
          <div className="space-y-4">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#24303E] leading-snug">
              {activeDiscussion.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-[#7A8C9E]">
              <div className="flex items-center gap-1.5 font-medium text-[#415364]">
                <div className="w-6 h-6 rounded-full bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold text-[11px]">
                  {activeDiscussion.authorName.charAt(0).toUpperCase()}
                </div>
                <span>{activeDiscussion.authorName}</span>
                {activeDiscussion.authorRole && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F2F6F9] text-[#6B8BA4] font-semibold">
                    {activeDiscussion.authorRole}
                  </span>
                )}
              </div>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A0B0BF]" />
                {formatTimeAgo(activeDiscussion.createdAt)}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E8EFF5] text-sm text-[#384858] leading-relaxed whitespace-pre-line">
              {activeDiscussion.content}
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4 pt-4 border-t border-[#F0F4F8]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-[#24303E] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#6B8BA4]" />
                <span>
                  {language === 'id' 
                    ? `Semua Balasan (${activeDiscussion.replies.length})` 
                    : `All Replies (${activeDiscussion.replies.length})`}
                </span>
              </h3>
            </div>

            {/* List of Replies */}
            {activeDiscussion.replies.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DCE4EC] text-center space-y-1">
                <p className="text-xs font-semibold text-[#506272]">
                  {language === 'id' ? 'Belum ada balasan pada topik ini.' : 'No replies on this topic yet.'}
                </p>
                <p className="text-[11px] text-[#7A8C9E]">
                  {language === 'id' ? 'Jadilah orang pertama yang memberikan perspektif atau masukan ramah!' : 'Be the first to share your mindful perspective!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDiscussion.replies.map((reply) => (
                  <div key={reply.id} className="p-4.5 rounded-2xl bg-white border border-[#E5ECF2] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#EAF0EB] text-[#55785F] flex items-center justify-center font-bold text-[11px]">
                          {reply.authorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-[#24303E]">{reply.authorName}</span>
                        {reply.authorRole && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EDF3EF] text-[#3D6649] font-medium">
                            {reply.authorRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8CA0B0]">
                        {formatTimeAgo(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#485C6E] leading-relaxed whitespace-pre-line pl-8">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="mt-6 p-5 rounded-2xl bg-[#F8F6F2] border border-[#E2EAF0] space-y-3">
              <div className="flex items-center gap-2 font-heading font-bold text-xs text-[#24303E]">
                <CornerDownRight className="w-4 h-4 text-[#6B8BA4]" />
                <span>{language === 'id' ? 'Tuliskan Balasan atau Saranmu' : 'Post Your Reply'}</span>
              </div>

              {replyError && (
                <div className="p-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#9F1239] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{replyError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={replyAuthorName}
                  onChange={(e) => setReplyAuthorName(e.target.value)}
                  placeholder={language === 'id' ? 'Nama Tampilanmu (opsional)' : 'Your Display Name'}
                  className="p-2.5 rounded-xl border border-[#D0DCE6] bg-white text-xs font-medium focus:ring-2 focus:ring-[#6B8BA4]/30"
                />
              </div>

              <textarea
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={language === 'id' 
                  ? 'Ketik saran, tanggapan, atau pengalamanmu dengan bijak dan saling mendukung...' 
                  : 'Write your constructive advice or experience...'}
                className="w-full p-3 rounded-xl border border-[#D0DCE6] bg-white text-xs leading-relaxed focus:ring-2 focus:ring-[#6B8BA4]/30"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EAEFEA]/70">
                <span className="text-[11px] text-[#7A8C9E] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9EAEA2] shrink-0" />
                  {language === 'id' ? 'Komentar tersimpan & langsung terlihat oleh anggota lain.' : 'Replies appear immediately.'}
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="self-end sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6B8BA4] hover:bg-[#587893] text-white text-[11px] font-medium tracking-normal transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-50 active:scale-98"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmittingReply ? (language === 'id' ? 'Mengirim...' : 'Sending...') : (language === 'id' ? 'Kirim Balasan' : 'Submit Reply')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Forum List & Filter View */
        <div className="space-y-6">
          {/* Top Controls: Search Bar & Create Discussion Button */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2EAF0] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#24303E] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#6B8BA4]" />
                  <span>{language === 'id' ? 'Forum Komunitas & Diskusi Finansial' : 'Financial Community & Discussions'}</span>
                </h2>
                <p className="text-xs text-[#5C6F80]">
                  {language === 'id' 
                    ? 'Ruang saling dukung menahan impulsivitas belanja, berbagi trik budgeting, dan konsultasi keputusan pembelian.'
                    : 'A supportive safe space to share mindful money habits and purchase dilemmas.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingDiscussion(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-heading font-extrabold text-xs shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'id' ? 'Buat Diskusi Baru' : 'New Discussion'}</span>
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-[#8CA8BF] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari topik diskusi (misal: paylater, kosan, dana darurat, wishlist)...' : 'Search discussions...'}
                className="w-full pl-10 pr-20 py-2.5 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1 rounded-lg bg-[#E2EAF0] hover:bg-[#D5DFE7] text-[11px] font-semibold text-[#415364] transition-colors cursor-pointer"
              >
                {language === 'id' ? 'Cari' : 'Search'}
              </button>
            </form>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#7A8C9E] uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {language === 'id' ? 'Kategori:' : 'Topic:'}
              </span>
              {COMMUNITY_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6B8BA4] border-[#6B8BA4] text-white shadow-xs'
                        : 'bg-[#F8F6F2] border-[#DCE4EC] text-[#55697A] hover:bg-[#EFECE6]'
                    }`}
                  >
                    {language === 'id' ? cat.label : cat.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Discussion Creation Modal / Panel */}
          {isCreatingDiscussion && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#6B8BA4]/30 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#EEF3F7] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#24303E]">
                    {language === 'id' ? 'Mulai Diskusi Baru' : 'Start a New Discussion'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingDiscussion(false)}
                  className="text-xs text-[#7A8C9E] hover:text-[#24303E] cursor-pointer"
                >
                  ✕ {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#9F1239] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <form onSubmit={handleCreateDiscussion} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#24303E] mb-1">
                    {language === 'id' ? 'Judul Diskusi / Pertanyaan *' : 'Discussion Title *'}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={language === 'id' ? 'Contoh: Mau beli tablet cicilan 6 bulan untuk kuliah, bijak gak ya?' : 'e.g. Planning to buy a tablet on 6-month installment...'}
                    className="w-full p-2.5 rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] text-xs font-semibold focus:ring-2 focus:ring-[#6B8BA4]/30"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#24303E] mb-1">
                      {language === 'id' ? 'Kategori Topik *' : 'Category *'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] text-xs font-semibold focus:ring-2 focus:ring-[#6B8BA4]/30"
                    >
                      {COMMUNITY_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {language === 'id' ? cat.label : cat.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24303E] mb-1">
                      {language === 'id' ? 'Nama Tampilanmu (opsional)' : 'Display Name'}
                    </label>
                    <input
                      type="text"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      placeholder={language === 'id' ? 'Misal: Rika, Mahasiswa 21 th' : 'e.g. Anonymous Peer'}
                      className="w-full p-2.5 rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] text-xs focus:ring-2 focus:ring-[#6B8BA4]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24303E] mb-1">
                    {language === 'id' ? 'Isi Pertanyaan / Cerita Detail *' : 'Discussion Details *'}
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={language === 'id' ? 'Ceritakan situasi keuanganmu, keraguan belanja, atau pertanyaanmu secara gamblang...' : 'Explain your financial situation or question...'}
                    className="w-full p-3 rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] text-xs leading-relaxed focus:ring-2 focus:ring-[#6B8BA4]/30"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingDiscussion(false)}
                    className="px-4 py-2 rounded-xl border border-[#D5DFE7] text-xs font-semibold text-[#506272] hover:bg-[#F8F6F2] cursor-pointer"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDisc}
                    className="px-5 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingDisc ? (language === 'id' ? 'Mempublikasikan...' : 'Publishing...') : (language === 'id' ? 'Publikasikan Diskusi' : 'Publish Discussion')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Discussion List Cards */}
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#6B8BA4] animate-spin mx-auto" />
              <p className="text-xs text-[#7A8C9E] font-medium">
                {language === 'id' ? 'Memuat topik diskusi komunitas...' : 'Loading community topics...'}
              </p>
            </div>
          ) : discussions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2EAF0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#24303E]">
                {language === 'id' ? 'Belum Ada Diskusi yang Sesuai' : 'No Discussions Found'}
              </h3>
              <p className="text-xs text-[#7A8C9E] max-w-sm mx-auto">
                {language === 'id' 
                  ? 'Belum ada pertanyaan pada filter ini. Jadilah pelopor dengan memulai diskusi pertama!' 
                  : 'Be the first to start a conversation in this topic!'}
              </p>
              <button
                type="button"
                onClick={() => setIsCreatingDiscussion(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B8BA4] text-white text-xs font-semibold hover:bg-[#587893] cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Mulai Diskusi Pertama' : 'Start First Discussion'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((disc) => (
                <div 
                  key={disc.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2EAF0] hover:border-[#6B8BA4]/50 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF0EB] text-[#3D6649] w-fit">
                      {getCategoryLabel(disc.category)}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-[#7A8C9E]">
                      <span className="font-medium text-[#415364]">{disc.authorName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A0B0BF]" />
                        {formatTimeAgo(disc.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 
                      onClick={() => handleOpenDiscussion(disc.id)}
                      className="font-heading font-bold text-base text-[#24303E] hover:text-[#6B8BA4] transition-colors cursor-pointer"
                    >
                      {disc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#55697A] line-clamp-2 leading-relaxed">
                      {disc.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F2F6F9]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B8BA4]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{disc.replies.length} {language === 'id' ? 'Balasan' : 'Replies'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenDiscussion(disc.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E2EAF0] text-xs font-semibold text-[#3B4F60] transition-colors cursor-pointer"
                    >
                      <span>{language === 'id' ? 'Lihat Diskusi' : 'Open Discussion'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
