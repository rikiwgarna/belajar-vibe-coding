# Belajar Vibe Coding - Backend Project

Fondasi project backend modern menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

---

## 🛠️ Tech Stack
- **Runtime & Package Manager:** [Bun](https://bun.sh)
- **Web Framework:** [ElysiaJS](https://elysiajs.com)
- **ORM & Migrations:** [Drizzle ORM](https://orm.drizzle.team) & Drizzle Kit
- **Database Driver:** `mysql2` (MySQL)

---

## 📁 Struktur Direktori
```text
├── drizzle/              # File SQL migrasi dari Drizzle Kit
├── src/
│   ├── db/
│   │   ├── index.ts      # Koneksi database & instance Drizzle
│   │   └── schema.ts     # Definisi skema tabel MySQL
│   └── index.ts          # Entry point server ElysiaJS
├── .env.example          # Template konfigurasi environment
├── drizzle.config.ts     # Konfigurasi Drizzle Kit
├── package.json
└── tsconfig.json
```

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
- [Bun](https://bun.sh) (v1.0+)
- Instance server MySQL aktif

### 2. Instalasi Dependency
```bash
bun install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` lalu sesuaikan kredensial database Anda:
```bash
cp .env.example .env
```
Contoh isi `.env`:
```env
PORT=3000
DATABASE_URL=mysql://root:password@localhost:3306/belajar_vibe_coding
```

### 4. Manajemen Database (Drizzle)
- **Generate migrasi SQL:**
  ```bash
  bun run db:generate
  ```
- **Push skema langsung ke database (Development):**
  ```bash
  bun run db:push
  ```
- **Buka Drizzle Studio (Database GUI):**
  ```bash
  bun run db:studio
  ```

### 5. Menjalankan Server
- **Mode Development (Hot-reload):**
  ```bash
  bun run dev
  ```
- **Mode Production:**
  ```bash
  bun run start
  ```

---

## 📡 Endpoint API
- `GET /`: Pesan sambutan dan status server.
- `GET /health`: Health check dan uptime aplikasi.
- `GET /users`: Contoh pembacaan data tabel `users` menggunakan Drizzle ORM.
