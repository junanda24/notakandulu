// Pilihan template, font, dan preset pembayaran.

export const TEMPLATES = [
  { id: "saas", name: "Minimal SaaS", desc: "Paling profesional, ala Stripe", paper: "A4", dark: false },
  { id: "corporate", name: "Corporate Clean", desc: "Format perusahaan Indonesia", paper: "A4", dark: false },
  { id: "editorial", name: "Editorial Serif", desc: "Elegan ala HoneyBook", paper: "A4", dark: false },
  { id: "kwitansi", name: "Kwitansi Elegan", desc: "Formal + terbilang + materai", paper: "A5", dark: false },
  { id: "accent", name: "Accent Header", desc: "Pita warna penuh", paper: "A4", dark: false },
  { id: "dark", name: "Executive Dark", desc: "Charcoal + aksen emas", paper: "A4", dark: true },
  { id: "mono", name: "Monochrome Print", desc: "Hitam-putih hemat tinta", paper: "A4", dark: false },
  { id: "struk-80", name: "Struk 80mm", desc: "Thermal lebar, +detail", paper: "80mm", dark: false },
  { id: "struk-58", name: "Struk 58mm", desc: "Thermal kecil", paper: "58mm", dark: false },
  { id: "faktur-formal", name: "Faktur Formal", desc: "Ala Adobe/GitHub, blok total hitam", paper: "A4", dark: false },
  { id: "saas-paywall", name: "SaaS Paywall", desc: "Ala Stripe/Paper.id, total hero", paper: "A4", dark: false },
  { id: "receipt-minimal", name: "Receipt Minimal", desc: "Ala Spotify/Uber, tanpa tabel", paper: "A4", dark: false },
  { id: "thermal-58", name: "Thermal 58 PLN", desc: "Gaya PLN/BCA + barcode", paper: "58mm", dark: false },
  { id: "marketplace", name: "Marketplace", desc: "Ala Tokopedia/Shopee + kode unik", paper: "A4", dark: false },
  { id: "studio", name: "Studio / Agency", desc: "Total di header, kolom jam", paper: "A4", dark: false },
  { id: "faktur-pajak", name: "Faktur Pajak", desc: "Invoice + faktur pajak, DPP/PPN", paper: "A4", dark: false },
  { id: "bold-statement", name: "Bold Statement", desc: "Ungu berani ala Behance", paper: "A4", dark: true },
  { id: "kwitansi-klasik", name: "Kwitansi Klasik", desc: "Materai + cap LUNAS", paper: "A5", dark: false },
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
  { id: "ketik", name: "Mesin Ketik", body: '"IBM Plex Mono", monospace', display: '"IBM Plex Mono", monospace' },
  { id: "tangan", name: "Tulis Tangan", body: '"Caveat", cursive', display: '"Caveat", cursive' },
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
