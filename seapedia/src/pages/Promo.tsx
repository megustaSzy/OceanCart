import { Ticket, Copy, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function Promo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-vouchers'],
    queryFn: () => api.get('/vouchers')
  });

  const promos = Array.isArray(data?.data) ? data.data : [];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kode voucher ${code} berhasil disalin!`);
  };

  const getGradientColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-orange-500 to-red-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Promo & Voucher</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Nikmati berbagai penawaran menarik dari OceanCart. Gunakan kode voucher di bawah ini saat checkout untuk mendapatkan potongan harga.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-blue-500">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          Gagal memuat promo. Silakan coba lagi nanti.
        </div>
      ) : promos.length === 0 ? (
        <section className="text-center py-20" aria-label="Status Promo">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Ticket className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada promo</h2>
          <p className="text-gray-500">Saat ini belum ada kode voucher yang tersedia.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Daftar Promo">
          {promos.map((promo: any, index: number) => (
            <article key={promo.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col group">
              <div className={`h-32 bg-gradient-to-br ${getGradientColor(index)} p-6 relative overflow-hidden`}>
                <Ticket className="absolute -right-6 -bottom-6 text-white opacity-20 w-32 h-32 transform -rotate-12 group-hover:scale-110 transition-transform" />
                <div className="relative z-10 flex flex-col justify-center h-full">
                  <span className="text-white/80 font-bold text-sm mb-1 uppercase tracking-wider">Kode Voucher</span>
                  <span className="text-white font-extrabold text-2xl tracking-widest">{promo.code}</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Potongan Rp {parseInt(promo.discount).toLocaleString('id-ID')}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  {promo.description || `Dapatkan potongan sebesar Rp ${parseInt(promo.discount).toLocaleString('id-ID')} untuk transaksimu. Kuota terbatas, tersisa ${promo.remainingUsage} kali pemakaian!`}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs font-bold text-gray-400">
                    Berlaku s/d <br/> <span className="text-gray-700">{new Date(promo.expiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(promo.code)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors text-sm"
                  >
                    <Copy size={16} /> Salin
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
