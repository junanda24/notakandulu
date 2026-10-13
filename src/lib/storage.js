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
    const okSave = save({ ...d, schemaVersion: SCHEMA_VERSION });
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
  save(d);
}
export function getSettings() {
  return { ...defaultSettings(), ...(load().settings || {}) };
}
export function setSettings(s) {
  const d = load();
  d.settings = { ...getSettings(), ...s };
  save(d);
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
  save(d);
  return d.history;
}
export function deleteHistory(id) {
  const d = load();
  d.history = (d.history || []).filter((x) => x.id !== id);
  save(d);
  return d.history;
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
