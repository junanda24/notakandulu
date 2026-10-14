// Modal selamat datang — tampil sekali saat pertama kali buka.
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TEMPLATES } from "../data/options.js";

const WELCOME_KEY = "notakandulu:welcomed";

const STEPS = [
  { icon: "📝", title: "Ikuti 4 langkah", desc: "Data, item, gaya, kirim — tinggal ikuti panduannya sampai nota jadi." },
  { icon: "🎨", title: "Atur gayanya", desc: `${TEMPLATES.length} template elegan di Langkah Gaya, dari formal sampai struk thermal.` },
  { icon: "📤", title: "Simpan & bagikan", desc: "Ekspor PNG/PDF atau kirim langsung via WhatsApp." },
];

export default function WelcomeModal() {
  const [show, setShow] = useState(() => {
    try { return localStorage.getItem(WELCOME_KEY) !== "1"; } catch { return true; }
  });
  useEffect(() => {
    if (!show) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".wm-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
    gsap.fromTo(
      ".wm-card",
      { scale: 0.9, y: 24, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }
    );
    return () => { gsap.killTweensOf(".wm-backdrop"); gsap.killTweensOf(".wm-card"); };
  }, [show]);
  if (!show) return null;
  const close = () => {
    try { localStorage.setItem(WELCOME_KEY, "1"); } catch {}
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setShow(false); return; }
    gsap.to(".wm-card", { scale: 0.94, y: 10, opacity: 0, duration: 0.22, ease: "power2.in" });
    gsap.to(".wm-backdrop", { opacity: 0, duration: 0.25, ease: "power1.in", onComplete: () => setShow(false) });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="wm-backdrop absolute inset-0" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }} />
      <div className="wm-card relative bg-white dark:bg-neutral-900 rounded-2xl border border-line shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
        <img src="/logo.jpg" alt="Logo TagihkanDulu" className="inline h-12 w-12 rounded-xl object-cover" />
        <h2 className="text-xl font-extrabold tracking-tight mt-4">Selamat datang di TagihkanDulu</h2>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
          Buat invoice gratis, tanpa iklan dan login itu nyata 🔥
        </p>
        <div className="text-left mt-5 space-y-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-2xl leading-none mt-0.5">{s.icon}</span>
              <div>
                <p className="text-sm font-bold">{i + 1}. {s.title}</p>
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={close}
          className="mt-6 w-full rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 text-[15px] transition"
        >
          Mulai bikin invoice →
        </button>
        <div className="text-[11px] text-neutral-400 mt-3 space-y-1">
          <p>🔒 Datamu 100% privat: tersimpan hanya di browser ini, tidak dikirim ke mana pun.</p>
          <p>⚠️ Tanpa akun berarti tanpa backup otomatis. Ekspor backup rutin di menu ☰ → Riwayat.</p>
        </div>
      </div>
    </div>
  );
}
