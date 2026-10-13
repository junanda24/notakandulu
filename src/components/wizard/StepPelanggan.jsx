// Wizard step 1: data pelanggan + data nota.
import { Field, TextInput, TextArea, Select, Card, Btn } from "../ui.jsx";
import { CURRENCIES } from "../../lib/format.js";
import { Advanced, sampleInvoice, useInvSet } from "./shared.jsx";

export default function StepPelanggan({ inv, setInv }) {
  const { set } = useInvSet(setInv);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40 p-4">
        <p className="text-sm font-bold">Langkah 1 — Siapa yang ditagih?</p>
        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
          Isi nama pelanggan dan tanggal nota. Sisanya bisa belakangan.
        </p>
        <Btn onClick={() => setInv((p) => ({ ...p, ...sampleInvoice() }))} className="mt-3 py-1.5! px-3! text-xs!">
          Isi data contoh
        </Btn>
      </div>

      <Card title="Data Nota" sticker="wajib">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nomor nota">
            <TextInput value={inv.number} onChange={(e) => set({ number: e.target.value })} placeholder="INV-2026-001" />
          </Field>
          <Field label="Tanggal">
            <TextInput type="date" value={inv.date} onChange={(e) => set({ date: e.target.value })} />
          </Field>
          <Field label="Nama pelanggan">
            <TextInput value={inv.customerName} onChange={(e) => set({ customerName: e.target.value })} placeholder="Nama / perusahaan" />
          </Field>
          <Field label="Status bayar">
            <Select value={inv.status || "belum"} onChange={(e) => set({ status: e.target.value })}>
              <option value="belum">Belum bayar</option>
              <option value="lunas">Lunas</option>
            </Select>
          </Field>
          <Field label="Mata uang">
            <Select value={inv.currency} onChange={(e) => set({ currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Info pelanggan (opsional)" className="mt-3">
          <TextArea rows={2} value={inv.customerInfo} onChange={(e) => set({ customerInfo: e.target.value })} placeholder="Alamat, no. HP, dsb." />
        </Field>
        <Advanced title="Opsi lanjutan">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jatuh tempo (opsional)">
              <TextInput type="date" value={inv.dueDate || ""} onChange={(e) => set({ dueDate: e.target.value })} />
            </Field>
            <Field label="No. PO / referensi (opsional)">
              <TextInput value={inv.poNumber || ""} onChange={(e) => set({ poNumber: e.target.value })} placeholder="cth: PO-2026-118" />
            </Field>
            <Field label="NPWP pelanggan (opsional)">
              <TextInput value={inv.customerNpwp || ""} onChange={(e) => set({ customerNpwp: e.target.value })} placeholder="cth: 01.234.567.8-901.000" />
            </Field>
          </div>
        </Advanced>
      </Card>
    </div>
  );
}
