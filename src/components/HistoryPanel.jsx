// Riwayat nota tersimpan.
import { useRef, useState } from "react";
import { Card, Btn } from "./ui.jsx";
import { fmtMoney, fmtDate } from "../lib/format.js";
import { paymentStatus, STATUS_META } from "../lib/calc.js";
import { calcTotals } from "../lib/calc.js";
import { exportData, importData, storageInfo } from "../lib/storage.js";
import { computeStats } from "../lib/stats.js";

export default function HistoryPanel({ history, onOpen, onDelete, onNew, onRestored, settings }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");
  const info = storageInfo();
  const stats = computeStats(history, settings || {});

  const doExport = async () => {
    const r = await exportData();
    if (r.cancelled) return;
    setMsg(r.ok
      ? (r.via === "share" ? "Backup dibagikan ✓ — simpan ke Files" : "Backup diunduh ✓ — cek folder Download")
      : "Gagal: " + r.error);
    setTimeout(() => setMsg(""), 4000);
  };

  const doImport = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const r = importData(text);
    setMsg(r.ok ? "Backup dimuat ✓" : "Gagal: " + r.error);
    if (r.ok && onRestored) onRestored();
    e.target.value = "";
    setTimeout(() => setMsg(""), 3500);
  };

  return (
    <div className="space-y-4">
    <Card title="📊 Statistik" sticker="lokal · privat">
      {stats.totalInvoices === 0 ? (
        <p className="text-sm text-neutral-500">Belum ada data. Statistik muncul setelah kamu menyimpan nota.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="brutal-sm rounded-lg bg-cream p-2.5">
              <p className="font-display text-xl">{stats.totalInvoices}</p>
              <p className="font-mono2 text-[9px] font-bold text-neutral-500 mt-0.5">TOTAL NOTA</p>
            </div>
            <div className="brutal-sm rounded-lg bg-cream p-2.5">
              <p className="font-display text-xl">{stats.monthCount}</p>
              <p className="font-mono2 text-[9px] font-bold text-neutral-500 mt-0.5">BULAN INI</p>
            </div>
            <div className="brutal-sm rounded-lg bg-indigo-600 dark:bg-indigo-500 p-2.5">
              <p className="font-display text-sm leading-6 truncate text-white tnum" title={fmtMoney(stats.totalNominal, settings?.currency)}>{fmtMoney(stats.totalNominal, settings?.currency)}</p>
              <p className="font-mono2 text-[9px] font-bold text-indigo-100 mt-0.5">TOTAL NOMINAL</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="font-mono2 text-[10px] font-bold text-neutral-500 mb-1.5">NOTA PER BULAN</p>
            <div className="flex items-end gap-1.5 h-16">
              {stats.months.map((m) => (
                <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="font-mono2 text-[9px] font-bold">{m.count || ""}</span>
                  <div className="w-full rounded-t border border-ink bg-indigo-500" style={{ height: `${Math.max(4, (m.count / stats.maxBar) * 100)}%`, opacity: m.count ? 1 : 0.25 }} />
                  <span className="font-mono2 text-[8px] text-neutral-500 mt-0.5">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 font-mono2 text-[10px] text-neutral-500">
            Template favorit: <b className="text-ink">{stats.favTplName}</b> · Nominal bulan ini: <b className="text-ink">{fmtMoney(stats.monthNominal, settings?.currency)}</b>
          </p>
        </>
      )}
    </Card>
    <Card title="🗂️ Riwayat Nota" sticker={`${history.length}/50`}>
      {history.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-2xl">📭</p>
          <p className="mt-2 text-sm text-neutral-500">Belum ada nota tersimpan.<br />Klik "Simpan nota" setelah selesai mengisi.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((h) => {
            const t = calcTotals(h);
            const st = paymentStatus(h);
            const sm = st ? STATUS_META[st] : null;
            return (
              <div key={h.id} className="brutal-sm rounded-lg bg-cream px-3 py-2.5 flex items-center justify-between gap-2">
                <button onClick={() => onOpen(h)} className="text-left flex-1 min-w-0">
                  <p className="font-mono2 text-xs font-bold truncate">
                    {h.number || "(tanpa nomor)"}{" "}
                    {sm && <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${sm.badge}`}>{sm.label}</span>}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {fmtDate(h.date)} · {h.customerName || "—"} · <b className="text-ink">{fmtMoney(t.total, h.currency)}</b>
                  </p>
                </button>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onOpen(h, true)} className="font-mono2 text-[10px] font-bold text-blue-700 hover:underline">
                    duplikat
                  </button>
                  <button onClick={() => onDelete(h.id)} className="font-mono2 text-[10px] font-bold text-red-600 hover:underline">
                    hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>

    <Card title="💾 Backup & Restore" sticker="lokal">
      <p className="font-mono2 text-[10px] text-neutral-500 mb-1">
        Penyimpanan terpakai: {(info.used / 1024).toFixed(1)} KB dari ~5 MB ({info.pct.toFixed(1)}%)
      </p>
      <div className="h-2 rounded-full border border-ink bg-white overflow-hidden mb-3">
        <div className="h-full bg-emerald-500" style={{ width: `${Math.max(2, info.pct)}%` }} />
      </div>
      <div className="flex gap-2">
        <Btn onClick={doExport} color="bg-indigo-500 text-white" className="flex-1 text-xs!">⬇️ Backup (JSON)</Btn>
        <Btn onClick={() => fileRef.current?.click()} color="bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" className="flex-1 text-xs!">⬆️ Restore</Btn>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={doImport} />
      </div>
      {msg && <p className="mt-2 text-xs font-bold">{msg}</p>}
      <p className="mt-2 font-mono2 text-[10px] text-neutral-500">
        Pindah HP/laptop? Backup di sini, restore di perangkat baru.
      </p>
    </Card>
    </div>
  );
}
