import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Ship, ShoppingCart, LogIn, LayoutDashboard, Ticket, Info, Phone, ChevronDown, Menu, X, Anchor } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useState, useRef, useEffect } from 'react';

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    logout();
    navigate('/');
  };

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart'),
    enabled: isAuthenticated && user?.activeRole === 'BUYER'
  });

  const carts = Array.isArray(cartData?.data) ? cartData.data : [];
  const cartCount = carts.reduce((acc: number, cart: any) => acc + (cart.items?.length || 0), 0);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Belanja', path: '/products' },
    { name: 'Promo', path: '/promo' },
    { name: 'Tentang Kami', path: '/about' },
    { name: 'Kontak', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-xl text-white shadow-md shadow-blue-500/30">
                <Ship size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                OceanCart
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    location.pathname === link.path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user?.activeRole === 'BUYER' && (
                <Link to="/cart" className="p-2 text-gray-500 hover:text-blue-500 transition-colors relative">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3 ml-4 border-l border-gray-200 pl-4">
                  <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-all">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500 ml-2 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-md shadow-blue-500/30">
                    <LogIn size={18} />
                    Login
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:text-blue-500">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 text-center mt-2">Login</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Ship size={24} className="text-blue-500" />
            <span className="text-xl font-bold text-gray-800">OceanCart</span>
          </div>
          <p>© {new Date().getFullYear()} OceanCart Multi-Role Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
