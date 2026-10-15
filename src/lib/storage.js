// Versioned localStorage: shop profile (+payments), history, UI settings, number counter.

const KEY = "notakandulu:v1";
const SCHEMA_VERSION = 2;
const MAX_HISTORY = 50;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function save(d) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
    return true;
  } catch {
    return false; // quota penuh
  }
}

/** Migrasi schema bila versi berubah di update mendatang. */
export function migrate() {
  const d = load();
  if ((d.schemaVersion || 0) < SCHEMA_VERSION) {
    d.schemaVersion = SCHEMA_VERSION;
    // v1: bentuk awal — tidak ada transformasi
    // v2: field baru opsional (status/dp/terms/poNumber/customerNpwp/unit/npwp/showSignature)
    //      — nota lama tanpa field tsb tetap valid, dirender kondisional.
    save(d);
  }
  return d;
}

/** Estimasi pemakaian (karakter). Batas umum browser ~5MB. */
export function storageInfo() {
  let used = 0;
  try {
    used = (localStorage.getItem(KEY) || "").length;
  } catch { /* abaikan */ }
  return { used, limit: 5 * 1024 * 1024, pct: Math.min(100, (used / (5 * 1024 * 1024)) * 100) };
}

/** Backup seluruh data. Di HP: buka share sheet (simpan ke Files / kirim ke WA).
    Di desktop: unduh file. Kembalikan {ok, via, error}. */
export async function exportData() {
  try {
    const d = load();
    const name = `tagihkandulu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const json = JSON.stringify(
      { app: "tagihkandulu", schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data: d },
      null, 2
    );
    const file = new File([json], name, { type: "application/json" });
    const isMobile = window.matchMedia?.("(pointer: coarse)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Backup TagihkanDulu" });
        return { ok: true, via: "share" };
      } catch (e) {
        if (e && e.name === "AbortError") return { ok: true, via: "share", cancelled: true };
        // gagal share -> lanjut ke metode unduh
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    return { ok: true, via: "download" };
  } catch (e) {
    return { ok: false, error: "Backup gagal: " + (e?.message || "unknown") };
  }
}

/** Restore dari file backup. Kembalikan {ok, error}. */
export function importData(json) {
  try {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    if ((parsed.app !== "tagihkandulu" && parsed.app !== "notakandulu") || !parsed.data || typeof parsed.data !== "object") {
      return { ok: false, error: "File bukan backup TagihkanDulu yang valid." };
    }
    const d = parsed.data;
    // Validasi ringan bentuk data
    if (d.history && !Array.isArray(d.history)) return { ok: false, error: "Riwayat rusak." };
    if (d.profile && typeof d.profile !== "object") return { ok: false, error: "Profil rusak." };
    if (d.profile?.payments && !Array.isArray(d.profile.payments)) return { ok: false, error: "Data pembayaran rusak." };
    if (d.settings && typeof d.settings !== "object") return { ok: false, error: "Pengaturan rusak." };
    // Validasi accent hex (konsisten dengan validasi accentUsed di openHistory).
    if (d.settings?.accent && !/^#[0-9a-fA-F]{6}$/.test(d.settings.accent)) d.settings.accent = "#0d9488";
    // Normalisasi counter: string "5" + 1 = "51" (bug nomor duplikat) — paksa jadi angka.
    // Ambil max dengan counter saat ini biar restore backup lama tidak menurunkan nomor (risiko duplikat).
    const backupCounter = Math.max(0, parseInt(d.counter, 10) || 0);
    const counter = Math.max(backupCounter, load().counter || 0);
    // Normalisasi tiap entri riwayat: angka negatif → 0, tanggal invalid → fallback.
    const history = (d.history || []).map((h) => {
      const hh = { ...h };
      for (const k of ["discount", "tax", "shipping", "dp"]) hh[k] = Math.max(0, Number(hh[k]) || 0);
      if (hh.items) hh.items = hh.items.map((it) => ({ ...it, qty: Math.max(0, Number(it.qty) || 0), price: Math.max(0, Number(it.price) || 0) }));
      if (hh.date && !/^\d{4}-\d{2}-\d{2}$/.test(hh.date)) hh.date = new Date().toISOString().slice(0, 10);
      if (hh.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(hh.dueDate)) hh.dueDate = "";
      return hh;
    });
    const okSave = save({ ...d, history, counter, schemaVersion: SCHEMA_VERSION });
    if (!okSave) return { ok: false, error: "Penyimpanan penuh — backup gagal dimuat." };
    return { ok: true };
  } catch {
    return { ok: false, error: "File tidak bisa dibaca sebagai JSON." };
  }
}

export const defaultProfile = () => ({
  shopName: "",
  tagline: "",
  address: "",
  contact: "",
  npwp: "",
  logo: "",
  payments: [], // {id, type:'bank'|'ewallet'|'lainnya', label, number, holder}
});

export const defaultSettings = () => ({
  template: "saas",
  font: "klasik",
  accent: "#0d9488",
  currency: "IDR",
  numberPattern: "INV-{YYYY}-{NNN}",
  showSignature: false,
});

export function getProfile() {
  return { ...defaultProfile(), ...(load().profile || {}) };
}
export function setProfile(p) {
  const d = load();
  d.profile = p;
  return save(d);
}
export function getSettings() {
  return { ...defaultSettings(), ...(load().settings || {}) };
}
export function setSettings(s) {
  const d = load();
  d.settings = { ...defaultSettings(), ...(d.settings || {}), ...s };
  return save(d);
}
export function getHistory() {
  return load().history || [];
}
/** Simpan snapshot nota ke riwayat (upsert by id, terbaru dulu, maks 50). */
export function saveToHistory(inv) {
  const d = load();
  const h = (d.history || []).filter((x) => x.id !== inv.id);
  h.unshift({ ...inv, savedAt: new Date().toISOString() });
  d.history = h.slice(0, MAX_HISTORY);
  const ok = save(d);
  return { history: d.history, ok };
}
export function deleteHistory(id) {
  const d = load();
  d.history = (d.history || []).filter((x) => x.id !== id);
  const ok = save(d);
  return { history: d.history, ok };
}
/** Counter nomor nota global (1-based next). */
export function nextCounter() {
  const d = load();
  d.counter = (d.counter || 0) + 1;
  save(d);
  return d.counter;
}
export function peekCounter() {
  return (load().counter || 0) + 1;
}
