import { Metadata } from 'next';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Daftar Semua Koleksi Mahakarya | Floréa Florist',
  description:
    'Eksplorasi seluruh portofolio buket bunga sutra premium dan preserved flower abadi Floréa Florist. Tersedia berbagai kategori dan varian terlengkap.',
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
