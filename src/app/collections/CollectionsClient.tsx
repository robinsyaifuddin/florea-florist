'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Loader2,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { QuickOrderModal } from '@/components/QuickOrderModal';
import { useAdmin } from '@/context/AdminContext';
import { Product, getCategoryLabel } from '@/data/products';

export default function CollectionsClient() {
  const { products, isLoading } = useAdmin();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Kategori filter options (termasuk Pilihan Favorit)
  const categoryOptions = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'artistic', label: 'Buket Bunga Artistik' },
    { id: 'celebration', label: 'Perayaan & Momen' },
    { id: 'personal', label: 'Personalisasi & Hadiah' },
    { id: 'favorites', label: 'Pilihan Favorit' },
  ];

  // Ringkasan metrik statistik
  const summaryMetrics = useMemo(() => {
    const totalCount = products.length;
    const favoriteCount = products.filter((p) => p.isPopular).length;
    const artisticCount = products.filter((p) => p.category === 'artistic').length;
    const celebrationCount = products.filter((p) => p.category === 'celebration').length;
    const personalCount = products.filter((p) => p.category === 'personal').length;

    return {
      totalCount,
      favoriteCount,
      artisticCount,
      celebrationCount,
      personalCount,
    };
  }, [products]);

  // Filtering dan sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const label = getCategoryLabel(item);
      
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'favorites'
          ? Boolean(item.isPopular)
          : item.category === selectedCategory;

      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        label.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      // featured: prioritaskan favorit dulu
      result = [...result].sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar onSearchChange={(q) => setSearchQuery(q)} />

      <main className="flex-grow">
        {/* Breadcrumb & Section Header */}
        <section className="bg-white border-b border-stone-200/80 pt-6 pb-8 sm:pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-900 font-medium">Semua Koleksi</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#E60067] mb-1.5">
                  Katalog Komprehensif
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                  Seluruh Mahakarya Koleksi Floréa
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                  Jelajahi setiap rangkaian buket bunga sutra velvet & preserved botanicals premium yang dirancang eksklusif untuk setiap perayaan abadi Anda.
                </p>
              </div>

              <Link
                href="/"
                className="self-start md:self-auto inline-flex items-center justify-center text-xs font-semibold text-[#E60067] hover:text-[#B80053] px-5 py-2.5 rounded-full bg-pink-50/70 border border-pink-200/60 hover:bg-pink-100/70 transition-all duration-150 active:scale-[0.98]"
              >
                Kembali ke Beranda
              </Link>
            </div>

            {/* RINGKASAN JUMLAH KOLEKSI (Metric Cards) - Bulatan Angka Berwarna & Label di Bawah */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-pink-100">
              {/* Total Koleksi */}
              <div className="bg-pink-50/30 border border-pink-200/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-[#E60067] font-serif text-xl sm:text-2xl font-bold shadow-xs">
                  {summaryMetrics.totalCount}
                </div>
                <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-stone-600 mt-2.5">
                  Total Koleksi
                </span>
              </div>

              {/* Pilihan Favorit */}
              <div className="bg-pink-50/30 border border-pink-200/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#E60067] text-white flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-xs">
                  {summaryMetrics.favoriteCount}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#E60067] mt-2.5">
                  Pilihan Favorit
                </span>
              </div>

              {/* Rangkaian Artistik */}
              <div className="bg-pink-50/30 border border-pink-200/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-[#E60067] font-serif text-xl sm:text-2xl font-bold shadow-xs">
                  {summaryMetrics.artisticCount}
                </div>
                <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-stone-600 mt-2.5">
                  Artistik
                </span>
              </div>

              {/* Momen & Hadiah */}
              <div className="bg-pink-50/30 border border-pink-200/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-[#E60067] font-serif text-xl sm:text-2xl font-bold shadow-xs">
                  {summaryMetrics.celebrationCount + summaryMetrics.personalCount}
                </div>
                <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-stone-600 mt-2.5">
                  Momen & Hadiah
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar & Grid Koleksi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Controls Bar: Compact Icon-Only Search & Dropdowns */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white border border-pink-200/60 p-3 sm:p-3.5 rounded-2xl shadow-xs">
            {/* Input Pencarian dengan Icon Pink */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#E60067] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari buket idaman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-pink-50/20 border border-pink-100 text-stone-800 text-xs py-2.5 pl-10 pr-8 rounded-xl focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067]/20 transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#E60067] p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Kategori & Urutkan (Icon + Select) */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto">
              {/* Dropdown Kategori (Termasuk Opsi Favorit) */}
              <div className="relative flex-1 sm:flex-initial">
                <div className="flex items-center gap-2 bg-pink-50/30 border border-pink-200/70 hover:border-[#E60067] rounded-xl px-3 py-2 transition-all">
                  <Filter className="w-3.5 h-3.5 text-[#E60067] shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Filter Kategori"
                    className="appearance-none bg-transparent text-stone-800 text-xs font-semibold pr-6 focus:outline-none cursor-pointer w-full"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="text-stone-800 bg-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#E60067] absolute right-3 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown Urutkan / Sorting */}
              <div className="relative flex-1 sm:flex-initial">
                <div className="flex items-center gap-2 bg-pink-50/30 border border-pink-200/70 hover:border-[#E60067] rounded-xl px-3 py-2 transition-all">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#E60067] shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Urutkan Koleksi"
                    className="appearance-none bg-transparent text-stone-800 text-xs font-semibold pr-6 focus:outline-none cursor-pointer w-full"
                  >
                    <option value="featured" className="text-stone-800 bg-white">Paling Populer</option>
                    <option value="price-asc" className="text-stone-800 bg-white">Harga: Terendah</option>
                    <option value="price-desc" className="text-stone-800 bg-white">Harga: Tertinggi</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#E60067] absolute right-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Menampilkan status bar hasil filter */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-5 px-1">
            <p>
              Menampilkan <span className="font-semibold text-stone-800">{filteredProducts.length}</span> dari {products.length} karya mahakarya
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="text-[#E60067] hover:underline font-semibold cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>

          {/* Catalog Cards Grid */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#E60067]" />
              <p className="text-xs text-stone-500">Menyiapkan seluruh galeri koleksi...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex">
                  <ProductCard
                    product={product}
                    onQuickView={(p) => setActiveModalProduct(p)}
                    onOrderDirect={(p) => setActiveModalProduct(p)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-stone-300 rounded-2xl p-8 bg-white">
              <p className="text-sm font-medium text-stone-800 mb-1">
                Koleksi yang Anda cari tidak ditemukan
              </p>
              <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau bersihkan filter untuk melihat portofolio lainnya.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#E60067] hover:bg-[#CC005A] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Tampilkan Semua Koleksi
              </button>
            </div>
          )}
        </div>

        {/* Modal Pemesanan WhatsApp */}
        <QuickOrderModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      </main>

      <Footer />
    </div>
  );
}
