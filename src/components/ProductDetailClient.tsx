'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Minus,
  Plus,
  MessageCircle,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { Product, getCategoryLabel, getCategoryShortLabel } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [cardMessage, setCardMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Zoom interactive state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  const updateTouchPosition = (touch: React.Touch, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsZoomed(true);
    if (e.touches.length > 0) {
      updateTouchPosition(e.touches[0], e.currentTarget);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateTouchPosition(e.touches[0], e.currentTarget);
    }
  };

  // Sizes logic
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : [
    { id: 'standard', name: 'Standard', price: product.price },
    { id: 'deluxe', name: 'Deluxe (+Rp 50.000)', price: product.price + 50000 },
    { id: 'premium', name: 'Premium (+Rp 100.000)', price: product.price + 100000 },
  ];

  const currentPrice = sizes[selectedSizeIndex]?.price || product.price;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyLink = async () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://florea.web.id/product/${product.id}`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Floréa Florist`,
          text: `Lihat rangkaian buket ${product.name} di Floréa Florist:`,
          url: currentUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOrderWhatsApp = () => {
    const phoneNumber = '62895705032933'; // CS WhatsApp
    const selectedSizeName = sizes[selectedSizeIndex]?.name || 'Standard';
    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://florea.web.id';
    const productLink = `${siteOrigin}/product/${product.id}`;

    const message = `Halo Floréa Florist, saya ingin melakukan pemesanan buket istimewa berikut:

• *Karya Pilihan*: ${product.name}
• *Kategori*: ${getCategoryLabel(product)}
• *Ukuran Rangkaian*: ${selectedSizeName}
• *Jumlah*: ${quantity} buket
• *Total Estimasi*: ${formatPrice(currentPrice * quantity)}
${cardMessage.trim() ? `• *Pesan Personal di Kartu*: "${cardMessage.trim()}"\n` : '• *Pesan Kartu*: (Tanpa kartu ucapan)\n'}
Tautan Produk: ${productLink}

Mohon konfirmasi ketersediaan slot rangkaian dan jadwal pengirimannya. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-3.5 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-stone-900 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link href="/#catalog" className="hover:text-stone-900 transition">
          Katalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-900 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Section: 2 Columns yang proporsional dan pas di layar desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 mb-8 items-start">
        
        {/* Left Column: Single Main Showcase Image (5 cols desktop, clean & focused) */}
        <div className="md:col-span-5 flex flex-col max-w-sm mx-auto md:max-w-none w-full">
          <div
            onContextMenu={(e) => e.preventDefault()}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={() => setIsZoomed(false)}
            onTouchCancel={() => setIsZoomed(false)}
            onTouchMove={handleTouchMove}
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              userSelect: 'none',
            }}
            className="relative w-full aspect-[4/3] sm:aspect-square md:max-h-[380px] lg:max-h-[400px] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs group cursor-crosshair select-none"
          >
            {product.image ? (
              <div
                className="relative w-full h-full transition-transform duration-100 ease-out pointer-events-none select-none"
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  quality={85}
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover select-none pointer-events-none"
                  style={{
                    WebkitTouchCallout: 'none',
                    userSelect: 'none',
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                <ImageIcon className="w-16 h-16 stroke-[1.25]" />
                <span className="text-xs text-stone-400 mt-2 font-sans">Belum ada foto produk</span>
              </div>
            )}

            {/* Badge Populer / Favorit */}
            {product.isPopular && (
              <span className="absolute top-3 left-3 bg-[#E60067] text-white text-[9px] font-semibold px-2.5 py-0.5 rounded tracking-wider uppercase z-10 shadow-xs pointer-events-none">
                Favorit
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Detail & Ordering (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-start">
          {/* Category Badge */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#E60067]">
              {getCategoryShortLabel(product)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-stone-900 mb-1 tracking-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2.5 pb-2.5 border-b border-stone-200/70">
            <span className="text-xl sm:text-2xl font-semibold text-stone-900">
              {formatPrice(currentPrice * quantity)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice * quantity)}
              </span>
            )}
            {quantity > 1 && (
              <span className="text-[11px] text-stone-500">
                ({formatPrice(currentPrice)} / buket)
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Size Options (Dropdown / Select atau List Baris ke Bawah) */}
          <div className="mb-3">
            <label htmlFor="size-select" className="block text-[10px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
              Dimensi & Kemewahan Rangkaian
            </label>
            <div className="flex flex-col gap-1.5">
              {sizes.map((s, idx) => {
                const isSelected = selectedSizeIndex === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`w-full p-2.5 border text-left flex items-center justify-between transition-all duration-150 cursor-pointer rounded-xl ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 font-medium'
                        : 'border-stone-200/90 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-3.5 h-3.5 border flex items-center justify-center rounded-full transition-colors ${
                          isSelected ? 'border-stone-900 bg-stone-900' : 'border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-xs text-stone-900">{s.name}</span>
                    </div>
                    <span className="text-xs text-stone-700 font-semibold">{formatPrice(s.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Message Input */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="card-msg" className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider">
                Kartu Ucapan Kaligrafi Eksklusif (Gratis)
              </label>
            </div>
            <textarea
              id="card-msg"
              rows={2}
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              placeholder="Tuliskan pesan tulus Anda di sini..."
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200/90 focus:outline-none focus:border-stone-900 bg-white resize-none transition-colors"
            />
          </div>

          {/* Quantity, CTA Button, & Share */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-stone-200/80 mb-3.5">
            {/* Quantity Selector */}
            <div className="flex items-center border border-stone-200/90 rounded-full bg-stone-50/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kurangi jumlah"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white text-stone-600 hover:text-stone-900 transition-colors duration-150 active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-semibold text-stone-900 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tambah jumlah"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white text-stone-600 hover:text-stone-900 transition-colors duration-150 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tombol Pesan Sekarang */}
            <button
              onClick={handleOrderWhatsApp}
              className="flex-1 py-2.5 sm:py-3 px-5 sm:px-6 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center transition-all duration-150 hover:shadow-md hover:shadow-pink-500/10 active:scale-[0.98] cursor-pointer min-w-0"
            >
              <span className="truncate">Pesan Sekarang</span>
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Bagikan Tautan Produk"
              aria-label="Bagikan Tautan Produk"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-200/90 hover:border-stone-400 text-stone-700 bg-white transition-all duration-150 flex items-center justify-center active:scale-95 hover:bg-stone-50 cursor-pointer shrink-0 shadow-2xs"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200/70 text-[10px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#E60067] shrink-0" />
              <span className="truncate">Jaminan presisi katalog 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#E60067] shrink-0" />
              <span className="truncate">Layanan same-day terpercaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Produk (Tabel Spesifikasi) */}
      <div className="mb-16 border border-stone-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-stone-200/90 bg-stone-50/50">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Detail Mahakarya & Spesifikasi
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <tbody>
                <tr className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 sm:pr-6 text-stone-500 font-medium w-1/3 whitespace-nowrap align-top">Kategori & Material</td>
                  <td className="py-2.5 text-stone-900 font-semibold">{getCategoryShortLabel(product)} ({product.material})</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 sm:pr-6 text-stone-500 font-medium align-top whitespace-nowrap">Gaya Rangkaian</td>
                  <td className="py-2.5 text-stone-900 font-semibold">Korean Haute Couture Floral Architecture</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 sm:pr-6 text-stone-500 font-medium align-top whitespace-nowrap">Kemasan & Sentuhan Akhir</td>
                  <td className="py-2.5 text-stone-900 font-semibold">Premium Matte Wrapping Paper, Pita Satin Lembut & Kartu Kaligrafi</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 sm:pr-6 text-stone-500 font-medium align-top whitespace-nowrap">Momen Paling Tepat</td>
                  <td className="py-2.5 text-stone-900 font-semibold">Wisuda Kehormatan, Anniversary, Pernikahan, Ulang Tahun Berkesan & Apresiasi Personal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products Section (Mirip Bagian Bawah Gambar 2) */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200/80">
          <div className="flex flex-col mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E60067] mb-1">
              Koleksi Pelengkap
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Pilihan Mahakarya Sejenis Dari Florist
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}