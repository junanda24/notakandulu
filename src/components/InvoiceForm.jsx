// Form isi nota: pelanggan, nomor, tanggal, items, diskon/pajak/ongkir, catatan, pembayaran.
import { Field, TextInput, TextArea, Select, Card } from "./ui.jsx";
import { blankItem } from "../lib/calc.js";
import { CURRENCIES } from "../lib/format.js";

const UNITS = ["pcs", "box", "pak", "lusin", "kodi", "kg", "gram", "liter", "meter", "m2", "jam", "hari", "minggu", "sesi", "kali", "orang", "porsi", "lot", "paket", "set", "unit"];
const TERMS = ["Net 7", "Net 14", "Net 30", "Dibayar saat terima"];

export default function InvoiceForm({ inv, setInv, profile }) {
  const set = (patch) => setInv((p) => ({ ...p, ...patch }));
  const setItem = (id, patch) =>
    setInv((p) => ({ ...p, items: p.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  const addItem = () => setInv((p) => ({ ...p, items: [...p.items, blankItem()] }));
  const delItem = (id) =>
    setInv((p) => ({ ...p, items: p.items.length > 1 ? p.items.filter((it) => it.id !== id) : p.items }));

  const togglePayment = (pid) =>
    setInv((p) => ({
      ...p,
      paymentIds: (p.paymentIds || []).includes(pid)
        ? p.paymentIds.filter((x) => x !== pid)
        : [...(p.paymentIds || []), pid],
    }));

  return (
    <div className="space-y-4">
      <Card title="📝 Data Nota" sticker="wajib">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nomor nota">
            <TextInput value={inv.number} onChange={(e) => set({ number: e.target.value })} placeholder="INV-2026-001" />
          </Field>
          <Field label="Tanggal">
            <TextInput type="date" value={inv.date} onChange={(e) => set({ date: e.target.value })} />
          </Field>
          <Field label="Jatuh tempo (opsional)">
            <TextInput type="date" value={inv.dueDate || ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </Field>
          <Field label="Status bayar">
            <Select value={inv.status || "belum"} onChange={(e) => set({ status: e.target.value })}>
              <option value="belum">Belum bayar</option>
              <option value="lunas">Lunas</option>
            </Select>
          </Field>
          <Field label="No. PO / referensi (opsional)">
            <TextInput value={inv.poNumber || ""} onChange={(e) => set({ poNumber: e.target.value })} placeholder="cth: PO-2026-118" />
          </Field>
          <Field label="Nama pelanggan">
            <TextInput value={inv.customerName} onChange={(e) => set({ customerName: e.target.value })} placeholder="Nama / perusahaan" />
          </Field>
          <Field label="NPWP pelanggan (opsional)">
            <TextInput value={inv.customerNpwp || ""} onChange={(e) => set({ customerNpwp: e.target.value })} placeholder="cth: 01.234.567.8-901.000" />
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
      </Card>

      <Card title="📦 Item" sticker={`${inv.items.length} item`}>
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

      <Card title="🧮 Hitungan">
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
          <Field label="Pajak %">
            <TextInput type="number" min="0" value={inv.tax} onChange={(e) => set({ tax: e.target.value })} />
          </Field>
          <Field label="Ongkir">
            <TextInput type="number" min="0" value={inv.shipping} onChange={(e) => set({ shipping: e.target.value })} />
          </Field>
          <Field label="Uang muka (DP)">
            <TextInput type="number" min="0" value={inv.dp || 0} onChange={(e) => set({ dp: e.target.value })} />
          </Field>
        </div>
        <Field label="Syarat pembayaran (opsional)" className="mt-3">
          <Select value={inv.terms || ""} onChange={(e) => set({ terms: e.target.value })}>
            <option value="">— pilih atau kosongkan —</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
            {inv.terms && !TERMS.includes(inv.terms) && <option value={inv.terms}>{inv.terms}</option>}
          </Select>
        </Field>
        <Field label="Catatan" className="mt-3">
          <TextArea rows={2} value={inv.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Syarat & ketentuan, ucapan terima kasih, dsb." />
        </Field>
      </Card>

      {(profile.payments || []).length > 0 && (
        <Card title="💳 Pembayaran di nota" sticker="opsional">
          <p className="mb-2 font-mono2 text-[10px] text-neutral-500">Pilih metode yang tampil di nota ini:</p>
          <div className="flex flex-wrap gap-2">
            {(profile.payments || []).map((p) => {
              const on = (inv.paymentIds || []).includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePayment(p.id)}
                  className={`brutal-sm rounded-lg px-3 py-1.5 text-xs font-bold transition ${on ? "bg-indigo-600 border-indigo-600 text-white" : "opacity-60"}`}
                >
                  {on ? "✓ " : ""}{p.label} · {p.number}
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
