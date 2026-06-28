# 🐟 OceanCart - Multi Role Seafood Marketplace

OceanCart adalah platform *marketplace* terpadu berskala besar yang dikhususkan untuk mempertemukan Nelayan/Penjual Hasil Laut, Pembeli, Kurir Pengiriman, dan Administrator dalam satu ekosistem digital yang mulus dan terintegrasi. 

Dengan antarmuka yang menawan (*premium-looking UI*), arsitektur *backend* yang tangguh (*MVC pattern*), dan manajemen *state* yang *real-time*, OceanCart mendefinisikan ulang cara jual-beli hasil laut secara daring.

---

## 🛠 Tech Stack & Versions

Proyek ini dibangun menggunakan teknologi *modern web development* terbaru:

### **Frontend (Web App)**
*   **Framework:** React `v19.2.7`
*   **Build Tool:** Vite `v8.1.0` (with `@rolldown/plugin-babel`)
*   **Styling:** Tailwind CSS `v4.3.1`
*   **State Management:** Zustand `v5.0.14` (Global Auth) & TanStack React Query `v5.101.2` (Server State)
*   **Routing:** React Router DOM `v7.18.0`
*   **Form & Validation:** React Hook Form `v7.80.0` + Zod `v4.4.3`
*   **Language:** TypeScript `v6.0.2`

### **Backend (API Server)**
*   **Environment:** Node.js
*   **Framework:** Express.js `v5.2.1`
*   **Database ORM:** Prisma Client & Prisma Adapter PG `v7.8.0`
*   **Database:** PostgreSQL `v8.22.0`
*   **Authentication:** JSON Web Token (JWT) `v9.0.3` & bcryptjs `v3.0.3`
*   **Validation:** Zod `v4.4.3`
*   **Task Scheduling:** Node Cron `v4.5.0`

---

## ✨ Fitur Utama

1. **Multi-Role Authentication (RBAC)**
   *   Mendukung pendaftaran dan *login* untuk 4 peran: `ADMIN`, `BUYER`, `SELLER`, dan `DRIVER`.
   *   Otorisasi dinamis membatasi akses URL dan visibilitas tombol di *frontend* sesuai dengan *activeRole* yang dipilih.
2. **Dynamic Voucher & Promo System**
   *   `ADMIN` dapat melakukan CRUD Voucher lengkap dengan batasan limit penggunaan, deskripsi syarat, dan tanggal kadaluarsa.
   *   Sistem validasi voucher secara cerdas di sisi `BUYER` memotong harga seketika di *checkout*.
3. **OceanCartPay (Internal E-Wallet)**
   *   Simulasi gerbang pembayaran internal. Pengguna dapat melakukan *Top Up*, melihat Riwayat Transaksi (*Income/Outcome*), dan memotong saldo saat *Checkout*.
4. **Smart Cart & Real-Time Stock Management**
   *   *Cart* dilengkapi kontrol kuantitas interaktif. 
   *   Saat *checkout*, stok *database* akan otomatis terpotong menggunakan Transaksi Database ACID yang aman mencegah *overselling*.
5. **Integrated Order & Delivery Pipeline**
   *   *Seller* melihat pesanan masuk dan mengubah status (Sedang Dikemas -> Menunggu Pengirim).
   *   *Driver* melihat bursa pekerjaan dan mengambil paket pengiriman.

---

## 🎨 User Experience (UX)

OceanCart dirancang dengan pedoman UI/UX modern kelas premium:
*   **Glassmorphism & Soft Shadows:** Penggunaan transparansi dan bayangan memudar (*feathered shadows*) untuk memberikan ilusi *layering* yang dalam.
*   **Interactive Micro-animations:** Semua tombol keranjang, input *quantity*, dan penambahan alamat memiliki transisi yang sangat halus, memastikan tidak ada lompatan antarmuka yang kasar.
*   **Intuitive Feedback:** Modals, Toasts (React Hot Toast), dan indikator *loading* *(skeleton screens)* selalu hadir untuk membimbing interaksi pengguna.

---

## 🏛 Sistem Desain / Arsitektur

### **Backend: Clean MVC Architecture**
API OceanCart menerapkan pola pemisahan logika tiga lapis:
1. **Controllers:** Hanya bertanggung jawab membaca *request*, memanggil layanan, dan mengembalikan format *response* yang standar.
2. **Services:** Inti aplikasi. Seluruh aturan bisnis, kalkulasi harga, pemotongan pajak (PPN 11%), diskon, validasi dompet ada di sini.
3. **Repositories:** Lapisan isolasi untuk seluruh perintah prisma (*query database*). Jika suatu saat database diganti, hanya bagian ini yang perlu diubah.

### **Database ERD (High Level)**
*   `User` (1-to-M) `Store`, `Wallet`, `Cart`, `Order`
*   `Store` (1-to-M) `Product`, `Order`
*   `Order` (1-to-M) `OrderItem`, `OrderStatusHistory`
*   `Voucher` (Standalone Master Data)

