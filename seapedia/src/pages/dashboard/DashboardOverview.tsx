import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Wallet, ShoppingBag, Package, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const { user } = useAuthStore();

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.get('/wallet'),
    enabled: !!user
  });

  const { data: ordersData } = useQuery({
    queryKey: ['dashboard-orders', user?.activeRole],
    queryFn: () => {
      if (user?.activeRole === 'SELLER') return api.get('/orders/seller');
      if (user?.activeRole === 'DRIVER') return api.get('/driver/jobs');
      return api.get('/orders/buyer');
    },
    enabled: !!user
  });

  const balance = walletData?.data?.balance || 0;
  const orders = Array.isArray(ordersData?.data) ? ordersData.data : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Halo, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-2">Selamat datang kembali di Dashboard {user?.activeRole}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-blue-100">Saldo OceanCartPay</h3>
            <div className="p-2 bg-white/20 rounded-xl"><Wallet size={20} /></div>
          </div>
          <p className="text-3xl font-extrabold mb-4">Rp {parseInt(balance).toLocaleString('id-ID')}</p>
          <Link to="/dashboard/wallet" className="inline-flex items-center text-sm font-bold text-white hover:text-blue-100 transition-colors">
            Top Up Saldo <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {(user?.activeRole === 'BUYER' || user?.activeRole === 'SELLER') && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-500">Total {user?.activeRole === 'SELLER' ? 'Pesanan Masuk' : 'Pesanan'}</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag size={20} /></div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{orders.length}</p>
          </div>
        )}

        {user?.activeRole === 'SELLER' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-500">Kelola Katalog</h3>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Package size={20} /></div>
            </div>
            <Link to="/dashboard/products" className="bg-indigo-600 text-white font-bold py-3 rounded-xl text-center hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
              Lihat Produk
            </Link>
          </div>
        )}

        {user?.activeRole === 'DRIVER' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-500">Pekerjaan Tersedia</h3>
              <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl"><Truck size={20} /></div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-4">{orders.length}</p>
            <Link to="/dashboard/jobs" className="bg-cyan-600 text-white font-bold py-3 rounded-xl text-center hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-500/20">
              Lihat Pekerjaan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
