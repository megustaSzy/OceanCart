import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShoppingCart, Star, MapPin, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`)
  });

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => api.get(`/reviews/product/${id}`),
    enabled: !!id
  });

  const addToCart = useMutation({
    mutationFn: () => api.post('/cart', { productId: Number(id), quantity }),
    onSuccess: () => {
      toast.success('Produk berhasil ditambahkan ke keranjang!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan ke keranjang');
    }
  });

  const product = data?.data;
  const reviews = reviewData?.data || [];

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  );
  
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Produk tidak ditemukan.</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <figure className="bg-gray-50 h-[400px] md:h-auto relative m-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl" aria-hidden="true">🐟</div>
            )}
          </figure>
          
          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">Tangkapan Segar</span>
              <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
                <Star size={16} fill="currentColor" /> 4.8
              </span>
            </div>
            
            <header>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
            </header>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-6 mb-8 border-y border-gray-100 py-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Stok Tersedia</p>
                <p className="font-bold text-gray-900">{product.stock} kg</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Kondisi</p>
                <p className="font-bold text-green-600">Sangat Segar</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <Store size={24} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Dijual oleh</p>
                  <p className="font-bold text-gray-900">{product.store?.storeName}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <p className="font-bold text-gray-900">Jumlah Beli:</p>
              <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock === 0}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={() => {
                if (!isAuthenticated) return navigate('/login');
                if (user?.activeRole !== 'BUYER') return toast.error('Hanya role BUYER yang dapat berbelanja');
                addToCart.mutate();
              }}
              disabled={addToCart.isPending || product.stock === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none text-lg"
            >
              <ShoppingCart size={24} />
              {product.stock === 0 ? 'Stok Habis' : 'Masukkan Keranjang'}
            </button>
          </div>
        </div>
      </article>

      {/* Reviews */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10" aria-labelledby="reviews-heading">
        <header>
          <h2 id="reviews-heading" className="text-2xl font-bold text-gray-900 mb-6">Ulasan Pembeli ({reviews.length})</h2>
        </header>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada ulasan untuk produk ini.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev: any) => (
              <article key={rev.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <header className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                    {rev.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{rev.user?.name}</h3>
                    <div className="flex text-amber-500" aria-label={`Rating: ${rev.rating} dari 5 bintang`}>
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" aria-hidden="true" />)}
                    </div>
                  </div>
                </header>
                <p className="text-gray-600 ml-13">{rev.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
