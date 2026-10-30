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
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Info,
  Flower2,
  PartyPopper,
  Gift,
  LayoutGrid,
  Image as ImageIcon,
  Star,
  MoreVertical,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Product, getCategoryLabel, getCategoryShortLabel } from '@/data/products';
import ProductFormModal from './ProductFormModal';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Semua Koleksi', icon: LayoutGrid },
  { id: 'artistic', label: 'Buket Bunga Artistik', icon: Flower2 },
  { id: 'celebration', label: 'Perayaan & Momen', icon: PartyPopper },
  { id: 'personal', label: 'Personalisasi & Hadiah', icon: Gift },
];

export default function AdminDashboard() {
  const { products, isLoading, logout, addProduct, updateProduct, deleteProduct, refreshProducts } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const selectedCatObj = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory) || CATEGORY_OPTIONS[0];
  const SelectedIcon = selectedCatObj.icon;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
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
        showToast(`Koleksi "${productData.name}" berhasil diperbarui`, 'success');
      } else {
        await addProduct(productData);
        showToast(`Koleksi baru berhasil ditambahkan ke katalog`, 'success');
      }
      setIsModalOpen(false);
    } catch {
      showToast('Gagal menyimpan perubahan. Silakan coba lagi.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
      showToast(`Koleksi "${name}" berhasil dihapus`, 'info');
    } catch {
      showToast('Gagal menghapus produk. Silakan coba lagi.', 'error');
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
      {/* Toast Notification (Top Center / Pill Style) */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200">
          <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900/95 text-white backdrop-blur-md shadow-xl shadow-stone-950/15 border border-white/10 text-xs font-medium tracking-tight animate-in fade-in slide-in-from-top-3 duration-200">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-stone-100">{toast.message}</span>
          </div>
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
      <main className="max-w-7xl mx-auto px-3 sm:px-8 pt-4 sm:pt-6">
        {/* Metric Overview Row (Simple Clean Numbers) */}
        <div className="flex items-center justify-around py-3 px-2 sm:px-6 bg-white/70 rounded-2xl border border-stone-200/60 shadow-2xs mb-4 sm:mb-6">
          <div className="flex flex-col items-center text-center px-2">
            <span className="text-xl sm:text-2xl font-bold text-[#E60067] leading-none">
              {products.length}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-[#E60067] uppercase tracking-wider mt-1.5">
              Total Koleksi
            </span>
          </div>

          <div className="w-[1px] h-7 bg-stone-200/60" />

          <div className="flex flex-col items-center text-center px-2">
            <span className="text-xl sm:text-2xl font-bold text-[#E60067] leading-none">
              {products.filter((p) => p.isPopular).length}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-[#E60067] uppercase tracking-wider mt-1.5">
              Favorit
            </span>
          </div>

          <div className="w-[1px] h-7 bg-stone-200/60" />

          <div className="flex flex-col items-center text-center px-2">
            <span className="text-xl sm:text-2xl font-bold text-[#E60067] leading-none">
              {products.filter((p) => p.category === 'artistic').length}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-[#E60067] uppercase tracking-wider mt-1.5">
              Artistik
            </span>
          </div>

          <div className="w-[1px] h-7 bg-stone-200/60" />

          <div className="flex flex-col items-center text-center px-2">
            <span className="text-xl sm:text-2xl font-bold text-[#E60067] leading-none">
              {products.filter((p) => p.category === 'celebration' || p.category === 'personal').length}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-[#E60067] uppercase tracking-wider mt-1.5">
              Momen & Hadiah
            </span>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs mb-4 sm:mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama atau bahan..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067] bg-stone-50/50"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-medium shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mahakarya</span>
            </button>
          </div>

          {/* Categories Filter: Interactive Dropdown with icon & label */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full sm:w-auto min-w-[240px] flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-800 text-xs font-medium transition cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <SelectedIcon className="w-4 h-4 text-[#E60067] shrink-0" />
                <span className="truncate">{selectedCatObj.label}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-full sm:w-72 bg-white rounded-xl border border-stone-200 shadow-xl z-50 py-1 overflow-hidden animate-in fade-in duration-150">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    const count = cat.id === 'all'
                      ? products.length
                      : products.filter((p) => p.category === cat.id).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50/70 text-[#E60067] font-semibold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#E60067]' : 'text-stone-400'}`} />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? 'bg-[#E60067]/10 text-[#E60067]' : 'bg-stone-100 text-stone-500'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Cards Table/Grid */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Daftar Mahakarya ({filteredProducts.length})
            </h2>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Kelola foto, harga, dimensi, dan detail katalog
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-xs sm:text-sm text-stone-500">Tidak ada mahakarya yang cocok dengan kriteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/60 transition"
                >
                  {/* Left: Thumbnail & Concise Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-stone-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-medium text-[#E60067] truncate">
                          {getCategoryShortLabel(p)}
                        </span>
                        {p.isPopular && (
                          <span
                            className="inline-flex items-center text-amber-500"
                            title="Produk Favorit"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                        {p.name}
                      </h3>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-semibold text-stone-900">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions Dropdown Menu */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuId(activeMenuId === p.id ? null : p.id);
                        setDeleteConfirmId(null);
                      }}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        activeMenuId === p.id
                          ? 'bg-stone-200 text-stone-900'
                          : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                      }`}
                      title="Menu Aksi"
                      aria-label="Menu Aksi"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === p.id && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeleteConfirmId(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-stone-200 shadow-lg z-40 py-1 overflow-hidden animate-in fade-in duration-150">
                          {deleteConfirmId === p.id ? (
                            <div className="p-2.5 space-y-2 bg-rose-50/50">
                              <p className="text-[11px] font-medium text-stone-700 leading-tight">
                                Hapus mahakarya ini?
                              </p>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteProduct(p.id, p.name);
                                    setActiveMenuId(null);
                                    setDeleteConfirmId(null);
                                  }}
                                  className="flex-1 py-1 px-2 text-center text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition cursor-pointer"
                                >
                                  Ya, Hapus
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="py-1 px-2 text-xs text-stone-600 hover:bg-stone-200/60 rounded-md transition cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Link
                                href={`/product/${p.id}`}
                                target="_blank"
                                onClick={() => setActiveMenuId(null)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                                <span>Lihat Produk</span>
                              </Link>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleOpenEditModal(p);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition text-left cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                                <span>Edit Detail</span>
                              </button>

                              <div className="my-1 border-t border-stone-100" />

                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Hapus Mahakarya</span>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
