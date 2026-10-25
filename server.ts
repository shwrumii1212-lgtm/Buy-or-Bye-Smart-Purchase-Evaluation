import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with server-side environment key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Community Forum Store with Pre-seeded realistic discussions
interface Reply {
  id: string;
  authorName: string;
  authorRole?: string;
  avatarSeed?: string;
  content: string;
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string;
  category: string;
  authorName: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

let discussions: Discussion[] = [
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
        content: 'Halo Dina! Rumus 50/30/20 dari Elizabeth Warren memang aslinya dirancang untuk kondisi biaya hidup seimbang. Buat perantau kota besar, kamu bisa pakai formula adaptif 60/20/20 atau 65/20/15:\n- 60-65% Kebutuhan Pokok (kos, makan sehat hemat, transport kerja)\n- 20% Tabungan & Dana Darurat (langsung potong di hari gajian)\n- 15-20% Gaya Hidup & Self-Reward terukur.\n\nKuncinya: jangan korbankan tabungan demi nongkrong, tapi jangan menyiksa diri juga!',
        createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-1-2',
        authorName: 'Siti Rahma',
        authorRole: 'Community Member',
        content: 'Setuju banget sama Kak Rian. Dulu kos sendirian bikin boncos, tahun kedua aku ajak teman sekantor buat sewa kamar berdua (twin bed). Biaya kos langsung kepotong 40%! Kalau lingkungan kosmu memungkinkan, opsi sharing room sangat membantu menyelamatkan cashflow.',
        createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-1-3',
        authorName: 'Ardi Wijaya',
        authorRole: 'Member',
        content: 'Bisa juga coba meal prep masak nasi dan lauk simpel di kos untuk sarapan/malam. Pengeluaran makan di luar yang biasanya 1,5 juta bisa ditekan jadi 800 ribu sebulan.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
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
        content: 'Hai Amanda! Urutkan utang dari saldo nominal pokok paling KECIL sampai paling BESAR, tanpa lihat bunganya dulu. Bayar batas minimum untuk semua akun, tapi semua sisa uang bebas bulanan difokuskan babat habis akun terkecil pertama. Begitu 1 akun lunas, lega luar biasa dan ada suntikan moral buat lanjut babat akun berikutnya!',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-2-3',
        authorName: 'Rifki H.',
        authorRole: 'Member',
        content: 'Jangan lupa hapus semua data pembayaran instan & uninstall aplikasinya sementara waktu biar gak tergiur buka lagi ya Kak.',
        createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-3',
    title: 'Trik ampuh menahan "Checkout Tengah Malam" pas lagi doom scrolling diskon',
    category: 'belanja_impulsif',
    authorName: 'Nadia S.',
    authorRole: 'Community Member',
    content: 'Tiap jam 11 malam ke atas rasanya jari gatal pengen buka marketplace. Algoritma rekomendasi racun banget dan sering berakhir checkout barang gak penting. Ada tips konkrit selain hapus aplikasi? Soalnya aplikasi marketplace kadang masih dipakai belanja kebutuhan rumah tangga.',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-3-1',
        authorName: 'Fajar Nugraha',
        authorRole: 'Mindful Spender',
        content: 'Trik terbaik: hapus fitur One-Click Checkout dan unlink kartu kredit/debit instan dari aplikasi. Setiap mau bayar, paksa dirimu bayar via transfer manual atau virtual account yang butuh buka m-banking dan ketik password. Hambatan (friction) 2 menit ini 90% efektif bikin otak sadar dan membatalkan checkout!',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-3-2',
        authorName: 'Vania L.',
        authorRole: 'Community Member',
        content: 'Aku terapkan aturan: kalau lihat barang pengen, masukin wishlist lalu WAJIB diuji di Buy or Bye dan tunggu minimal 48 jam. Kalau setelah 2 hari masih kepikiran dan rasional, baru boleh dipikirkan lagi.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
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
        content: 'Hai Bima! Fondasi piramida finansial adalah Dana Darurat minimal 3 bulan biaya hidup pokok (untuk lajang) atau 6 bulan (jika sudah berkeluarga / freelancer). Dana darurat harus disimpan di instrumen likuid bebas fluktuasi pasar modal (seperti Reksa Dana Pasar Uang atau tabungan terpisah). Setelah dana darurat aman dan bebas utang konsumtif berbunga tinggi, baru kamu bisa mulai alokasikan uang dingin untuk investasi.',
        createdAt: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-4-2',
        authorName: 'Bima Satria',
        authorRole: 'Community Member',
        content: 'Makasih penjelasannya Kak! Jadi amannya kumpulin dana darurat dulu ya baru mikir portofolio saham.',
        createdAt: new Date(Date.now() - 95 * 3600 * 1000).toISOString(),
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
        content: 'Aku pakai sistem 3 Rekening:\n1. Rekening Gaji & Kebutuhan Rutin (Sewa kos, listrik, makan, wifi)\n2. Rekening Tabungan & Dana Darurat (Tidak ada kartu ATM, tidak diinstal di HP utama)\n3. Rekening Jajan / Operasional Harian (Ini yang diisi kuota mingguan buat kopi, nongkrong, nonton).\nKalau kuota di rekening 3 habis, ya puasa jajan sampai minggu depan!',
        createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-5-2',
        authorName: 'Dimas Kurnia',
        authorRole: 'Member',
        content: 'Setuju dengan sistem 3 kantong. Sekarang banyak bank digital yang punya fitur sub-wallet/kantong dalam satu akun jadi gak perlu bayar banyak biaya admin bulanan.',
        createdAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-6',
    title: 'Mau beli laptop gaming 12 juta tapi ragu: Kebutuhan atau sekadar Keinginan?',
    category: 'investasi_dasar',
    authorName: 'Eko Prasetyo',
    authorRole: 'Community Member',
    content: 'Pekerjaan saya freelance graphic design & video editor. Laptop lama sudah 5 tahun dan render video suka ngelag parah. Harga laptop incaran 12 juta. Tabungan ada 18 juta. Apakah ini pembelian yang bijak atau sebaiknya tahan dulu?',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-6-1',
        authorName: 'Hendra Saputra',
        authorRole: 'Mindful Creator',
        content: 'Kalau laptop tersebut adalah alat produksi primer yang langsung menghasilkan uang dan laptop lama sudah memakan waktu kerja (opportunity loss), ini masuk kategori Belanja Produktif / Kebutuhan Kerja, bukan sekadar gaya hidup. Tapi pastikan sisa 6 juta tabungan masih cukup untuk dana darurat minimal 1-2 bulan ya!',
        createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-6-2',
        authorName: 'Buy or Bye Mentor',
        authorRole: 'Financial Educator',
        content: 'Tips tambahan: coba hitung Payback Period-nya. Jika laptop baru bisa mempercepat editing 2x lipat dan kamu bisa ambil 2 klien tambahan per bulan, dalam waktu berapa bulan harga 12 juta itu balik modal? Jika di bawah 4 bulan, pembelian ini sangat rasional.',
        createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      }
    ]
  }
];

