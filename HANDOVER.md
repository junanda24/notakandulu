# NotaKandulu — Handover (Tahap 9)

Ditulis: 2026-10-13. Status build: selesai, live di https://notakandulu.vercel.app.

## Apa ini
Aplikasi pembuat nota/kwitansi/struk untuk UMKM Indonesia. Bikin nota di HP, cetak / export PDF, backup JSON.

## Stack & lokasi
- React 19 + Vite 8 + Tailwind CSS v4 (via `@tailwindcss/vite`), `html-to-image` untuk export gambar
- Kode: `~/workspace/notakandulu/` (belum ada git repo — inisialisasi git disarankan kalau mau versioning)
- Deploy: Vercel, project `notakandulu` (org `team_3Gdr7vRqaWyOKQ6k6mlCZR3X`), deploy via `vercel build` + `vercel deploy --prebuilt --prod`
- `npm run build` → `dist/`, lalu deploy prebuilt (pola yang sama kayak one-piece-web & devil-archive)

## Fitur (per 2026-10-13)
- 4 tab: **Buat Nota** (form + item + hitungan) / **Toko** (profil usaha + upload logo) / **Gaya** (9 template) / **Riwayat** (nota tersimpan)
- **9 template** (`src/data/options.js` → `TEMPLATES`): Minimal SaaS (default), Corporate Clean, Editorial Serif, Kwitansi Elegan (terbilang + zona materai ≥ Rp5jt + stempel LUNAS), Accent Header, Executive Dark, Monochrome Print, Struk 80mm, Struk 58mm
- Logo usaha: upload di tab Toko, otomatis diresize ≤512px, tampil di semua template
- Export: cetak/PDF via print, bagikan gambar via `navigator.share` (fallback unduh di desktop)
- Backup/restore JSON: share sheet native di HP (Safari iOS ngabaikan atribut `download`), unduh file di desktop
- Bank pembayaran: transfer bank umum + bank digital (Jago, Neo, Blu, Jenius, Digibank, TMRW, Allo, SeaBank)
- Dark mode khusus editor (toggle 🌙 di header); lembar nota selalu terang biar hasil cetak konsisten
- Font Plus Jakarta Sans, aksen indigo, angka `tabular-nums`

## Bug yang pernah ketemu & cara betulinnya
1. **PDF blank putih** — div cetak ternyata di dalam div app yang `display:none` pas print. Fix: div cetak dipindah jadi sibling dari div app.
2. **Tombol Simpan ilang di light mode** — CSS custom (`.brutal-btn`) ditulis tanpa `@layer`, di Tailwind v4 CSS tanpa layer selalu menang lawan utility ber-layer. Fix: semua primitif custom dibungkus `@layer components`. Bug yang sama sempat kena tombol WA + kartu nominal statistik.
3. **Backup "nggak kejadian apa-apa" di iPhone** — Safari iOS ngabaikan `download`. Fix: pakai `navigator.share({files})` di mobile, unduh biasa di desktop, plus pesan status jelas.

## Yang belum / opsional
- Monitoring uptime (proposal cron harian ada di bawah — butuh persetujuan user dulu)
- `git init` + push ke GitHub biar ada versioning (sekarang belum ada repo)
- Tahap 9 monitoring resmi menunggu kata "lanjut" dari user

## Proposal monitoring (Tahap 9) — butuh "lanjut" user
- **Apa:** cek harian `GET https://notakandulu.vercel.app` → harus HTTP 200 dan body mengandung "NotakanDulu". Kalau gagal 2x berturut-turut → kabari user sekali (jangan spam tiap jam).
- **Kapan:** harian ~09:00 WIB (dalam jendela 09:00–21:30).
- **Berhenti kalau:** user bilang stop, atau situs didekomision.
- **Catatan implementasi:** cron butuh `owner` — notakandulu belum ada di tracking/goals, jadi buat tracked item dulu (`tracking.create`), baru `cron.add` dengan `owner: goal:<slug-item>`. Jangan bikin cron tanpa owner.
