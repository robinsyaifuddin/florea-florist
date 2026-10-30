'use client';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-stone-200/90 p-3 sm:p-4 animate-pulse">
      {/* Gambar Skeleton */}
      <div className="w-full aspect-square rounded-lg skeleton-shimmer mb-3 sm:mb-4" />

      {/* Info Skeleton */}
      <div className="flex flex-col flex-grow space-y-2">
        {/* Kategori label */}
        <div className="h-3 w-1/3 rounded skeleton-shimmer" />

        {/* Nama produk */}
        <div className="h-4 w-4/5 rounded skeleton-shimmer" />

        {/* Harga */}
        <div className="h-5 w-1/2 rounded skeleton-shimmer mt-1" />

        {/* Tombol aksi */}
        <div className="grid grid-cols-2 gap-2 pt-3 mt-auto">
          <div className="h-8 rounded-lg skeleton-shimmer" />
          <div className="h-8 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
