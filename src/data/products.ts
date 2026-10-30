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

import { SUPABASE_SYNCED_PRODUCTS } from './supabaseProducts';

export const PRODUCTS: Product[] = SUPABASE_SYNCED_PRODUCTS;

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
