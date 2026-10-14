// Formatting: currency, Indonesian terbilang, dates, invoice numbers.

export const CURRENCIES = [
  { code: "IDR", label: "Rupiah (Rp)", locale: "id-ID", symbol: "Rp" },
  { code: "USD", label: "US Dollar ($)", locale: "en-US", symbol: "$" },
  { code: "SGD", label: "Singapore Dollar (S$)", locale: "en-SG", symbol: "S$" },
  { code: "MYR", label: "Ringgit (RM)", locale: "ms-MY", symbol: "RM" },
  { code: "EUR", label: "Euro (€)", locale: "de-DE", symbol: "€" },
];

export function currencyMeta(code = "IDR") {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function fmtMoney(n, code = "IDR") {
  const m = currencyMeta(code);
  const v = Math.round(Number(n) || 0);
  if (code === "IDR") return "Rp" + v.toLocaleString("id-ID");
  return v.toLocaleString(m.locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

const _words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
function _terbilang(n) {
  n = Math.floor(Math.abs(n));
  if (n < 12) return _words[n];
  if (n < 20) return _terbilang(n - 10) + " belas";
  if (n < 100) return _terbilang(Math.floor(n / 10)) + " puluh " + _terbilang(n % 10);
  if (n < 200) return "seratus " + _terbilang(n - 100);
  if (n < 1000) return _terbilang(Math.floor(n / 100)) + " ratus " + _terbilang(n % 100);
  if (n < 2000) return "seribu " + _terbilang(n - 1000);
  if (n < 1000000) return _terbilang(Math.floor(n / 1000)) + " ribu " + _terbilang(n % 1000);
  if (n < 1000000000) return _terbilang(Math.floor(n / 1000000)) + " juta " + _terbilang(n % 1000000);
  if (n < 1000000000000) return _terbilang(Math.floor(n / 1000000000)) + " milyar " + _terbilang(n % 1000000000);
  return _terbilang(Math.floor(n / 1000000000000)) + " triliun " + _terbilang(n % 1000000000000);
}
/** Indonesian amount-in-words, e.g. "Seratus lima puluh ribu rupiah" */
export function terbilang(n, currency = "IDR") {
  const v = Math.round(Number(n) || 0);
  if (v === 0) return "Nol " + (currency === "IDR" ? "rupiah" : currencyMeta(currency).label);
  const words = _terbilang(v).replace(/\s+/g, " ").trim();
  const cap = words.charAt(0).toUpperCase() + words.slice(1);
  return cap + (currency === "IDR" ? " rupiah" : " " + currency);
}

export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const NUMBER_PATTERNS = [
  { id: "inv", label: "INV-2026-001", pattern: "INV-{YYYY}-{NNN}" },
  { id: "nota", label: "NOTA/10/001", pattern: "NOTA/{MM}/{NNN}" },
  { id: "kw", label: "KW-2610-0001", pattern: "KW-{YY}{MM}-{NNNN}" },
];
/** Expand {YYYY},{YY},{MM},{DD},{N...} — N run length = zero padding. counter is 1-based. */
export function expandNumber(pattern, counter, dateIso) {
  let d = dateIso ? new Date(dateIso + "T00:00:00") : new Date();
  if (isNaN(d)) d = new Date(); // tanggal kosong/rusak -> pakai hari ini, jangan "NaN"
  const pad = (v, l) => String(v).padStart(l, "0");
  return pattern
    .replace("{YYYY}", d.getFullYear())
    .replace("{YY}", String(d.getFullYear()).slice(2))
    .replace("{MM}", pad(d.getMonth() + 1, 2))
    .replace("{DD}", pad(d.getDate(), 2))
    .replace(/\{N+\}/g, (m) => pad(counter, m.length - 2));
}

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
