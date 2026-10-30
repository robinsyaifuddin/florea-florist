import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase/products';

export const revalidate = 60; // Cache di edge/server Next.js selama 60 detik

export async function GET(request: Request) {
  try {
    const products = await getProducts();
    
    // Buat ETag fingerprint sederhana berdasarkan jumlah produk dan update ID
    const signature = products.map((p) => `${p.id}:${p.price}:${p.isPopular}`).join('|');
    let hash = 0;
    for (let i = 0; i < signature.length; i++) {
      hash = (hash << 5) - hash + signature.charCodeAt(i);
      hash |= 0;
    }
    const etag = `W/"prod-${hash}"`;

    const clientIfNoneMatch = request.headers.get('if-none-match');
    if (clientIfNoneMatch === etag) {
      // Data di perangkat user masih sama persis! Kirim 304 Not Modified (0 byte transfer)
      return new NextResponse(null, { status: 304 });
    }

    // Response dengan Cache-Control SWR + ETag
    return NextResponse.json(products, {
      status: 200,
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('API /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
