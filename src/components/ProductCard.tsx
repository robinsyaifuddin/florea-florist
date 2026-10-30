'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, getCategoryShortLabel } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onOrderDirect?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="group relative flex flex-col w-full bg-white rounded-xl border border-stone-200/90 p-3 sm:p-4 transition-transform duration-150 hover:-translate-y-1 hover:border-stone-400 hover:shadow-sm will-change-transform">
      {/* Badge Favorit Star Modern 3D */}
      {product.isPopular && (
        <div
          aria-label="Produk Favorit"
          title="Produk Favorit"
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none drop-shadow-md transition-transform duration-200 group-hover:scale-110"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-[0_2px_4px_rgba(230,0,103,0.35)]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`star3d-grad-${product.id}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6BB5" />
                <stop offset="45%" stopColor="#E60067" />
                <stop offset="100%" stopColor="#9E0042" />
              </linearGradient>
              <linearGradient id={`star3d-highlight-${product.id}`} x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Base Star */}
            <path
              d="M12 2.5L14.938 8.452L21.508 9.407L16.754 14.043L17.876 20.585L12 17.495L6.124 20.585L7.246 14.043L2.492 9.407L9.062 8.452L12 2.5Z"
              fill={`url(#star3d-grad-${product.id})`}
              stroke="#FFFFFF"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
            {/* Top 3D Facet Highlight */}
            <path
              d="M12 2.5L14.938 8.452L12 12L9.062 8.452L12 2.5Z"
              fill={`url(#star3d-highlight-${product.id})`}
            />
            <path
              d="M12 12L21.508 9.407L16.754 14.043L12 12Z"
              fill="#FFFFFF"
              fillOpacity="0.2"
            />
          </svg>
        </div>
      )}

      {/* Wadah Foto Buket */}
      <Link
        href={`/product/${product.id}`}
        prefetch={true}
        className="relative w-full aspect-square bg-stone-100 rounded-lg overflow-hidden mb-3 sm:mb-4 block outline-none select-none [-webkit-tap-highlight-color:transparent]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </Link>

      {/* Info Rangkaian Buket */}
      <div className="flex flex-col flex-grow">
        <div className="text-[10px] sm:text-[11px] text-[#E60067] font-semibold uppercase tracking-wider mb-1 truncate">
          {getCategoryShortLabel(product)}
        </div>

        <Link href={`/product/${product.id}`} prefetch={true} className="block">
          <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 group-hover:text-[#E60067] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Harga */}
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4 pt-1.5 sm:pt-2 border-t border-stone-100">
          <span className="text-sm sm:text-base font-semibold text-stone-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-stone-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Tombol Aksi Menuju Halaman Detail */}
        <div className="mt-auto pt-1 flex items-center gap-2">
          <Link
            href={`/product/${product.id}`}
            prefetch={true}
            className="flex-1 py-2 sm:py-2.5 px-4 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white text-xs font-semibold tracking-wide text-center transition-colors duration-100 active:scale-[0.98] shadow-2xs"
          >
            Lihat Koleksi
          </Link>
        </div>
      </div>
    </div>
  );
}
