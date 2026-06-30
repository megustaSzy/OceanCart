<div align="center">

# 🐟 OceanCart

### Multi-Role Seafood Marketplace Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)

**OceanCart** adalah platform *marketplace* terpadu berskala besar yang dikhususkan untuk mempertemukan **Nelayan/Penjual Hasil Laut**, **Pembeli**, **Kurir Pengiriman**, dan **Administrator** dalam satu ekosistem digital yang mulus dan terintegrasi.

Dengan antarmuka yang menawan (*premium-looking UI*), arsitektur *backend* yang tangguh (*MVC pattern*), dan manajemen *state* yang *real-time*, OceanCart mendefinisikan ulang cara jual-beli hasil laut secara daring.

</div>

---

## 📑 Daftar Isi

- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Struktur Proyek](#-struktur-proyek)
- [Dokumentasi API](#-dokumentasi-api)
- [Keamanan](#-keamanan)

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%">

### Frontend (Web App)

| Teknologi | Versi |
|-----------|-------|
| React | `v19.2.7` |
| Vite | `v8.1.0` |
| Tailwind CSS | `v4.3.1` |
| TypeScript | `v6.0.2` |
| Zustand | `v5.0.14` |
| TanStack React Query | `v5.101.2` |
| React Router DOM | `v7.18.0` |
| React Hook Form + Zod | `v7.80.0` + `v4.4.3` |

</td>
<td width="50%">

### Backend (API Server)

| Teknologi | Versi |
|-----------|-------|
| Node.js | Latest LTS |
| Express.js | `v5.2.1` |
| Prisma ORM | `v7.8.0` |
| PostgreSQL | `v8.22.0` |
| JSON Web Token | `v9.0.3` |
| bcryptjs | `v3.0.3` |
| Zod | `v4.4.3` |
| Node Cron | `v4.5.0` |

</td>
</tr>
</table>

---

## ✨ Fitur Utama

### 🔐 Multi-Role Authentication (RBAC)
Mendukung pendaftaran dan *login* untuk 4 peran: **ADMIN**, **BUYER**, **SELLER**, dan **DRIVER**. Otorisasi dinamis membatasi akses URL dan visibilitas tombol di *frontend* sesuai dengan *activeRole* yang dipilih.

### 🎫 Dynamic Voucher & Promo System
Admin dapat melakukan CRUD Voucher lengkap dengan batasan limit penggunaan, deskripsi syarat, dan tanggal kadaluarsa. Sistem validasi voucher secara cerdas di sisi Buyer memotong harga seketika di *checkout*.

### 💰 OceanCartPay (Internal E-Wallet)
Simulasi gerbang pembayaran internal. Pengguna dapat melakukan *Top Up*, melihat Riwayat Transaksi (*Income/Outcome*), dan memotong saldo saat *Checkout*.

### 🛒 Smart Cart & Real-Time Stock Management
Cart dilengkapi kontrol kuantitas interaktif. Saat *checkout*, stok database akan otomatis terpotong menggunakan **Transaksi Database ACID** yang aman mencegah *overselling*.

### 🔍 Server-Side Pagination & Search
Halaman produk menggunakan sistem paginasi dan pencarian dari sisi server, dilengkapi dengan *debounced search input* untuk meminimalkan beban API dan mempercepat performa.

### 🚚 Integrated Order & Delivery Pipeline
Seller melihat pesanan masuk dan mengubah status (*Sedang Dikemas → Menunggu Pengirim*). Driver melihat bursa pekerjaan dan mengambil paket pengiriman.

---

## 🎨 User Experience (UX)

OceanCart dirancang dengan pedoman UI/UX modern kelas premium:

| Aspek | Detail |
|-------|--------|
| **Semantic HTML** | Seluruh halaman menggunakan tag semantik (`<main>`, `<section>`, `<article>`, `<header>`, `<aside>`) untuk SEO dan aksesibilitas optimal |
| **Glassmorphism & Soft Shadows** | Transparansi dan bayangan memudar untuk memberikan ilusi *layering* yang dalam |
| **Interactive Micro-animations** | Transisi halus pada tombol keranjang, input quantity, dan penambahan alamat |
| **Intuitive Feedback** | Modals, Toasts, dan skeleton screens selalu membimbing interaksi pengguna |
| **ARIA Accessibility** | Atribut `aria-label`, `aria-labelledby`, dan `aria-hidden` pada komponen interaktif |

---

## 🏛 Arsitektur Sistem

### Backend: Clean MVC Architecture

```mermaid
graph LR
    A[Client Request] --> B[Routes]
    B --> C[Middleware<br/>Auth & Role]
    C --> D[Controllers]
    D --> E[Services<br/>Business Logic]
    E --> F[Repositories<br/>Prisma Queries]
    F --> G[(PostgreSQL)]
```

| Layer | Tanggung Jawab |
|-------|---------------|
| **Controllers** | Membaca *request*, memanggil layanan, mengembalikan format *response* standar |
| **Services** | Inti aplikasi — aturan bisnis, kalkulasi harga, pemotongan pajak (PPN 11%), diskon, validasi dompet |
| **Repositories** | Lapisan isolasi untuk seluruh perintah Prisma. Jika database diganti, hanya bagian ini yang perlu diubah |

### Database ERD (High Level)

```mermaid
erDiagram
    User ||--o{ Store : owns
    User ||--|| Wallet : has
    User ||--|| Cart : has
    User ||--o{ Order : places
    Store ||--o{ Product : sells
    Store ||--o{ Order : receives
    Order ||--o{ OrderItem : contains
    Order ||--o{ OrderStatusHistory : tracks
    Voucher }o--o{ Order : "applied to"
```

---

## 🚀 Instalasi & Menjalankan

> **Prasyarat:** Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (v18+) dan [PostgreSQL](https://www.postgresql.org/).

### 1. Clone Repository

```bash
git clone https://github.com/megustaSzy/OceanCart.git
cd OceanCart
```

### 2. Setup Database & Backend

```bash
cd api-seapedia
npm install
```

Buat file `.env` di dalam folder `api-seapedia`:

```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/oceancart?schema=public"
JWT_SECRET="oceancart_rahasia_super_aman_123"
JWT_REFRESH_SECRET="oceancart_refresh_sangat_aman_321"
```

Migrasi struktur database dan generate Prisma Client:

```bash
npx prisma migrate dev --name init
```

Isi data awal (*Seeding*) untuk membuat akun demo dan produk contoh:

```bash
npx prisma db seed
```

Jalankan server backend:

```bash
npm run dev
```

> Server backend akan berjalan di `http://localhost:3001`

### 📋 Akun Demo (Setelah Seeding)

Setelah menjalankan `npx prisma db seed`, akun-akun berikut akan tersedia untuk digunakan:

| Role | Email | Password | Saldo Awal |
|------|-------|----------|------------|
| **Admin** | `admin@seapedia.com` | `password123` | Rp 0 |
| **Buyer** | `buyer@seapedia.com` | `password123` | Rp 500.000 |
| **Seller** | `seller@seapedia.com` | `password123` | Rp 100.000 |
| **Driver** | `driver@seapedia.com` | `password123` | Rp 0 |

> ⚠️ **Catatan:** Semua akun di atas menggunakan password yang sama yaitu `password123`. Akun Seller otomatis memiliki toko bernama **"Seafood Segar Bahari"** beserta 3 produk contoh (Salmon, Udang Windu, Cumi-Cumi).

### 3. Setup Frontend

Buka terminal baru:

```bash
cd seapedia
npm install
```

Buat file `.env` di dalam folder `seapedia`:

```env
VITE_API_URL=http://localhost:3001/api
```

Jalankan:

```bash
npm run dev
```

> Aplikasi web akan berjalan di `http://localhost:5173`

---

## 📁 Struktur Proyek

```text
OceanCart/
│
├── api-seapedia/                    # 🔧 Backend Environment
│   ├── prisma/                     # Skema Database & Seeder
│   ├── src/
│   │   ├── constants/              # Pesan response standar
│   │   ├── controllers/            # HTTP Request handlers
│   │   ├── cron/                   # Penjadwalan otomatis (Node Cron)
│   │   ├── exceptions/             # Custom Error Classes
│   │   ├── middlewares/            # Auth & Error handling
│   │   ├── repositories/           # Prisma DB Queries isolator
│   │   ├── routes/                 # Endpoint Definitions
│   │   ├── services/               # Business Logics
│   │   ├── utils/                  # Utilities (Bcrypt, JWT)
│   │   └── index.js & server.js    # Server Entry Points
│   └── package.json
│
└── seapedia/                        # 🎨 Frontend Environment
    ├── src/
    │   ├── assets/                 # Gambar statis
    │   ├── components/             # Komponen UI Reusable (Modal, Navbar)
    │   ├── hooks/                  # Custom Hooks (useDebounce, useAuthInit)
    │   ├── layouts/                # Master Layout (Dashboard, Main)
    │   ├── pages/                  # Halaman Utama (Cart, Products, dll)
    │   ├── services/               # Axios API Interceptors
    │   ├── store/                  # Zustand Global State
    │   ├── types/                  # TypeScript Type Definitions
    │   ├── App.tsx                 # React Router Config
    │   └── main.tsx                # DOM Renderer & Query Config
    └── package.json
```

---

## 🌐 Dokumentasi API

Setiap API memberikan format response seragam:

```json
{
  "success": true,
  "message": "Pesan keberhasilan",
  "data": { ... },
  "metadata": { "total": 100, "page": 1, "limit": 8, "totalPages": 13 }
}
```

### 1. Auth & Users

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Mendaftar pengguna baru (otomatis buat toko jika SELLER) |
| `POST` | `/api/auth/login` | Mendapatkan Token Akses |
| `POST` | `/api/auth/refresh-token` | Memperbarui Token Akses menggunakan Refresh Token |
| `POST` | `/api/auth/select-role` | Mengganti peran aktif (Active Role) |

### 2. Products & Store

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/products?page=1&limit=8&search=` | Daftar produk dengan paginasi & pencarian |
| `GET` | `/api/products/:id` | Detail spesifik satu produk |
| `GET` | `/api/stores/my-products` | Produk milik Penjual tertentu |
| `POST` | `/api/stores/products` | Menambahkan produk baru |
| `PUT` | `/api/products/:id` | Memperbarui data produk |
| `DELETE` | `/api/products/:id` | Menghapus produk |

### 3. Cart & Order

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/cart` | Melihat keranjang milik BUYER |
| `POST` | `/api/cart` | Memasukkan produk ke keranjang |
| `PUT` | `/api/cart/:id` | Memperbarui kuantitas produk |
| `DELETE` | `/api/cart/:id` | Menghapus item dari keranjang |
| `POST` | `/api/orders/checkout` | Checkout (validasi saldo, potong stok) |
| `GET` | `/api/orders/my-orders` | Melihat riwayat pesanan BUYER |

### 4. Wallet

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/wallet` | Melihat saldo dan riwayat transaksi |
| `POST` | `/api/wallet/topup` | Top Up saldo OceanCartPay |

### 5. Admin & Vouchers

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/vouchers` | Voucher yang valid untuk di-klaim (Public) |
| `GET` | `/api/admin/vouchers` | Semua voucher termasuk expired (Admin) |
| `POST` | `/api/admin/vouchers` | Membuat voucher baru |
| `PUT` | `/api/admin/vouchers/:id` | Mengubah voucher |
| `DELETE` | `/api/admin/vouchers/:id` | Menghapus voucher |

### 6. Driver

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/driver/available-jobs` | Melihat bursa pengiriman yang tersedia |
| `POST` | `/api/driver/accept/:orderId` | Mengambil pekerjaan pengiriman |

---

## 🔒 Keamanan

| Aspek | Implementasi |
|-------|-------------|
| **Password Hashing** | Semua kata sandi disandikan dengan **bcryptjs** |
| **Stateless JWT** | Implementasi ganda (Access Token & Refresh Token) untuk meminimalisasi risiko penyadapan |
| **Auth Middleware** | `authMiddleware.js` memeriksa keabsahan Token JWT pada setiap request |
| **Role Middleware** | `roleMiddleware.js` memeriksa keselarasan endpoint dengan Active Role pengakses |
| **Zod Validation** | Menolak payload yang tidak valid sejak layer pertama (input parsing) |
| **ACID Transactions** | Prisma Interactive Transactions untuk mencegah race conditions pada checkout |

---

<div align="center">

**Developed with ❤️ by Raditya Ahmad**

*OceanCart — Menghubungkan Nelayan dan Pecinta Hasil Laut*

</div>
