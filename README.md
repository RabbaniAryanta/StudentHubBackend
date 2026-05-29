# StudentHub Backend — Dokumentasi API, Fitur & Hak Akses

Dokumen ini menjelaskan keseluruhan arsitektur backend, rincian fungsionalitas tiap modul, daftar *endpoint* utama, dan pembagian hak akses (Role-Based Access Control) untuk Publik, User, dan Admin.

> Repository reference: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

---

## 1. Skema Basis Data & Konsep Relasi Utama
Struktur database telah disesuaikan agar berjalan independen dengan pemisahan entitas yang jelas:

- **Auth & Users**: `User` dan `OtpCode` menangani otentikasi. Akun `User` diperuntukkan murni sebagai akun *login* untuk konsumen/pembeli.
- **Students Management (Admin Only)**: `Student`, `Major`, `Batch`. **Penting:** Entitas `Student` tidak memiliki relasi dengan akun `User`. Data siswa adalah *master data* yang sepenuhnya di-input dan dikelola oleh Admin.
- **Katalog & Project**: `Project`, `Category`, `Tag`, `ProjectTag`. Setiap Project terkait dengan satu `Category`, beberapa `Tag`, dan opsional terkait dengan satu `Student` (sebagai pemilik karya).
- **Transaksi**: `Cart`, `CartItem`, `Order`, `OrderItem`, `PaymentProof`, `BankAccount`.
- **Interaksi**: `Wishlist`, `Rating`, `Contact` (untuk form hubungi kami).

---

## 2. Pembagian Hak Akses & Workflow Fitur

Aplikasi ini membagi hak akses ke dalam 3 level utama:

### 🌐 A. Akses Publik (Visitor / Belum Login)
Pengunjung yang belum mendaftar/login hanya memiliki akses *Read-Only* ke bagian katalog dan fitur publik dasar.
- **Katalog**:
  - `GET /projects` — Menampilkan daftar project yang berstatus **PUBLISHED** saja.
  - `GET /projects/:slugOrId` — Menampilkan detail project spesifik (selama berstatus PUBLISHED).
  - `GET /categories` & `GET /tags` — Menampilkan filter katalog.
- **Auth**: `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/login`.
- **Contact**: `POST /contacts` — Mengirim pesan atau *inquiry* kepada admin.

### 👤 B. Akses Authenticated User (`Role: USER`)
Pengguna yang sudah login dan melampirkan token `Authorization: Bearer <token>` bisa melakukan aktivitas transaksi dan interaksi.
- **Akun**: `GET /users/me`, `PATCH /users/me` — Mengelola profil sendiri.
- **Katalog & Interaksi**:
  - `POST /wishlists` — Melakukan *toggle* (Tambah/Hapus) project ke daftar *wishlist*. (Otomatis menambah/mengurangi `wishlistCount` pada project).
  - `GET /wishlists/my-wishlist` — Melihat daftar wishlist sendiri.
  - `POST /ratings` — Memberikan rating dan *review* pada project. (Otomatis menghitung ulang `averageRating` pada project).
- **Transaksi & Keranjang**:
  - `POST /carts`, `DELETE /carts/:projectId`, `GET /carts/my-cart` — Mengelola keranjang belanja.
  - `POST /orders/checkout` — Melakukan *checkout* dari semua *item* yang ada di keranjang menjadi satu nomor *Order* (`orderCode`), lalu keranjang akan dikosongkan otomatis.
- **Pembayaran**:
  - `GET /bank-accounts` & `GET /bank-accounts/active` & `GET /bank-accounts/:id` — Melihat daftar rekening resmi admin untuk tujuan transfer.
  - `GET /payment/bill/:orderId` — Mengecek rincian tagihan pesanan.
  - `POST /payment/upload-proof/:orderId` — Mengunggah gambar bukti transfer.
  - `GET /payment/proof/:orderId` — Melihat bukti transfer yang sudah di-upload.

### 👑 C. Akses Admin (`Role: ADMIN`)
Admin memiliki kontrol penuh atas seluruh sistem dan *master data*. Endpoint admin dilindungi dengan `@UseGuards(AuthGuard, RolesGuard)` dan `@Role('ADMIN')`.
- **Master Data Katalog**:
  - `POST`, `PATCH`, `DELETE` untuk `/categories` dan `/tags`.
  - `POST /projects` — Menambahkan project baru (otomatis berstatus `DRAFT`). Harus menggunakan `multipart/form-data` untuk upload `thumbnail` dan `mediaUrls`.
  - `PATCH /projects/:id`, `DELETE /projects/:id`.
  - `GET /projects/all/admin` — Melihat SEMUA project tanpa terkecuali.
  - `GET /projects/:id` — Admin dapat menembus batasan dan melihat detail project meskipun statusnya masih `DRAFT`.
- **Data Siswa & Akademik**:
  - `POST`, `PATCH`, `DELETE` untuk `/majors`, `/batches`, dan `/students`. Admin mendaftarkan karya siswa dengan menyambungkan `studentId` ke dalam `Project`.
- **Keuangan & Order**:
  - `POST`, `PATCH`, `DELETE` untuk `/bank-accounts` (kelola rekening aktif).
  - `GET /orders`, `PATCH /orders/:id` — Melihat semua pesanan dan mengubah status order.
  - `PATCH /payment/verify/:id` — Memverifikasi bukti pembayaran user (misal set status jadi `APPROVED` atau `REJECTED`, dan memberikan `adminNote`).
- **Lainnya**: Kelola `contacts` (inquiries), manajemen user.

---

## 3. Catatan Standarisasi API Backend

Dalam versi terbaru ini, backend StudentHub sudah menerapkan pola API yang terstandarisasi layaknya platform TEFA:

1. **Uniform Response Wrapper**: Semua endpoint memberikan respon dalam bentuk objek JSON seragam:
   ```json
   {
     "success": true,
     "message": "Pesan sukses (opsional)",
     "data": { ... } // Payload data aktual
   }
   ```
2. **Error Handling Terpadu**:
   - Jika ada duplikasi data (Prisma Error `P2002`), backend mengembalikan HTTP `409 Conflict`.
   - Jika data tidak ditemukan (Prisma Error `P2025`), backend mengembalikan HTTP `404 Not Found`.
3. **Transaction Safety**: Fitur kritis seperti *Checkout* dan penghitungan ulang nilai *Rating / Wishlists* dibungkus dengan *Prisma Transaction* atau logic kalkulasi otomatis agar sinkronisasi data tetap terjaga.