// 1. API: Get all discussions
app.get('/api/discussions', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...discussions];

  if (category && category !== 'all') {
    filtered = filtered.filter(d => d.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.content.toLowerCase().includes(q) ||
      d.authorName.toLowerCase().includes(q)
    );
  }

  // Sort by latest created or latest activity
  filtered.sort((a, b) => {
    const aTime = a.replies.length > 0 ? Math.max(new Date(a.createdAt).getTime(), new Date(a.replies[a.replies.length - 1].createdAt).getTime()) : new Date(a.createdAt).getTime();
    const bTime = b.replies.length > 0 ? Math.max(new Date(b.createdAt).getTime(), new Date(b.replies[b.replies.length - 1].createdAt).getTime()) : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  res.json({ discussions: filtered });
});

// 2. API: Get single discussion with replies
app.get('/api/discussions/:id', (req, res) => {
  const disc = discussions.find(d => d.id === req.params.id);
  if (!disc) {
    return res.status(404).json({ error: 'Diskusi tidak ditemukan' });
  }
  res.json({ discussion: disc });
});

// 3. API: Create discussion
app.post('/api/discussions', (req, res) => {
  const { title, category, content, authorName, authorRole } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Judul diskusi wajib diisi' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Isi pertanyaan / diskusi wajib diisi' });
  }

  const newDisc: Discussion = {
    id: `disc-${Date.now()}`,
    title: title.trim(),
    category: category || 'pengelolaan_uang',
    authorName: authorName?.trim() || 'Teman Belanja',
    authorRole: authorRole || 'Member',
    content: content.trim(),
    createdAt: new Date().toISOString(),
    replies: []
  };

  discussions.unshift(newDisc);
  res.status(201).json({ discussion: newDisc });
});

