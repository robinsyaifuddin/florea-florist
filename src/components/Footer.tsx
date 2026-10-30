import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ShieldCheck, HeartHandshake, ShoppingBag, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="reveal-on-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-stone-800 items-start">
          
          {/* Brand Info (Col 5) */}
          <div className="md:col-span-5 flex flex-col justify-start -mt-2">
            <div className="relative h-10 w-36 mb-3">
              <Image
                src="/logo-transparent.png"
                alt="Floréa Florist Logo"
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm mb-4">
              Perangkai buket bunga sutra premium & preserved flower abadi. Merawat rasa, merayakan pencapaian, dan menghadirkan pengalaman berkelas tanpa batas waktu.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Karya Floral Haute Couture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Pengiriman Aman Nusantara</span>
              </div>
            </div>
          </div>

          {/* Social Media (Col 3) */}
          <div className="md:col-span-3 flex flex-col justify-start">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 leading-6">
              Sosial Media & Toko
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition duration-150"
                >
                  <svg className="w-4 h-4 fill-none stroke-rose-400 stroke-2 shrink-0" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition duration-150"
                >
                  <svg className="w-4 h-4 fill-rose-400 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.87a8.28 8.28 0 0 0 4.84 1.57v-3.5a4.83 4.83 0 0 1-.93-.25z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://shopee.co.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition duration-150"
                >
                  <ShoppingBag className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Shopee</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Studio & Order Info (Col 4) */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 leading-6">
              Layanan Pribadi & Studio
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-300 block">Studio & Workshop:</span>
                  <span>Jl. Raya Curug No.60, Curug, Kec. Bojongsari, Kota Depok, Jawa Barat 16517</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Konsultasi Eksklusif: 08.30 - 21.00 WIB setiap hari.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Florea Florist. All rights reserved.</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition text-[11px]"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Portal Admin</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
