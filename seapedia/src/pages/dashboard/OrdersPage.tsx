import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Status pesanan diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui status')
  });
  
  const endpoint = user?.activeRole === 'SELLER' ? '/orders/seller' : '/orders/buyer';

  const { data, isLoading } = useQuery({
    queryKey: ['orders', user?.activeRole],
    queryFn: () => api.get(endpoint)
  });

  const orders = Array.isArray(data?.data) ? data.data : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Sedang_Dikemas': return 'bg-amber-100 text-amber-700';
      case 'Menunggu_Pengirim': return 'bg-blue-100 text-blue-700';
      case 'Dikirim': return 'bg-cyan-100 text-cyan-700';
      case 'Pesanan_Selesai': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) return <div className="p-8 text-gray-500">Memuat pesanan...</div>;

  return (
    <section aria-labelledby="orders-heading">
      <h1 id="orders-heading" className="text-2xl font-extrabold text-gray-900 mb-8">
        {user?.activeRole === 'SELLER' ? 'Daftar Pesanan Masuk' : 'Riwayat Pesanan Saya'}
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-lg">Belum ada pesanan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <article key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden" aria-labelledby={`order-heading-${order.id}`}>
              <header className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span id={`order-heading-${order.id}`} className="font-bold text-gray-900">Pesanan #{order.id}</span>
                  <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </header>
              
              <div className="p-6">
                <ul className="space-y-4 mb-6" aria-label="Daftar Barang Belanjaan">
                  {order.items?.map((item: any) => (
                    <li key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        {item.product.image ? (
                          <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">🐟</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">{item.quantity} kg x Rp {parseInt(item.price).toLocaleString('id-ID')}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 mb-4 text-sm text-gray-500 border-t border-gray-100 pt-4" aria-label="Rincian Pembayaran">
                  <div className="flex justify-between">
                    <span>Metode Pengiriman</span>
                    <span className="font-medium text-gray-900">{order.deliveryMethod || 'Regular'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal Produk</span>
                    <span className="font-medium text-gray-900">Rp {parseInt(order.subtotal || '0').toLocaleString('id-ID')}</span>
                  </div>
                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon Voucher</span>
                      <span className="font-medium">- Rp {parseInt(order.discount || '0').toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span className="font-medium text-gray-900">Rp {parseInt(order.deliveryFee || '0').toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak (PPN)</span>
                    <span className="font-medium text-gray-900">Rp {parseInt(order.ppn || '0').toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                  <span className="text-gray-900 font-bold">Total Pembayaran</span>
                  <span className="text-xl font-extrabold text-blue-600">Rp {parseInt(order.total || '0').toLocaleString('id-ID')}</span>
                </div>

                {user?.activeRole === 'SELLER' && order.status === 'Sedang_Dikemas' && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'Menunggu_Pengirim' })}
                      disabled={updateStatusMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending ? 'Memproses...' : 'Pesanan Siap Dikirim'}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
