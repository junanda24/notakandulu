// Wizard pembuatan nota: stepper 4-5 langkah, progress bisa diklik, data tidak hilang saat mundur.
import { useRef } from "react";
import ShopPanel from "../ShopPanel.jsx";
import CustomizePanel from "../CustomizePanel.jsx";
import StepPelanggan from "./StepPelanggan.jsx";
import StepItem from "./StepItem.jsx";
import StepKirim from "./StepKirim.jsx";
import { getSteps } from "./shared.jsx";
import { Btn } from "../ui.jsx";

// Stepper untuk nav header: segmented bar full-width, tiap step segmen tombol yang gampang di-tap.
export function NavStepper({ steps, idx, onJump }) {
  const SHORT = { toko: "Toko", pelanggan: "Pelanggan", item: "Item", gaya: "Gaya", kirim: "Kirim" };
  return (
    <ol className="flex gap-1 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900 p-1">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.id} className="flex-1 min-w-0">
            <button
              onClick={() => onJump(s.id)}
              aria-current={active ? "step" : undefined}
              title={s.title}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[12px] transition ${
                active
                  ? "bg-teal-600 text-white font-bold shadow"
                  : done
                    ? "text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-100/60 dark:hover:bg-teal-950"
                    : "text-neutral-400 dark:text-neutral-500 font-medium hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              <span className="tabular-nums font-extrabold shrink-0">{done ? "✓" : i + 1}</span>
              <span className="truncate hidden min-[420px]:inline">{SHORT[s.id] || s.title}</span>
            </button>
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
