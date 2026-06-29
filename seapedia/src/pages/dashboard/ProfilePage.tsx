import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { User, Shield, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import AddAddressModal from '../../components/AddAddressModal';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { data: addressData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/addresses'),
    enabled: !!user
  });

  const addresses = Array.isArray(addressData?.data) ? addressData.data : [];

  return (
    <section aria-labelledby="profile-heading">
      <h1 id="profile-heading" className="text-2xl font-extrabold text-gray-900 mb-8">Profil Saya</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center sticky top-24" aria-labelledby="profile-name">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-4xl mx-auto mb-4 shadow-inner" aria-hidden="true">
              {user?.name?.charAt(0)}
            </div>
            <h2 id="profile-name" className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 mb-6">{user?.email}</p>
            
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-medium text-sm">
              <Shield size={16} aria-hidden="true" />
              Role Aktif: {user?.activeRole}
            </div>
          </article>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8" aria-labelledby="personal-data-heading">
            <h2 id="personal-data-heading" className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-500" aria-hidden="true" /> Data Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Nama Lengkap</p>
                <p className="font-bold text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                <p className="font-bold text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Username</p>
                <p className="font-bold text-gray-900">@{user?.username || user?.name?.toLowerCase().replace(/\s/g, '')}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8" aria-labelledby="address-book-heading">
            <header className="flex justify-between items-center mb-6">
              <h2 id="address-book-heading" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" aria-hidden="true" /> Buku Alamat
              </h2>
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-100 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus size={16} aria-hidden="true" /> Tambah Alamat
              </button>
            </header>

            {addresses.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <MapPin size={32} className="mx-auto text-gray-300 mb-2" aria-hidden="true" />
                <p className="text-gray-500 font-medium">Belum ada alamat tersimpan.</p>
              </div>
            ) : (
              <ul className="space-y-4" aria-label="Daftar Alamat Saya">
                {addresses.map((address: any, index: number) => (
                  <li key={address.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <address className="not-italic">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-extrabold text-gray-900">{address.receiverName}</p>
                        {index === 0 && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">Alamat Utama</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{address.phone}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{address.address}</p>
                      <p className="text-sm text-gray-700 font-medium mt-1">{address.city}, {address.postalCode}</p>
                    </address>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <AddAddressModal 
        isOpen={isAddingAddress}
        onClose={() => setIsAddingAddress(false)}
      />
    </section>
  );
}
