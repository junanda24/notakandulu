// Wizard step 4 (terakhir): ringkasan nota, pilih pembayaran, simpan & kirim.
import { Card, Btn } from "../ui.jsx";
import { calcTotals } from "../../lib/calc.js";
import { fmtMoney, fmtDate } from "../../lib/format.js";

export default function StepKirim({ inv, setInv, profile, onSave, onGotoToko }) {
  const t = calcTotals(inv);
  const hasPayments = (profile.payments || []).length > 0;
  const togglePayment = (pid) =>
    setInv((p) => ({
      ...p,
      paymentIds: (p.paymentIds || []).includes(pid)
        ? p.paymentIds.filter((x) => x !== pid)
        : [...(p.paymentIds || []), pid],
    }));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40 p-4">
        <p className="text-sm font-bold">Langkah terakhir — Cek & kirim</p>
        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
          Periksa ringkasan di bawah. Kalau sudah pas, simpan notanya.
        </p>
      </div>

      <Card title="Ringkasan Nota" sticker={inv.number || "tanpa nomor"}>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Pelanggan</dt>
            <dd className="font-semibold text-right">{inv.customerName || <span className="text-neutral-400">belum diisi</span>}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Tanggal</dt>
            <dd className="font-semibold">{fmtDate(inv.date)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Item</dt>
            <dd className="font-semibold">{inv.items.length} item</dd>
          </div>
          {t.discountAmt > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Diskon</dt>
              <dd className="font-semibold">−{fmtMoney(t.discountAmt, inv.currency)}</dd>
            </div>
          )}
          {t.taxAmt > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Pajak</dt>
              <dd className="font-semibold">{fmtMoney(t.taxAmt, inv.currency)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-3 border-t border-line pt-2">
            <dt className="font-bold">Total tagihan</dt>
            <dd className="font-extrabold text-teal-700 dark:text-teal-400 tabular-nums">{fmtMoney(t.total, inv.currency)}</dd>
          </div>
        </dl>
      </Card>

      {!hasPayments ? (
        <div className="rounded-xl border border-dashed border-line p-4 text-[13px] text-neutral-500 dark:text-neutral-400">
          Belum ada rekening tersimpan.{" "}
          <button onClick={onGotoToko} className="font-bold text-teal-600 dark:text-teal-400 underline">
            Tambah di tab Toko
          </button>{" "}
          biar info pembayaran muncul di nota — atau lewati dulu.
        </div>
      ) : (
        <Card title="Pembayaran di nota" sticker="opsional">
          <p className="mb-2 font-mono2 text-[10px] text-neutral-500">Pilih metode yang tampil di nota ini:</p>
          <div className="flex flex-wrap gap-2">
            {(profile.payments || []).map((p) => {
              const on = (inv.paymentIds || []).includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePayment(p.id)}
                  className={`brutal-sm rounded-lg px-3 py-1.5 text-xs font-bold transition ${on ? "bg-teal-600 border-teal-600 text-white" : "opacity-60"}`}
                >
                  {on ? "✓ " : ""}{p.label} · {p.number}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Btn onClick={onSave} primary className="w-full py-3! text-base!">
        Simpan Nota
      </Btn>
      <p className="text-center text-[12px] text-neutral-500 dark:text-neutral-400">
        Setelah tersimpan, ekspor PNG/PDF atau kirim via WA dari panel pratinjau.
      </p>
    </div>
  );
}
