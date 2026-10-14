// Wizard step 4 (terakhir): ringkasan nota, pilih pembayaran, simpan, ekspor & bagikan.
import { useEffect, useRef, useState } from "react";
import { Card, Btn, Collapse } from "../ui.jsx";
import { InvoiceSheet, ExportCard } from "../Preview.jsx";
import { calcTotals } from "../../lib/calc.js";
import { fmtMoney, fmtDate } from "../../lib/format.js";

export default function StepKirim({ inv, setInv, profile, settings, onSave, onNew, onGotoToko, onGotoRiwayat }) {
  const t = calcTotals(inv);
  const [saved, setSaved] = useState(false);
  // Nota baru (id beda) -> reset status tersimpan
  useEffect(() => { setSaved(false); }, [inv.id]);
  const doSave = () => { if (onSave()) setSaved(true); };
  // Sheet tersembunyi (off-screen) khusus untuk render PNG — html-to-image butuh node ter-layout
  const hiddenSheetRef = useRef(null);
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
            Tambah di Langkah Data
          </button>{" "}
          biar info pembayaran muncul di nota — atau lewati dulu.
        </div>
      ) : (
        <Card title="Pembayaran di nota" sticker="opsional">
          <p className="mb-2.5 font-mono2 text-[10px] text-neutral-500">Ketuk untuk pilih — boleh lebih dari satu. Yang kepilih tampil di nota.</p>
          <div className="space-y-2">
            {(profile.payments || []).map((p) => {
              const on = (inv.paymentIds || []).includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePayment(p.id)}
                  aria-pressed={on}
                  className={`w-full flex items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-2.5 text-left transition active:scale-[0.99] ${on ? "border-teal-600 bg-teal-50 dark:bg-teal-950/50" : "border-line bg-white dark:bg-neutral-900"}`}
                >
                  <span className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold text-white transition ${on ? "border-teal-600 bg-teal-600" : "border-neutral-300 dark:border-neutral-600"}`}>
                    {on ? "✓" : ""}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold truncate">{p.label}</span>
                    <span className="block text-[11.5px] text-neutral-500 tabular-nums truncate">{p.number}{p.holder ? ` · a.n. ${p.holder}` : ""}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Btn onClick={doSave} primary className="w-full py-3!">
        <span className="block text-base font-extrabold">Simpan Nota</span>
        <span className="mt-0.5 block text-[12.5px] font-semibold text-white/85 tabular-nums">
          {inv.number || "Tanpa nomor"} · {inv.items.length} item · {fmtMoney(t.total, inv.currency)}
        </span>
      </Btn>
      <Collapse open={saved}>
        <div className="rounded-xl border border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/50 p-4 text-center">
          <p className="text-2xl">✓</p>
          <p className="text-sm font-bold mt-1">Nota {inv.number || ""} tersimpan!</p>
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-1">
            Ekspor PNG/PDF atau kirim via WA langsung dari bawah ini.
          </p>
          <div className="mt-3 flex gap-2 justify-center">
            <Btn onClick={onNew} className="py-2! text-xs!">+ Buat nota baru</Btn>
            <Btn onClick={onGotoRiwayat} className="py-2! text-xs!">Lihat di Riwayat</Btn>
          </div>
        </div>
      </Collapse>
      {!saved && (
        <p className="text-center text-[12px] text-neutral-500 dark:text-neutral-400">
          Setelah tersimpan, ekspor atau bagikan langsung dari bawah ini.
        </p>
      )}

      <ExportCard inv={inv} profile={profile} settings={settings} sheetRef={hiddenSheetRef} />

      {/* Sheet off-screen untuk render PNG (tidak terlihat, tapi ter-layout untuk html-to-image) */}
      <div aria-hidden="true" style={{ position: "fixed", left: "-10000px", top: 0, pointerEvents: "none" }}>
        <div ref={hiddenSheetRef}>
          <InvoiceSheet inv={inv} profile={profile} settings={settings} />
        </div>
      </div>
    </div>
  );
}
