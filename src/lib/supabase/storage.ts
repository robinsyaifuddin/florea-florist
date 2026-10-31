import { createClient } from './client';

export const BUCKET_NAME = 'florea-products';

/**
 * Upload gambar produk (File atau Blob WebP) ke Supabase Storage
 * @param file File atau Blob binary dari input form
 * @param pathName path atau nama file khusus (opsional)
 * @returns public URL dari gambar yang diupload
 */
export async function uploadProductImage(file: File | Blob, pathName?: string): Promise<string> {
  const supabase = createClient();
  const fileExt = (file instanceof File ? file.name.split('.').pop() : 'webp') || 'webp';
  const fileName = pathName || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const contentType = file.type || (fileExt === 'webp' ? 'image/webp' : 'image/jpeg');

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType,
      cacheControl: '31536000',
      upsert: true,
    });

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError.message);
    throw new Error(uploadError.message);
  }

  // Ambil URL Publik
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Helper untuk mendapatkan public URL langsung berdasarkan filePath
 */
export function getProductImageUrl(filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  return data.publicUrl;
}
