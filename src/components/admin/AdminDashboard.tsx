'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  RotateCcw,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Product, getCategoryLabel } from '@/data/products';
import ProductFormModal from './ProductFormModal';

export default function AdminDashboard() {
  const { products, isLoading, logout, addProduct, updateProduct, deleteProduct, refreshProducts } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showToast(`Berhasil memperbarui "${productData.name}" di Supabase`);
      } else {
        await addProduct(productData);
        showToast(`Berhasil menambahkan mahakarya baru ke Supabase!`);
      }
      setIsModalOpen(false);
    } catch {
      showToast('Terjadi kesalahan saat menyimpan ke Supabase');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
      showToast(`"${name}" telah dihapus dari Supabase.`);
    } catch {
      showToast('Gagal menghapus produk dari Supabase.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const label = getCategoryLabel(p);
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 border border-stone-800 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-24">
              <Image
                src="/logo-transparent.png"
                alt="Floréa Florist Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-medium text-stone-900 text-sm sm:text-base">
                  Florea Florist
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-50 text-[#E60067] border border-pink-200/60">
                  Katalog Manager
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Kelola foto, harga, dimensi rangkaian, dan detail spesifikasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Toko Publik</span>
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Metric Overview Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Mahakarya</span>
              <Layers className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              {products.length} <span className="text-xs font-normal text-stone-400">item</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Koleksi Terpopuler</span>
              <Sparkles className="w-4 h-4 text-[#E60067]" />
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              {products.filter((p) => p.isPopular).length}{' '}
              <span className="text-xs font-normal text-stone-400">unggulan</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Status Sync</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-600">Supabase Connected</span>
              <button
                onClick={async () => {
                  await refreshProducts();
                  showToast('Data berhasil di-refresh dari Supabase');
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 hover:underline cursor-pointer"
                title="Muat ulang data produk dari Supabase"
              >
                <RotateCcw className="w-3 h-3" /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, bahan, atau koleksi..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067]"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#E60067] hover:bg-[#CC005A] text-white text-xs font-semibold shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mahakarya</span>
            </button>
          </div>

          {/* Categories Pill Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-1" />
            {[
              { id: 'all', label: 'Semua Koleksi' },
              { id: 'artistic', label: 'Buket Bunga Artistik' },
              { id: 'celebration', label: 'Perayaan & Momen' },
              { id: 'personal', label: 'Personalisasi & Hadiah' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Table/Grid */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Daftar Mahakarya & Katalog ({filteredProducts.length})
            </h2>
            <span className="text-[11px] text-stone-400">
              Format detail mendukung gambar multi-slide, variasi dimensi, dan spesifikasi
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-stone-500">Tidak ada mahakarya yang cocok dengan kriteria pencarian.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition"
                >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 shrink-0">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#E60067]">
                            {getCategoryLabel(p)}
                          </span>
                          {p.isPopular && (
                            <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Favorit
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-stone-900 truncate">
                          {p.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-stone-900">
                            {formatPrice(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-stone-400 line-through">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                          <span className="font-medium text-stone-600">Bahan:</span> {p.material} •{' '}
                          <span className="font-medium text-stone-600">Rangkaian:</span>{' '}
                          {p.details?.arrangementStyle || 'Korean Haute Couture Floral Architecture'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                      <Link
                        href={`/product/${p.id}`}
                        target="_blank"
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                        title="Lihat halaman detail mahakarya di website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
                        title="Sunting mahakarya"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {deleteConfirmId === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition cursor-pointer"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus mahakarya"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </main>

      {/* Modal Form Tambah / Edit */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
}
