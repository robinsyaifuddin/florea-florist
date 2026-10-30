import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Layanan Eksklusif & Informasi Atelier | Floréa Florist',
  description: 'Layanan konsultasi concierge Floréa Florist, lokasi atelier workshop, jadwal pemesanan, kontak resmi WhatsApp, dan panduan reservasi buket abadi.',
};

const faqs = [
  {
    q: 'Apakah keindahan dan bentuk rangkaian bunga ini bertahan selamanya?',
    a: 'Tentu. Seluruh mahakarya Floréa dikurasi khusus menggunakan perpaduan silk sutra velvet grade couture dan preserved botanical foliage. Rangkaian ini tidak akan pernah layu, tidak membutuhkan air, bebas serbuk sari, dan rona warnanya tetap anggun sepanjang masa.'
  },
  {
    q: 'Dapatkah saya mengkustomisasi nuansa warna wrap, jenis bunga, dan pita?',
    a: 'Dengan senang hati. Atelier kami memberikan kebebasan bagi Anda untuk mengombinasikan warna Korean matte paper, warna pita satin, hingga jenis bunga sesuai impresi dan pesan mendalam yang ingin Anda sampaikan.'
  },
  {
    q: 'Bagaimana keamanan pengiriman jarak jauh ke luar kota di seluruh Indonesia?',
    a: 'Setiap karya dilindungi hard-box struktural double-wall khusus anti guncang dengan dudukan presisi. Kami menjamin buket sampai di tangan penerima di seluruh Indonesia dalam kondisi prima, megah, dan sempurna.'
  },
  {
    q: 'Berapa lama estimasi pengerjaan dan pengiriman sampai ke tujuan?',
    a: 'Untuk koleksi kurasi siap kirim, kami menyediakan layanan Same-Day Delivery instan. Sementara untuk kreasi kustom personal, Master Florist kami memerlukan waktu 1–2 hari kerja untuk merangkai setiap helai dengan ketelitian tertinggi.'
  },
  {
    q: 'Bagaimana langkah termudah untuk melakukan reservasi atau konsultasi?',
    a: 'Anda dapat menekan tombol konsultasi atau reservasi di katalog untuk langsung terhubung dengan Concierge WhatsApp kami. Kami akan mendampingi Anda memilih rangkaian yang paling merepresentasikan perasaan Anda.'
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb & Hero Header */}
        <section className="bg-white border-b border-stone-200/80 pt-8 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
              <Link href="/" className="hover:text-stone-900 transition">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[#E60067]">Hubungi Kami & Studio Info</span>
            </nav>

            <div className="max-w-3xl">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#E60067] uppercase mb-3 block">
                Concierge & Informasi Atelier
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight mb-4">
                Konsultasikan Mahakarya Anda & <br className="hidden sm:inline" />
                <span className="italic font-serif text-[#E60067]">Atelier Floréa Florist</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Kami siap mendampingi Anda memilih atau merancang rangkaian floral terbaik untuk menyentuh hati seseorang yang paling berharga.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Kontak Cepat & Info Perusahaan */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Kolom Kiri: Detail Kontak & Jam Kerja */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
                  <h2 className="text-lg font-serif font-semibold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                    Layanan Konsultasi Pribadi & Reservasi
                  </h2>

                  <div className="space-y-5">
                    {/* WhatsApp */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E60067] flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 font-medium">WhatsApp Concierge (Respon Cepat)</p>
                        <a 
                          href="https://wa.me/62895705032933?text=Halo%20Flor%C3%A9a%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20buket"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm sm:text-base font-semibold text-stone-900 hover:text-[#E60067] transition block mt-0.5"
                        >
                          +62 895-7050-32933
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E60067] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 font-medium">Email Informasi & Kerjasama</p>
                        <a 
                          href="mailto:contact@floreaflorist.com"
                          className="text-sm sm:text-base font-semibold text-stone-900 hover:text-[#E60067] transition block mt-0.5"
                        >
                          contact@floreaflorist.com
                        </a>
                      </div>
                    </div>

                    {/* Jam Operasional */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E60067] flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 font-medium">Jam Pelayanan Florist</p>
                        <p className="text-sm font-semibold text-stone-900 mt-0.5">Senin - Minggu: 08.30 - 21.00 WIB</p>
                        <p className="text-xs text-stone-500 mt-0.5">Pengiriman Instan & Same-Day siap kirim tiap hari</p>
                      </div>
                    </div>

                    {/* Alamat Studio */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E60067] flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 font-medium">Studio & Workshop Perangkaian</p>
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 mt-0.5 leading-relaxed">
                          Floréa Florist Studio & Workshop
                        </p>
                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-1">
                          Jl. Raya Curug No.60, Curug, Kec. Bojongsari, Kota Depok, Jawa Barat 16517
                        </p>
                        <p className="text-xs text-stone-500 leading-relaxed mt-1">
                          Pusat perangkaian buket bunga abadi & workshop bunga artificial kualitas premium. Melayani kurir instan lokal dan pengiriman ekspedisi ke seluruh Indonesia.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <a
                      href="https://wa.me/62895705032933?text=Halo%20Flor%C3%A9a%20Florist,%20saya%20ingin%20tanya%20informasi%20pemesanan%20buket"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.98]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat WhatsApp Florist Sekarang</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Google Maps Interactive Embed */}
              <div className="lg:col-span-7">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs h-full flex flex-col">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-serif font-semibold text-stone-900 leading-snug">
                        Peta Lokasi Studio
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Area operasional workshop perangkaian dan pengiriman buket
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[#E60067] bg-pink-50 px-3 py-1 rounded-full border border-pink-200/60 whitespace-nowrap">
                      Buka Sekarang
                    </span>
                  </div>

                  {/* Interactive Map Container */}
                  <div className="relative w-full h-[380px] sm:h-[440px] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 mt-2">
                    <iframe
                      title="Lokasi Floréa Florist Studio Bojongsari Depok"
                      src="https://maps.google.com/maps?q=Jl.%20Raya%20Curug%20No.60,%20Curug,%20Kec.%20Bojongsari,%20Kota%20Depok,%20Jawa%20Barat%2016517&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full grayscale-[10%] contrast-[1.05]"
                    />
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 pt-3 border-t border-stone-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E60067] shrink-0" />
                      <span>Bojongsari, Kota Depok</span>
                    </span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Jl.+Raya+Curug+No.60,+Curug,+Kec.+Bojongsari,+Kota+Depok,+Jawa+Barat+16517"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E60067] font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                    >
                      Buka di Google Maps →
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section: FAQ Pertanyaan yang Sering Diajukan */}
        <section className="py-14 sm:py-20 bg-white border-t border-stone-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 text-[#E60067] mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2">
                Jawaban seputar buket bunga artificial, proses custom, serta tata cara pengiriman Floréa.
              </p>
            </div>

            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-6 sm:py-7">
                  <h3 className="text-sm sm:text-base font-semibold text-stone-900 flex items-start gap-3">
                    <span className="text-xs font-mono font-medium text-[#E60067] bg-rose-50 px-2 py-0.5 rounded mt-0.5">
                      Q{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed mt-2.5 pl-8 sm:pl-9">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Banner Bantuan Chat Tambahan */}
            <div className="mt-12 text-center bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-stone-200/80">
              <h4 className="text-base font-serif font-medium text-stone-900 mb-2">
                Masih punya pertanyaan lain seputar pesanan Anda?
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-5">
                Florist kami selalu senang berdiskusi dan membantu mencocokkan buket yang pas untuk momen Anda.
              </p>
              <a
                href="https://wa.me/62895705032933?text=Halo%20Flor%C3%A9a%20Florist,%20saya%20mau%20tanya-tanya%20seputar%20buket"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold transition shadow-xs active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasikan dengan Florist Kami</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
