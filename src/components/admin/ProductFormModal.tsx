'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Product, CATEGORY_LABELS } from '@/data/products';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
  initialProduct?: Product | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  // Basic Info
  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState<Product['category']>(
    initialProduct?.category || 'artistic'
  );
  const [price, setPrice] = useState<number | ''>(
    initialProduct ? initialProduct.price : ''
  );
  const [originalPrice, setOriginalPrice] = useState<number | ''>(
    initialProduct?.originalPrice ?? ''
  );
  const [isPopular, setIsPopular] = useState<boolean>(
    initialProduct?.isPopular || false
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ''
  );

  // Gallery & Image Upload
  const [mainImage, setMainImage] = useState(initialProduct?.image || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper konversi file/blob gambar ke format WebP super ringan & tajam
  const convertToWebP = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new (window as any).Image();
      const objectUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let originW = img.naturalWidth || img.width;
        let originH = img.naturalHeight || img.height;

        // Optimasi dimensi: max 1280px (sangat tajam untuk katalog e-commerce, namun memangkas 80-90% bobot memori)
        const maxDimension = 1280;
        let targetW = originW;
        let targetH = originH;

        if (originW > maxDimension || originH > maxDimension) {
          if (originW >= originH) {
            targetW = maxDimension;
            targetH = Math.round((originH * maxDimension) / originW);
          } else {
            targetH = maxDimension;
            targetW = Math.round((originW * maxDimension) / originH);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia'));
          return;
        }

        // Rendering piksel halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Ekspor ke format WebP terkompresi efisien (kualitas 0.82: visual jernih & bobot file sangat ringan ~40-90KB)
        const webpDataUrl = canvas.toDataURL('image/webp', 0.82);
        resolve(webpDataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Gagal memuat gambar ke canvas'));
      };
      img.src = objectUrl;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isHeic =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    const isGeneralImage =
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp|gif|svg|bmp|avif|tiff?)$/i.test(fileName);

    if (!isHeic && !isGeneralImage) {
      setUploadError('Harap pilih file gambar (JPG, PNG, WEBP, HEIC/iPhone, dsb).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 25MB.');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    try {
      let sourceBlob: Blob = file;

      if (isHeic) {
        // Konversi format iPhone HEIC/HEIF ke JPEG HD berkualitas tinggi (0.95)
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.95,
        });
        sourceBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      // Konversi otomatis semua format gambar ke WebP HD (0.92) tanpa merusak ketajaman
      const webpResult = await convertToWebP(sourceBlob);
      setMainImage(webpResult);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('Error converting image to WebP:', err);
      // Fallback: baca langsung jika browser sangat lama tidak mendukung canvas WebP
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMainImage(reader.result);
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setUploadError('Gagal memproses gambar. Silakan coba lagi.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sizes / Kemewahan Rangkaian
  const [sizes, setSizes] = useState<Array<{ id: string; name: string; price: number | '' }>>(
    initialProduct?.sizes && initialProduct.sizes.length > 0
      ? initialProduct.sizes
      : [
          { id: 'standard', name: '', price: '' },
          { id: 'deluxe', name: '', price: '' },
          { id: 'premium', name: '', price: '' },
        ]
  );

  // Specifications
  const [material, setMaterial] = useState(
    initialProduct?.material || ''
  );
  const [durability, setDurability] = useState(
    initialProduct?.durability || ''
  );
  const [arrangementStyle, setArrangementStyle] = useState(
    initialProduct?.details?.arrangementStyle || ''
  );
  const [packaging, setPackaging] = useState(
    initialProduct?.details?.packaging || ''
  );
  const [occasion, setOccasion] = useState(
    initialProduct?.details?.occasion || ''
  );

  const handleSizeChange = (index: number, field: 'name' | 'price', val: string | number) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: val };
    setSizes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload: any = {
      ...(initialProduct ? { id: initialProduct.id } : {}),
      name,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'Pesona Puspa Abadi (Koleksi Buket Bunga Artistik)',
      price: price === '' ? 0 : Number(price),
      originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
      isPopular,
      material,
      durability,
      image: mainImage || '',
      gallery: mainImage ? [mainImage] : [],
      description,
      sizes: sizes.map((s) => ({
        ...s,
        price: s.price === '' ? 0 : Number(s.price),
      })),
      details: {
        flowerType: material,
        bouquetSize: 'Tinggi ~45cm x Lebar ~35cm',
        arrangementStyle,
        packaging,
        occasion,
      },
    };

    onSave(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-stone-200/90 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div>
            <h3 className="text-base font-semibold text-stone-900 font-serif">
              {initialProduct ? 'Sunting Mahakarya Katalog' : 'Tambah Mahakarya Baru'}
            </h3>
            <p className="text-xs text-stone-500">
              Format detail katalog terkalibrasi dengan halaman detail produk Florea
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Section 1: Identitas Produk */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E60067]">
              Informasi Utama & Harga
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Mahakarya (Judul)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Timeless White Botanical Ensemble"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Kategori Utama
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const cat = e.target.value as Product['category'];
                    setCategory(cat);
                  }}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067] bg-white"
                >
                  <option value="artistic">Buket Bunga Artistik</option>
                  <option value="celebration">Perayaan & Momen</option>
                  <option value="personal">Personalisasi & Hadiah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Harga Utama (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={5000}
                  value={price}
                  placeholder="Misal: 220000"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const val = raw === '' ? '' : Number(raw);
                    setPrice(val);
                    // auto sync standard size price if standard exists
                    setSizes((prev) =>
                      prev.map((s, idx) => (idx === 0 ? { ...s, price: val } : s))
                    );
                  }}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Harga Coret / Asli (Opsional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={originalPrice}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setOriginalPrice(raw === '' ? '' : Number(raw));
                  }}
                  placeholder="Misal: 270000"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067]"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 text-[#E60067] rounded border-stone-300 focus:ring-[#E60067]"
                />
                <label htmlFor="isPopular" className="text-xs font-medium text-stone-800 cursor-pointer">
                  Tampilkan Badge Favorit / Populer di katalog
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Deskripsi Puitis & Makna Rangkaian
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kemurnian hydrangea putih dalam harmoni Korean wrapping minimalis..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067] resize-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Section 2: Foto Utama Mahakarya */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E60067]">
              Foto Mahakarya (Single Showcase)
            </h4>
            <p className="text-[11px] text-stone-400">
              Unggah file foto buket langsung dari perangkat Anda (semua format termasuk HEIC/iPhone).
            </p>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              {/* Kolom Kiri: Pratinjau Foto */}
              <div className="w-20 h-20 relative rounded-xl border border-stone-200 overflow-hidden shrink-0 bg-stone-100 flex items-center justify-center shadow-2xs">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt="Preview Foto Mahakarya"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-stone-400" />
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Tombol Upload & Info */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.heic,.heif"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-medium shadow-xs transition active:scale-[0.98] cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Mengompres WebP...' : mainImage ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                  </button>
                </div>

                <p className="text-[10px] text-stone-400">
                  Otomatis dikonversi ke format WebP super ringan & tajam untuk loading katalog cepat.
                </p>

                {uploadError && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Section 3: Dimensi & Kemewahan Rangkaian (Ukuran & Varian Harga) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E60067]">
              Opsi Dimensi & Kemewahan Rangkaian
            </h4>
            <p className="text-[11px] text-stone-400">
              Format pilihan ukuran yang tampil sebagai kartu opsi di samping foto (Standard, Deluxe, Premium).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sizes.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Opsi {idx + 1}
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Label Opsi</label>
                    <input
                      type="text"
                      value={s.name}
                      placeholder={idx === 0 ? 'Standard' : idx === 1 ? 'Deluxe' : 'Premium'}
                      onChange={(e) => handleSizeChange(idx, 'name', e.target.value)}
                      className="w-full text-xs p-1.5 rounded border border-stone-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Harga Opsi (Rp)</label>
                    <input
                      type="number"
                      value={s.price}
                      placeholder="0"
                      onChange={(e) => {
                        const raw = e.target.value;
                        handleSizeChange(idx, 'price', raw === '' ? '' : Number(raw));
                      }}
                      className="w-full text-xs p-1.5 rounded border border-stone-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Section 4: Detail Mahakarya & Spesifikasi (Sesuai Tabel di Gambar) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E60067]">
              Detail Mahakarya & Tabel Spesifikasi
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Kategori & Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Misal: Textured Fabric & Real Touch Stem"
                  className="w-full text-xs sm:text-sm p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Gaya Rangkaian
                </label>
                <input
                  type="text"
                  value={arrangementStyle}
                  onChange={(e) => setArrangementStyle(e.target.value)}
                  placeholder="Misal: Korean Haute Couture Floral Architecture"
                  className="w-full text-xs sm:text-sm p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Kemasan & Sentuhan Akhir
                </label>
                <input
                  type="text"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  placeholder="Misal: Premium Matte Wrapping Paper, Pita Satin Lembut & Kartu Kaligrafi"
                  className="w-full text-xs sm:text-sm p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Momen Paling Tepat
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Misal: Wisuda Kehormatan, Anniversary, Pernikahan..."
                  className="w-full text-xs sm:text-sm p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#E60067]"
                />
              </div>
            </div>
          </div>

          {/* Footer Form Action */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#E60067] hover:bg-[#CC005A] text-white text-xs font-semibold tracking-wide shadow-xs active:scale-98 transition cursor-pointer"
            >
              {initialProduct ? 'Simpan Perubahan' : 'Terbitkan Mahakarya'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
