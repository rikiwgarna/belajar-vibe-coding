# Plan: Implementasi Fitur Registrasi User (`POST /api/users`)

## Deskripsi & Tujuan
Mengimplementasikan fitur registrasi user baru pada aplikasi backend menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**. Dokumen ini disusun secara bertahap sebagai panduan kerja untuk mengimplementasikan skema database, *business logic* (service), hingga *endpoint* API (route).

---

## 1. Spesifikasi Kebutuhan

### A. Skema Tabel Database (`users`)
Perbarui atau pastikan tabel `users` pada `src/db/schema.ts` memiliki struktur kolom berikut:
| Nama Kolom | Tipe Data | Constraint / Keterangan |
| :--- | :--- | :--- |
| `id` | `integer` | Primary Key, Auto Increment |
| `name` | `varchar(255)` | `NOT NULL` |
| `email` | `varchar(255)` | `NOT NULL`, `UNIQUE` |
| `password` | `varchar(255)` | `NOT NULL` (Disimpan dalam bentuk hash **bcrypt**) |
| `created_at` | `timestamp` | `DEFAULT CURRENT_TIMESTAMP`, `NOT NULL` |

---

### B. Spesifikasi Endpoint API
- **Method & URL:** `POST /api/users`
- **Request Header:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Riki",
    "email": "riki@localhost",
    "password": "rahasia"
  }
  ```
- **Response Body (Success - HTTP 200/201):**
  ```json
  {
    "data": "OK"
  }
  ```
- **Response Body (Error Duplikasi Email - HTTP 400/409):**
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```

---

### C. Struktur Folder & Konvensi Penamaan File
Seluruh kode fitur harus mengikuti struktur direktori dan format penamaan berikut di dalam folder `src/`:
```text
src/
├── db/
│   ├── index.ts              # Koneksi database Drizzle
│   └── schema.ts             # Definisi skema tabel (termasuk tabel users)
├── routes/                   # Berisi routing ElysiaJS
│   └── users-routes.ts       # Format: <fitur>-routes.ts
├── services/                 # Berisi logic bisnis aplikasi
│   └── users-services.ts     # Format: <fitur>-services.ts
└── index.ts                  # Entry point utama aplikasi
```

---

## 2. Tahapan Implementasi Step-by-Step

Ikuti langkah-langkah di bawah ini secara berurutan:

### Tahap 1: Update Skema Database & Migrasi (`src/db/schema.ts`)
1. Buka file `src/db/schema.ts`.
2. Pastikan tabel `users` memiliki kolom:
   - `id`: `int("id").primaryKey().autoincrement()`
   - `name`: `varchar("name", { length: 255 }).notNull()`
   - `email`: `varchar("email", { length: 255 }).notNull().unique()`
   - `password`: `varchar("password", { length: 255 }).notNull()`
   - `createdAt`: `timestamp("created_at").defaultNow().notNull()`
3. Jalankan perintah `bun run db:generate` untuk memperbarui file migrasi SQL Drizzle (dan `bun run db:push` bila database MySQL lokal sudah aktif).

### Tahap 2: Implementasi Business Logic di Layer Service (`src/services/users-services.ts`)
1. Buat folder `src/services/` jika belum ada, lalu buat file `src/services/users-services.ts`.
2. Buat fungsi untuk registrasi user (misalnya `registerUser(input: { name: string; email: string; password: string })`).
3. Di dalam fungsi tersebut, lakukan langkah berikut:
   - **Cek Email Terdaftar:** Query ke tabel `users` berdasarkan `email` menggunakan Drizzle (`eq(users.email, input.email)`).
   - **Validasi Duplikasi:** Jika user dengan email tersebut sudah ada di database, lempar error (atau kembalikan penanda error) dengan pesan `"Email sudah terdaftar"`.
   - **Hash Password dengan Bcrypt:** Lakukan hashing pada `input.password` menggunakan algoritma **bcrypt**.
     > *Tips:* Anda dapat menggunakan fitur bawaan Bun `await Bun.password.hash(input.password, { algorithm: "bcrypt" })` atau library `bcrypt` / `bcryptjs`.
   - **Simpan ke Database:** Lakukan `db.insert(users).values({ name, email, password: hashedPassword })`.
   - Kembalikan hasil sukses.

### Tahap 3: Implementasi Routing di Layer Routes (`src/routes/users-routes.ts`)
1. Buat folder `src/routes/` jika belum ada, lalu buat file `src/routes/users-routes.ts`.
2. Buat instance plugin/router Elysia (misalnya `new Elysia({ prefix: "/api/users" })` atau mendefinisikan route `POST /api/users`).
3. Tambahkan validasi *request body* menggunakan `t.Object` dari Elysia (`name`, `email`, `password` bertipe `t.String()`).
4. Panggil fungsi service dari `src/services/users-services.ts`:
   - Jika berhasil, kembalikan response JSON:
     ```json
     { "data": "OK" }
     ```
   - Jika gagal karena email sudah terdaftar, atur HTTP status code yang sesuai (misalnya `400` atau `409`) dan kembalikan response JSON:
     ```json
     { "error": "Email sudah terdaftar" }
     ```

### Tahap 4: Integrasi Route ke Server Utama (`src/index.ts`)
1. Buka file `src/index.ts`.
2. Import `usersRoutes` dari `./routes/users-routes`.
3. Daftarkan route tersebut ke instance utama Elysia menggunakan `.use(usersRoutes)`.
4. Hapus atau rapikan route contoh `/users` lama jika sudah tidak diperlukan agar tidak membingungkan.

### Tahap 5: Pengujian & Verifikasi
1. Jalankan `bun run typecheck` (`bun check`) dan pastikan tidak ada error TypeScript.
2. Jalankan server dengan `bun run dev` atau buat unit/integration test untuk memastikan:
   - Request `POST /api/users` dengan email baru berhasil menyimpan password yang sudah ter-hash (bcrypt) ke database dan mengembalikan `{ "data": "OK" }`.
   - Request `POST /api/users` dengan email yang sama mengembalikan `{ "error": "Email sudah terdaftar" }`.

---

## 3. Kriteria Selesai (Definition of Done)
- [x] Tabel `users` di `src/db/schema.ts` memiliki kolom `id`, `name`, `email`, `password`, dan `created_at` sesuai spesifikasi.
- [x] File migrasi Drizzle terbaru telah di-generate.
- [x] File `src/services/users-services.ts` berisi logic pengecekan email duplikat, hashing password menggunakan bcrypt, dan penyimpanan user ke database.
- [x] File `src/routes/users-routes.ts` menangani endpoint `POST /api/users` dengan format request & response sesuai spesifikasi.
- [x] Route sudah terhubung di `src/index.ts` dan lolos pengecekan tipe (`bun run typecheck`).

