export interface EducationalArticle {
  id: string;
  title: string;
  titleEn: string;
  category: 'mindset' | 'paylater' | 'budgeting' | 'emergency';
  readTime: string;
  date: string;
  author: string;
  summary: string;
  summaryEn: string;
  content: string[];
  contentEn: string[];
  keyTakeaways: string[];
  keyTakeawaysEn: string[];
  sourceUrl?: string;
  trendingBadge?: boolean;
}

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'art_1',
    title: 'Psikologi Flash Sale: Mengapa Otak Sulit Menolak Timer Hitung Mundur',
    titleEn: 'The Psychology of Flash Sales: Why Countdown Timers Bypass Your Logic',
    category: 'mindset',
    readTime: '4 menit baca',
    date: 'Maret 2026',
    author: 'Tim Riset Keuangan Buy or Bye',
    trendingBadge: true,
    summary: 'Platform e-commerce secara sengaja mendesain visual urgency untuk mengaktifkan hormon adrenalin dan mematikan fungsi prefrontal cortex otak yang bertugas berpikir logis.',
    summaryEn: 'E-commerce platforms purposefully engineer visual urgency to trigger adrenaline and mute your prefrontal cortex.',
    content: [
      'Pernahkah kamu melihat banner merah bertuliskan "Sisa 2 jam lagi! 89% stok telah terjual" lalu mendadak merasa harus checkout barang yang 10 menit sebelumnya bahkan tidak kamu butuhkan? Fenomena ini dikenal sebagai Artificial Scarcity Bias (Bias Kelangkaan Buatan).',
      'Ketika melihat timer hitung mundur berkedip, amigdala di otak kita meresponsnya sebagai ancaman kehilangan peluang (Loss Aversion). Rasa sakit akibat kehilangan kesempatan diskon diukur oleh otak 2 kali lebih kuat daripada kesenangan mendapatkan barang tersebut.',
      'Strategi Terbaik: Terapkan Aturan 24 Jam Buy or Bye. Begitu kamu menutup tab e-commerce dan menunggu esok hari, lonjakan hormon dopamin akan mereda kembali ke garis dasar (baseline). Lebih dari 78% barang yang sempat membuat penasaran terbukti tidak lagi diinginkan keesokan paginya.'
    ],
    contentEn: [
      'Have you ever seen a bright banner saying "Only 2 hours left! 89% claimed" and suddenly felt compelled to buy an item you did not even know existed 10 minutes prior? This is known as the Artificial Scarcity Bias.',
      'Countdown timers trigger the amygdala, generating an instinctual Fear of Missing Out (FOMO). Neurologically, the perceived pain of losing a discount is twice as intense as the joy of owning the item.',
      'The Best Defense: Implement the 24-Hour Cooling Off Rule. Closing the app allows your dopamine rush to subside to baseline levels. Over 78% of impulse desires evaporate after a good night’s sleep.'
    ],
    keyTakeaways: [
      'Diskon bukan penghematan jika barang tersebut tidak benar-benar kamu butuhkan.',
      'Timer promo dirancang untuk memicu kepanikan, bukan memberi keuntungan murni.',
      'Tutup aplikasi minimal 24 jam sebelum memutuskan checkout produk diskon.'
    ],
    keyTakeawaysEn: [
      'A discount is never a saving if the purchase was unnecessary.',
      'Promo timers are designed to provoke anxiety rather than grant real value.',
      'Exit the app for at least 24 hours before deciding to checkout.'
    ],
    sourceUrl: 'https://www.psychologytoday.com/us/basics/consumer-behavior'
  },
  {
    id: 'art_2',
    title: 'Biaya Tersembunyi Paylater: Mengapa Cicilan Murah Terasa Begitu Berat',
    titleEn: 'The Hidden Toll of Paylater: Why Small Monthly Installments Suffocate You',
    category: 'paylater',
    readTime: '5 menit baca',
    date: 'Februari 2026',
    author: 'Analisis Arus Kas Mandiri',
    trendingBadge: true,
    summary: 'Membongkar ilusi cicilan Rp 150.000 per bulan yang tanpa disadari menumpuk menjadi beban utang 40% dari gaji bulanan.',
    summaryEn: 'Unmasking the illusion of seemingly harmless small installments that quietly swallow 40% of your take-home pay.',
    content: [
      'Fitur Buy Now Pay Later (BNPL) memecah rasa sakit membayar (pain of paying). Ketika membayar tunai Rp 1.200.000, otak kita merasakan kehilangan uang secara nyata saat itu juga. Namun dengan paylater "hanya Rp 230.000 x 6 bulan", otak tertipu menganggapnya sebagai pengeluaran kecil.',
      'Faktanya: bunga bulanan 2.95% terlihat kecil, namun jika diakumulasikan secara tahunan setara lebih dari 35.4% per tahun! Ditambah biaya administrasi transaksi dan biaya penanganan yang jarang disadari.',
      'Bahaya terbesarnya adalah akumulasi komitmen. Memiliki 4 cicilan kecil masing-masing Rp 200rb, Rp 350rb, Rp 150rb, dan Rp 300rb berarti Rp 1.000.000 dari gajimu sudah lenyap bahkan sebelum kamu menerima gaji bulan depan.'
    ],
    contentEn: [
      'Buy Now Pay Later isolates the natural "pain of paying". When spending $100 cash, your brain directly registers the loss. When broken down into $20 over 6 months, your brain falsely minimizes the obligation.',
      'In reality, monthly rates of 2.95% compound to over 35% annualized, compounded by recurring processing and service fees.',
      'The silent killer is debt stacking. Multiple small commitments easily compound to paralyze your monthly cashflow before your paycheck even clears.'
    ],
    keyTakeaways: [
      'Gunakan aturan emas: jika kamu tidak mampu membeli 2 kali harga tunainya, kamu belum mampu membelinya.',
      'Paylater hanya boleh digunakan untuk kondisi darurat mendesak, bukan barang konsumtif atau hobi.',
      'Jaga rasio total cicilan bulanan (DSR) di bawah 30% dari pemasukan.'
    ],
    keyTakeawaysEn: [
      'Golden rule: if you cannot buy it twice in cash, you cannot comfortably afford it.',
      'Reserve short-term credit solely for true emergencies, never for disposable leisure.',
      'Cap monthly Debt Service Ratio (DSR) strictly under 30% of your income.'
    ],
    sourceUrl: 'https://ojk.go.id/id/kanal/edukasi-dan-perlindungan-konsumen'
  },
  {
    id: 'art_3',
    title: 'Metode Sinking Fund: Menikmati Belanja Tanpa Utang dan Tanpa Penyesalan',
    titleEn: 'The Sinking Fund Method: Guilt-Free Shopping Without Debt',
    category: 'budgeting',
    readTime: '3 menit baca',
    date: 'Maret 2026',
    author: 'Panduan Praktis Gen Z',
    trendingBadge: false,
    summary: 'Bagaimana cara membeli sneakers idaman, tiket konser, atau upgrade gadget secara elegan tanpa mengganggu uang tabungan darurat.',
    summaryEn: 'How to purchase dream sneakers, concert tickets, or tech upgrades gracefully without tapping emergency reserves.',
    content: [
      'Banyak orang mengira hidup hemat berarti tidak boleh membeli barang kesukaan sama sekali. Pola pikir serba membatasi ini justru sering berujung pada ledakan belanja balas dendam (Revenge Spending).',
      'Solusinya adalah Sinking Fund: rekening atau kantong tabungan khusus yang disisihkan secara terencana setiap bulan untuk satu tujuan belanja tertentu di masa depan.',
      'Contoh: Ingin membeli headphone seharga Rp 1.500.000 dalam 3 bulan ke depan? Cukup sisihkan Rp 500.000 per bulan ke pos Sinking Fund. Saat uangnya terkumpul, kamu bisa membelinya secara tunai lunas dengan kepuasan 100% tanpa rasa bersalah!'
    ],
    contentEn: [
      'Many people believe frugality means deprivation. Inflexible austerity almost always backfires into destructive revenge spending.',
      'The solution is a Sinking Fund: dedicated sub-accounts funded monthly for an intentional, predetermined purchase in the future.',
      'Example: Want a $150 headphone in 3 months? Save $50 every month. Once funded, purchase it outright in cash with zero guilt and zero interest.'
    ],
    keyTakeaways: [
      'Sinking fund memisahkan uang belanja impian dari uang darurat.',
      'Menabung dulu membuatmu menghargai barang tersebut jauh lebih tinggi saat berhasil memilikinya.',
      'Gunakan fitur kantong/pocket bank digital untuk mengisolasi pos dana belanja.'
    ],
    keyTakeawaysEn: [
      'Sinking funds isolate planned leisure spending from mandatory emergency reserves.',
      'Delayed gratification substantially increases satisfaction upon ownership.',
      'Leverage digital bank vaults/pockets to compartmentalize goals.'
    ],
    sourceUrl: 'https://www.investopedia.com/terms/s/sinkingfund.asp'
  },
  {
    id: 'art_4',
    title: 'Fondasi Dana Darurat: Mengapa 3 Bulan Gaji Lebih Berharga dari Outfit Mewah',
    titleEn: 'The Emergency Reserve Fortress: Why 3 Months Runway Beats Luxury Goods',
    category: 'emergency',
    readTime: '4 menit baca',
    date: 'Januari 2026',
    author: 'Literasi Keuangan Berkelanjutan',
    trendingBadge: false,
    summary: 'Kebebasan finansial sejati bukan tentang apa yang kamu kenakan, melainkan ketenangan tidur mengetahui bahwa kamu aman jika mendadak kehilangan mata pencaharian.',
    summaryEn: 'Genuine financial freedom is not about what you wear, but sleeping peacefully knowing you can survive unexpected life shocks.',
    content: [
      'Dana darurat adalah airbag finansialmu. Tanpa dana darurat, setiap pengeluaran tak terduga—mulai dari motor mogok, sakit mendadak, hingga pemutusan hubungan kerja—akan langsung memaksamu berutang atau mencairkan aset dengan rugi.',
      'Urutan prioritas finansial yang sehat selalu: Kebutuhan Dasar → Dana Darurat (3-6 Bulan) → Tabungan Investasi → Baru Gaya Hidup & Wishlist.',
      'Menempatkan dana darurat: Simpan di instrumen likuiditas tinggi seperti RDPU (Reksa Dana Pasar Uang) atau tabungan bank digital berbunga kompetitif yang bisa dicairkan dalam hitungan detik saat darurat.'
    ],
    contentEn: [
      'An emergency fund is your financial airbag. Without one, any sudden bump—vehicle breakdown, medical issue, sudden layoff—immediately forces you into predatory debt.',
      'The healthy financial hierarchy is strictly: Basic Needs → Emergency Runway (3-6 Months) → Long-Term Investments → Lifestyle & Luxury.',
      'Where to park it: Keep funds liquid in high-yield savings or money market funds that can be accessed 24/7 without lock-in penalties.'
    ],
    keyTakeaways: [
      'Lajang / First Jobber: minimal 3 bulan pengeluaran pokok.',
      'Berkeluarga / Freelancer: minimal 6-12 bulan pengeluaran pokok.',
      'Jangan pernah gunakan dana darurat untuk promo belanja atau flash sale!'
    ],
    keyTakeawaysEn: [
      'Single / First jobber: at least 3 months essential runway.',
      'Freelancers / dependents: at least 6-12 months essential runway.',
      'Never touch emergency funds for shopping sales or lifestyle purchases!'
    ],
    sourceUrl: 'https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters'
  }
];