// 4. API: Add reply to discussion
app.post('/api/discussions/:id/replies', (req, res) => {
  const disc = discussions.find(d => d.id === req.params.id);
  if (!disc) {
    return res.status(404).json({ error: 'Diskusi tidak ditemukan' });
  }

  const { content, authorName, authorRole } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Balasan tidak boleh kosong' });
  }

  const newReply: Reply = {
    id: `rep-${Date.now()}`,
    authorName: authorName?.trim() || 'Teman Bijak',
    authorRole: authorRole || 'Member',
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  disc.replies.push(newReply);
  res.status(201).json({ reply: newReply, discussion: disc });
});

// 5. API: AI Financial Assistant (Gemini 3.8 Flash)
app.post('/api/ai/ask', async (req, res) => {
  const { messages, userFinance } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Pesan percakapan tidak boleh kosong' });
  }

  if (!ai) {
    return res.status(500).json({ 
      error: 'Layanan AI belum dikonfigurasi: API Key tidak tersedia di server.' 
    });
  }

  try {
    // Build system instructions with financial education responsibility boundaries
    let systemInstruction = `Kamu adalah "Teman Finansial" di platform Buy or Bye.
Misi kamu: Membantu generasi muda dan Gen Z memahami pengelolaan keuangan pribadi, mengendalikan nafsu belanja impulsif, menavigasi jebakan paylater, serta membangun kebiasaan budgeting dengan bahasa Indonesia yang hangat, ramah, santai, mudah dimengerti, tidak menghakimi, dan aplikatif.

BATASAN KESELAMATAN & FORMAT TAMPILAN:
1. Sampaikan edukasi finansial secara bertanggung jawab dan jujur. Jangan pernah menjanjikan return atau hasil keuntungan pasti.
2. Jawaban bersifat edukasi dan literasi umum, BUKAN nasihat finansial profesional bersertifikasi.
3. Jangan pernah meminta kata sandi, PIN, nomor kartu kredit/debit, atau data sensitif pengguna.
4. FORMAT RAPI:
   - Gunakan format percakapan bersih. 
   - JANGAN gunakan tanda pagar Markdown (seperti ### atau ##) untuk judul. Tulis judul bagian langsung sebagai teks tebal seperti **1. Aturan 50/30/20** atau **Tips Praktis:**.
   - JANGAN gunakan tanda bintang tiga berlebihan (seperti ***). Cukup gunakan tanda tebal standar **kata** atau miring *kata*.
   - Gunakan poin daftar bernomor (1., 2., 3.) atau bullet yang bersih.
   - Jika memberikan perhitungan, jelaskan asumsi yang digunakan secara transparan.
5. Tetap ringkas, padat makna, hangat, dan dorong pengguna untuk selalu berpikir rasional sebelum checkout.`;

    if (userFinance) {
      systemInstruction += `\n\nKonteks Profil Pengguna (Anonim):
- Pemasukan Bulanan: Rp ${Number(userFinance.monthlyIncome || 0).toLocaleString('id-ID')}
- Pos Kebutuhan Pokok: Rp ${Number(userFinance.essentialExpenses || 0).toLocaleString('id-ID')}
- Pos Gaya Hidup: Rp ${Number(userFinance.lifestyleExpenses || 0).toLocaleString('id-ID')}
- Pos Tabungan: Rp ${Number(userFinance.savings || 0).toLocaleString('id-ID')}
- Cicilan/Utang: Rp ${Number(userFinance.debtInstallments || 0).toLocaleString('id-ID')}
Gunakan konteks ini secara bijak jika pengguna menanyakan seputar kondisi keuangannya.`;
    }

    // Format conversation history for Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }]
    }));

    let replyText = '';
    // Use gemini-3.1-flash-lite as speedy & high-availability model for low-latency chat
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      replyText = response.text || '';
    } catch (err: any) {
      console.warn('Attempt with gemini-3.1-flash-lite encountered issue, trying gemini-3.8-flash:', err?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      replyText = fallbackResponse.text || '';
    }

    if (!replyText) {
      replyText = 'Maaf, saya tidak dapat merumuskan jawaban saat ini. Silakan coba tanyakan kembali.';
    }

    res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Error generating content from Gemini API:', err);
    res.status(500).json({ 
      error: 'Terjadi kendala saat menghubungkan ke asisten AI: ' + (err.message || 'Gagal memproses jawaban.') 
    });
  }
});

// In development, mount Vite middleware so Vite HMR/dev server runs via Express on port 3000
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.join(__dirname, 'dist');
  const hasDist = (await import('fs')).existsSync(distPath);

  if (isProduction && hasDist) {
    // Serve static files in production build
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Use Vite middleware in development or when dist has not yet been built
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Buy or Bye Fullstack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
