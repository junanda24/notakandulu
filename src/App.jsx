import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Wizard from "./components/wizard/Wizard.jsx";
import { getSteps, STEP_IDS } from "./components/wizard/shared.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import Preview, { InvoiceSheet, MobilePreviewModal } from "./components/Preview.jsx";
import { blankInvoice, blankItem } from "./lib/calc.js";
import { expandNumber, todayIso, uid } from "./lib/format.js";
import {
  getProfile, setProfile, getSettings, setSettings,
  getHistory, saveToHistory, deleteHistory, nextCounter, peekCounter, migrate,
} from "./lib/storage.js";

import SaranPanel from "./components/SaranPanel.jsx";
import WelcomeModal from "./components/WelcomeModal.jsx";
import Splash from "./components/Splash.jsx";

function DrawerItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "bg-teal-50 dark:bg-teal-950 font-bold text-teal-700 dark:text-teal-300"
          : "font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState("buat");
  const [splash, setSplash] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false); // modal preview full-screen (HP)
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("notakandulu:theme");
      const isDark = saved ? saved === "dark" : window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      // Disengaja di initializer (bukan useEffect): cegah flash tema salah sebelum paint pertama.
      if (isDark) document.documentElement.classList.add("dark");
      return !!isDark;
    } catch { return false; }
  });
  const [profile, setProfileState] = useState(() => { migrate(); return getProfile(); });
  const [settings, setSettingsState] = useState(getSettings);
  const [history, setHistory] = useState(getHistory);
  const [toast, setToast] = useState("");
  const [drawer, setDrawer] = useState(false); // side menu (burger)
  const goTab = (id) => { setTab(id); setDrawer(false); };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("notakandulu:theme", next ? "dark" : "light"); } catch {}
  };

  // Kunci scroll + Escape saat drawer terbuka
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setDrawer(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);
  // Posisi wizard (disimpan biar refresh tidak mengulang dari awal)
  const [wstep, setWstep] = useState(() => {
    try {
      const s = localStorage.getItem("notakandulu:wstep");
      if (s && STEP_IDS.includes(s)) return s;
    } catch {}
    return "data";
  });
  const persistWstep = (id) => {
    setWstep(id);
    try { localStorage.setItem("notakandulu:wstep", id); } catch {}
  };

  const newNumber = () =>
    expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", peekCounter(), todayIso());
  const [inv, setInv] = useState(() => blankInvoice({ number: "", date: todayIso(), currency: getSettings().currency }));

  // Nomor otomatis terisi saat nota masih kosong
  useEffect(() => {
    setInv((p) => (p.number ? p : { ...p, number: newNumber() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistProfile = (updater) => {
    let ok = true;
    setProfileState((p) => {
      const np = typeof updater === "function" ? updater(p) : updater;
      ok = setProfile(np);
      return np;
    });
    setTimeout(() => { if (!ok) showToast("Penyimpanan penuh — data toko mungkin tidak tersimpan"); }, 0);
  };
  const persistSettings = (updater) => {
    let ok = true;
    setSettingsState((s) => {
      const ns = typeof updater === "function" ? updater(s) : updater;
      ok = setSettings(ns);
      return ns;
    });
    setTimeout(() => { if (!ok) showToast("Penyimpanan penuh — pengaturan mungkin tidak tersimpan"); }, 0);
  };

  // Sinkron mata uang settings -> nota baru
  useEffect(() => {
    setInv((p) => ({ ...p, currency: settings.currency }));
  }, [settings.currency]);

  const toastRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (m) => {
    clearTimeout(toastTimer.current);
    setToast(m);
    toastTimer.current = setTimeout(() => {
      const el = toastRef.current;
      if (el && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(el, { y: 14, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => setToast("") });
      } else {
        setToast("");
      }
    }, 2200);
  };

  // Toast masuk: slide-up + fade.
  useEffect(() => {
    const el = toastRef.current;
    if (!el || !toast) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.6)", overwrite: true });
  }, [toast]);

  const handleSave = () => {
    // kunci nomor: naikkan counter begitu nota disimpan
    const finalInv = { ...(inv.number ? inv : { ...inv, number: expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", nextCounter(), inv.date) }) };
    if (inv.number && !history.some((h) => h.id === inv.id)) {
      // nomor manual pertama kali disimpan -> tetap majukan counter agar tak bentrok
      nextCounter();
    }
    finalInv.templateUsed = settings.template;
    const { history: h, ok } = saveToHistory(finalInv);
    setHistory(h);
    setInv(finalInv);
    const dupNum = inv.number && h.some((x) => x.id !== finalInv.id && x.number === inv.number);
    showToast(!ok ? "Gagal menyimpan — memori browser penuh"
      : dupNum ? `Nota tersimpan ✓ (nomor ${inv.number} sudah dipakai nota lain!)`
      : "Nota tersimpan ✓");
    return ok;
  };

  const handleNew = () => {
    setInv(blankInvoice({ number: expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", peekCounter(), todayIso()), date: todayIso(), currency: settings.currency }));
    persistWstep("data");
    setTab("buat");
    showToast("Nota baru ✓");
  };

  const handleClearInv = () => {
    setInv(blankInvoice({ number: expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", peekCounter(), todayIso()), date: todayIso(), currency: settings.currency }));
    showToast("Data dikosongkan ✓");
  };

  const openHistory = (h, duplicate = false) => {
    const src = h && typeof h === "object" ? h : {};
    // Guard: entry riwayat korup/format lama tanpa items -> jangan crash; fallback ke 1 baris kosong.
    // Merge dengan blankInvoice agar field yang hilang tetap punya default.
    const items = Array.isArray(src.items) && src.items.length > 0
      ? src.items.map((it) => ({ ...blankItem(), ...(it || {}) }))
      : [blankItem()];
    // Guard tanggal: <input type="date"> cuma terima YYYY-MM-DD; format lain bikin field kelihatan kosong.
    const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(src.date || "") ? src.date : undefined;
    const isoDue = /^\d{4}-\d{2}-\d{2}$/.test(src.dueDate || "") ? src.dueDate : undefined;
    if (duplicate) {
      const base = blankInvoice();
      const copy = {
        ...base,
        ...src,
        id: `${Date.now().toString(36)}-dup`,
        number: expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", peekCounter(), todayIso()),
        items: items.map((it) => ({ ...it, id: uid() })),
        date: isoDate || base.date,
        dueDate: isoDue || "",
      };
      setInv(copy);
      showToast("Diduplikasi — simpan untuk mengunci nomor");
    } else {
      const base = blankInvoice();
      setInv({ ...base, ...src, items, date: isoDate || base.date, dueDate: isoDue || "" });
    }
    setTab("buat");
  };

  const formPanel = useMemo(() => {
    if (tab === "buat") return (
      <Wizard
        inv={inv}
        setInv={setInv}
        profile={profile}
        persistProfile={persistProfile}
        settings={settings}
        persistSettings={persistSettings}
        stepId={wstep}
        setStepId={persistWstep}
        onSave={handleSave}
        onClearInv={handleClearInv}
        onGotoToko={() => { setTab("buat"); persistWstep("data"); }}
        onGotoRiwayat={() => setTab("riwayat")}
      />
    );
    if (tab === "saran") return <SaranPanel />;
    return (
      <HistoryPanel
        history={history}
        onOpen={openHistory}
        onDelete={(id) => {
          const { history: h, ok } = deleteHistory(id);
          setHistory(h);
          if (!ok) showToast("Gagal menghapus — memori browser penuh");
        }}
        onToggleStatus={(id) => {
          const item = history.find((h) => h.id === id);
          if (!item) return;
          const { history: h, ok } = saveToHistory({ ...item, status: (item.status || "belum") === "lunas" ? "belum" : "lunas" });
          setHistory(h);
          if (!ok) showToast("Gagal menyimpan — memori browser penuh");
        }}
        settings={settings}
        onRestored={() => {
          setProfileState(getProfile());
          setSettingsState(getSettings());
          setHistory(getHistory());
          showToast("Data dipulihkan ✓");
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, inv, profile, settings, history, wstep]);

  // Info langkah wizard untuk redup pratinjau di langkah awal
  const wizSteps = getSteps();
  const wizIdx = Math.max(0, wizSteps.findIndex((s) => s.id === wstep));
  const dimPreview = tab === "buat" && wizIdx < wizSteps.length - 2;

  return (
    <>
    {splash && <Splash onDone={() => setSplash(false)} />}
    <WelcomeModal />
    <div className="app-shell min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.jpg" alt="Logo TagihkanDulu" className="h-9 w-9 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <h1 className="text-[15px] font-extrabold tracking-tight leading-none">TagihkanDulu</h1>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">Buat invoice gratis, tanpa iklan dan login itu nyata 🔥</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button aria-label="Buka menu"
              onClick={() => setDrawer(true)}
              title="Menu"
              className="brutal-btn h-9 w-9 rounded-lg text-lg leading-none lg:hidden"
            >
              ☰
            </button>
            <button
              onClick={() => setDrawer(true)}
              className="brutal-btn hidden lg:inline-flex h-9 items-center px-4 rounded-lg text-sm font-bold"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5">
        {tab === "saran" ? (
          <div className="mx-auto max-w-2xl">{formPanel}</div>
        ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_440px]">
          <div className="hidden lg:block">
            <div className={`lg:sticky lg:top-[76px] transition-opacity duration-300 ${dimPreview ? "lg:opacity-40" : ""}`}>
              <Preview inv={inv} profile={profile} settings={settings} />
            </div>
          </div>
          <div>
            {formPanel}
          </div>
        </div>
        )}
      </main>

      <footer className="border-t border-line mt-8">
        <p className="mx-auto max-w-7xl px-4 pt-4 text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
          TagihkanDulu — buat invoice gratis, tanpa iklan dan login itu nyata 🔥
        </p>
        <p className="mx-auto max-w-7xl px-4 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
          🔒 100% privat: data invoice hanya tersimpan di browser kamu, tidak dikirim ke mana pun
        </p>
        <p className="mx-auto max-w-7xl px-4 pb-1 pt-1 text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
          Panduan gratis: <a href="/cara-membuat-invoice/" className="underline">cara membuat invoice</a> · <a href="/contoh-invoice/" className="underline">contoh invoice</a> · <a href="/cara-membuat-kwitansi/" className="underline">cara membuat kwitansi</a>
        </p>
        <p className="mx-auto max-w-7xl px-4 pb-4 pt-1 text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
          💛 Dukung via GoPay <span className="font-mono2 font-bold">0857-6362-2979</span>
        </p>
      </footer>

      {toast && (
        <div ref={toastRef} role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-line bg-white dark:bg-neutral-900 px-5 py-3 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}

      {/* Floating action bar — khusus HP: Preview saja */}
      {tab !== "saran" && (
        <>
          <div className="h-24 lg:hidden" />
          <div
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex justify-center px-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center gap-1 rounded-full border border-line bg-white/95 dark:bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur">
              <button
                onClick={() => setPreviewOpen(true)}
                className="rounded-full px-7 py-3 font-bold text-[15px] text-neutral-700 dark:text-neutral-200 transition active:scale-95"
              >
                👁️ Preview
              </button>
            </div>
          </div>
        </>
      )}
    </div>


    {/* Print sheet — sibling app-shell, hanya muncul saat cetak (bugfix: sebelumnya di dalam display:none) */}
    <div className="print-sheet">
      <InvoiceSheet inv={inv} profile={profile} settings={settings} id="print-invoice" />
    </div>

    {/* Modal preview full-screen khusus HP */}
    {previewOpen && (
      <MobilePreviewModal inv={inv} profile={profile} settings={settings} onClose={() => setPreviewOpen(false)} />
    )}

    {/* Side drawer (burger menu) */}
    {drawer && (
      <>
        <div className="drawer-backdrop no-print fixed inset-0 z-40 bg-black/40" onClick={() => setDrawer(false)} />
        <aside role="dialog" aria-modal="true" aria-label="Menu" className="drawer-panel no-print fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-neutral-900 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
            <p className="font-extrabold text-[15px] tracking-tight">Menu</p>
            <button aria-label="Tutup menu"
              onClick={() => setDrawer(false)}
              title="Tutup"
              className="brutal-btn h-9 w-9 rounded-lg text-base leading-none"
            >
              ✕
            </button>
          </div>
          <nav className="p-2.5 space-y-1">
            <DrawerItem icon="📝" label="Buat nota" active={tab === "buat"} onClick={() => goTab("buat")} />
            <DrawerItem icon="＋" label="Nota baru" onClick={() => { handleNew(); setDrawer(false); }} />
            <DrawerItem icon="📋" label="Riwayat nota" active={tab === "riwayat"} onClick={() => goTab("riwayat")} />
            <DrawerItem icon="💡" label="Kritik & saran" active={tab === "saran"} onClick={() => goTab("saran")} />
          </nav>
          <div className="mt-auto p-2.5 border-t border-line">
            <DrawerItem
              icon={dark ? "☀️" : "🌙"}
              label={dark ? "Mode terang" : "Mode gelap"}
              onClick={toggleDark}
            />
          </div>
        </aside>
      </>
    )}
    </>
  );
}
