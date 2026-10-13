# TagihkanDulu — Handover (Tahap 9)

Ditulis: 2026-10-13. Diperbarui: 2026-10-13 21:00 WIB (rebrand NotaKandulu→TagihkanDulu, batch-2 GSAP, batch-3 Saran/donasi, data-contoh 4 persona). Status build: selesai, live di https://tagihkandulu.vercel.app.

## Apa ini
Aplikasi pembuat invoice/nota/kwitansi/struk untuk UMKM Indonesia. Bikin invoice di HP, cetak / export PDF / export gambar PNG, bagikan via WA/email, backup JSON. Jargon: "buat Invoice gratis, tanpa iklan dan login itu nyata". Logo = foto kucing user (header, splash, welcome modal, favicon).

## Stack & lokasi
- React 19.3 + Vite 8.3 + Tailwind CSS v4 (via `@tailwindcss/vite`), `html-to-image` untuk export gambar, GSAP 3.15 untuk animasi
- Kode: `~/workspace/tagihkandulu/` (dulu `~/workspace/notakandulu/`, di-rename pas rebrand 2026-10-13)
- Git: repo `junanda24/tagihkandulu` (branch `main`); per 2026-10-13 ~21:00 WIB local `main` 56 commit di depan `origin/main` (working tree bersih; `git fetch` sempat gagal dari background run, jadi angka ini dari ref lokal terakhir)
- Deploy: Vercel, project `tagihkandulu` (org `team_3Gdr7vRqaWyOKQ6k6mlCZR3X`), pola `vercel build` + `vercel deploy --prebuilt --prod` dari mesin ini (token CLI ada di `~/.local/share/com.vercel.cli/auth.json`). `dist/` ikut di-commit, jadi hash bundle live bisa dicocokkan dengan commit lokal.
- Project Vercel lama (`notakandulu`, `tagihkan`) sudah dihapus.

## Fitur (per 2026-10-13 malam WIB)
- 5 area: **Buat Nota** (wizard 4 langkah: Pelanggan → Data → Item → Kirim) / **Toko** (profil usaha + upload logo) / **Gaya** (18 template + 11 font) / **Riwayat** (nota tersimpan, badge status one-tap toggle) / **Saran** (Google Form kritik-saran + donasi GoPay dengan tombol salin)
- **18 template** (`src/data/options.js` → `TEMPLATES`):
  - Batch 1: Minimal SaaS (default), Corporate Clean, Editorial Serif, Kwitansi Elegan (terbilang + zona materai ≥ Rp5jt + stempel LUNAS), Accent Header, Executive Dark, Monochrome Print, Struk 80mm, Struk 58mm
  - Batch 2 (dari bedah 25 invoice asli, 2026-10-13): Faktur Formal (blok total hitam ala Adobe), SaaS Paywall (total hero + status pill ala Stripe), Receipt Minimal (tanpa tabel ala Spotify/Uber), Thermal 58 PLN (monospace kapital + barcode), Marketplace (kode unik ala Tokopedia/Shopee), Studio / Agency, Faktur Pajak (kolom DPP/PPN), Bold Statement (ungu ala Behance), Kwitansi Klasik (materai + cap LUNAS)
