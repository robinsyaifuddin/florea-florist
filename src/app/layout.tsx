import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AdminProvider } from '@/context/AdminContext';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import { getProducts } from '@/lib/supabase/products';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://florea.web.id';

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Florea Florist | Buket Mewah Terbaik, Bunga & Hadiah Pasangan',
    template: '%s | Florea Florist Flowers & Gift',
  },
  description:
    'Florea (Florea Florist Flowers and Gift): Toko buket mewah terbaik & original di Depok & Jakarta. Sedia buket bunga sutra premium, buket pria, buket wanita, hadiah ulang tahun, wisuda & anniversary berkelas.',
  keywords: [
    'florea',
    'florea florist',
    'florea bouquet',
    'florea flowers and gift',
    'florea buket',
    'buket mewah terbaik',
    'buket original',
    'buket pria',
    'buket wanita',
    'buket termewah',
    'buket terbaik',
    'gift terbaik pasangan',
    'hadiah ulang tahun',
    'hadiah wisuda',
    'florist depok',
    'florist jakarta',
    'buket bunga abadi',
    'preserved flower mewah',
    'toko buket bunga terdekat',
  ],
  authors: [{ name: 'Florea Florist' }],
  creator: 'Florea Florist',
  publisher: 'Florea Florist',
  formatDetection: {
    telephone: true,
    address: true,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-transparent.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'Florea Florist Flowers & Gift',
    title: 'Florea Florist | Buket Mewah Terbaik & Hadiah Istimewa Pasangan',
    description:
      'Koleksi buket bunga original, buket pria & wanita, buket termewah untuk hadiah ulang tahun, wisuda & momen spesial dari Florea Flowers and Gift. Pengiriman aman seluruh Indonesia.',
    images: [
      {
        url: '/logo-transparent.png',
        width: 800,
        height: 800,
        alt: 'Florea Florist Flowers & Gift Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florea Florist | Buket Mewah Terbaik & Flowers and Gift',
    description:
      'Pesan buket original, buket pria/wanita, dan kado terbaik pasangan untuk wisuda & ulang tahun dari Florea Florist.',
    images: ['/logo-transparent.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialProducts = await getProducts();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Florist',
        '@id': `${siteUrl}/#florist`,
        name: 'Florea Florist',
        alternateName: [
          'Florea',
          'Florea Bouquet',
          'Florea Flowers and Gift',
          'Florea Buket',
          'Floréa Florist',
        ],
        description:
          'Florea Florist adalah studio bunga dan hadiah mewah terbaik yang menyediakan buket original, buket pria, buket wanita, preserved flower abadi, serta gift terbaik pasangan untuk wisuda dan ulang tahun.',
        image: `${siteUrl}/logo-transparent.png`,
        logo: `${siteUrl}/logo-transparent.png`,
        url: siteUrl,
        telephone: '+62895705032933',
        priceRange: 'Rp 45.000 - Rp 350.000',
        currenciesAccepted: 'IDR',
        paymentAccepted: 'Cash, Bank Transfer, QRIS',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jl. Raya Curug No.60, Curug, Kec. Bojongsari',
          addressLocality: 'Depok',
          addressRegion: 'Jawa Barat',
          postalCode: '16517',
          addressCountry: 'ID',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -6.4024844,
          longitude: 106.7441584,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '08:30',
            closes: '21:00',
          },
        ],
        sameAs: [
          'https://wa.me/62895705032933',
          'https://www.instagram.com/floreabouquet.co',
          'https://tiktok.com',
          'https://shopee.co.id',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Katalog Buket & Bunga Florea',
          itemListElement: [
            {
              '@type': 'OfferCatalog',
              name: 'Buket Mewah Terbaik & Original',
            },
            {
              '@type': 'OfferCatalog',
              name: 'Buket Pria & Buket Wanita',
            },
            {
              '@type': 'OfferCatalog',
              name: 'Hadiah Wisuda & Ulang Tahun',
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Florea Florist',
        alternateName: 'Florea Flowers and Gift',
        description: 'Toko Buket Mewah Terbaik, Bunga Sutra Premium & Gift Terbaik Pasangan',
        publisher: {
          '@id': `${siteUrl}/#florist`,
        },
        inLanguage: 'id-ID',
      },
    ],
  };

  return (
    <html lang="id" className={`scroll-smooth ${cormorant.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#FAF8F5] text-stone-900 antialiased selection:bg-rose-100 selection:text-rose-900 min-h-screen flex flex-col">
        <ScrollRevealInit />
        <AdminProvider initialProducts={initialProducts}>{children}</AdminProvider>
      </body>
    </html>
  );
}
