import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '@/data/products';

export function CategoryBento() {
  return (
    <section className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="reveal-on-scroll flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#E60067] block mb-1">
            Kurasi Berdasarkan Momen
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Karya Seni Floral Untuk Detik Bersejarah Anda
          </h2>
        </div>
        <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
          Setiap helai dirangkai untuk menciptakan kehangatan, wibawa, dan memori yang hidup selamanya di hati sang penerima.
        </p>
      </div>

      {/* Bento Grid: 1 Large Asymmetric + 2 Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Large Feature Card (Col-span 7) */}
        <Link
          href={`/collections?category=${CATEGORIES[0].id}`}
          prefetch={true}
          className="reveal-on-scroll lg:col-span-7 group relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer transition-all duration-300 hover:border-stone-400 hover:shadow-md block"
        >
          <Image
            src={CATEGORIES[0].image}
            alt={CATEGORIES[0].title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#88003c]/90 via-[#E60067]/40 to-transparent" />

          <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between z-10 text-white">
            <div className="flex justify-between items-start">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {CATEGORIES[0].tag}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#E60067] group-hover:text-white transition-all duration-200">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className="text-[11px] sm:text-xs text-stone-300 uppercase tracking-widest mb-1">
                {CATEGORIES[0].subtitle}
              </p>
              <h3 className="text-xl sm:text-3xl font-serif font-bold text-white mb-2">
                {CATEGORIES[0].title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md line-clamp-2">
                {CATEGORIES[0].description}
              </p>
            </div>
          </div>
        </Link>

        {/* 2 Stacked Cards (Col-span 5) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-6">
          {CATEGORIES.slice(1).map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/collections?category=${cat.id}`}
              prefetch={true}
              className={`reveal-on-scroll ${idx === 0 ? 'delay-100' : 'delay-200'} group relative h-48 sm:h-48 lg:h-[180px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer transition-all duration-300 hover:border-stone-400 hover:shadow-md block`}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#88003c]/90 via-[#E60067]/35 to-stone-900/40 group-hover:via-[#E60067]/45 transition-colors duration-300" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-medium">
                    {cat.subtitle}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#E60067] group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
