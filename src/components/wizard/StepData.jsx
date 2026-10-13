// Wizard step 1 (gabungan): data toko + data pelanggan, dipisah section.
import { useState } from "react";
import ShopPanel from "../ShopPanel.jsx";
import StepPelanggan from "./StepPelanggan.jsx";
import { Btn } from "../ui.jsx";
import { sampleInvoice } from "./shared.jsx";

function Section({ title, subtitle, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="brutal">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 p-4 sm:p-5 text-left"
      >
        <span>
          <span className="block text-sm font-bold tracking-tight">{title}</span>
          {subtitle && !open && (
            <span className="block text-[11px] text-neutral-500 mt-0.5 truncate">{subtitle}</span>
          )}
        </span>
        <span className={`text-neutral-400 text-[11px] transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && <div className="px-4 sm:px-5 pb-4 sm:pb-5">{children}</div>}
    </section>
  );
}

export default function StepData({ inv, setInv, profile, persistProfile }) {
  const shopFilled = !!profile?.shopName?.trim();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40 p-4">
        <p className="text-sm font-bold">Langkah 1 — Toko & pelanggan</p>
        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
          Data tokomu cukup diisi sekali. Lalu isi siapa yang ditagih.
        </p>
        <Btn onClick={() => setInv((p) => ({ ...p, ...sampleInvoice() }))} className="mt-3 py-1.5! px-3! text-xs!">
          Isi data contoh
        </Btn>
      </div>

      <Section
        title="Toko Saya"
        subtitle={shopFilled ? profile.shopName : "Belum diisi"}
        defaultOpen={!shopFilled}
      >
        <ShopPanel profile={profile} setProfile={persistProfile} />
      </Section>

      <StepPelanggan inv={inv} setInv={setInv} />
    </div>
  );
}
