import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Ship } from 'lucide-react';
import { api } from '../services/api';

const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.string().min(1, 'Pilih role Anda'),
  storeName: z.string().optional(),
  storeDescription: z.string().optional()
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER', storeName: '', storeDescription: '' }
  });

  const selectedRole = watch('role');

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/register', data),
    onSuccess: (res: any) => {
      toast.success(res.message || 'Registrasi berhasil! Silakan login.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registrasi gagal');
    }
  });

  const roleOptions = [
    { id: 'BUYER', label: 'Pembeli' },
    { id: 'SELLER', label: 'Penjual' },
    { id: 'DRIVER', label: 'Kurir' }
  ];

  const onSubmit = (data: RegisterForm) => {
    const payload: any = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      roles: [data.role]
    };

    if (data.role === 'SELLER') {
      if (!data.storeName) {
        toast.error('Nama toko wajib diisi untuk Penjual');
        return;
      }
      payload.storeName = data.storeName;
      payload.storeDescription = data.storeDescription;
    }
    mutation.mutate(payload);
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <section className="max-w-lg w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100" aria-labelledby="register-heading">
        <header className="text-center">
          <div className="mx-auto bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Ship size={32} className="text-white" />
          </div>
          <h2 id="register-heading" className="text-3xl font-extrabold text-gray-900">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-gray-600">
            Bergabung dengan ekosistem OceanCart
          </p>
        </header>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  {...register('name')}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nama Lengkap"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  {...register('username')}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="username"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="email@contoh.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Tipe Akun</label>
              <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((role) => (
                  <label 
                    key={role.id} 
                    className="relative flex flex-col items-center justify-center p-3 cursor-pointer rounded-xl border-2 border-transparent bg-gray-50 hover:bg-gray-100 transition-all [&:has(:checked)]:border-blue-500 [&:has(:checked)]:bg-blue-50 [&:has(:checked)_span]:text-blue-700 shadow-sm"
                  >
                    <input
                      type="radio"
                      value={role.id}
                      {...register('role')}
                      className="sr-only"
                    />
                    <span className="text-sm font-bold text-gray-500 text-center">{role.label}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>

            {selectedRole === 'SELLER' && (
              <fieldset className="space-y-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                <legend className="font-bold text-blue-900 flex items-center gap-2 mb-2 w-full">
                  <Ship size={18} /> Detail Toko
                </legend>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko *</label>
                  <input
                    {...register('storeName')}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Contoh: Tangkapan Segar Bahari"
                  />
                  {errors.storeName && <p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Toko (Opsional)</label>
                  <textarea
                    {...register('storeDescription')}
                    rows={2}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                    placeholder="Jelaskan sedikit tentang toko dan produk yang dijual..."
                  />
                </div>
              </fieldset>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20"
            >
              {mutation.isPending ? 'Memproses...' : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Daftar
                </>
              )}
            </button>
          </div>
          
          <div className="text-center mt-4 text-sm">
            Sudah punya akun? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Masuk di sini</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
