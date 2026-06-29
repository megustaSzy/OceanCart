import { Anchor, Users, Truck, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Tentang OceanCart</h1>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Kami adalah platform marketplace hasil laut pertama di Indonesia yang menghubungkan 
          nelayan pesisir langsung ke meja makan Anda, tanpa perantara yang menaikkan harga.
        </p>
      </header>

      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-10 md:p-16 text-white text-center mb-16 shadow-2xl relative overflow-hidden" aria-labelledby="vision-heading">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <h2 id="vision-heading" className="text-3xl font-bold mb-4 relative z-10">Visi Kami</h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto relative z-10 leading-relaxed">
          Menjadi ekosistem digital terdepan yang memberdayakan nelayan lokal, menjamin kesegaran produk laut, 
          dan memberikan pengalaman berbelanja seafood yang transparan, cepat, dan terpercaya.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" aria-label="Statistik Platform">
        {[
          { label: 'Nelayan Terdaftar', value: '500+' },
          { label: 'Produk Tersedia', value: '1,200+' },
          { label: 'Kota Terjangkau', value: '50+' },
          { label: 'Pesanan Selesai', value: '25,000+' },
        ].map((stat) => (
          <article key={stat.label} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-extrabold text-blue-600 mb-2">{stat.value}</div>
            <h3 className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</h3>
          </article>
        ))}
      </section>

      <section className="mb-16">
        <header>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Bagaimana OceanCart Bekerja?</h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <article className="text-center group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 transition-colors">
              <Anchor size={40} className="text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold text-lg -mt-8 mb-6 shadow-lg border-4 border-white relative z-10">1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Nelayan Menjual</h3>
            <p className="text-gray-500 leading-relaxed">Nelayan dan penjual ikan mendaftarkan toko mereka lalu mengunggah produk tangkapan segar.</p>
          </article>
          <article className="text-center group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors">
              <Users size={40} className="text-green-500 group-hover:text-white transition-colors" />
            </div>
            <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold text-lg -mt-8 mb-6 shadow-lg border-4 border-white relative z-10">2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pembeli Memesan</h3>
            <p className="text-gray-500 leading-relaxed">Pembeli memilih produk, memasukkan ke keranjang, dan membayar melalui dompet OceanCartPay.</p>
          </article>
          <article className="text-center group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
              <Truck size={40} className="text-orange-500 group-hover:text-white transition-colors" />
            </div>
            <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold text-lg -mt-8 mb-6 shadow-lg border-4 border-white relative z-10">3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Kurir Mengantar</h3>
            <p className="text-gray-500 leading-relaxed">Kurir mengambil pesanan dari toko dan mengantarkannya langsung ke pintu rumah Anda.</p>
          </article>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center" aria-labelledby="security-heading">
        <ShieldCheck size={64} className="text-blue-500 mx-auto mb-6" aria-hidden="true" />
        <h2 id="security-heading" className="text-3xl font-extrabold text-gray-900 mb-4">Dijamin Aman & Terpercaya</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Setiap transaksi dilindungi oleh sistem rekber (Rekening Bersama). Uang Anda tidak akan diteruskan 
          ke penjual sampai pesanan berhasil diterima. Keamanan akun dijamin dengan teknologi HttpOnly Cookies.
        </p>
      </section>
    </main>
  );
}
