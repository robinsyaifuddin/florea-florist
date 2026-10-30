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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://florea.web.id').replace(/\/$/, '');
  const productUrl = `${siteUrl}/product/${product.id}`;

  // Pastikan URL gambar absolut agar WhatsApp crawler bisa fetch preview gambar
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${siteUrl}${product.image?.startsWith('/') ? '' : '/'}${product.image || '/og-image.jpg'}`;

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
      siteName: 'Floréa Florist',
      type: 'article',
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://florea.web.id';
  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  // Schema Product Rich Snippet untuk Google & AI Engine
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`,
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Florea Florist',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: 'IDR',
      price: product.price,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Florist',
        name: 'Florea Florist',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 38,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />

      <main className="flex-grow">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}
