export interface Product {
  id: string;
  name: string;
  category: 'artistic' | 'celebration' | 'personal';
  categoryLabel?: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  isPopular?: boolean;
  material: string;
  durability: string;
  description: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  sizes?: { id: string; name: string; price: number }[];
  colors?: { name: string; value: string }[];
  details?: {
    flowerType?: string;
    bouquetSize?: string;
    arrangementStyle?: string;
    packaging?: string;
    occasion?: string;
  };
}

export const CATEGORY_LABELS: Record<Product['category'], string> = {
  artistic: 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)',
  celebration: 'Gubahan Selebrasi Megah (Koleksi Perayaan & Momen Akbar)',
  personal: 'Tanda Kasih & Kenangan (Koleksi Personalisasi & Hadiah Spesial)',
};

export const CATEGORY_SHORT_LABELS: Record<Product['category'], string> = {
  artistic: 'Buket Bunga Artistik',
  celebration: 'Perayaan & Momen',
  personal: 'Personalisasi & Hadiah',
};

export function getCategoryLabel(product: { category: Product['category']; categoryLabel?: string }): string {
  return product.categoryLabel || CATEGORY_LABELS[product.category] || 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)';
}

export function getCategoryShortLabel(product: { category: Product['category'] }): string {
  return CATEGORY_SHORT_LABELS[product.category] || 'Koleksi Bunga';
}

export const PRODUCTS: Product[] = [
  {
    id: 'blush-silk-peony',
    name: 'Blush Velvet Silk Peony & Rose',
    category: 'artistic',
    categoryLabel: 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)',
    price: 245000,
    originalPrice: 285000,
    isPopular: true,
    material: 'Premium Silk & Velvet Touch',
    durability: 'Keanggunan Abadi • Tanpa Perlu Disiram',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Bukan sekadar buket, melainkan ungkapan rasa yang dirangkai sempurna. Sentuhan kelopak velvet peoni dan mawar blush sutra premium yang memancarkan pesona hangat, anggun, dan abadi sebagai pengingat momen berharga Anda.',
  },
  {
    id: 'timeless-white-hydrangea',
    name: 'Timeless White Botanical Ensemble',
    category: 'artistic',
    categoryLabel: 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)',
    price: 220000,
    material: 'Textured Fabric & Real Touch Stem',
    durability: 'Presisi Alami • Tahan Sepanjang Masa',
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Kemurnian hydrangea putih dalam harmoni Korean wrapping minimalis. Dihadirkan bagi Anda yang menghargai ketenangan estetika, ketulusan rasa, dan kemewahan yang berbicara dalam keheningan.',
  },
  {
    id: 'everlasting-rose-casket',
    name: 'Everlasting Preserved Rose Box',
    category: 'personal',
    categoryLabel: 'Tanda Kasih & Kenangan (Koleksi Personalisasi & Hadiah Spesial)',
    price: 360000,
    isPopular: true,
    material: 'Preserved & Velvet Accent',
    durability: 'Kemewahan Abadi • Tahan 3-5 Tahun',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Simbol penghormatan dan kasih sayang berkelas tinggi. Mawar pilihan dalam silinder luxury box beraksen pita satin emas, siap menjadi centerpiece meja yang memikat setiap pasang mata.',
  },
  {
    id: 'graduation-sunflower-joy',
    name: 'Graduation Golden Artificial Sunflower',
    category: 'celebration',
    categoryLabel: 'Gubahan Selebrasi Megah (Koleksi Perayaan & Momen Akbar)',
    price: 195000,
    material: 'High-Grade Artificial Silk',
    durability: 'Tetap Tegak & Segar Sepanjang Hari',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Menyemai rasa bangga atas pencapaian besar sang juara. Bunga matahari keemasan yang dirangkai presisi, tetap tegak anggun saat sesi foto wisuda seharian penuh tanpa khawatir layu atau patah.',
  },
  {
    id: 'korean-tulip-pastel',
    name: 'Korean Pastel Silk Tulip Melody',
    category: 'artistic',
    categoryLabel: 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)',
    price: 210000,
    originalPrice: 240000,
    isPopular: true,
    material: 'Real-Touch Polyurethane & Silk Leaf',
    durability: 'Fleksibel, Lembut & Tanpa Usang',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Romansa lembut bernuansa Seoul dengan sentuhan real-touch yang lentur dan sejuk saat disentuh. Pilihan personal terbaik untuk menghangatkan hati seseorang yang paling istimewa bagi Anda.',
  },
  {
    id: 'lavender-eucalyptus-box',
    name: 'French Lavender & Silk Bloom Box',
    category: 'personal',
    categoryLabel: 'Tanda Kasih & Kenangan (Koleksi Personalisasi & Hadiah Spesial)',
    price: 315000,
    material: 'Dried Lavender & Premium Silk Rose',
    durability: 'Aroma Lembut Menenangkan • Abadi',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Hadirkan nuansa damai pedesaan Provence ke sudut ruang Anda. Paduan mawar sutra dengan lavender alami yang memikat mata dan meneduhkan suasana setiap kali dipandang.',
  },
  {
    id: 'vintage-autumn-rose',
    name: 'Autumn Terracotta Garden Bouquet',
    category: 'artistic',
    categoryLabel: 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)',
    price: 265000,
    material: 'Silk Flower & Preserved Foliage',
    durability: 'Karakter Hangat & Warna Abadi',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Kombinasi warna terakota dan daun eucalyptus rustic yang penuh karisma. Mewakili kedewasaan emosional, kehangatan hubungan, serta ketulusan yang terpatri abadi.',
  },
  {
    id: 'deluxe-graduation-bear-rose',
    name: 'Deluxe Graduation Teddy & Silk Rose',
    category: 'celebration',
    categoryLabel: 'Gubahan Selebrasi Megah (Koleksi Perayaan & Momen Akbar)',
    price: 250000,
    originalPrice: 290000,
    isPopular: true,
    material: 'Plush Doll & Premium Silk Rose',
    durability: 'Kenangan Kelulusan Seumur Hidup',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
    ],
    description: 'Hadiah penghargaan tertinggi untuk perjuangan yang telah selesai. Dilengkapi boneka toga eksklusif berbahan beludru halus dan mawar sutra abadi dengan selempang nama personal.',
  }
];

export const CATEGORIES = [
  {
    id: 'artistic',
    title: 'Pesona Puspa Abadi',
    subtitle: 'Koleksi Buket Bunga Artistik',
    description: 'Sentuhan kain sutra dan velvet bertekstur alami dalam estetika rangkaian artistik yang abadi.',
    image: '/category/Pesona Puspa Abadi (Koleksi Buket Bunga Artistik).jfif',
    tag: 'Pilihan Utama',
  },
  {
    id: 'celebration',
    title: 'Gubahan Selebrasi Megah',
    subtitle: 'Koleksi Perayaan & Momen Akbar',
    description: 'Buket anggun dan kokoh yang dirancang untuk mengabadikan pencapaian wisuda serta selebrasi bersejarah.',
    image: '/category/Gubahan Selebrasi Megah (Koleksi Perayaan & Momen Akbar).jfif',
    tag: 'Momen Akbar',
  },
  {
    id: 'personal',
    title: 'Tanda Kasih & Kenangan',
    subtitle: 'Koleksi Personalisasi & Hadiah Spesial',
    description: 'Rangkaian eksklusif bloom box dan bunga preserved abadi sebagai lambang ketulusan hadiah personal penuh arti.',
    image: '/category/Tanda Kasih & Kenangan (Koleksi Personalisasi & Hadiah Spesial).jfif',
    tag: 'Hadiah Spesial',
  },
];
