import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Truck, Wallet, LogOut, Ship, Home, User, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    switch (user?.activeRole) {
      case 'BUYER':
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Pesanan Saya', path: '/dashboard/orders', icon: ShoppingBag },
          { name: 'Dompet', path: '/dashboard/wallet', icon: Wallet },
          { name: 'Profil', path: '/dashboard/profile', icon: User },
        ];
      case 'SELLER':
        return [
          { name: 'Ringkasan Toko', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Produk', path: '/dashboard/products', icon: Package },
          { name: 'Pesanan Masuk', path: '/dashboard/incoming-orders', icon: ShoppingBag },
          { name: 'Dompet & Laporan', path: '/dashboard/wallet', icon: Wallet },
          { name: 'Profil', path: '/dashboard/profile', icon: User },
        ];
      case 'DRIVER':
        return [
          { name: 'Pekerjaan Tersedia', path: '/dashboard/jobs', icon: Truck },
          { name: 'Pendapatan', path: '/dashboard/wallet', icon: Wallet },
          { name: 'Profil', path: '/dashboard/profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { name: 'Manajemen Voucher', path: '/dashboard/vouchers', icon: Ticket },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-lg text-white">
              <Ship size={18} />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              OceanCart
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
          >
            <Home size={20} />
            Halaman Utama
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
