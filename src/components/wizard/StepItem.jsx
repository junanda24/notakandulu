// Wizard step 2: item barang/jasa + hitungan (diskon, pajak, ongkir, DP, catatan).
import { Field, TextInput, TextArea, Select, Card } from "../ui.jsx";
import { Advanced, TERMS, UNITS, useInvSet } from "./shared.jsx";

export default function StepItem({ inv, setInv }) {
  const { set, setItem, addItem, delItem } = useInvSet(setInv);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40 p-4">
        <p className="text-sm font-bold">Langkah 2 — Apa saja yang ditagih?</p>
        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
          Tambah barang atau jasa satu per satu. Total dihitung otomatis.
        </p>
      </div>

      <Card title="Item" sticker={`${inv.items.length} item`}>
        <div className="space-y-3">
          {inv.items.map((it, i) => (
            <div key={it.id} className="brutal-sm rounded-lg bg-cream p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono2 text-[10px] font-bold text-neutral-500">#{i + 1}</span>
                <button onClick={() => delItem(it.id)} className="font-mono2 text-[10px] font-bold text-red-600 hover:underline">
                  hapus
                </button>
              </div>
              <TextInput value={it.name} onChange={(e) => setItem(it.id, { name: e.target.value })} placeholder="Nama barang / jasa" className="mb-2" />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Qty">
                  <TextInput type="number" min="0" value={it.qty} onChange={(e) => setItem(it.id, { qty: e.target.value })} />
                </Field>
                <Field label="Satuan">
                  <Select value={it.unit || "pcs"} onChange={(e) => setItem(it.id, { unit: e.target.value })}>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                    {it.unit && !UNITS.includes(it.unit) && <option value={it.unit}>{it.unit}</option>}
                  </Select>
                </Field>
                <Field label="Harga satuan">
                  <TextInput type="number" min="0" value={it.price} onChange={(e) => setItem(it.id, { price: e.target.value })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="brutal-btn rounded-lg mt-3 w-full px-4 py-2 text-sm font-semibold">
          + Tambah item
        </button>
      </Card>

      <Card title="Hitungan">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Diskon">
            <div className="flex gap-1.5">
              <TextInput type="number" min="0" value={inv.discount.value} onChange={(e) => set({ discount: { ...inv.discount, value: e.target.value } })} className="px-2!" />
              <Select value={inv.discount.type} onChange={(e) => set({ discount: { ...inv.discount, type: e.target.value } })} className="w-[70px]! px-1!">
                <option value="percent">%</option>
                <option value="fixed">Rp</option>
              </Select>
            </div>
          </Field>
        </div>
        <Advanced title="Opsi lanjutan: pajak, ongkir, DP, syarat">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pajak %">
              <TextInput type="number" min="0" value={inv.tax} onChange={(e) => set({ tax: e.target.value })} />
            </Field>
            <Field label="Ongkir">
              <TextInput type="number" min="0" value={inv.shipping} onChange={(e) => set({ shipping: e.target.value })} />
            </Field>
            <Field label="Uang muka (DP)">
              <TextInput type="number" min="0" value={inv.dp || 0} onChange={(e) => set({ dp: e.target.value })} />
            </Field>
            <Field label="Syarat pembayaran (opsional)">
              <Select value={inv.terms || ""} onChange={(e) => set({ terms: e.target.value })}>
                <option value="">— pilih atau kosongkan —</option>
                {TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
                {inv.terms && !TERMS.includes(inv.terms) && <option value={inv.terms}>{inv.terms}</option>}
              </Select>
            </Field>
          </div>
        </Advanced>
        <Field label="Catatan" className="mt-3">
          <TextArea rows={2} value={inv.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Syarat & ketentuan, ucapan terima kasih, dsb." />
        </Field>
      </Card>
    </div>
  );
}
