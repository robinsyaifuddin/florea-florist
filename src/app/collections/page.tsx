import { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Koleksi Buket Mewah Terbaik, Bunga Sutra & Hadiah | Florea Florist',
  description:
    'Eksplorasi buket original, buket termewah, buket pria, buket wanita, serta gift terbaik pasangan untuk hadiah ulang tahun dan wisuda dari Florea Flowers and Gift.',
  alternates: {
    canonical: '/collections',
  },
  openGraph: {
    title: 'Koleksi Buket Mewah Terbaik & Original | Florea Florist',
    description:
      'Pilihan buket bunga terbaik, buket wisuda, dan hadiah ulang tahun premium. Tersedia pengiriman aman seluruh Indonesia.',
    url: 'https://florea.web.id/collections',
  },
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <CollectionsClient />
    </Suspense>
  );
}
