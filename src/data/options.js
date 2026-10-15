// Pilihan template, font, dan preset pembayaran.

export const TEMPLATES = [
  { id: "saas", name: "Minimal SaaS", desc: "Paling profesional, ala Stripe", paper: "A4", dark: false, kind: "invoice" },
  { id: "corporate", name: "Corporate Clean", desc: "Format perusahaan Indonesia", paper: "A4", dark: false, kind: "invoice" },
  { id: "editorial", name: "Editorial Serif", desc: "Elegan ala HoneyBook", paper: "A4", dark: false, kind: "invoice" },
  { id: "accent", name: "Accent Header", desc: "Pita warna penuh", paper: "A4", dark: false, kind: "invoice" },
  { id: "dark", name: "Executive Dark", desc: "Charcoal + aksen emas", paper: "A4", dark: true, kind: "invoice" },
  { id: "mono", name: "Monochrome Print", desc: "Hitam-putih hemat tinta", paper: "A4", dark: false, kind: "invoice" },
  { id: "faktur-formal", name: "Faktur Formal", desc: "Ala Adobe/GitHub, blok total warna", paper: "A4", dark: false, kind: "invoice" },
  { id: "saas-paywall", name: "SaaS Paywall", desc: "Ala Stripe/Paper.id, total hero", paper: "A4", dark: false, kind: "invoice" },
  { id: "marketplace", name: "Marketplace", desc: "Ala Tokopedia/Shopee", paper: "A4", dark: false, kind: "invoice" },
  { id: "studio", name: "Studio / Agency", desc: "Total di header, kolom jam", paper: "A4", dark: false, kind: "invoice" },
  { id: "faktur-pajak", name: "Faktur Pajak", desc: "Invoice + faktur pajak, DPP/PPN", paper: "A4", dark: false, kind: "invoice" },
  { id: "bold-statement", name: "Bold Statement", desc: "Berani ala Behance, ikut aksen", paper: "A4", dark: true, kind: "invoice" },
  { id: "clarity", name: "Clarity", desc: "Putih bersih, angka hero besar", paper: "A4", dark: false, kind: "invoice" },
  { id: "noir", name: "Noir", desc: "Hitam pekat, dramatis rapi", paper: "A4", dark: true, kind: "invoice" },
  { id: "ivory", name: "Ivory", desc: "Kertas hangat + serif mewah", paper: "A4", dark: false, kind: "invoice" },
  { id: "linea", name: "Linea", desc: "Satu garis aksen, minimal", paper: "A4", dark: false, kind: "invoice" },
  { id: "porcelain", name: "Porcelain", desc: "Kartu lembut ala Apple", paper: "A4", dark: false, kind: "invoice" },
  { id: "atelier", name: "Atelier", desc: "Editorial, margin lega", paper: "A4", dark: false, kind: "invoice" },
  { id: "noir-gold", name: "Noir & Gold", desc: "Charcoal + emas mewah", paper: "A4", dark: false, kind: "invoice" },
  { id: "emerald-ledger", name: "Emerald Ledger", desc: "Hijau hutan + krem tenang", paper: "A4", dark: false, kind: "invoice" },
  { id: "warm-clay", name: "Warm Clay", desc: "Kertas hangat + terakota", paper: "A4", dark: false, kind: "invoice" },
  { id: "kwitansi", name: "Kwitansi Elegan", desc: "Formal + terbilang + materai", paper: "A5", dark: false, kind: "nota" },
  { id: "struk-80", name: "Struk 80mm", desc: "Thermal lebar, +detail", paper: "80mm", dark: false, kind: "nota" },
  { id: "struk-58", name: "Struk 58mm", desc: "Thermal kecil", paper: "58mm", dark: false, kind: "nota" },
  { id: "receipt-minimal", name: "Receipt Minimal", desc: "Ala Spotify/Uber, tanpa tabel", paper: "A4", dark: false, kind: "nota" },
  { id: "thermal-58", name: "Thermal 58 PLN", desc: "Gaya PLN/BCA + barcode", paper: "58mm", dark: false, kind: "nota" },
  { id: "kwitansi-klasik", name: "Kwitansi Klasik", desc: "Materai + cap LUNAS", paper: "A5", dark: false, kind: "nota" },
  { id: "kwitansi-luhur", name: "Kwitansi Luhur", desc: "Bingkai sertifikat heritage", paper: "A5", dark: false, kind: "nota" },
  { id: "kwitansi-kontemporer", name: "Kwitansi Kontemporer", desc: "Minimal emerald modern", paper: "A5", dark: false, kind: "nota" },
];

