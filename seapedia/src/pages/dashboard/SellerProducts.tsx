import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import AddProductModal from '../../components/AddProductModal';

export default function SellerProducts() {
  const qc = useQueryClient();
  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: () => api.get('/products')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success('Produk berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus produk');
    }
  });

  const products = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) return <div className="p-8 text-gray-500">Memuat produk...</div>;

  return (
    <section aria-labelledby="manage-products-heading">
      <header className="flex justify-between items-center mb-8">
        <h1 id="manage-products-heading" className="text-2xl font-extrabold text-gray-900">Kelola Produk</h1>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <Plus size={20} aria-hidden="true" /> Tambah Produk
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Belum ada produk yang dijual.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Produk</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold">Stok</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">🐟</div>
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-700">Rp {parseInt(p.price).toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock} kg
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setDeletingProduct(p.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Hapus produk ${p.name}`}
                    >
                      <Trash2 size={20} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal 
        isOpen={deletingProduct !== null}
        title="Hapus Produk?"
        message="Produk yang dihapus tidak dapat dikembalikan. Yakin ingin menghapusnya dari toko Anda?"
        type="danger"
        confirmText="Ya, Hapus!"
        onConfirm={() => {
          if (deletingProduct) deleteMutation.mutate(deletingProduct);
        }}
        onCancel={() => setDeletingProduct(null)}
      />

      <AddProductModal 
        isOpen={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
      />
    </section>
  );
}
