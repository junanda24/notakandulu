// Wizard pembuatan nota: stepper 4-5 langkah, progress bisa diklik, data tidak hilang saat mundur.
import { useRef } from "react";
import ShopPanel from "../ShopPanel.jsx";
import CustomizePanel from "../CustomizePanel.jsx";
import StepPelanggan from "./StepPelanggan.jsx";
import StepItem from "./StepItem.jsx";
import StepKirim from "./StepKirim.jsx";
import { getSteps } from "./shared.jsx";
import { Btn } from "../ui.jsx";

function StepperHead({ steps, idx, onJump }) {
  // Label pendek biar 4-5 step muat di kolom wizard tanpa kepotong
  const SHORT = { toko: "Toko", pelanggan: "Pelanggan", item: "Item", gaya: "Gaya", kirim: "Kirim" };
  return (
    <div>
      {/* Desktop: numbered steps */}
      <ol className="hidden sm:flex items-center gap-1 mb-5">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={s.id} className="flex items-center min-w-0 flex-1 last:flex-none">
              <button
                onClick={() => onJump(s.id)}
                className="flex items-center gap-1.5 min-w-0 shrink-0"
                title={s.title}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold tabular-nums transition ${
                    active
                      ? "bg-teal-600 text-white"
                      : done
                        ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                        : "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={`text-[12px] whitespace-nowrap truncate ${active ? "font-bold text-ink" : "text-neutral-500 dark:text-neutral-400"}`}>
                  {SHORT[s.id] || s.title}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span className={`mx-1.5 h-px flex-1 min-w-2 ${done ? "bg-teal-500" : "bg-line"}`} />
              )}
            </li>
          );
        })}
      </ol>
      {/* Mobile: compact progress */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] font-bold text-neutral-500 tabular-nums">
            Langkah {idx + 1} dari {steps.length}
          </span>
          <span className="text-[12px] font-bold text-teal-700 dark:text-teal-400">{steps[idx].title}</span>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex gap-1.5 overflow-x-auto">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onJump(s.id)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === idx ? "bg-teal-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
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
      <StepperHead steps={steps} idx={idx} onJump={go} />

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