export const PAPER_WIDTH = {
  "58mm": "58mm",
  "80mm": "80mm",
  A5: "148mm",
  A4: "210mm",
};

export const FONTS = [
  { id: "klasik", name: "Klasik (Serif)", body: '"Fraunces", Georgia, serif', display: '"Fraunces", Georgia, serif' },
  { id: "modern", name: "Modern", body: '"Inter", system-ui, sans-serif', display: '"Archivo Black", "Inter", sans-serif' },
  { id: "jakarta", name: "Jakarta Sans", body: '"Plus Jakarta Sans", system-ui, sans-serif', display: '"Plus Jakarta Sans", system-ui, sans-serif' },
  { id: "dm", name: "DM Modern", body: '"DM Sans", system-ui, sans-serif', display: '"DM Serif Display", Georgia, serif' },
  { id: "manrope", name: "Manrope", body: '"Manrope", system-ui, sans-serif', display: '"Manrope", system-ui, sans-serif' },
  { id: "worksans", name: "Work Sans", body: '"Work Sans", system-ui, sans-serif', display: '"Work Sans", system-ui, sans-serif' },
  { id: "sora", name: "Sora Tech", body: '"Sora", system-ui, sans-serif', display: '"Sora", system-ui, sans-serif' },
  { id: "lora", name: "Lora Serif", body: '"Lora", Georgia, serif', display: '"Lora", Georgia, serif' },
  { id: "baskerville", name: "Baskerville", body: '"Libre Baskerville", Georgia, serif', display: '"Libre Baskerville", Georgia, serif' },
  { id: "ketik", name: "Mesin Ketik", body: '"IBM Plex Mono", monospace', display: '"IBM Plex Mono", monospace' },
  { id: "tangan", name: "Tulis Tangan", body: '"Caveat", cursive', display: '"Caveat", cursive' },
  { id: "playfair", name: "Playfair Mewah", body: '"Inter", system-ui, sans-serif', display: '"Playfair Display", Georgia, serif' },
  { id: "cormorant", name: "Cormorant Anggun", body: '"Inter", system-ui, sans-serif', display: '"Cormorant Garamond", Georgia, serif' },
  { id: "marcellus", name: "Marcellus Klasik", body: '"Work Sans", system-ui, sans-serif', display: '"Marcellus", Georgia, serif' },
  { id: "montserrat", name: "Montserrat Tegas", body: '"Inter", system-ui, sans-serif', display: '"Montserrat", system-ui, sans-serif' },
];

export const ACCENT_PRESETS = [
  "#1e3a5f", // navy
  "#0f766e", // teal
  "#b45309", // amber gelap
  "#9d174d", // maroon
  "#4c1d95", // ungu
  "#166534", // hijau
  "#c9a96a", // champagne gold
  "#111111", // hitam
];

export const BANK_PRESETS = ["BCA", "BRI", "Mandiri", "BNI", "BTN", "CIMB Niaga", "Danamon", "Permata", "BSI", "Jago", "Bank Neo", "Blu", "Jenius", "Digibank", "TMRW", "Allo Bank", "SeaBank"];
export const EWALLET_PRESETS = ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja", "SeaBank"];
export const PAYMENT_TYPES = [
  { id: "bank", name: "Bank" },
  { id: "ewallet", name: "E-Wallet" },
  { id: "lainnya", name: "Lainnya" },
];
