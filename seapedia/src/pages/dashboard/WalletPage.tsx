import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useState } from 'react';

export default function WalletPage() {
  const qc = useQueryClient();
  const [topupAmount, setTopupAmount] = useState('');

  const { data: walletData } = useQuery({ queryKey: ['wallet'], queryFn: () => api.get('/wallet') });
  const { data: historyData } = useQuery({ queryKey: ['wallet-history'], queryFn: () => api.get('/wallet/history') });

  const topupMutation = useMutation({
    mutationFn: (amount: number) => api.post('/wallet/topup', { amount, description: 'Topup via Transfer Bank' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['wallet-history'] });
      toast.success('Top up berhasil!');
      setTopupAmount('');
    }
  });

  const balance = walletData?.data?.balance || 0;
  const history = historyData?.data || [];

  return (
    <main>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dompet OceanCartPay</h1>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10" aria-label="Ringkasan Saldo dan Top Up">
        <article className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/30">
          <div className="flex items-center gap-3 mb-6 opacity-80">
            <Wallet size={24} />
            <span className="font-semibold tracking-wider uppercase text-sm">Saldo Aktif</span>
          </div>
          <p className="text-4xl font-extrabold mb-2">Rp {parseInt(balance).toLocaleString('id-ID')}</p>
          <p className="text-sm opacity-70">Aman dan terenkripsi</p>
        </article>

        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Isi Saldo</h2>
          <div className="flex gap-4">
            <input 
              type="text"
              value={topupAmount}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                if (rawValue) {
                  setTopupAmount(parseInt(rawValue, 10).toLocaleString('id-ID'));
                } else {
                  setTopupAmount('');
                }
              }}
              placeholder="Minimal Rp 10.000"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={() => {
                const numericAmount = Number(topupAmount.replace(/\./g, ''));
                if (numericAmount >= 10000) topupMutation.mutate(numericAmount);
                else toast.error('Minimal top up Rp 10.000');
              }}
              disabled={topupMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Plus size={20} /> Top Up
            </button>
          </div>
        </section>
      </section>

      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8" aria-label="Riwayat Transaksi">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h2>
        </header>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada transaksi.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((tx: any) => {
              const isIncome = tx.type === 'TOPUP' || tx.type === 'PAYMENT' && tx.amount > 0; 
              // Note: the backend logic determines if it's income based on type and user role, usually TOPUP is income.
              return (
                <li key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{tx.description || tx.type}</p>
                      <time dateTime={new Date(tx.createdAt).toISOString()} className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleString('id-ID')}
                      </time>
                    </div>
                  </div>
                  <div className={`font-extrabold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'} Rp {parseInt(tx.amount).toLocaleString('id-ID')}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
