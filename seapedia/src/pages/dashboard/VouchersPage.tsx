import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Ticket, Plus, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function VouchersPage() {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    remainingUsage: '',
    expiredAt: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: () => api.get('/admin/vouchers')
  });

  const vouchers = Array.isArray(data?.data) ? data.data : [];

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/vouchers', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      toast.success('Voucher berhasil dibuat');
      closeModal();
    },
    onError: (err: any) => toast.error(err.message || 'Gagal membuat voucher')
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put(`/admin/vouchers/${editingVoucher.id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      toast.success('Voucher berhasil diperbarui');
      closeModal();
    },
    onError: (err: any) => toast.error(err.message || 'Gagal memperbarui voucher')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/vouchers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      toast.success('Voucher dihapus');
    }
  });

  const openAddModal = () => {
    setEditingVoucher(null);
    setFormData({ code: '', description: '', discount: '', remainingUsage: '', expiredAt: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (voucher: any) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      description: voucher.description || '',
      discount: voucher.discount,
      remainingUsage: voucher.remainingUsage,
      expiredAt: new Date(voucher.expiredAt).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discount: parseFloat(formData.discount),
      remainingUsage: parseInt(formData.remainingUsage),
      expiredAt: new Date(formData.expiredAt).toISOString()
    };

    if (editingVoucher) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) return <div className="p-8 text-gray-500">Memuat data...</div>;

  return (
    <section aria-labelledby="vouchers-heading">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 id="vouchers-heading" className="text-2xl font-extrabold text-gray-900 mb-2">Manajemen Voucher</h1>
          <p className="text-gray-500">Kelola promo dan diskon untuk pelanggan.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={20} aria-hidden="true" />
          Buat Voucher
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vouchers.map((voucher: any) => {
          const isExpired = new Date(voucher.expiredAt) < new Date();
          const isDepleted = voucher.remainingUsage <= 0;
          const isInvalid = isExpired || isDepleted;

          return (
            <article key={voucher.id} className={`bg-white rounded-3xl p-6 border ${isInvalid ? 'border-red-100 opacity-60' : 'border-gray-100'} shadow-sm relative overflow-hidden group`} aria-labelledby={`voucher-code-${voucher.id}`}>
              <header className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl" aria-hidden="true">
                  <Ticket size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(voucher)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-xl transition-colors" aria-label={`Edit voucher ${voucher.code}`}>
                    <Edit2 size={16} aria-hidden="true" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(voucher.id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl transition-colors" aria-label={`Hapus voucher ${voucher.code}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </header>

              <h2 id={`voucher-code-${voucher.id}`} className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-1">{voucher.code}</h2>
              <p className="text-xl font-bold text-blue-600 mb-6">Potongan Rp {parseInt(voucher.discount).toLocaleString('id-ID')}</p>

              <div className="space-y-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-2xl">
                <div className="flex justify-between">
                  <span>Sisa Kuota</span>
                  <span className={`font-bold ${isDepleted ? 'text-red-500' : 'text-gray-900'}`}>{voucher.remainingUsage}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Kadaluarsa</span>
                  <span className={`font-bold ${isExpired ? 'text-red-500' : 'text-gray-900'}`}>{new Date(voucher.expiredAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              {isInvalid && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Tidak Valid
                </div>
              )}
            </article>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <header className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">{editingVoucher ? 'Edit Voucher' : 'Buat Voucher Baru'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="Tutup modal">
                <X size={24} aria-hidden="true" />
              </button>
            </header>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="voucher-code-input" className="block text-sm font-bold text-gray-700 mb-2">Kode Voucher</label>
                <input 
                  id="voucher-code-input"
                  type="text" 
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="MISAL: DISKON50K"
                />
              </div>

              <div>
                <label htmlFor="voucher-desc-input" className="block text-sm font-bold text-gray-700 mb-2">Deskripsi (Opsional)</label>
                <textarea 
                  id="voucher-desc-input"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
                  placeholder="Contoh: Diskon khusus pengguna baru tanpa minimum belanja."
                />
              </div>
              
              <div>
                <label htmlFor="voucher-discount-input" className="block text-sm font-bold text-gray-700 mb-2">Nominal Diskon (Rp)</label>
                <input 
                  id="voucher-discount-input"
                  type="number" 
                  required
                  min="0"
                  value={formData.discount}
                  onChange={e => setFormData({...formData, discount: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="50000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="voucher-usage-input" className="block text-sm font-bold text-gray-700 mb-2">Batas Pakai (Kuota)</label>
                  <input 
                    id="voucher-usage-input"
                    type="number" 
                    required
                    min="1"
                    value={formData.remainingUsage}
                    onChange={e => setFormData({...formData, remainingUsage: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label htmlFor="voucher-expired-input" className="block text-sm font-bold text-gray-700 mb-2">Kadaluarsa Tgl</label>
                  <input 
                    id="voucher-expired-input"
                    type="date" 
                    required
                    value={formData.expiredAt}
                    onChange={e => setFormData({...formData, expiredAt: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
              >
                {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan Voucher'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
