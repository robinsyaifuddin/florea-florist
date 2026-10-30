import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AdminProvider } from '@/context/AdminContext';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://floreaflorist.com';

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Floréa Florist | Atelier Buket Bunga Sutra Premium, Wisuda & Preserved Flower',
    template: '%s | Floréa Florist',
  },
  description:
    'Floréa Florist Atelier: Menghadirkan pengalaman berkesan dengan buket bunga sutra premium, buket wisuda prestisius, preserved flower, dan bloom box abadi. Pengiriman aman seluruh Indonesia.',
  keywords: [
    'buket bunga',
    'toko buket terdekat',
    'buket bunga wisuda',
    'bunga artificial premium',
    'buket bunga sutra',
    'preserved flower mewah',
    'bloom box bunga elegan',
    'florist eksklusif jakarta depok',
    'buket bunga abadi',
    'hadiah wisuda berkelas',
    'buket anniversary',
    'florea florist',
  ],
  authors: [{ name: 'Floréa Florist' }],
  creator: 'Floréa Florist',
  publisher: 'Floréa Florist',
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
    siteName: 'Floréa Florist',
    title: 'Floréa Florist | Toko Buket Bunga Wisuda, Artificial & Preserved Flower',
    description:
      'Koleksi buket bunga artificial premium, buket wisuda, dan preserved bloom box elegan tahan selamanya. Bisa kirim ke seluruh Indonesia.',
    images: [
      {
        url: '/logo-transparent.png',
        width: 800,
        height: 800,
        alt: 'Floréa Florist Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Floréa Florist | Buket Bunga Wisuda & Artificial Premium',
    description:
      'Pesan buket bunga artificial berkualitas tinggi, buket wisuda, dan hadiah bunga abadi dari Floréa Florist.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: 'Floréa Florist',
    image: `${siteUrl}/logo-transparent.png`,
    '@id': `${siteUrl}/#florist`,
    url: siteUrl,
    telephone: '+62895705032933',
    priceRange: 'Rp 45.000 - Rp 350.000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
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
    sameAs: ['https://wa.me/62895705032933'],
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
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
