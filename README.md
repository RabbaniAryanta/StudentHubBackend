# Web Katalog — Dokumentasi Fitur, Skema Prisma & Flow per Role

Dokumen ini menjelaskan fitur backend, skema data (langsung dari `prisma/schema.prisma`), daftar endpoint utama, serta pembagian aksi untuk publik, user, dan admin. Ditujukan supaya tim frontend dapat merencanakan UI, props, dan integrasi API.

Repository reference: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

## Ringkasan singkat
- Autentikasi: register, verify OTP, login
- Konten katalog: `projects` (status: DRAFT / PUBLISHED / ARCHIVED), slug-based detail
- Manajemen data: categories, tags, majors, batches, students, bank accounts
- Interaksi pengguna: wishlists, ratings, cart/order, contacts (publik)

## Skema Prisma (model & atribut)
Berikut adalah skema persis dari `backend/prisma/schema.prisma` (model → field : tipe):

- Role (enum): `USER`, `ADMIN`

- User:
  - `id: Int` (PK)
  - `email: String` (unique)
  - `password: String`
  - `name: String`
  - `phone: String?`
  - `avatarUrl: String?`
  - `role: Role` (default USER)
  - `createdAt: DateTime`
  - `updatedAt: DateTime`
  - `isTwoFactorEnabled: Boolean`

- OtpCode:
  - `id, email, code, expiresAt, used, attempts, createdAt`

- Major:
  - `id, name` (unique)

- Batch:
  - `id, year` (unique)

- Student:
  - `id, nis` (unique), `userId` (unique), `majorId`, `batchId`
  - relasi: `user`, `major`, `batch`, `projects[]`

- Category:
  - `id, name` (unique), `slug` (unique)

- Tag:
  - `id, name` (unique)

- Decision: keep `Tag` model — used for filtering and related-projects.
  - Use-case: frontend will use `GET /tags` to populate filters and `GET /projects?tagId=` to fetch projects by tag.
  - Examples for tag requests/responses provided in `postman/examples/`.

- Project:
  - `id, title, slug` (unique), `description`
  - `price: Decimal` (default 0.00)
  - `thumbnail: String?`, `mediaUrls: Json` (array JSON)
  - `status: ProjectStatus` (DRAFT|PUBLISHED|ARCHIVED)
  - `averageRating: Decimal`, `totalReviews: Int`, `wishlistCount: Int`
  - `createdAt, updatedAt`, `categoryId`, `studentId?`

- ProjectTag: composite PK (projectId, tagId)

- Cart, CartItem: (user cart + items)

- BankAccount: `bankName, accountNumber, accountOwner, isActive`

- Order:
  - `id, orderCode` (unique), `userId`, `totalPrice` (Decimal), `status` (OrderStatus enum)
  - `message?`, `bankAccountId?`, timestamps
  - relasi: `items[]`, `paymentProofs[]`

- OrderItem: `projectName`, `price`, `thumbnail`, `quantity`

- PaymentProof: `orderId, fileUrl, status (PaymentProofStatus), adminNote`

- Contact:
  - `id, name, email, phone?, message, status (ContactStatus), createdAt, updatedAt`

- Rating:
  - `id, userId, projectId, score (Int), comment?, createdAt` (unique per user+project)

- Wishlist:
  - `id, userId, projectId, createdAt` (unique per user+project)

