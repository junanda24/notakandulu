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
