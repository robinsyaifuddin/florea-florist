import { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Daftar Semua Koleksi Mahakarya | Floréa Florist',
  description:
    'Eksplorasi seluruh portofolio buket bunga sutra premium dan preserved flower abadi Floréa Florist. Tersedia berbagai kategori dan varian terlengkap.',
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <CollectionsClient />
    </Suspense>
  );
}
