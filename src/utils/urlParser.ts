import { ProductCategory } from '../types';

export interface ParsedUrlData {
  platform: string;
  detectedName?: string;
  detectedPrice?: number;
  detectedCategory?: ProductCategory;
  isValidUrl: boolean;
  cleanUrl: string;
}

// Known simulated catalog for common test links & e-commerce patterns
const KNOWN_PATTERNS: Array<{
  match: RegExp;
  name: string;
  price: number;
  category: ProductCategory;
}> = [
  {
    match: /sneaker|sepatu|canvas|shoes/i,
    name: 'Sneakers Casual Low Top Canvas Edition',
    price: 389000,
    category: 'fashion'
  },
  {
    match: /keyboard|mechanical|keychron/i,
    name: 'Mechanical Keyboard Wireless Hot-Swappable RGB',
    price: 749000,
    category: 'gadget'
  },
  {
    match: /headphone|headset|tws|earphone|anc/i,
    name: 'Wireless Noise Cancelling Headphone Pro',
    price: 1250000,
    category: 'gadget'
  },
  {
    match: /serum|sunscreen|moisturizer|skincare|niacinamide|retinol/i,
    name: 'Hydrating Glow Serum Niacinamide 10%',
    price: 135000,
    category: 'beauty'
  },
  {
    match: /jacket|jaket|hoodie|crewneck|outerwear/i,
    name: 'Vintage Oversized Fleece Hoodie Jacket',
    price: 320000,
    category: 'fashion'
  },
  {
    match: /tas|backpack|totebag|slingbag/i,
    name: 'Waterproof Minimalist Daily Backpack 20L',
    price: 275000,
    category: 'fashion'
  },
  {
    match: /pop\s*mart|figure|blind\s*box|lego|gundam/i,
    name: 'Collectible Vinyl Figure Limited Series',
    price: 380000,
    category: 'hobbies'
  },
  {
    match: /coffee|kopi|tumbler|mug/i,
    name: 'Insulated Stainless Steel Coffee Tumbler 500ml',
    price: 165000,
    category: 'home'
  },
  {
    match: /lampu|desk\s*lamp|monitor\s*light/i,
    name: 'Screenbar LED Desk Monitor Light Bar',
    price: 295000,
    category: 'home'
  }
];

export function parseEcommerceUrl(rawUrl: string): ParsedUrlData {
  const url = rawUrl.trim();
  if (!url) {
    return { platform: '', isValidUrl: false, cleanUrl: '' };
  }

  let formattedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = `https://${url}`;
  }

  let platform = 'E-Commerce Marketplace';
  const lower = formattedUrl.toLowerCase();

  if (lower.includes('shopee.co.id') || lower.includes('shopee.')) {
    platform = 'Shopee Indonesia';
  } else if (lower.includes('tokopedia.com')) {
    platform = 'Tokopedia';
  } else if (lower.includes('tiktok.com') || lower.includes('shop.tiktok.')) {
    platform = 'TikTok Shop';
  } else if (lower.includes('zalora.co.id') || lower.includes('zalora.')) {
    platform = 'Zalora Indonesia';
  } else if (lower.includes('blibli.com')) {
    platform = 'Blibli';
  } else if (lower.includes('lazada.co.id') || lower.includes('lazada.')) {
    platform = 'Lazada';
  } else if (lower.includes('amazon.')) {
    platform = 'Amazon';
  }

  let detectedName: string | undefined;
  let detectedCategory: ProductCategory = 'fashion';
  let detectedPrice: number | undefined;

  try {
    const urlObj = new URL(formattedUrl);
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    // Check query params for price
    if (searchParams.get('price')) {
      const p = Number(searchParams.get('price'));
      if (!isNaN(p) && p > 0) detectedPrice = p;
    }

    // Check matched known catalog
    const fullSearchText = `${pathname} ${urlObj.search}`.replace(/[_\-+/?=&.]/g, ' ');
    for (const pattern of KNOWN_PATTERNS) {
      if (pattern.match.test(fullSearchText)) {
        detectedName = pattern.name;
        if (!detectedPrice) detectedPrice = pattern.price;
        detectedCategory = pattern.category;
        break;
      }
    }

    // If not matched directly by known catalog, parse the URL slug
    if (!detectedName) {
      const segments = pathname.split('/').filter(Boolean);
      // Remove generic marketplace prefixes like 'p', 'product', 'i'
      const candidateSegments = segments.filter(s => !['p', 'product', 'item', 'i', 'view', 'catalog'].includes(s.toLowerCase()));
      const lastSlug = candidateSegments[candidateSegments.length - 1] || segments[0];

      if (lastSlug) {
        const cleaned = decodeURIComponent(lastSlug)
          .replace(/\.(html|php|aspx|htm)/gi, '')
          .replace(/[0-9]{7,}/g, '') // remove trailing item IDs
          .replace(/[-_+]/g, ' ')
          .replace(/\b(i|id|sku|sp|ref)\b/gi, '')
          .trim();

        if (cleaned.length > 2) {
          detectedName = cleaned
            .split(' ')
            .filter(w => w.length > 0)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .slice(0, 8)
            .join(' ');
        }
      }
    }

    // Infer category and fallback realistic price if still not set
    const categoryText = `${pathname} ${detectedName || ''}`.toLowerCase();
    if (categoryText.match(/gadget|hp|phone|keyboard|laptop|mouse|tws|headphone|audio|charger/)) {
      detectedCategory = 'gadget';
      if (!detectedPrice) detectedPrice = 650000;
    } else if (categoryText.match(/skincare|serum|sunscreen|lip|cream|parfum|perfume|beauty/)) {
      detectedCategory = 'beauty';
      if (!detectedPrice) detectedPrice = 145000;
    } else if (categoryText.match(/game|nintendo|playstation|lego|figure|diecast|hobby/)) {
      detectedCategory = 'hobbies';
      if (!detectedPrice) detectedPrice = 320000;
    } else if (categoryText.match(/makan|kopi|coffee|snack|tea|food|kuliner/)) {
      detectedCategory = 'fnb';
      if (!detectedPrice) detectedPrice = 65000;
    } else if (categoryText.match(/meja|kursi|bantal|cangkir|dekor|home|dapur/)) {
      detectedCategory = 'home';
      if (!detectedPrice) detectedPrice = 220000;
    } else {
      detectedCategory = 'fashion';
      if (!detectedPrice) detectedPrice = 299000;
    }

  } catch {
    // If not standard URL format
  }

  return {
    platform,
    detectedName: detectedName || 'Produk E-Commerce Pilihan',
    detectedPrice: detectedPrice || 250000,
    detectedCategory,
    isValidUrl: formattedUrl.length > 7 && formattedUrl.includes('.'),
    cleanUrl: formattedUrl
  };
}
