import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Truck, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';

export default function DriverJobs() {
  const qc = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [confirmType, setConfirmType] = useState<'TAKE' | 'COMPLETE'>('COMPLETE');

  const { data, isLoading } = useQuery({
    queryKey: ['driver-jobs'],
    queryFn: () => api.get('/driver/jobs')
  });

  const takeMutation = useMutation({
    mutationFn: (id: number) => api.post('/driver/jobs/take', { orderId: id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['driver-jobs'] });
      toast.success('Pekerjaan berhasil diambil! Segera antar pesanan.');
    },
    onError: (error: any) => toast.error(error?.message || 'Gagal mengambil pekerjaan')
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => api.post('/driver/jobs/complete', { orderId: id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['driver-jobs'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['wallet-history'] });
      toast.success('Pekerjaan selesai, fee ditambahkan ke dompet!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menyelesaikan pekerjaan');
    }
  });

  const jobs = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) return <div className="p-8 text-gray-500">Memuat pekerjaan...</div>;

  return (
    <section aria-labelledby="jobs-heading">
      <h1 id="jobs-heading" className="text-2xl font-extrabold text-gray-900 mb-8">Pekerjaan Tersedia</h1>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
          <Truck size={48} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-lg">Belum ada pekerjaan pengiriman saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job: any) => (
            <article key={job.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between" aria-labelledby={`job-title-${job.id}`}>
              <div>
                <header className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${job.status === 'Menunggu_Pengirim' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {job.status === 'Menunggu_Pengirim' ? 'Pekerjaan Baru' : 'Sedang Dikirim'}
                    </span>
                    <h2 id={`job-title-${job.id}`} className="font-bold text-gray-900 mt-3 text-lg">{job.store?.storeName}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Fee Pengiriman</p>
                    <p className="font-extrabold text-green-600">Rp {parseInt(job.deliveryFee || 0).toLocaleString('id-ID')}</p>
                  </div>
                </header>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-gray-700">Alamat Tujuan:</p>
                  {job.buyer?.addresses && job.buyer.addresses.length > 0 ? (
                    <address className="mt-2 text-sm text-gray-600 not-italic">
                      <p className="font-bold text-gray-900">{job.buyer.addresses[0].receiverName}</p>
                      <p>{job.buyer.addresses[0].phone}</p>
                      <p className="mt-1">{job.buyer.addresses[0].address}</p>
                      <p>{job.buyer.addresses[0].city}, {job.buyer.addresses[0].postalCode}</p>
                    </address>
                  ) : (
                    <p className="text-sm text-red-500 mt-2 font-medium">Alamat belum diatur (Hubungi: {job.buyer?.email})</p>
                  )}
                </div>
              </div>

              {job.status === 'Menunggu_Pengirim' ? (
                <button 
                  onClick={() => { setSelectedJob(job.id); setConfirmType('TAKE'); }}
                  disabled={takeMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50"
                >
                  <Truck size={20} aria-hidden="true" /> Ambil Pekerjaan
                </button>
              ) : (
                <button 
                  onClick={() => { setSelectedJob(job.id); setConfirmType('COMPLETE'); }}
                  disabled={completeMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                  <CheckCircle size={20} aria-hidden="true" /> Selesai Antar
                </button>
              )}
            </article>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={selectedJob !== null}
        title={confirmType === 'TAKE' ? 'Ambil Pekerjaan?' : 'Selesaikan Pengiriman?'}
        message={confirmType === 'TAKE' ? 'Anda akan mengambil pekerjaan ini dan siap mengantarkannya ke tujuan.' : 'Pastikan barang sudah diterima dengan aman oleh pembeli sebelum menekan tombol Selesai.'}
        type={confirmType === 'TAKE' ? 'info' : 'success'}
        confirmText={confirmType === 'TAKE' ? 'Ya, Ambil!' : 'Ya, Selesai!'}
        onConfirm={() => {
          if (selectedJob) {
            if (confirmType === 'TAKE') takeMutation.mutate(selectedJob);
            else completeMutation.mutate(selectedJob);
          }
        }}
        onCancel={() => setSelectedJob(null)}
      />
    </section>
  );
}
