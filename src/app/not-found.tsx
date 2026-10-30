import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-md w-full text-center">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2 block">
            Error 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-stone-900 mb-4 tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed mb-8">
            Buket atau halaman yang Anda cari mungkin telah dipindahkan, berganti nama, atau sudah tidak tersedia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 transition active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <Link
              href="/#catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-stone-200 bg-white text-stone-800 text-sm font-medium hover:bg-stone-50 transition active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              Lihat Koleksi Buket
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