> Untuk detail tipe (Decimal precision, enums), lihat langsung [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

## Daftar endpoint utama & hak akses
Catatan: controller di `backend/src` menentukan guards. Ringkasan terpenting:

- Auth (`/auth`)
  - `POST /auth/register` — register (validasi)
  - `POST /auth/verify-otp` — verify OTP
  - `POST /auth/login` — login → return token

- Projects (`/projects`)
  - `GET /projects` — publik, hanya projects PUBLISHED (`findAllPublished()`)
  - `GET /projects/:slug` — publik, detail
  - `POST /projects` — ADMIN only (file upload: `thumbnail`, `mediaUrls` via `multipart/form-data`)

- Categories (`/categories`)
  - `GET /categories`, `GET /categories/:id` — publik
  - `POST`, `PATCH`, `DELETE` — ADMIN only

- Tags (`/tags`)
  - `GET /tags`, `GET /tags/:id` — publik
  - `POST`, `PATCH`, `DELETE` — ADMIN only

- Users (`/users`)
  - `GET /users/me` — AUTH
  - `PATCH /users/me` — AUTH
  - `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id` — ADMIN only

- Wishlists (`/wishlists`) — protected by `AuthGuard`
  - `POST /wishlists` — create (kirim `userId`, `projectId`)
  - `GET /wishlists`, `GET /wishlists/:id`, `PATCH /wishlists/:id`, `DELETE /wishlists/:id`

- Ratings (`/ratings`) — protected by `AuthGuard`
  - `POST /ratings` — create rating (unique per user+project)
  - `GET /ratings`, `GET /ratings/:id`, `PATCH`, `DELETE`

- Orders (`/orders`)
  - `POST /orders` — AUTH (create order)
  - `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id`, `DELETE /orders/:id` — ADMIN only

- Bank Accounts (`/bank-accounts`)
  - `GET /bank-accounts`, `GET /bank-accounts/:id` — AUTH
  - `POST`, `PATCH`, `DELETE` — ADMIN only

- Contacts (`/contacts`)
  - `POST /contacts` — publik (form contact / publik dapat mengirim message untuk admin)
  - `GET /contacts`, `GET /contacts/:id`, `PATCH`, `DELETE` — ADMIN only

- Majors (`/majors`), Batches (`/batches`), Students (`/students`)
  - Controllers are guarded for ADMIN (create/read/update/delete)

## Pembagian hak dan flow fitur (lebih rinci)

1) Publik (visitor, tidak login)
  - Bisa: lihat daftar project ter-publish (`GET /projects`), lihat detail project (`GET /projects/:slug`), lihat kategori/tag list, mengirim pesan melalui `POST /contacts` (mis. request upload project / kontak admin).
  - Tidak bisa: menambahkan wishlist, memberi rating, membuat order, mengakses profil.

2) Authenticated User (`role = USER`)
  - Bisa: login/register/verify OTP, melihat & mengubah profil (`/users/me`), menambahkan/kelola wishlist, memberi rating pada project, membuat order (`POST /orders`), melihat bank account list (`GET /bank-accounts`), mengelola cart (jika frontend implement), melihat rating/wishlist miliknya.
  - Catatan: semua operasi pengguna dikaitkan ke `userId` (token harus terkirim di header `Authorization: Bearer <token>`).

3) Admin (`role = ADMIN`)
  - Bisa semua aksi user plus manajemen penuh data: create/update/delete `projects` (upload media), categories, tags, majors, batches, students, bank accounts, orders (lihat dan ubah status), contacts (lihat & reply via admin note / status update), users (CRUD).
  - Endpoint yang membutuhkan admin menggunakan `@UseGuards(AuthGuard, RolesGuard)` dan `@Role('ADMIN')` di controller.

## Catatan penting untuk frontend
- Project create: gunakan `multipart/form-data` dengan field names `thumbnail` (file) dan `mediaUrls` (array of files) bersama field JSON untuk metadata.
- Rating unik per user+project — frontend harus mencegah duplicate UI submit.
- Wishlist unique per user+project — toggling harus menangani unique constraint.
- Contact form: gunakan `POST /contacts` sebagai mekanisme publik untuk meminta admin meng-upload project atau bertanya.

## Next steps (opsional)
- Saya bisa generate API reference lengkap (request/response contoh) dari controllers/service DTOs.
- Saya juga bisa ekstrak relasi dan contoh JSON payload untuk tiap endpoint.

Dokumen ini dibuat dengan membaca `backend/prisma/schema.prisma` dan controller di `backend/src`.
File ini disimpan di root: [README.md](README.md)
