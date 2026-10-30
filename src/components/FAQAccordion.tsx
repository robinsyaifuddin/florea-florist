'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  // Buka item pertama secara default agar user langsung paham bisa di-expand/collapse
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <div className="divide-y divide-stone-200 border-y border-stone-200">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="transition-colors">
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="w-full py-5 sm:py-6 flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-[#E60067] transition-colors leading-snug">
                {item.q}
              </span>
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-200/90 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-[#E60067] border-[#E60067] text-white' : 'bg-stone-50 text-stone-500 group-hover:border-stone-400 group-hover:text-stone-900'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            {isOpen && (
              <div className="pb-5 sm:pb-6 text-xs sm:text-[13px] text-stone-600 leading-relaxed pr-6 sm:pr-10 animate-fadeIn">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
