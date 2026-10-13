import { useEffect, useMemo, useState } from "react";
import Wizard, { NavStepper } from "./components/wizard/Wizard.jsx";
import { getSteps, STEP_IDS } from "./components/wizard/shared.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import Preview, { InvoiceSheet, MobilePreviewModal } from "./components/Preview.jsx";
import { Btn } from "./components/ui.jsx";
import { blankInvoice } from "./lib/calc.js";
import { expandNumber, todayIso } from "./lib/format.js";
import {
  getProfile, setProfile, getSettings, setSettings,
  getHistory, saveToHistory, deleteHistory, nextCounter, peekCounter, migrate,
} from "./lib/storage.js";

import SaranPanel from "./components/SaranPanel.jsx";
import WelcomeModal from "./components/WelcomeModal.jsx";
import Splash from "./components/Splash.jsx";

export default function App() {
  const [tab, setTab] = useState("buat");
  const [splash, setSplash] = useState(true);
  const [mobileView, setMobileView] = useState("form"); // form | preview (khusus HP)
  const [previewOpen, setPreviewOpen] = useState(false); // modal preview full-screen (HP)
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
  const goTab = (id) => { setTab(id); setMobileView("form"); };
  // Posisi wizard (disimpan biar refresh tidak mengulang dari awal)
  const [wstep, setWstep] = useState(() => {
    try {
      const s = localStorage.getItem("notakandulu:wstep");
      if (s && STEP_IDS.includes(s)) return s;
    } catch {}
    try {
      const p = getProfile();
      return p?.shopName?.trim() ? "pelanggan" : "toko";
    } catch { return "pelanggan"; }
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
    // Mulai dari Toko kalau profil kosong, kalau tidak langsung ke Pelanggan (Toko tetap bisa diklik)
    persistWstep(profile?.shopName?.trim() ? "pelanggan" : "toko");
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
        onNew={handleNew}
        onGotoToko={() => { setTab("buat"); persistWstep("toko"); }}
        onGotoRiwayat={() => setTab("riwayat")}
      />
    );
    if (tab === "saran") return <SaranPanel />;
    return (
      <HistoryPanel
        history={history}
        onOpen={openHistory}
        onDelete={(id) => setHistory(deleteHistory(id))}
        onToggleStatus={(id) => {
          const item = history.find((h) => h.id === id);
          if (!item) return;
          setHistory(saveToHistory({ ...item, status: (item.status || "belum") === "lunas" ? "belum" : "lunas" }));
        }}
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
  }, [tab, inv, profile, settings, history, wstep]);

  // Info langkah wizard untuk badge tab "Buat Nota" + redup pratinjau di langkah awal
  const wizSteps = getSteps(profile);
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
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Riwayat & Saran pindah ke header — nav fokus 100% ke stepper */}
            <button
              onClick={() => goTab("riwayat")}
              title="Riwayat nota"
              className={`brutal-btn h-9 rounded-lg px-2.5 text-base flex items-center gap-1.5 ${tab === "riwayat" ? "bg-teal-600! border-teal-600! text-white" : ""}`}
            >
              📋<span className="hidden md:inline text-[13px] font-bold">Riwayat</span>
            </button>
            <button
              onClick={() => goTab("saran")}
              title="Kritik & saran"
              className={`brutal-btn h-9 rounded-lg px-2.5 text-base flex items-center gap-1.5 ${tab === "saran" ? "bg-teal-600! border-teal-600! text-white" : ""}`}
            >
              💡<span className="hidden md:inline text-[13px] font-bold">Saran</span>
            </button>
            <span className="w-px h-6 bg-line mx-0.5" />
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
            <Btn onClick={handleNew} title="Buat nota baru" className="py-1.5! px-3! text-xs!">
              <span className="md:hidden text-sm font-extrabold">+</span>
              <span className="hidden md:inline">+ Baru</span>
            </Btn>
            <Btn onClick={handleSave} primary className="py-1.5! px-3! text-xs!">Simpan</Btn>
          </div>
        </div>
        {/* Nav: 100% stepper — fokus penuh ke alur pembuatan */}
        <nav className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-2">
            <NavStepper
              steps={wizSteps}
              idx={wizIdx}
              onJump={(id) => { goTab("buat"); persistWstep(id); }}
            />
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5">
        {tab === "saran" ? (
          <div className="mx-auto max-w-2xl">{formPanel}</div>
        ) : (
        <div className="grid gap-5 lg:grid-cols-[440px_1fr]">
          <div className={mobileView === "form" ? "block" : "hidden lg:block"}>
            {formPanel}
          </div>
          <div className={mobileView === "preview" ? "block" : "hidden lg:block"}>
            <div className={`lg:sticky lg:top-[132px] transition-opacity duration-300 ${dimPreview ? "lg:opacity-40" : ""}`}>
              {dimPreview && (
                <p className="hidden lg:block text-center text-[11px] text-neutral-400 mb-2">
                  Pratinjau live — lanjutkan langkah untuk melihat hasil akhir
                </p>
              )}
              <Preview inv={inv} profile={profile} settings={settings} />
            </div>
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
        <p className="mx-auto max-w-7xl px-4 pb-4 pt-1 text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
          💛 Dukung via GoPay <span className="font-mono2 font-bold">0857-6362-2979</span>
        </p>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-line bg-white dark:bg-neutral-900 px-5 py-3 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}
    </div>

      {/* Floating preview button — khusus HP */}
      {tab !== "saran" && (
        <>
          <div className="h-24 lg:hidden" />
          <div
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex justify-center px-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <button
              onClick={() => setPreviewOpen(true)}
              className="rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3.5 shadow-2xl text-[15px] transition active:scale-95"
            >
              👁️ Preview Invoice Ku
            </button>
          </div>
        </>
      )}

    {/* Print sheet — sibling app-shell, hanya muncul saat cetak (bugfix: sebelumnya di dalam display:none) */}
    <div className="print-sheet">
      <InvoiceSheet inv={inv} profile={profile} settings={settings} id="print-invoice" />
    </div>

    {/* Modal preview full-screen khusus HP */}
    {previewOpen && (
      <MobilePreviewModal inv={inv} profile={profile} settings={settings} onClose={() => setPreviewOpen(false)} />
    )}
    </>
  );
}
