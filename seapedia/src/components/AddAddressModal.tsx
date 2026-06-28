import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAddressModal({ isOpen, onClose }: AddAddressModalProps) {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/addresses', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Alamat berhasil disimpan!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menyimpan alamat');
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-white rounded-[32px] shadow-2xl p-8 max-w-md w-full relative z-10 transform scale-100 transition-transform duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-2xl transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-4 mb-8 mt-2">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[20px] flex items-center justify-center shadow-inner">
            <MapPin size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900">Alamat Tujuan</h3>
            <p className="text-gray-500 text-sm">Tambahkan alamat pengiriman</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Penerima</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="Contoh: Budi Santoso"
              value={formData.receiverName}
              onChange={e => setFormData({...formData, receiverName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">No. HP</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="081234567890"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
            <textarea 
              required
              minLength={10}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]" 
              placeholder="Contoh: Jl. Merdeka No. 10, RT 01/02 (minimal 10 karakter)"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
            {formData.address.length > 0 && formData.address.length < 10 && (
              <p className="text-xs text-red-500 mt-1">Alamat terlalu pendek (minimal 10 karakter)</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kota</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Contoh: Jakarta"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kode Pos</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="12345"
                value={formData.postalCode}
                onChange={e => setFormData({...formData, postalCode: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 text-lg"
          >
            {mutation.isPending ? 'Menyimpan...' : 'Simpan Alamat'}
          </button>
        </form>
      </div>
    </div>
  );
}