---

## 🔒 Security Notes

1. **Password Hashing:** Semua kata sandi disandikan dengan **bcryptjs**.
2. **Stateless JWT:** Implementasi ganda (Access Token & Refresh Token). Meminimalisasi risiko penyadapan token panjang.
3. **Middleware Proteksi Ekstra:** 
   *   `authMiddleware.js` memeriksa keabsahan Token JWT.
   *   `roleMiddleware.js` memeriksa keselarasan antara *request endpoint* dengan *Active Role* si pengakses.
4. **Zod Validation:** Menolak paket aneh atau injeksi data berbahaya sejak dari depan (*payload parsing*).

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi

Ikuti panduan berikut untuk menjalankan OceanCart di mesin lokal Anda. Pastikan Anda telah menginstal Node.js dan PostgreSQL.

### **1. Setup Database & Backend**
Buka terminal dan masuk ke folder `api-oceancart`:
```bash
cd api-oceancart
npm install
```
Buat file `.env` di dalam folder `api-oceancart`:
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/oceancart?schema=public"
JWT_SECRET="oceancart_rahasia_super_aman_123"
JWT_REFRESH_SECRET="oceancart_refresh_sangat_aman_321"
```
Migrasi struktur database dan isi data awal (*Seeding*):
```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```
*(Server backend akan berjalan di `http://localhost:3001`)*

### **2. Setup Frontend**
Buka terminal baru dan masuk ke folder `oceancart`:
```bash
cd oceancart
npm install
npm run dev
```
*(Aplikasi Web akan berjalan di `http://localhost:5173`)*

---

## 📁 Struktur Proyek (Directory Tree)

```text
oceancart_monorepo/
│
├── api-oceancart/                  # Backend Environment
│   ├── prisma/                    # Skema Database & Seeder
│   ├── src/
│   │   ├── constants/             # Pesan response standar
│   │   ├── controllers/           # HTTP Request handlers
│   │   ├── cron/                  # Penjadwalan otomatis (Node Cron)
│   │   ├── exceptions/            # Custom Error Classes
│   │   ├── middlewares/           # Auth & Error handling
│   │   ├── repositories/          # Prisma DB Queries isolator
│   │   ├── routes/                # Endpoint Definitions
│   │   ├── services/              # Business Logics
│   │   ├── utils/                 # Utilities (Bcrypt, JWT)
│   │   └── index.js & server.js   # Server Entry Points
│   └── package.json
│
└── oceancart/                      # Frontend Environment
    ├── src/
    │   ├── assets/                # Gambar statis
    │   ├── components/            # Komponen UI Reusable (Modal, Navbar)
    │   ├── layouts/               # Master Layout (Dashboard, Main)
    │   ├── pages/                 # Halaman Utama (Cart, Products, dll)
    │   ├── services/              # Axios API Interceptors
    │   ├── store/                 # Zustand Global State
    │   ├── App.tsx                # React Router Config
    │   └── main.tsx               # DOM Renderer
    └── package.json
```

---

## 🌐 Dokumentasi API Lengkap

Setiap API memberikan format *response* seragam seperti ini:
```json
{
  "success": true,
  "message": "Pesan keberhasilan",
  "data": { ... }
}
```

### **1. Auth & Users**
*   `POST /api/auth/register`: Mendaftar pengguna baru (Otomatis membuat toko jika tipe akun SELLER).
*   `POST /api/auth/login`: Mendapatkan Token Akses.
*   `POST /api/auth/select-role`: Mengganti peran aktif (Active Role).

### **2. Products & Store**
*   `GET /api/products`: Mendapatkan semua produk (*Public*).
*   `GET /api/products/:id`: Detail spesifik satu produk.
*   `GET /api/stores/my-products`: Produk milik Penjual tertentu.
*   `POST /api/stores/products`: Menambahkan produk baru.

### **3. Cart & Order**
*   `GET /api/cart`: Melihat keranjang milik BUYER.
*   `POST /api/cart`: Memasukkan produk ke keranjang.
*   `PUT /api/cart/:id`: Memperbarui kuantitas produk dalam keranjang.
*   `POST /api/orders/checkout`: Validasi OceanCartPay dan merubah keranjang menjadi Pesanan (Memotong Stok).

### **4. Admin & Vouchers**
*   `GET /api/vouchers`: Mendapatkan voucher yang *valid* untuk di-klaim (*Public*).
*   `GET /api/admin/vouchers`: Mendapatkan semua daftar voucher (termasuk *expired*).
*   `POST /api/admin/vouchers`: Membuat voucher baru.
*   `PUT /api/admin/vouchers/:id`: Mengubah voucher.

---

<p align="center">
  <b>Developed with ❤️ by Raditya Ahmad</b>
</p>
