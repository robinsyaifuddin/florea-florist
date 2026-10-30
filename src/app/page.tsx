'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryBento } from '@/components/CategoryBento';
import { ProductCatalog } from '@/components/ProductCatalog';
import { StudioAndDeliverySection } from '@/components/StudioAndDeliverySection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onSearchChange={(query) => setSearchQuery(query)}
      />

      <main className="flex-grow">
        <HeroSection />

        <CategoryBento />

        <ProductCatalog
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
          searchTerm={searchQuery}
        />

        <StudioAndDeliverySection />
      </main>

      <Footer />
    </div>
  );
}
