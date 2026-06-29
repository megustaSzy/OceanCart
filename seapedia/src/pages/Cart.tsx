import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddAddressModal from '../components/AddAddressModal';

export default function Cart() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart')
  });

  const { data: addressData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/addresses')
  });
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const address = Array.isArray(addressData?.data) ? addressData.data[0] : null;

  const { data: walletData } = useQuery({ queryKey: ['wallet'], queryFn: () => api.get('/wallet') });
  const walletBalance = walletData?.data?.balance || 0;

  const removeMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/cart/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item dihapus');
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => api.put(`/cart/${id}`, { quantity }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal mengubah jumlah');
    }
  });

  const checkVoucherMutation = useMutation({
    mutationFn: (code: string) => api.post('/orders/check-voucher', { voucherCode: code }),
    onSuccess: (res: any) => {
      setDiscountAmount(res.data.discount);
      setAppliedVoucher(voucherCode);
      toast.success(res.message || 'Voucher berhasil digunakan!');
    },
    onError: (error: any) => {
      setDiscountAmount(0);
      setAppliedVoucher('');
      toast.error(error?.message || 'Voucher tidak valid');
    }
  });

  const checkoutMutation = useMutation({
    mutationFn: () => api.post('/orders/checkout', { deliveryMethod: 'Regular', voucherCode: appliedVoucher }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Berhasil checkout!');
      navigate('/dashboard/orders');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Checkout gagal');
    }
  });

  const carts = Array.isArray(data?.data) ? data.data : [];
  const items = carts.flatMap((cart: any) => cart.items) || [];
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.quantity * parseFloat(item.product.price)), 0);
  
  const ppn = (subtotal - discountAmount) * 0.11;
  const deliveryFee = 15000;
  const totalPayment = subtotal - discountAmount + ppn + deliveryFee;

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat keranjang...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Keranjang Belanja</h1>
        <Link 
          to="/dashboard/orders" 
          className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-blue-100"
        >
          <ShoppingBag size={18} />
          Riwayat Pembelian
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-lg mb-4">Keranjang Anda kosong</p>
          <Link to="/products" className="inline-flex bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
            Mulai Belanja
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-4" aria-label="Daftar Item Keranjang">
            {items.map((item: any) => (
              <article key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0 relative">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🐟</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.product.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="font-extrabold text-blue-600">Rp {parseInt(item.product.price).toLocaleString('id-ID')}</p>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity - 1 });
                          }
                        }}
                        disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (item.quantity < item.product.stock) {
                            updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity + 1 });
                          } else {
                            toast.error('Stok maksimum tercapai');
                          }
                        }}
                        disabled={item.quantity >= item.product.stock || updateQuantityMutation.isPending}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <p className="font-extrabold text-gray-900">Rp {(item.quantity * parseFloat(item.product.price)).toLocaleString('id-ID')}</p>
                  <button 
                    onClick={() => removeMutation.mutate(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    aria-label="Hapus Item"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="lg:col-span-1">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="text-xl font-bold text-gray-900 mb-6">Ringkasan Belanja</h2>
              
              <div className="space-y-4 mb-6 text-gray-600 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Voucher</span>
                    <span className="font-medium">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimasi Ongkir</span>
                  <span className="font-medium text-gray-900">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (PPN 11%)</span>
                  <span className="font-medium text-gray-900">Rp {ppn.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-extrabold text-gray-900 mb-6">
                <span>Total Pembayaran</span>
                <span>Rp {totalPayment.toLocaleString('id-ID')}</span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">Punya Kode Voucher?</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: DISKON50K"
                    disabled={discountAmount > 0}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  {discountAmount > 0 ? (
                    <button 
                      onClick={() => {
                        setDiscountAmount(0);
                        setAppliedVoucher('');
                        setVoucherCode('');
                      }}
                      className="bg-red-50 text-red-600 font-bold px-4 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Batal
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        if (voucherCode) checkVoucherMutation.mutate(voucherCode);
                      }}
                      disabled={!voucherCode || checkVoucherMutation.isPending}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {checkVoucherMutation.isPending ? 'Cek...' : 'Gunakan'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900">Alamat Pengiriman</h3>
                  {!address && (
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md"
                    >
                      + Tambah
                    </button>
                  )}
                </div>
                {address ? (
                  <div className="text-sm text-gray-600">
                    <p className="font-bold text-gray-900">{address.receiverName} <span className="text-gray-400 font-normal">({address.phone})</span></p>
                    <p className="mt-1 line-clamp-2">{address.address}</p>
                    <p>{address.city}, {address.postalCode}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-500 font-medium">Alamat tujuan belum diatur.</p>
                )}
              </div>
              
              <button 
                onClick={() => {
                  if (!address) {
                    toast.error('Silakan tambahkan alamat terlebih dahulu!');
                    setIsAddingAddress(true);
                  } else {
                    setIsPaymentModalOpen(true);
                  }
                }}
                disabled={checkoutMutation.isPending || items.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Checkout Sekarang
              </button>
            </section>
          </aside>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white relative">
              <h2 className="text-2xl font-extrabold mb-1">OceanCartPay</h2>
              <p className="text-blue-100 text-sm">Konfirmasi Pembayaran</p>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Total Tagihan</span>
                <span className="text-2xl font-black text-gray-900">Rp {totalPayment.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Saldo Anda</p>
                  <p className={`font-extrabold text-lg ${walletBalance >= totalPayment ? 'text-gray-900' : 'text-red-500'}`}>
                    Rp {parseInt(walletBalance).toLocaleString('id-ID')}
                  </p>
                </div>
                {walletBalance < totalPayment && (
                  <Link to="/dashboard/wallet" className="text-xs bg-red-100 text-red-600 px-3 py-2 rounded-lg font-bold hover:bg-red-200 transition-colors">
                    Isi Saldo
                  </Link>
                )}
              </div>

              {walletBalance >= totalPayment ? (
                <button 
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    checkoutMutation.mutate();
                  }}
                  disabled={checkoutMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all text-lg"
                >
                  Bayar dengan OceanCartPay
                </button>
              ) : (
                <button 
                  disabled
                  className="w-full bg-gray-200 text-gray-500 font-bold py-4 rounded-2xl cursor-not-allowed text-lg"
                >
                  Saldo Tidak Cukup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

        <AddAddressModal 
        isOpen={isAddingAddress}
        onClose={() => setIsAddingAddress(false)}
      />
    </main>
  );
}
