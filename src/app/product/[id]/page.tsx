import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById, getProducts } from '@/lib/supabase/products';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Revalidasi dinamis agar produk baru langsung bisa dibuka
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Floréa Florist',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://florea.web.id';
  const productUrl = `${siteUrl}/product/${product.id}`;

  return {
    title: `${product.name} | Floréa Florist`,
    description: product.description,
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Floréa Florist`,
      description: product.description,
      url: productUrl,
      type: 'article',
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Floréa Florist`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-grow">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}
