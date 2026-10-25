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
    authorRole: 'Member',
    content: 'Halo teman-teman Buy or Bye! Penghasilan saya sekitar Rp 4,5 juta/bulan. Sekarang kosan + listrik habis Rp 1,6 juta sendiri (lebih dari 35%). Mau terapkan 50/30/20 susah banget di pos kebutuhan pokok (50%). Adakah yang punya formula alternatif budgeting yang lebih realistis untuk perantau kota besar?',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-1-1',
        authorName: 'Rian Pratama',
        authorRole: 'Budgeting Enthusiast',
        content: 'Halo Dina! Rumus 50/30/20 dari Elizabeth Warren memang ideal untuk negara maju dengan biaya hidup proporsional. Buat perantau Indonesia, kamu bisa coba formula 65/20/15 atau 60/25/15: 60-65% kebutuhan pokok (termasuk kos & makan), 15-20% tabungan & dana darurat (wajib diawalkan saat gajian), dan 15-20% gaya hidup / self-reward terkontrol. Yang terpenting bukan persentase kaku, tapi konsistensi menabungnya!',
        createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-1-2',
        authorName: 'Siti Rahma',
        authorRole: 'Member',
        content: 'Setuju sama Kak Rian. Waktu awal kerja aku juga kos sendirian mahal. Akhirnya tahun kedua cari room-mate untuk sewa kamar berdua, biaya kos langsung kepotong 40%! Kalau memungkinkan itu sangat membantu tabungan pos primer.',
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
        authorRole: 'Member',
        content: 'Keren banget Kak Kevin! Boleh sharing urutan langkah Snowball Debt-nya? Aku lagi ada 2 tagihan paylater kecil dan 1 pinjaman gadget yang lumayan gede.',
        createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rep-2-2',
        authorName: 'Kevin Wardhana',
        authorRole: 'Financial Survivor',
        content: 'Hai Amanda! Kuncinya: urutkan dari nominal pokok terkecil tanpa peduli suku bunga. Bayar minimum untuk semuanya, tapi alokasikan semua sisa uang ekstra untuk tagihan terkecil sampai LUNAS. Kemenangan psikologis saat satu akun lunas bikin kita punya motivasi ekstra buat babat tagihan berikutnya!',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-3',
    title: 'Trik ampuh menahan "Checkout Tengah Malam" pas lagi doom scrolling',
    category: 'belanja_impulsif',
    authorName: 'Nadia S.',
    authorRole: 'Member',
    content: 'Tiap jam 11 malam ke atas rasanya jari gatal pengen buka marketplace. Algoritma rekomendasi racun banget. Ada tips konkrit selain hapus aplikasi? Soalnya aplikasi marketplace kadang masih dipakai beli deterjen dan sabun bulanan.',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-3-1',
        authorName: 'Fajar Nugraha',
        authorRole: 'Mindful Spender',
        content: 'Trik terbaik: hapus fitur One-Click Checkout dan unlink kartu kredit/debit instan dari aplikasi. Setiap mau bayar, paksa dirimu bayar via transfer manual atau virtual account yang butuh buka m-banking dan ketik password. Hambatan (friction) 2 menit ini 90% efektif bikin otak sadar dan batal beli barang gak penting!',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'disc-4',
    title: 'Berapa idealnya dana darurat sebelum mulai beli instrumen investasi?',
    category: 'menabung',
    authorName: 'Bima Satria',
    authorRole: 'Member',
    content: 'Banyak teman seumuran langsung beli saham/kripto padahal rekening tabungan mepet. Sebenarnya kapan saat yang tepat dan aman buat mulai investasi bagi pemula yang baru punya gaji pertama?',
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-4-1',
        authorName: 'Buy or Bye Mentor',
        authorRole: 'Educator',
        content: 'Hai Bima! Fondasi piramida finansial adalah Dana Darurat minimal 3 bulan pengeluaran pokok (untuk lajang) atau 6 bulan (jika sudah berkeluarga/freelancer). Dana darurat harus di instrumen likuid bebas risiko pasar (deposito, tabungan terpisah, atau RDPU). Setelah dana darurat terkunci dan tidak ada utang konsumtif berbunga tinggi, baru kamu bisa mulai alokasikan uang dingin untuk investasi.',
        createdAt: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
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
