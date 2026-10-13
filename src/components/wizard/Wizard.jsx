// Wizard pembuatan nota: stepper 4-5 langkah, progress bisa diklik, data tidak hilang saat mundur.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import CustomizePanel from "../CustomizePanel.jsx";
import StepData from "./StepData.jsx";
import StepItem from "./StepItem.jsx";
import StepKirim from "./StepKirim.jsx";
import { getSteps } from "./shared.jsx";
import { Btn } from "../ui.jsx";

// Stepper kanonis: lingkaran indikator + garis konektor + label (anatomi baku Material/Flowbite).
// Ditaruh di konten (bukan nav) biar dapat ruang vertikal yang layak.
export function Stepper({ steps, idx, onJump }) {
  return (
    <div className="mb-6">
      <ol className="flex items-start">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          const last = i === steps.length - 1;
          return (
            <li key={s.id} className={`flex items-start ${last ? "" : "flex-1"}`}>
              <button
                onClick={() => onJump(s.id)}
                aria-current={active ? "step" : undefined}
                title={s.title}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-extrabold tabular-nums transition ${
                    active
                      ? "bg-teal-600 text-white ring-4 ring-teal-600/20"
                      : done
                        ? "bg-teal-600 text-white"
                        : "border-2 border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-[11px] sm:text-[12px] whitespace-nowrap ${
                    active
                      ? "font-bold text-neutral-900 dark:text-neutral-100"
                      : done
                        ? "font-semibold text-neutral-600 dark:text-neutral-300"
                        : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {s.short}
                </span>
              </button>
              {!last && (
                <span className={`mt-4 h-0.5 flex-1 mx-1.5 sm:mx-2.5 rounded-full ${done ? "bg-teal-500" : "bg-neutral-200 dark:bg-neutral-800"}`} />
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 mt-2.5 tabular-nums">
        Langkah {idx + 1} dari {steps.length}
      </p>
    </div>
  );
}

export default function Wizard({
  inv, setInv, profile, persistProfile, settings, persistSettings,
  stepId, setStepId, onSave, onNew, onClearInv, onGotoToko, onGotoRiwayat,
}) {
  const topRef = useRef(null);
  const contentRef = useRef(null);
  const stepDir = useRef(1);
  const firstStep = useRef(true);
  const steps = getSteps(profile);
  let idx = steps.findIndex((s) => s.id === stepId);
  if (idx < 0) idx = 0; // step tersimpan tak lagi valid (mis. toko sudah diisi) -> ke awal
  const cur = steps[idx];

  const go = (id) => {
    const ni = steps.findIndex((s) => s.id === id);
    if (ni >= 0) stepDir.current = ni >= idx ? 1 : -1;
    setStepId(id);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ block: "start" });
      window.scrollTo({ top: 0 });
    });
  };

  // Transisi antar step: slide searah navigasi + fade.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (firstStep.current) { firstStep.current = false; return; }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      el,
      { x: 44 * stepDir.current, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.38, ease: "power3.out", overwrite: true, clearProps: "transform" }
    );
  }, [cur.id]);
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
      <Stepper steps={steps} idx={idx} onJump={go} />

      <div ref={contentRef}>
        {cur.id === "data" && <StepData inv={inv} setInv={setInv} profile={profile} persistProfile={persistProfile} onClearInv={onClearInv} />}
        {cur.id === "item" && <StepItem inv={inv} setInv={setInv} />}
        {cur.id === "gaya" && <CustomizePanel settings={settings} setSettings={persistSettings} />}
        {cur.id === "kirim" && (
          <StepKirim inv={inv} setInv={setInv} profile={profile} settings={settings} onSave={onSave} onNew={onNew} onGotoToko={onGotoToko} onGotoRiwayat={onGotoRiwayat} />
        )}
      </div>

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
