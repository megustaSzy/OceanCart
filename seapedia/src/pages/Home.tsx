import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-50 rounded-l-[100px] opacity-50 transform translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <header className="text-center max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-6 border border-blue-200">
              🚀 Platform Hasil Laut Terbesar di Indonesia
            </span>
            <h1 id="hero-heading" className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
              Dari Laut Langsung <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Ke Meja Makan Anda
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              Marketplace inovatif yang menghubungkan nelayan langsung dengan pembeli, tanpa perantara. Didukung sistem pengiriman cepat dan transaksi super aman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                Belanja Sekarang <ArrowRight size={20} />
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-sm border border-gray-200 transition-all text-center">
                  Daftar sebagai Penjual
                </Link>
              )}
            </div>
          </header>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-gray-50 py-24" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">Mengapa Memilih OceanCart?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Sistem terintegrasi yang memastikan setiap pihak mendapatkan keuntungan dan kenyamanan maksimal.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <article className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transaksi Aman</h3>
              <p className="text-gray-500 leading-relaxed">
                Uang Anda aman bersama sistem rekber OceanCart. Dana baru akan diteruskan ke penjual ketika barang sudah Anda terima dengan baik.
              </p>
            </article>
            {/* Card 2 */}
            <article className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck size={32} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pengiriman Cepat</h3>
              <p className="text-gray-500 leading-relaxed">
                Terintegrasi langsung dengan puluhan kurir lokal pesisir yang siap menjemput tangkapan ikan hari ini dan mengantarkannya ke depan pintu Anda.
              </p>
            </article>
            {/* Card 3 */}
            <article className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={32} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ekosistem Multi-Role</h3>
              <p className="text-gray-500 leading-relaxed">
                Satu aplikasi, banyak peran. Gunakan akun yang sama untuk berbelanja, berjualan hasil tangkapan, atau mendaftar sebagai mitra kurir kami.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
