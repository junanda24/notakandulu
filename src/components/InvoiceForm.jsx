// Form isi nota: pelanggan, nomor, tanggal, items, diskon/pajak/ongkir, catatan, pembayaran.
import { useState } from "react";
import { Field, TextInput, TextArea, Select, Card } from "./ui.jsx";
import { blankItem } from "../lib/calc.js";
import { CURRENCIES, uid } from "../lib/format.js";

const UNITS = ["pcs", "box", "pak", "lusin", "kodi", "kg", "gram", "liter", "meter", "m2", "jam", "hari", "minggu", "sesi", "kali", "orang", "porsi", "lot", "paket", "set", "unit"];
const TERMS = ["Net 7", "Net 14", "Net 30", "Dibayar saat terima"];
const GUIDE_KEY = "notakandulu:hideGuide";

function sampleInvoice() {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);
  const iso = (d) => d.toISOString().slice(0, 10);
  return {
    number: "INV-2026-001",
    date: iso(today),
    dueDate: iso(due),
    status: "belum",
    currency: "IDR",
    customerName: "Budi Santoso",
    customerInfo: "Jl. Kenangan No. 5, Batam\n0812-3456-7890",
    customerNpwp: "",
    poNumber: "",
    tax: 11,
    discount: { type: "percent", value: 0 },
    shipping: 0,
    dp: 0,
    terms: "Net 14",
    notes: "Terima kasih atas kepercayaan Anda!",
    paymentIds: [],
    items: [
      { id: uid(), name: "Kopi Arabika 200g", qty: 2, unit: "pcs", price: 85000 },
      { id: uid(), name: "Jasa roasting", qty: 3, unit: "jam", price: 45000 },
    ],
  };
}

function Guide({ onSample }) {
  const [hide, setHide] = useState(() => {
    try { return localStorage.getItem(GUIDE_KEY) === "1"; } catch { return false; }
  });
  if (hide) return null;
  const dismiss = () => {
    try { localStorage.setItem(GUIDE_KEY, "1"); } catch {}
    setHide(true);
  };
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/40 p-4 relative">
      <button onClick={dismiss} className="absolute top-2 right-3 text-neutral-400 hover:text-neutral-600 text-lg leading-none" title="Tutup">×</button>
      <p className="text-sm font-bold mb-2">Cara pakai (30 detik):</p>
      <ol className="text-[13px] text-neutral-700 dark:text-neutral-300 space-y-1 list-none">
        <li><b>1.</b> Isi form di bawah, lalu <b>Simpan</b> — pratinjau live di kanan.</li>
        <li><b>2.</b> Pilih template di tab <b>Gaya</b> (18 pilihan).</li>
        <li><b>3.</b> Ekspor PNG/PDF atau bagikan via WA di panel pratinjau.</li>
      </ol>
      <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-2">Rekening/e-wallet diatur sekali di tab <b>Toko</b>.</p>
      <button
        onClick={onSample}
        className="mt-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold px-4 py-2 transition"
      >
        ✨ Isi data contoh
      </button>
    </div>
  );
}

function Advanced({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-3">
      <button onClick={() => setOpen(!open)} className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
        {open ? "▾" : "▸"} {title}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

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
      <Guide onSample={() => setInv((p) => ({ ...p, ...sampleInvoice() }))} />
      <Card title="📝 Data Nota" sticker="wajib">
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

      {(profile.payments || []).length === 0 && (
        <div className="rounded-xl border border-dashed border-line p-4 text-[13px] text-neutral-500 dark:text-neutral-400">
          💡 Tambah rekening / e-wallet di tab <b>Toko</b> biar info pembayaran muncul otomatis di nota.
        </div>
      )}
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
