import { useEffect, useMemo, useState } from "react";
import InvoiceForm from "./components/InvoiceForm.jsx";
import ShopPanel from "./components/ShopPanel.jsx";
import CustomizePanel from "./components/CustomizePanel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import Preview, { InvoiceSheet } from "./components/Preview.jsx";
import { Btn } from "./components/ui.jsx";
import { blankInvoice } from "./lib/calc.js";
import { expandNumber, todayIso } from "./lib/format.js";
import {
  getProfile, setProfile, getSettings, setSettings,
  getHistory, saveToHistory, deleteHistory, nextCounter, peekCounter, migrate,
} from "./lib/storage.js";

const TABS = [
  { id: "buat", name: "Buat Nota" },
  { id: "toko", name: "Toko" },
  { id: "gaya", name: "Gaya" },
  { id: "riwayat", name: "Riwayat" },
];

export default function App() {
  const [tab, setTab] = useState("buat");
  const [mobileView, setMobileView] = useState("form"); // form | preview (khusus HP)
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("notakandulu:theme");
      const isDark = saved ? saved === "dark" : window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      if (isDark) document.documentElement.classList.add("dark");
      return !!isDark;
    } catch { return false; }
  });
  const [profile, setProfileState] = useState(() => { migrate(); return getProfile(); });
  const [settings, setSettingsState] = useState(getSettings);
  const [history, setHistory] = useState(getHistory);
  const [toast, setToast] = useState("");

  const newNumber = () =>
    expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", peekCounter(), todayIso());
  const [inv, setInv] = useState(() => blankInvoice({ number: "", date: todayIso(), currency: getSettings().currency }));

  // Nomor otomatis terisi saat nota masih kosong
  useEffect(() => {
    setInv((p) => (p.number ? p : { ...p, number: newNumber() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistProfile = (updater) =>
    setProfileState((p) => {
      const np = typeof updater === "function" ? updater(p) : updater;
      setProfile(np);
      return np;
    });
  const persistSettings = (updater) =>
    setSettingsState((s) => {
      const ns = typeof updater === "function" ? updater(s) : updater;
      setSettings(ns);
      return ns;
    });

  // Sinkron mata uang settings -> nota baru
  useEffect(() => {
    setInv((p) => ({ ...p, currency: settings.currency }));
  }, [settings.currency]);

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const handleSave = () => {
    // kunci nomor: naikkan counter begitu nota disimpan
    const finalInv = inv.number ? inv : { ...inv, number: expandNumber(settings.numberPattern, nextCounter(), inv.date) };
    if (inv.number && !history.some((h) => h.id === inv.id)) {
      // nomor manual pertama kali disimpan -> tetap majukan counter agar tak bentrok
      nextCounter();
    }
    finalInv.templateUsed = settings.template;
    setHistory(saveToHistory(finalInv));
    setInv(finalInv);
    showToast("Nota tersimpan ✓");
  };

  const handleNew = () => {
    setInv(blankInvoice({ number: expandNumber(settings.numberPattern, peekCounter(), todayIso()), date: todayIso(), currency: settings.currency }));
    setTab("buat");
    setMobileView("form");
    showToast("Nota baru ✓");
  };

  const openHistory = (h, duplicate = false) => {
    if (duplicate) {
      const copy = { ...h, id: `${Date.now().toString(36)}-dup`, number: expandNumber(settings.numberPattern, peekCounter(), todayIso()) };
      setInv({ ...copy, items: copy.items.map((it) => ({ ...it })) });
      showToast("Diduplikasi — simpan untuk mengunci nomor");
    } else {
      setInv({ ...h, items: h.items.map((it) => ({ ...it })) });
    }
    setTab("buat");
    setMobileView("form");
  };

  const formPanel = useMemo(() => {
    if (tab === "buat") return <InvoiceForm inv={inv} setInv={setInv} profile={profile} />;
    if (tab === "toko") return <ShopPanel profile={profile} setProfile={persistProfile} />;
    if (tab === "gaya") return <CustomizePanel settings={settings} setSettings={persistSettings} />;
    return (
      <HistoryPanel
        history={history}
        onOpen={openHistory}
        onDelete={(id) => setHistory(deleteHistory(id))}
        onNew={handleNew}
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
  }, [tab, inv, profile, settings, history]);

  return (
    <>
    <div className="app-shell min-h-screen">
      {/* Header netral */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-base font-extrabold">T</span>
            <div>
              <h1 className="text-[15px] font-extrabold tracking-tight leading-none">Tagihkan</h1>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Invoice elegant, gratis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !dark;
                setDark(next);
                document.documentElement.classList.toggle("dark", next);
                try { localStorage.setItem("notakandulu:theme", next ? "dark" : "light"); } catch {}
              }}
              title={dark ? "Mode terang" : "Mode gelap"}
              className="brutal-btn h-9 w-9 rounded-lg text-base"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <Btn onClick={handleNew} className="py-1.5! px-3! text-xs!">+ Baru</Btn>
            <Btn onClick={handleSave} primary className="py-1.5! px-3! text-xs!">Simpan</Btn>
          </div>
        </div>
        {/* Tab nav */}
        <nav className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto py-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setMobileView("form"); }}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${tab === t.id ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500 hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile: toggle form/preview */}
      <div className="lg:hidden sticky top-[104px] z-10 border-b border-line bg-cream px-4 py-2">
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-neutral-100 dark:bg-neutral-800 p-1">
          {(["form", "preview"]).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={`rounded-md py-1.5 text-xs font-semibold transition ${mobileView === v ? "bg-white dark:bg-neutral-900 shadow-sm" : "text-neutral-500"}`}
            >
              {v === "form" ? "Isi" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
          <div className={mobileView === "form" ? "block" : "hidden lg:block"}>
            {formPanel}
          </div>
          <div className={mobileView === "preview" ? "block" : "hidden lg:block"}>
            <div className="lg:sticky lg:top-[132px]">
              <Preview inv={inv} profile={profile} settings={settings} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-line mt-8">
        <p className="mx-auto max-w-7xl px-4 py-4 text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
          Tagihkan — buat invoice gratis, tanpa iklan dan login itu nyata 🔥
        </p>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-line bg-white dark:bg-neutral-900 px-5 py-3 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}
    </div>

    {/* Print sheet — sibling app-shell, hanya muncul saat cetak (bugfix: sebelumnya di dalam display:none) */}
    <div className="print-sheet">
      <InvoiceSheet inv={inv} profile={profile} settings={settings} id="print-invoice" />
    </div>
    </>
  );
}
