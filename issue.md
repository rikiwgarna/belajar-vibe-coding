# Plan: Inisialisasi Project Backend (Bun + ElysiaJS + Drizzle + MySQL)

## Deskripsi & Tujuan
Membuat fondasi project backend baru pada direktori ini menggunakan **Bun** sebagai runtime dan package manager, **ElysiaJS** sebagai web framework, serta **Drizzle ORM** yang terhubung ke database **MySQL**.

Dokumen ini berisi panduan *high-level* yang harus diikuti untuk mengimplementasikan struktur awal project.

---

## Tech Stack
- **Runtime & Package Manager:** Bun
- **Web Framework:** ElysiaJS (`elysia`)
- **ORM & Migration:** Drizzle ORM (`drizzle-orm`) & Drizzle Kit (`drizzle-kit`)
- **Database & Driver:** MySQL (`mysql2`)

---

## Tahapan Pekerjaan

### 1. Inisialisasi Project
- Inisialisasi project Bun pada root folder ini.
- Atur struktur direktori yang rapi (misalnya menempatkan kode utama di dalam folder `src/`).
- Tambahkan script yang dibutuhkan pada `package.json` (seperti script untuk menjalankan server mode development dan script untuk manajemen skema Drizzle).

### 2. Instalasi Dependency
- Install dependency utama: `elysia`, `drizzle-orm`, dan `mysql2`.
- Install development dependency: `drizzle-kit` dan tipe pendukung Bun bila diperlukan.

### 3. Konfigurasi Environment & Git
- Buat file `.env.example` yang memuat variabel environment yang dibutuhkan (seperti `DATABASE_URL` dan `PORT`).
- Pastikan `.gitignore` sudah mencakup file sensitif dan artefak build (seperti `.env` dan `node_modules`).

### 4. Setup Drizzle ORM & Koneksi MySQL
- Buat modul koneksi database di dalam `src/db/` yang menghubungkan Drizzle dengan MySQL menggunakan konfigurasi dari environment variable.
- Buat satu skema tabel contoh sederhana (misalnya tabel `users`) sebagai referensi awal.
- Buat file konfigurasi `drizzle.config.ts` di root project untuk mengatur lokasi file skema dan output migrasi.

### 5. Pembuatan Server Utama ElysiaJS
- Buat entry point aplikasi (misalnya di `src/index.ts`).
- Implementasikan endpoint dasar (seperti `GET /` atau `GET /health`) untuk memastikan server berjalan.
- Tambahkan contoh route sederhana yang berinteraksi dengan modul database untuk memverifikasi integrasi antara ElysiaJS dan Drizzle.

### 6. Dokumentasi Penggunaan
- Perbarui `README.md` dengan instruksi singkat mengenai:
  - Cara meng-install dependency.
  - Cara mengatur file `.env`.
  - Cara mendorong/menjalankan migrasi database dengan Drizzle.
  - Cara menjalankan server lokal.

---

## Kriteria Selesai (Definition of Done)
- [x] Project Bun terinisialisasi dan seluruh dependency (`elysia`, `drizzle-orm`, `drizzle-kit`, `mysql2`) terpasang.
- [x] Struktur folder (`src/`, `src/db/`) dan konfigurasi `drizzle.config.ts` tersedia dan bebas dari error TypeScript.
- [x] Tersedia `.env.example` dan panduan singkat di `README.md`.
- [x] Server ElysiaJS dapat dijalankan menggunakan Bun dan merespons request dengan baik.

