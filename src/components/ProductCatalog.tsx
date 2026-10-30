'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { Product, getCategoryLabel } from '@/data/products';
import { useAdmin } from '@/context/AdminContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { QuickOrderModal } from '@/components/QuickOrderModal';

interface ProductCatalogProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm?: string;
}

export function ProductCatalog({
  selectedCategory,
  onCategoryChange,
  searchTerm = '',
}: ProductCatalogProps) {
  const { products, isLoading } = useAdmin();
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const filterTabs = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'artistic', label: 'Buket Bunga Artistik' },
    { id: 'celebration', label: 'Perayaan & Momen' },
    { id: 'personal', label: 'Personalisasi & Hadiah' },
  ];

  // Khusus section beranda ini: HANYA menampilkan produk favorit (isPopular === true)
  const favoriteProducts = useMemo(() => {
    return products.filter((item) => {
      const isFav = Boolean(item.isPopular);
      if (!isFav) return false;

      const label = getCategoryLabel(item);
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        label.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <section id="catalog" className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Katalog */}
      <div className="reveal-on-scroll flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-10 pb-5 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#E60067] block mb-1">
            Pilihan Favorit Pelanggan
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Koleksi Rangkaian Mahakarya Favorit
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Rangkaian buket paling digemari dengan detail presisi tinggi, siap dikirim langsung atau disesuaikan dengan palet warna impian Anda.
          </p>
        </div>

        {/* Filter Kategori: Dropdown di Mobile, Tabs Pill di Desktop/Tablet */}
        <div className="w-full sm:w-auto">
          {/* Dropdown Mobile */}
          <div className="relative sm:hidden w-full">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Pilih Kategori Buket"
              className="w-full appearance-none bg-white border border-stone-200 text-stone-800 text-xs font-semibold py-2.5 pl-3.5 pr-10 rounded-xl shadow-2xs focus:outline-none focus:border-[#E60067] transition-colors"
            >
              {filterTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Tab Filter Taktil Desktop/Tablet */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#E60067] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200/90 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State Skeleton Modern (Cepat & Responsif) */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : favoriteProducts.length > 0 ? (
        <>
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="w-[calc((100vw-32px-12px)/2)] min-w-[150px] max-w-[210px] sm:w-auto sm:min-w-0 sm:max-w-none shrink-0 snap-start flex"
              >
                <ProductCard
                  product={product}
                  onQuickView={(p) => setActiveModalProduct(p)}
                  onOrderDirect={(p) => setActiveModalProduct(p)}
                />
              </div>
            ))}
          </div>

          {/* Tombol Lihat Semua Koleksi */}
          <div className="mt-10 sm:mt-14 flex flex-col items-center justify-center text-center">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              Lihat Semua Koleksi
            </Link>
            <p className="mt-2.5 text-[11px] sm:text-xs text-stone-500">
              Jelajahi seluruh variasi mahakarya floral Floréa yang tersedia
            </p>
          </div>
        </>
      ) : (
        <div className="py-16 text-center border border-dashed border-stone-300 rounded-2xl p-6">
          <p className="text-stone-500 text-xs mb-3">
            Belum ada buket favorit yang sesuai dengan pilihan ini.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onCategoryChange('all')}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Reset Kategori
            </button>
            <Link
              href="/collections"
              prefetch={true}
              className="px-5 py-2.5 bg-[#E60067] text-white rounded-full text-xs font-semibold hover:bg-[#CC005A] transition-colors"
            >
              Buka Semua Koleksi
            </Link>
          </div>
        </div>
      )}

      {/* Modal Pemesanan WhatsApp */}
      <QuickOrderModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
}
