'use client';

import { useState } from 'react';
import { X, Send, Sparkles, Clock, ShieldCheck, HeartHandshake, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Product, getCategoryLabel } from '@/data/products';

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickOrderModal({ product, onClose }: QuickOrderModalProps) {
  const [recipientName, setRecipientName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Pagi (09.00 - 12.00)');
  const [cardMessage, setCardMessage] = useState('');
  const [wrapColor, setWrapColor] = useState('Signature Neutral (Rekomendasi Florist)');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!product) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNumber = '62895705032933'; // Nomor CS Florist
    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://florea.web.id';
    const productLink = `${siteOrigin}/product/${product.id}`;

    const message = `*PESANAN BUKET FLOREA FLORIST*

• *Item*: ${product.name}
• *Kategori*: ${getCategoryLabel(product)}
• *Harga*: ${formatPrice(product.price)}
• *Tipe Wrapping*: ${wrapColor}
• *Tautan Produk*: ${productLink}

*DETAIL PENGIRIMAN*:
• *Nama Penerima*: ${recipientName || '-'}
• *Alamat Kirim*: ${deliveryAddress || 'Ambil di Studio / Belum Ditentukan'}
• *Jadwal Kirim*: ${deliveryDate || 'Hari ini / Segera'} (${deliveryTime})

*PESAN KARTU UCAPAN*:
"${cardMessage || 'Kosongkan kartu'}"

Mohon konfirmasi ketersediaan slot rangkaian untuk jadwal di atas. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-stone-200 shadow-xl flex flex-col max-h-[92vh] animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 className="font-serif font-semibold text-lg text-stone-900">
              Pemesanan Rangkaian Eksklusif
            </h3>
            <p className="text-[11px] text-stone-500 font-sans">
              Terhubung langsung dengan Master Florist kami via WhatsApp Concierge
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Item Preview Card */}
          <div className="flex gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 items-center">
            <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-200 flex items-center justify-center">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-stone-400" />
              )}
            </div>
            <div className="flex-grow">
              <span className="text-[10px] uppercase tracking-wider text-rose-800 font-semibold">
                {getCategoryLabel(product)}
              </span>
              <h4 className="font-serif font-medium text-stone-900 text-sm line-clamp-1">
                {product.name}
              </h4>
              <p className="text-sm font-semibold text-stone-900 mt-1">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSendToWhatsApp} className="space-y-4 text-xs font-medium text-stone-700">
            <div>
              <label className="block mb-1.5 font-semibold text-stone-900">
                Pilihan Signature Wrap & Ribbons
              </label>
              <select
                value={wrapColor}
                onChange={(e) => setWrapColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:border-stone-900 transition"
              >
                <option value="Signature Neutral (Rekomendasi Florist)">
                  Signature Neutral (Rekomendasi Florist)
                </option>
                <option value="Soft Blush Rose & Champagne Silk">
                  Soft Blush Rose & Champagne Silk
                </option>
                <option value="Pure Snow White & Translucent Wrap">
                  Pure Snow White & Translucent Wrap
                </option>
                <option value="Midnight Charcoal & Satin Gold">
                  Midnight Charcoal & Satin Gold
                </option>
                <option value="Earthy Kraft & Jute Minimalist">
                  Earthy Kraft & Jute Minimalist
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 font-semibold text-stone-900">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama orang terkasih"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-stone-900">
                  Tanggal Pengiriman
                </label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 font-semibold text-stone-900">
                  Slot Waktu Pengantaran
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:border-stone-900 transition"
                >
                  <option value="Pagi (09.00 - 12.00)">Pagi (09.00 - 12.00)</option>
                  <option value="Siang (13.00 - 16.00)">Siang (13.00 - 16.00)</option>
                  <option value="Sore/Malam (16.00 - 19.30)">Sore/Malam (16.00 - 19.30)</option>
                  <option value="Fleksibel Seharian">Fleksibel Seharian</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-stone-900">
                  Area / Alamat Singkat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Senopati, Jaksel"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-semibold text-stone-900">
                Pesan Personal di Kartu Kaligrafi (Gratis)
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan ungkapan tulus dan bermakna Anda untuk orang tersayang..."
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 transition text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#E60067] hover:bg-[#CC005A] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-sm mt-3"
            >
              Lanjutkan Pemesanan ke WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
