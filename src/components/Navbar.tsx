'use client';

import { useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  onSearchChange?: (term: string) => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({ onSearchChange, activeCategory = 'all', onSelectCategory }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearchChange) onSearchChange('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          
          {/* Logo Brand Asli */}
          <Link
            href="/"
            aria-label="Florea Florist Flowers and Gift Home"
            className="flex items-center group focus:outline-none transition-transform duration-200 hover:scale-105 active:scale-95 shrink-0"
          >
            <div className="relative h-9 w-24 sm:h-14 sm:w-36">
              <Image
                src="/logo-transparent.png"
                alt="Florea Florist Flowers and Gift Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Right Action Icons: Search Icon + Pink Floral CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Cari bunga"
              className="p-1.5 sm:p-2 text-[#E60067] hover:text-[#B80053] transition-colors duration-150 active:scale-95 shrink-0 focus:outline-none"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.25]" />
            </button>

            {/* Direct WhatsApp Call to Action */}
            <a
              href="https://wa.me/62895705032933?text=Halo%20Flor%C3%A9a%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20buket"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-150 active:scale-[0.98] shadow-sm whitespace-nowrap"
            >
              <span>Konsultasi</span>
              <span className="hidden sm:inline">&nbsp;Eksklusif</span>
            </a>
          </div>
        </div>

        {/* Minimalist Expandable Search Bar on Icon Click */}
        {searchOpen && (
          <div className="py-3 border-t border-stone-200/80 animate-fadeIn">
            <div className="relative max-w-xl mx-auto flex items-center">
              <input
                type="text"
                placeholder="Temukan mahakarya: peoni sutra, tulip pastel, bloom box mewah..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full text-xs pl-9 pr-8 py-2.5 rounded-lg bg-white border border-stone-300 focus:outline-none focus:border-stone-900 transition shadow-2xs"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
              {searchValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
