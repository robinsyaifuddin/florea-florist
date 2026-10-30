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
  ArrowLeft
} from 'lucide-react';
import { Product, getCategoryLabel } from '@/data/products';
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
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default'
  );
  const [cardMessage, setCardMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Zoom interactive state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setZoomPosition({ x, y });
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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOrderWhatsApp = () => {
    const phoneNumber = '62895705032933'; // CS WhatsApp
    const selectedSizeName = sizes[selectedSizeIndex]?.name || 'Standard';

    const message = `Halo Floréa Florist, saya ingin melakukan pemesanan buket istimewa berikut:

• *Karya Pilihan*: ${product.name}
• *Kategori*: ${getCategoryLabel(product)}
• *Ukuran Rangkaian*: ${selectedSizeName}
${product.colors ? `• *Nuansa Warna*: ${selectedColor}\n` : ''}• *Jumlah*: ${quantity} buket
• *Total Estimasi*: ${formatPrice(currentPrice * quantity)}
${cardMessage.trim() ? `• *Pesan Personal di Kartu*: "${cardMessage.trim()}"\n` : '• *Pesan Kartu*: (Tanpa kartu ucapan)\n'}
Tautan Produk: ${typeof window !== 'undefined' ? window.location.href : ''}

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
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsZoomed(true)}
            onTouchEnd={() => setIsZoomed(false)}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[4/3] sm:aspect-square md:max-h-[380px] lg:max-h-[400px] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs group cursor-crosshair select-none"
          >
            <div
              className="relative w-full h-full transition-transform duration-150 ease-out"
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZoomed ? 'scale(2.1)' : 'scale(1)',
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>

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
              {getCategoryLabel(product)}
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

          {/* Size Options */}
          <div className="mb-3">
            <label className="block text-[10px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
              Dimensi & Kemewahan Rangkaian
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {sizes.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedSizeIndex === idx
                      ? 'border-[#E60067] bg-[#E60067]/5 ring-1 ring-[#E60067]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-stone-900 leading-tight mb-0.5">{s.name}</span>
                  <span className="text-[10px] text-stone-500">{formatPrice(s.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Options (if exists) */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <label className="block text-[10px] font-semibold text-stone-900 uppercase tracking-wider mb-1">
                Pilihan Palet Warna: <span className="text-stone-600 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-1.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border transition cursor-pointer flex items-center justify-center ${
                      selectedColor === c.name ? 'border-[#E60067] ring-1 ring-[#E60067] scale-105' : 'border-stone-300'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check className="w-2.5 h-2.5 text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Message Input */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="card-msg" className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider">
                Kartu Ucapan Kaligrafi Eksklusif (Gratis)
              </label>
              <span className="text-[9px] text-stone-400">Amplop linen & wax seal mewah</span>
            </div>
            <textarea
              id="card-msg"
              rows={2}
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              placeholder="Tuliskan pesan tulus Anda di sini (contoh: Selamat atas kelulusanmu, Sarah. Hari ini awal dari masa depan gemilangmu)..."
              className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067] bg-white resize-none transition"
            />
          </div>

          {/* Quantity, CTA Button, & Share */}
          <div className="flex items-center gap-2 pt-2.5 border-t border-stone-200/80 mb-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-stone-200 rounded-lg bg-white p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-700 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center text-xs font-semibold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-700 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Tombol Pesan Sekarang */}
            <button
              onClick={handleOrderWhatsApp}
              className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center transition duration-150 active:scale-[0.98] shadow-xs cursor-pointer min-w-0"
            >
              <span className="truncate">Reservasi Sekarang</span>
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Bagikan Tautan Produk"
              className="p-2 sm:p-2.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-700 bg-white transition flex items-center justify-center active:scale-95 cursor-pointer shrink-0"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
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

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <tbody>
                <tr className="border-b border-stone-100">
                  <td className="py-2.5 text-stone-500 font-medium w-1/3">Kategori & Material</td>
                  <td className="py-2.5 text-stone-900 font-semibold">{getCategoryLabel(product)} ({product.material})</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2.5 text-stone-500 font-medium">Gaya Rangkaian</td>
                  <td className="py-2.5 text-stone-900 font-semibold">Korean Haute Couture Floral Architecture</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2.5 text-stone-500 font-medium">Kemasan & Sentuhan Akhir</td>
                  <td className="py-2.5 text-stone-900 font-semibold">Premium Matte Wrapping Paper, Pita Satin Lembut & Kartu Kaligrafi</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-stone-500 font-medium">Momen Paling Tepat</td>
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