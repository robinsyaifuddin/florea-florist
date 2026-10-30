'use client';

import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-0 pb-0 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Kolom Kiri: Teks & Aksi */}
          <div className="lg:col-span-6 flex flex-col items-start z-10 pt-7 sm:pt-6 lg:pt-0 pb-8 sm:pb-12 lg:pb-14 sm:pl-3 lg:pl-6 mt-0 sm:-mt-8 lg:-mt-12">
            {/* Header Area: Kicker, Headline & Bunga Kecil (di mobile tampil 2 kolom berdampingan) */}
            <div className="flex items-center justify-start gap-3 min-[400px]:gap-4 w-full mb-3 sm:mb-5">
              <div className="shrink-0">
                {/* Kicker subtitle */}
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold tracking-widest text-[#E60067] uppercase mb-1 sm:mb-3 block">
                  Buket Bunga Eksklusif
                </span>

                {/* Headline */}
                <h1 className="text-xl min-[390px]:text-2xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] font-serif font-bold text-stone-900 leading-[1.16] tracking-tight">
                  <span className="block whitespace-nowrap">Rasa Tak Pernah Pudar.</span>
                  <span className="block whitespace-nowrap">
                    Begitu Pula{' '}
                    <span className="font-serif italic text-[#E60067]">
                      Buket Anda.
                    </span>
                  </span>
                </h1>
              </div>

              {/* Bunga Kecil Khusus Mobile */}
              <div className="lg:hidden shrink-0 relative flex items-center justify-center -ml-1 sm:ml-0">
                <div className="relative w-[88px] h-[104px] min-[390px]:w-[100px] min-[390px]:h-[116px] bg-[#FCE8F0] rounded-t-full rounded-b-2xl flex items-center justify-center shadow-xs overflow-visible">
                  <div className="relative w-[110%] h-[110%] translate-y-1">
                    <Image
                      src="/hero-flower-new.png"
                      alt="Artisanal Bouquet"
                      fill
                      priority
                      sizes="110px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-stone-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-lg mb-6 sm:mb-8 font-normal">
              Kami tidak sekadar merangkai bunga. Kami menghadirkan pengalaman menerima karya seni floral mewah, abadi, dan sarat makna untuk orang paling istimewa.
            </p>

            {/* Tombol Aksi Kiri */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
              <Link
                href="/collections"
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white text-[11px] sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] whitespace-nowrap"
              >
                Eksplor Koleksi
              </Link>

              <Link
                href="/contact"
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-white border border-stone-300/90 hover:border-stone-400 hover:bg-stone-50 text-stone-800 text-[11px] sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] whitespace-nowrap"
              >
                Konsultasi Pribadi
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Arch Shape Background (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 relative items-end justify-center">
            
            {/* The Arch Shape (Soft Pink Curved Arch Background) */}
            <div className="relative w-[320px] sm:w-[420px] md:w-[460px] lg:w-[490px] h-[440px] sm:h-[530px] lg:h-[570px] bg-[#FCE8F0] rounded-t-full rounded-b-none flex items-center justify-center transition-transform duration-500">
              
              {/* Buket Bunga Berbentuk Hati Utama */}
              <div className="relative w-[340px] sm:w-[460px] lg:w-[510px] h-[400px] sm:h-[500px] lg:h-[550px] z-10 translate-y-3 sm:translate-y-4 animate-float-slow">
                <Image
                  src="/hero-flower-new.png"
                  alt="Artisanal Luxury Bouquet of Fresh Flowers"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 550px"
                  className="object-contain object-center drop-shadow-2xl"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}