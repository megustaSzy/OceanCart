import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function Products() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, debouncedSearch],
    queryFn: () => api.get(`/products?page=${page}&limit=${limit}&search=${debouncedSearch}`),
    // Reset page to 1 if search changes
  });

  const productsData = Array.isArray((data as any)?.data) ? (data as any).data : [];
  const meta = (data as any)?.metadata || { totalPages: 1, page: 1 };
  
  // No longer need client-side filtering
  const filteredProducts = productsData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Marketplace Hasil Laut</h1>
          <p className="text-gray-500">Temukan tangkapan segar berkualitas tinggi dari nelayan lokal.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            aria-label="Cari Produk"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Cari Ikan Tongkol, Cumi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page when typing new search
            }}
          />
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <section className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" aria-label="Status Pencarian">
          <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan.</p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12" aria-label="Daftar Produk">
            {filteredProducts.map((product: any) => (
              <article key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group flex flex-col">
                <Link to={`/products/${product.id}`} className="flex-1 flex flex-col outline-none focus:ring-2 focus:ring-blue-500 rounded-3xl">
                  <div className="h-52 overflow-hidden bg-gray-100 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-blue-50 group-hover:bg-blue-100 transition-colors">🐟</div>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                      Sisa {product.stock}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="bg-blue-50 p-1 rounded-md text-blue-600">
                      <Store size={12} />
                    </div>
                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider truncate">
                      {product.store?.storeName || 'Toko Umum'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <p className="text-xl font-extrabold text-gray-900 mb-4 mt-auto">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </p>
                  <div className="w-full text-center bg-blue-50 text-blue-600 font-bold py-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors" aria-hidden="true">
                    Lihat Detail
                  </div>
                </div>
                </Link>
              </article>
            ))}
          </section>

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <nav className="flex justify-center items-center gap-4" aria-label="Paginasi">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                aria-label="Halaman Sebelumnya"
              >
                <ChevronLeft size={20} />
                Sebelumnya
              </button>
              
              <span className="text-sm font-bold text-gray-500">
                Halaman {page} dari {meta.totalPages}
              </span>
              
              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                aria-label="Halaman Selanjutnya"
              >
                Selanjutnya
                <ChevronRight size={20} />
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
