import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(5, 'Subjek minimal 5 karakter'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = () => {
    toast.success('Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.');
    reset();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Hubungi Kami</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Ada pertanyaan atau masukan? Tim kami siap membantu Anda setiap saat.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <address className="space-y-6 not-italic" aria-label="Informasi Kontak">
          <article className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shrink-0" aria-hidden="true">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Alamat Kantor</h2>
              <p className="text-sm text-gray-500 leading-relaxed">Jl. Pantai Indah No.88, Jakarta Utara, DKI Jakarta 14470</p>
            </div>
          </article>

          <article className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600 shrink-0" aria-hidden="true">
              <Phone size={24} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Telepon</h2>
              <p className="text-sm text-gray-500 font-medium"><a href="tel:08123456789">0812-3456-789</a></p>
              <p className="text-xs text-green-500 font-bold mt-1 uppercase tracking-wider">WhatsApp Tersedia</p>
            </div>
          </article>

          <article className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 shrink-0" aria-hidden="true">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Email</h2>
              <p className="text-sm text-gray-500 font-medium"><a href="mailto:support@oceancart.com">support@oceancart.com</a></p>
            </div>
          </article>

          <article className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 shrink-0" aria-hidden="true">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Jam Operasional</h2>
              <p className="text-sm text-gray-500 font-medium mb-1">Senin - Sabtu: 08:00 - 20:00 WIB</p>
              <p className="text-sm text-gray-500 font-medium">Minggu: 09:00 - 15:00 WIB</p>
            </div>
          </article>
        </address>

        <section className="lg:col-span-2" aria-labelledby="form-heading">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
            <h2 id="form-heading" className="text-2xl font-extrabold text-gray-900 mb-6">Kirim Pesan Langsung</h2>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    {...register('name')}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nama Anda"
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="email@contoh.com"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subjek</label>
                <input
                  {...register('subject')}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Pertanyaan tentang pesanan"
                />
                {errors.subject && <p className="text-sm text-red-500 mt-2">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pesan</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Tulis pesan Anda di sini..."
                />
                {errors.message && <p className="text-sm text-red-500 mt-2">{errors.message.message}</p>}
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-blue-500/30 w-full md:w-auto text-lg">
                <Send size={20} />
                Kirim Pesan
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
