'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Loader2,
  PackageCheck,
  Flame,
  Layers,
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Kategori tabs
  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'artistic', label: 'Buket Bunga Artistik' },
    { id: 'celebration', label: 'Perayaan & Momen' },
    { id: 'personal', label: 'Personalisasi & Hadiah' },
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
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        label.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFav = !onlyFavorites || Boolean(item.isPopular);

      return matchesCategory && matchesSearch && matchesFav;
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
  }, [products, selectedCategory, searchQuery, onlyFavorites, sortBy]);

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
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#E60067] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Katalog Komprehensif
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-medium text-stone-900 tracking-tight">
                  Seluruh Mahakarya Koleksi Floréa
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-2xl leading-relaxed">
                  Jelajahi setiap rangkaian buket bunga sutra velvet & preserved botanicals premium yang dirancang eksklusif untuk setiap perayaan abadi Anda.
                </p>
              </div>

              <Link
                href="/"
                className="self-start md:self-auto inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 transition-all duration-150 active:scale-[0.98]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Beranda
              </Link>
            </div>

            {/* RINGKASAN JUMLAH KOLEKSI (Metric Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-stone-100">
              {/* Total Koleksi */}
              <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider">
                    Total Koleksi
                  </span>
                  <PackageCheck className="w-4 h-4 text-stone-500" />
                </div>
                <div className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">
                  {summaryMetrics.totalCount}
                  <span className="text-xs font-normal text-stone-500 ml-1.5">Karya</span>
                </div>
              </div>

              {/* Pilihan Favorit */}
              <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-[#E60067] mb-1">
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider">
                    Pilihan Favorit
                  </span>
                  <Flame className="w-4 h-4 text-[#E60067]" />
                </div>
                <div className="text-xl sm:text-2xl font-serif font-semibold text-[#E60067]">
                  {summaryMetrics.favoriteCount}
                  <span className="text-xs font-normal text-stone-500 ml-1.5">Buket</span>
                </div>
              </div>

              {/* Rangkaian Artistik */}
              <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider">
                    Artistik
                  </span>
                  <Layers className="w-4 h-4 text-stone-500" />
                </div>
                <div className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">
                  {summaryMetrics.artisticCount}
                  <span className="text-xs font-normal text-stone-500 ml-1.5">Buket</span>
                </div>
              </div>

              {/* Momen & Hadiah */}
              <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider">
                    Momen & Hadiah
                  </span>
                  <Sparkles className="w-4 h-4 text-stone-500" />
                </div>
                <div className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">
                  {summaryMetrics.celebrationCount + summaryMetrics.personalCount}
                  <span className="text-xs font-normal text-stone-500 ml-1.5">Buket</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar & Grid Koleksi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white border border-stone-200/80 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
            {/* Tab Kategori */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#E60067] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-600 border border-stone-200/80 hover:border-stone-400 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter Toggle & Search & Sort */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              {/* Tombol Filter Favorit */}
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'bg-rose-50 border-rose-300 text-[#E60067]'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#E60067]' : ''}`} />
                <span>Hanya Favorit</span>
              </button>

              {/* Input Pencarian Langsung */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari buket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs py-2 pl-8 pr-7 rounded-xl focus:outline-none focus:border-[#E60067] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Urutkan Koleksi"
                  className="appearance-none bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#E60067] transition-colors cursor-pointer"
                >
                  <option value="featured">Paling Populer</option>
                  <option value="price-asc">Harga: Terendah</option>
                  <option value="price-desc">Harga: Tertinggi</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Menampilkan status bar hasil filter */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-5 px-1">
            <p>
              Menampilkan <span className="font-semibold text-stone-800">{filteredProducts.length}</span> dari {products.length} karya mahakarya
            </p>
            {(searchQuery || selectedCategory !== 'all' || onlyFavorites) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyFavorites(false);
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
                  setOnlyFavorites(false);
                }}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
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
