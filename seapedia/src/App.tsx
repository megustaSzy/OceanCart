import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Promo from './pages/Promo';
import About from './pages/About';
import Contact from './pages/Contact';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import OrdersPage from './pages/dashboard/OrdersPage';
import WalletPage from './pages/dashboard/WalletPage';
import SellerProducts from './pages/dashboard/SellerProducts';
import DriverJobs from './pages/dashboard/DriverJobs';
import ProfilePage from './pages/dashboard/ProfilePage';
import VouchersPage from './pages/dashboard/VouchersPage';
import { useAuthInit } from './hooks/useAuthInit';

function App() {
  const ready = useAuthInit();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat OceanCart...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="promo" element={<Promo />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Protected Routes (Buyer needs to be logged in to access cart) */}
        <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
          <Route path="cart" element={<Cart />} />
        </Route>
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="incoming-orders" element={<OrdersPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="jobs" element={<DriverJobs />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="vouchers" element={<VouchersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
