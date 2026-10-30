import { createClient } from './client';
import { Product } from '@/data/products';
import { unstable_cache } from 'next/cache';

// Mapping helper dari snake_case (Supabase) ke camelCase (TypeScript Product)
export function mapSupabaseToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label || undefined,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: row.image,
    gallery: row.gallery || [],
    isPopular: Boolean(row.is_popular),
    material: row.material || '',
    durability: row.durability || '',
    description: row.description || '',
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : true,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count ? Number(row.review_count) : 0,
    sku: row.sku || undefined,
    sizes: row.sizes || [],
    colors: row.colors || [],
    details: row.details || {},
  };
}

// Mapping ke format Supabase saat simpan/update
export function mapProductToSupabase(p: Partial<Product>) {
  const payload: any = {};
  if (p.id !== undefined) payload.id = p.id;
  if (p.name !== undefined) payload.name = p.name;
  if (p.category !== undefined) payload.category = p.category;
  if (p.categoryLabel !== undefined) payload.category_label = p.categoryLabel;
  if (p.price !== undefined) payload.price = p.price;
  if (p.originalPrice !== undefined) payload.original_price = p.originalPrice;
  if (p.image !== undefined) payload.image = p.image;
  if (p.gallery !== undefined) payload.gallery = p.gallery;
  if (p.isPopular !== undefined) payload.is_popular = p.isPopular;
  if (p.material !== undefined) payload.material = p.material;
  if (p.durability !== undefined) payload.durability = p.durability;
  if (p.description !== undefined) payload.description = p.description;
  if (p.inStock !== undefined) payload.in_stock = p.inStock;
  if (p.rating !== undefined) payload.rating = p.rating;
  if (p.reviewCount !== undefined) payload.review_count = p.reviewCount;
  if (p.sku !== undefined) payload.sku = p.sku;
  if (p.sizes !== undefined) payload.sizes = p.sizes;
  if (p.colors !== undefined) payload.colors = p.colors;
  if (p.details !== undefined) payload.details = p.details;
  return payload;
}

// Internal raw fetch products
async function fetchProductsRaw(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error.message);
      return [];
    }
    return (data || []).map(mapSupabaseToProduct);
  } catch (err) {
    console.error('Fetch products raw error:', err);
    return [];
  }
}

// Internal raw fetch product by ID
async function fetchProductByIdRaw(id: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }
    return mapSupabaseToProduct(data);
  } catch (err) {
    console.error('Fetch product by ID raw error:', err);
    return null;
  }
}

// 1. Get All Products (Cached with SWR revalidate for instant response)
export const getCachedProducts = unstable_cache(
  async () => fetchProductsRaw(),
  ['all-products-cache'],
  { revalidate: 30, tags: ['products'] }
);

export async function getProducts(): Promise<Product[]> {
  // Jika di lingkungan Next.js server, gunakan unstable_cache
  if (typeof window === 'undefined') {
    return getCachedProducts();
  }
  return fetchProductsRaw();
}

// 2. Get Single Product by ID (Cached)
export async function getProductById(id: string): Promise<Product | null> {
  if (typeof window === 'undefined') {
    return unstable_cache(
      async (prodId: string) => fetchProductByIdRaw(prodId),
      [`product-${id}`],
      { revalidate: 60, tags: ['products', `product-${id}`] }
    )(id);
  }
  return fetchProductByIdRaw(id);
}

// 3. Create Product
export async function createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product | null> {
  const supabase = createClient();
  const slugId = product.id || (
    product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `prod-${Date.now()}`
  ) + `-${Date.now().toString().slice(-4)}`;

  const payload = mapProductToSupabase({ ...product, id: slugId });
  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error inserting product:', error.message);
    throw new Error(error.message);
  }
  return mapSupabaseToProduct(data);
}

// 4. Update Product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const supabase = createClient();
  const payload = mapProductToSupabase(updates);
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error.message);
    throw new Error(error.message);
  }
  return mapSupabaseToProduct(data);
}

// 5. Delete Product
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error.message);
    throw new Error(error.message);
  }
  return true;
}