- **11 font OFL** (Plus Jakarta Sans, Fraunces, Inter, Archivo Black, IBM Plex Mono, Caveat, dsb.)
- **Animasi GSAP** (semua hormat `prefers-reduced-motion`): transisi step wizard (slide searah navigasi + fade), toast slide up/down, WelcomeModal pop `back.out`, panel "Nota tersimpan!" via komponen Collapse, preview modal HP ala bottom sheet; semua accordion (Opsi lanjutan, Toko, Template/Font) pakai Collapse (expand/shrink + fade `power3`)
- **Data contoh 4 persona** bergilir tiap klik "Isi data contoh": Kopi Junan, FreshWash Laundry, Bengkel Berkah Motor, Dapur Ibu Rina — semua isi SEMUA field (NPWP, no. PO, pajak, diskon, ongkir, DP); tombol "Kosongkan" reset semua
- **Saran tab** (`src/components/SaranPanel.jsx`): embed Google Form `https://forms.gle/4kzKHM1BRZ5dNZA79` + blok donasi GoPay (nomor + tombol salin, fallback textarea); footer ada baris donasi
- **Onboarding**: splash sinematik GSAP ~2s (skippable) → welcome modal 3 langkah → panduan 3 langkah di atas form; field jarang dipakai di-collapse di "Opsi lanjutan"
- **Logo usaha**: upload di tab Toko, otomatis diresize ≤512px, tampil di semua template (template gelap dibungkus chip putih, mono print jadi grayscale)
- **Terbilang** Indonesia otomatis; pola nomor invoice expandable; counter + peek
- **Export**: cetak/PDF via print, salin gambar nota ke clipboard (desktop, tempel di WA), `navigator.share` di mobile (fallback unduh di desktop — Safari iOS ngabaikan atribut `download`)
- **Bank pembayaran**: transfer bank umum + bank digital (Jago, Neo, Blu, Jenius, Digibank, TMRW, Allo, SeaBank)
- **Privacy promise**: semua data cuma di browser user (localStorage) — ada peringatan backup di modal/footer/kartu Riwayat (tanpa login ⇒ tanpa backup otomatis)
- **Dark mode** khusus editor (toggle di header); lembar nota selalu terang biar hasil cetak konsisten
- Aksen flat orange `#ea580c`; anti-AI-slop copy audit 60/100 — 10 pelanggaran sudah diperbaiki (emoji dipertahankan sebagai brand voice)

## Bug yang pernah ketemu & cara betulinnya
1. **PDF blank putih** — div cetak ternyata di dalam div app yang `display:none` pas print. Fix: div cetak dipindah jadi sibling dari div app.
2. **Tombol Simpan ilang di light mode** — CSS custom (`.brutal-btn`) ditulis tanpa `@layer`, di Tailwind v4 CSS tanpa layer selalu menang lawan utility ber-layer. Fix: semua primitif custom dibungkus `@layer components`. Bug yang sama sempat kena tombol WA + kartu nominal statistik.
3. **Backup "nggak kejadian apa-apa" di iPhone** — Safari iOS ngabaikan `download`. Fix: pakai `navigator.share({files})` di mobile, unduh biasa di desktop, plus pesan status jelas.
4. **Garis dekoratif dikira loading bar kedua** (splash) — dihapus 2026-10-13.
5. **Copy basi di microcopy** (WelcomeModal, tab Toko/Gaya; "elegant"→"elegan") — audit full 2026-10-13.

## Yang belum / opsional
- **Separator Invoice-vs-Nota di tab Gaya**: 18 template tampil flat satu list; invoice (13: saas, corporate, editorial, accent, dark, mono, faktur-formal, saas-paywall, marketplace, studio, faktur-pajak, bold-statement + receipt-minimal) campur sama nota/kwitansi/struk (5: kwitansi, kwitansi-klasik, struk-80, struk-58, thermal-58). Rencana: tambah field `kind: "invoice" | "nota"` di `TEMPLATES` (`src/data/options.js`) + render berkelompok di `src/components/CustomizePanel.jsx`.
- Monitoring uptime (proposal cron di bawah — butuh "lanjut" user dulu; recurring work tidak dibuat tanpa persetujuan)
- Tahap 9 monitoring resmi menunggu kata "lanjut" dari user

## Proposal monitoring (Tahap 9) — butuh "lanjut" user
- **Apa:** cek harian `GET https://tagihkandulu.vercel.app` → harus HTTP 200 dan body mengandung "TagihkanDulu". Kalau gagal 2x berturut-turut → kabari user sekali (jangan spam tiap jam).
- **Kapan:** harian ~09:00 WIB (dalam jendela 09:00–21:30).
- **Berhenti kalau:** user bilang stop, atau situs didekomision.
- **Catatan implementasi:** cron butuh `owner` → pakai user goal yang sudah ada: `owner: "goal:tagihkandulu-invoice-web-app"` (`~/workspace/goals/tagihkandulu-invoice-web-app/`). Jangan bikin cron tanpa owner.
