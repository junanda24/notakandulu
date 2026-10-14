// Wizard step 2: item barang/jasa (baris kompak, ketuk untuk edit) + hitungan (baris setelan + total live).
import { useRef, useState } from "react";
import { Field, TextInput, TextArea, Select, Card, Collapse } from "../ui.jsx";
import { TERMS, UNITS, useInvSet } from "./shared.jsx";
import { blankItem, calcTotals } from "../../lib/calc.js";
import { fmtMoney } from "../../lib/format.js";

// Angka tidak boleh negatif (min="0" cuma batasi spinner, ketikan manual lolos).
// String kosong dipertahankan supaya field tetap bisa dikosongkan user.
const clampNum = (v) => (v === "" || v == null ? "" : Math.max(0, Number(v) || 0));

function ItemRow({ it, index, open, onToggle, setItem, onDelete, canDelete }) {
  const lineTotal = (Number(it.qty) || 0) * (Number(it.price) || 0);
  return (
    <div className="rounded-xl border border-line bg-white dark:bg-neutral-900 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-cream/60 dark:active:bg-neutral-800/60 transition-colors"
      >
        <span className="w-[26px] h-[26px] rounded-lg bg-cream dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px] font-extrabold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-bold truncate">
            {it.name || <span className="text-neutral-400 font-semibold">Item baru…</span>}
          </span>
          <span className="block text-[11.5px] text-neutral-400 tabular-nums">
            {it.qty || 0} {it.unit || "pcs"} × {fmtMoney(Number(it.price) || 0)}
          </span>
        </span>
        <span className="text-[13.5px] font-extrabold tabular-nums shrink-0">{fmtMoney(lineTotal)}</span>
        <span className={`text-neutral-300 dark:text-neutral-600 text-[10px] transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      <Collapse open={open}>
        <div className="border-t border-dashed border-line bg-cream/50 dark:bg-neutral-800/40 px-3.5 py-3">
          <TextInput
            value={it.name}
            onChange={(e) => setItem(it.id, { name: e.target.value })}
            placeholder="Nama barang / jasa"
            className="mb-2.5"
          />
          <div className="grid grid-cols-3 gap-2">
            <Field label="Qty">
              <TextInput type="number" min="0" value={it.qty} onChange={(e) => setItem(it.id, { qty: clampNum(e.target.value) })} />
            </Field>
            <Field label="Satuan">
              <Select value={it.unit || "pcs"} onChange={(e) => setItem(it.id, { unit: e.target.value })}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
                {it.unit && !UNITS.includes(it.unit) && <option value={it.unit}>{it.unit}</option>}
              </Select>
            </Field>
            <Field label="Harga">
              <TextInput type="number" min="0" value={it.price} onChange={(e) => setItem(it.id, { price: clampNum(e.target.value) })} />
            </Field>
          </div>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(it.id)}
              className="mt-2.5 w-full rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[13px] font-bold py-2 active:scale-[0.99] transition"
            >
              Hapus item ini
            </button>
          )}
        </div>
      </Collapse>
    </div>
  );
}

function HitungRow({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[13.5px] font-bold">{title}</p>
        {desc && <p className="text-[11px] text-neutral-400 mt-0.5">{desc}</p>}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">{children}</div>
    </div>
  );
}

export default function StepItem({ inv, setInv }) {
  const { set, setItem, delItem } = useInvSet(setInv);
  const [openId, setOpenId] = useState(() => inv.items[0]?.id || null);
  // Invoice yang dibuka berganti (mis. klik riwayat / nota baru) -> reset baris terbuka ke item pertama,
  // supaya data riwayat langsung kelihatan & bisa diedit tanpa harus ketuk tiap baris dulu.
  const invIdRef = useRef(inv.id);
  if (invIdRef.current !== inv.id) {
    invIdRef.current = inv.id;
    setOpenId(inv.items[0]?.id || null);
  }
  const t = calcTotals(inv);
  const cur = inv.currency || "IDR";

  const addAndOpen = () => {
    const it = blankItem();
    setInv((p) => ({ ...p, items: [...p.items, it] }));
    setOpenId(it.id);
  };

  const segBtn = (active) =>
    `px-2.5 py-2 text-[13px] font-bold transition-colors ${active ? "bg-teal-600 text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40 p-4">
        <p className="text-sm font-bold">Langkah 2 — Apa saja yang ditagih?</p>
        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
          Tambah barang atau jasa satu per satu. Ketuk barisnya untuk ubah. Total dihitung otomatis.
        </p>
      </div>

      <Card
        title="Item"
        sticker={`x${inv.items.length}`}
        action={
          <button type="button" onClick={addAndOpen} className="text-[13px] font-extrabold text-teal-700 dark:text-teal-400 hover:underline">
            + Tambah
          </button>
        }
      >
        <div className="space-y-2">
          {inv.items.map((it, i) => (
            <ItemRow
              key={it.id}
              it={it}
              index={i}
              open={openId === it.id}
              onToggle={() => setOpenId(openId === it.id ? null : it.id)}
              setItem={setItem}
              onDelete={(id) => {
                if (openId === id) setOpenId(null);
                delItem(id);
              }}
              canDelete={inv.items.length > 1}
            />
          ))}
        </div>
      </Card>

      <Card title="Hitungan" sticker="otomatis">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <HitungRow title="Diskon" desc="Potongan dari subtotal">
            <TextInput
              type="number" min="0" value={inv.discount.value}
              onChange={(e) => set({ discount: { ...inv.discount, value: clampNum(e.target.value) } })}
              className="w-[88px]! text-right tabular-nums"
            />
            <div className="flex rounded-lg border border-line overflow-hidden" role="group" aria-label="Jenis diskon">
              <button type="button" aria-pressed={inv.discount.type === "percent"} className={segBtn(inv.discount.type === "percent")} onClick={() => set({ discount: { ...inv.discount, type: "percent" } })}>%</button>
              <button type="button" aria-pressed={inv.discount.type === "fixed"} className={segBtn(inv.discount.type === "fixed")} onClick={() => set({ discount: { ...inv.discount, type: "fixed" } })}>Rp</button>
            </div>
          </HitungRow>
          <HitungRow title="Pajak" desc="PPN / pajak lain">
            <TextInput
              type="number" min="0" value={inv.tax}
              onChange={(e) => set({ tax: clampNum(e.target.value) })}
              className="w-[88px]! text-right tabular-nums"
            />
            <span className="text-[13px] font-bold text-neutral-400 w-[18px] text-center">%</span>
          </HitungRow>
          <HitungRow title="Ongkir" desc="Biaya pengiriman">
            <span className="text-[13px] font-bold text-neutral-400">Rp</span>
            <TextInput
              type="number" min="0" value={inv.shipping}
              onChange={(e) => set({ shipping: clampNum(e.target.value) })}
              className="w-[110px]! text-right tabular-nums"
            />
          </HitungRow>
          <HitungRow title="Uang muka (DP)" desc="Dibayar di depan">
            <span className="text-[13px] font-bold text-neutral-400">Rp</span>
            <TextInput
              type="number" min="0" value={inv.dp ?? ""}
              onChange={(e) => set({ dp: clampNum(e.target.value) })}
              className="w-[110px]! text-right tabular-nums"
            />
          </HitungRow>
        </div>

        <div className="pt-3">
          <p className="text-[13.5px] font-bold mb-2">Syarat pembayaran</p>
          <div className="flex gap-1.5 flex-wrap">
            {TERMS.map((term) => {
              const on = inv.terms === term;
              return (
                <button
                  key={term}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set({ terms: on ? "" : term })}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${on ? "border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300" : "border-line text-neutral-500 dark:text-neutral-400"}`}
                >
                  {term}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Catatan" className="mt-3">
          <TextArea rows={2} value={inv.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Syarat & ketentuan, ucapan terima kasih, dsb." />
        </Field>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-neutral-900 dark:bg-black px-4 py-3">
          <span className="text-[12px] font-semibold text-neutral-400">Total tagihan</span>
          <span className="text-[17px] font-extrabold text-white tabular-nums">{fmtMoney(t.total, cur)}</span>
        </div>
      </Card>
    </div>
  );
}
