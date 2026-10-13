// Wizard pembuatan nota: stepper 4-5 langkah, progress bisa diklik, data tidak hilang saat mundur.
import { useRef } from "react";
import ShopPanel from "../ShopPanel.jsx";
import CustomizePanel from "../CustomizePanel.jsx";
import StepPelanggan from "./StepPelanggan.jsx";
import StepItem from "./StepItem.jsx";
import StepKirim from "./StepKirim.jsx";
import { getSteps } from "./shared.jsx";
import { Btn } from "../ui.jsx";

// Stepper untuk nav header: selalu kelihatan (sticky), bisa diklik pindah step.
export function NavStepper({ steps, idx, onJump }) {
  // Label pendek biar muat tanpa kepotong
  const SHORT = { toko: "Toko", pelanggan: "Pelanggan", item: "Item", gaya: "Gaya", kirim: "Kirim" };
  return (
    <ol className="flex items-center gap-1 overflow-x-auto py-1">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.id} className="flex items-center min-w-0 flex-none">
            <button
              onClick={() => onJump(s.id)}
              className="flex items-center gap-1.5 min-w-0 shrink-0 rounded-lg px-1.5 py-1"
              title={s.title}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold tabular-nums transition ${
                  active
                    ? "bg-teal-600 text-white"
                    : done
                      ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                      : "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={`text-[12px] whitespace-nowrap ${active ? "font-bold text-ink" : "text-neutral-500 dark:text-neutral-400"}`}>
                {SHORT[s.id] || s.title}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span className={`mx-1 h-px w-3 shrink-0 ${done ? "bg-teal-500" : "bg-line"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function Wizard({
  inv, setInv, profile, persistProfile, settings, persistSettings,
  stepId, setStepId, onSave, onNew, onGotoToko, onGotoRiwayat,
}) {
  const topRef = useRef(null);
  const steps = getSteps(profile);
  let idx = steps.findIndex((s) => s.id === stepId);
  if (idx < 0) idx = 0; // step tersimpan tak lagi valid (mis. toko sudah diisi) -> ke awal
  const cur = steps[idx];

  const go = (id) => {
    setStepId(id);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ block: "start" });
      window.scrollTo({ top: 0 });
    });
  };
  const next = () => idx < steps.length - 1 && go(steps[idx + 1].id);
  const back = () => idx > 0 && go(steps[idx - 1].id);
  const isLast = idx === steps.length - 1;

  // Enter di input teks = Lanjut (biar alur ngebut). Textarea/select/button dikecualikan.
  const onKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const t = e.target;
    if (!t || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.tagName === "BUTTON") return;
    if (t.tagName === "INPUT" && ["checkbox", "color", "file"].includes(t.type)) return;
    e.preventDefault();
    next();
  };

  return (
    <div ref={topRef} className="scroll-mt-32" onKeyDown={onKeyDown}>
      {cur.id === "toko" && <ShopPanel profile={profile} setProfile={persistProfile} />}
      {cur.id === "pelanggan" && <StepPelanggan inv={inv} setInv={setInv} />}
      {cur.id === "item" && <StepItem inv={inv} setInv={setInv} />}
      {cur.id === "gaya" && <CustomizePanel settings={settings} setSettings={persistSettings} />}
      {cur.id === "kirim" && (
        <StepKirim inv={inv} setInv={setInv} profile={profile} settings={settings} onSave={onSave} onNew={onNew} onGotoToko={onGotoToko} onGotoRiwayat={onGotoRiwayat} />
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <Btn onClick={back} disabled={idx === 0} className={idx === 0 ? "invisible" : ""}>
          ← Kembali
        </Btn>
        {isLast ? (
          <span className="text-[12px] text-neutral-400">Sudah di langkah terakhir</span>
        ) : (
          <Btn onClick={next} primary>
            Lanjut →
          </Btn>
        )}
      </div>
    </div>
  );
}
