import { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: ''
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/products', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success('Produk berhasil ditambahkan!');
      onClose();
      setFormData({ name: '', description: '', price: '', stock: '', image: '' });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan produk');
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
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
            <PackagePlus size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900">Tambah Produk</h3>
            <p className="text-gray-500 text-sm">Jual tangkapan laut baru Anda</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="Contoh: Ikan Tuna Segar"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]" 
              placeholder="Deskripsikan kondisi barang..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Harga / kg</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                <input 
                  required
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="0"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stok (kg)</label>
              <input 
                required
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="0"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">URL Gambar (Opsional)</label>
            <input 
              type="url" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
              placeholder="https://..."
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 text-lg"
          >
            {mutation.isPending ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}
