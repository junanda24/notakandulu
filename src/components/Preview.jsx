// Preview live + ekspor (cetak/PDF/PNG) + bagikan (WA/email/native).
import { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { Card, Btn } from "./ui.jsx";
import { TEMPLATES, FONTS, PAPER_WIDTH } from "../data/options.js";
import { calcTotals, paymentStatus, STATUS_META } from "../lib/calc.js";
import {
  invoiceText, waShareUrl, mailtoUrl, canNativeShareFile, canCopyPng,
  invoiceToPng, nativeSharePng, downloadPng, copyPngToClipboard, setPrintPageSize,
  waitForPrintReady,
} from "../lib/share.js";
import Struk58 from "./invoices/Struk58.jsx";
import Struk80 from "./invoices/Struk80.jsx";
import SaasCard from "./invoices/SaasCard.jsx";
import Corporate from "./invoices/Corporate.jsx";
import Editorial from "./invoices/Editorial.jsx";
import Kwitansi from "./invoices/Kwitansi.jsx";
import AccentBlock from "./invoices/AccentBlock.jsx";
import ExecutiveDark from "./invoices/ExecutiveDark.jsx";
import MonoPrint from "./invoices/MonoPrint.jsx";
import FakturFormal from "./invoices/FakturFormal.jsx";
import SaasPaywall from "./invoices/SaasPaywall.jsx";
import ReceiptMinimal from "./invoices/ReceiptMinimal.jsx";
import Thermal58 from "./invoices/Thermal58.jsx";
import Marketplace from "./invoices/Marketplace.jsx";
import Studio from "./invoices/Studio.jsx";
import FakturPajak from "./invoices/FakturPajak.jsx";
import BoldStatement from "./invoices/BoldStatement.jsx";
import KwitansiKlasik from "./invoices/KwitansiKlasik.jsx";
import Clarity from "./invoices/Clarity.jsx";
import Noir from "./invoices/Noir.jsx";
import Ivory from "./invoices/Ivory.jsx";
import Linea from "./invoices/Linea.jsx";
import Porcelain from "./invoices/Porcelain.jsx";
import Atelier from "./invoices/Atelier.jsx";

const TPL_COMPONENTS = {
  "saas": SaasCard,
  "corporate": Corporate,
  "editorial": Editorial,
  kwitansi: Kwitansi,
  "accent": AccentBlock,
  "dark": ExecutiveDark,
  "mono": MonoPrint,
  "struk-80": Struk80,
  "struk-58": Struk58,
  "faktur-formal": FakturFormal,
  "saas-paywall": SaasPaywall,
  "receipt-minimal": ReceiptMinimal,
  "thermal-58": Thermal58,
  "marketplace": Marketplace,
  "studio": Studio,
  "faktur-pajak": FakturPajak,
  "bold-statement": BoldStatement,
  "kwitansi-klasik": KwitansiKlasik,
  "clarity": Clarity,
  "noir": Noir,
  "ivory": Ivory,
  "linea": Linea,
  "porcelain": Porcelain,
  "atelier": Atelier,
};

export const InvoiceSheet = memo(function InvoiceSheet({ inv, profile, settings, id }) {  const Tpl = TPL_COMPONENTS[settings.template] || SaasCard;
  const totals = calcTotals(inv);
  const f = FONTS.find((x) => x.id === settings.font) || FONTS[0];
  const meta = TEMPLATES.find((x) => x.id === settings.template);
  return (
    <div
      id={id}
      className="invoice-paper"
      style={{
        width: PAPER_WIDTH[meta?.paper || "A4"],
        maxWidth: "100%",
        margin: "0 auto",
        ["--inv-accent"]: settings.accent,
      }}
    >
      <Tpl inv={inv} profile={profile} totals={totals} bodyFont={f.body} displayFont={f.display} accent={settings.accent} showSignature={settings.showSignature} />
    </div>
  );
});

// Kartu Ekspor & Bagikan — dipakai di Step 4 wizard (Langkah Kirim).
// Butuh sheetRef (ref ke node InvoiceSheet yang ter-render) untuk ekspor PNG.
export function ExportCard({ inv, profile, settings, sheetRef, notify }) {
  // Error ekspor/bagikan tampil sebagai toast app (bukan alert bawaan browser).
  const fail = notify || ((m) => alert(m));
  const [busy, setBusy] = useState("");
  const [copied, setCopied] = useState(false);
  const [nativeOk] = useState(() => canNativeShareFile());
  const [copyOk] = useState(() => !canNativeShareFile() && canCopyPng());

  // Kunci @page size = tinggi konten aktual biar tidak ada ruang putih sisa.
  const doPrint = async () => {
    const node = sheetRef?.current;
    await waitForPrintReady(node);
    const meta = TEMPLATES.find((x) => x.id === settings.template);
    const w = PAPER_WIDTH[meta?.paper || "A4"];
    const h = node ? node.getBoundingClientRect().height : 0;
    if (h > 0) setPrintPageSize(w, h);
    window.print();
  };

  const doPng = async (share) => {
    if (!sheetRef?.current) return;
    setBusy(share ? "share" : "png");
    try {
      if (share) {
        await nativeSharePng(sheetRef.current, inv);
      } else {
        const url = await invoiceToPng(sheetRef.current);
        downloadPng(url, `${inv.number || "nota"}.png`);
      }
    } catch (e) {
      if (e?.name !== "AbortError") fail("Gagal: " + (e.message || e));
    } finally {
      setBusy("");
    }
  };

  const doCopy = async () => {
    if (!sheetRef?.current) return;
    setBusy("copy");
    try {
      await copyPngToClipboard(sheetRef.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      fail("Gagal menyalin: " + (e.message || e));
    } finally {
      setBusy("");
    }
  };

  const text = invoiceText(inv, profile);

  return (
    <Card title="Ekspor & Bagikan" sticker="gratis">
      <div className="grid grid-cols-2 gap-2">
        <Btn onClick={doPrint} color="bg-white dark:bg-neutral-800 border-line text-neutral-900 dark:text-neutral-100" className="py-3!">
          <span className="mr-1.5 text-base">🖨️</span>Cetak / PDF
        </Btn>
        <Btn onClick={() => doPng(false)} color="bg-white dark:bg-neutral-800 border-line text-neutral-900 dark:text-neutral-100" className="py-3!" disabled={busy === "png"}>
          {busy === "png" ? "⏳ ..." : <><span className="mr-1.5 text-base">🖼️</span>Unduh PNG</>}
        </Btn>
        <a href={waShareUrl(text)} target="_blank" rel="noreferrer" className="brutal-btn rounded-xl border-[1.5px] border-line bg-white dark:bg-neutral-800 px-3 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 text-center transition active:scale-[0.97]">
          <span className="mr-1.5 text-base">💬</span>WA Teks
        </a>
        <a href={mailtoUrl(inv, profile, settings)} className="brutal-btn rounded-xl border-[1.5px] border-line bg-white dark:bg-neutral-800 px-3 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 text-center transition active:scale-[0.97]">
          <span className="mr-1.5 text-base">✉️</span>Email
        </a>
      </div>
      {nativeOk && (
        <Btn onClick={() => doPng(true)} color="bg-white dark:bg-neutral-800 border-line text-neutral-900 dark:text-neutral-100" className="w-full mt-2 py-3!" disabled={busy === "share"}>
          {busy === "share" ? "⏳ Menyiapkan..." : <><span className="mr-1.5 text-base">📲</span>Bagikan gambar</>}
        </Btn>
      )}
      {copyOk && (
        <Btn onClick={doCopy} color="bg-white dark:bg-neutral-800 border-line text-neutral-900 dark:text-neutral-100" className="w-full mt-2 py-3!" disabled={busy === "copy"}>
          {busy === "copy" ? "⏳ Menyiapkan..." : copied ? "✓ Tersalin! Tempel (Ctrl+V) di chat WA" : <><span className="mr-1.5 text-base">📋</span>Salin gambar nota</>}
        </Btn>
      )}
      <p className="mt-2 font-mono2 text-[10px] text-neutral-500">
        Cetak/PDF memakai dialog bawaan browser. Hasilnya sama persis dengan preview.
        {nativeOk
          ? " Gambar dikirim lewat menu bagikan di HP."
          : copyOk
            ? " Di laptop: salin gambar lalu tempel di chat WhatsApp, atau unduh PNG dan lampirkan manual."
            : ""}
      </p>
    </Card>
  );
}

export default function Preview({ inv, profile, settings }) {

  // @page tanpa margin — ukuran halaman dikunci saat tombol Cetak ditekan
  // (setPrintPageSize), mengikuti tinggi konten aktual.
  useEffect(() => {
    let el = document.getElementById("nd-page-size");
    if (!el) {
      el = document.createElement("style");
      el.id = "nd-page-size";
      document.head.appendChild(el);
    }
    el.textContent = `@media print { @page { margin: 0; } }`;
  }, []);

  const st = paymentStatus(inv);
  const sm = st ? STATUS_META[st] : null;

  return (
    <div className="space-y-4">
      <Card title="Preview Live" sticker={TEMPLATES.find((t) => t.id === settings.template)?.name}>
        {sm && (
          <div className="mb-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${sm.badge}`}>● {sm.label}</span>
            {st === "lewat" && inv.dueDate && (
              <span className="ml-2 text-xs text-neutral-500">jatuh tempo {inv.dueDate}</span>
            )}
          </div>
        )}
        <div className="invoice-stage -m-4 sm:-m-5 rounded-b-xl p-4 sm:p-8 overflow-x-auto">
          <div style={{ width: "fit-content", margin: "0 auto", maxWidth: "100%" }}>
            <InvoiceSheet inv={inv} profile={profile} settings={settings} />
          </div>
        </div>
      </Card>

    </div>
  );
}

// Lebar kertas dalam px (96dpi) untuk preview zoomable.
export const PAPER_PX = { "58mm": 219, "80mm": 302, "A5": 559, "A4": 794 };

// Preview full-screen ala PDF reader — khusus mobile: zoom + geser + ekspor.
export function MobilePreviewModal({ inv, profile, settings, onClose, notify }) {
  // Error ekspor tampil sebagai toast app (fallback alert) — dulu ReferenceError: fail undefined.
  const wrapRef = useRef(null);
  const sheetRef = useRef(null);
  const panelRef = useRef(null);

  // Masuk: slide-up ala bottom sheet. Keluar: slide-down dulu baru unmount.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(panelRef.current, { y: "100%" }, { y: 0, duration: 0.45, ease: "power3.out" });
    return () => gsap.killTweensOf(panelRef.current);
  }, []);
  const handleClose = () => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { onClose(); return; }
    gsap.to(panelRef.current, { y: "100%", duration: 0.3, ease: "power3.in", onComplete: onClose });
  };
  const [busy, setBusy] = useState("");
  const [zoom, setZoom] = useState(null); // null = mode pas-lebar
  const [fitZoom, setFitZoom] = useState(0.5);
  const [sheetH, setSheetH] = useState(1100);
  const meta = TEMPLATES.find((x) => x.id === settings.template);
  const paperPx = PAPER_PX[meta?.paper || "A4"] || 794;

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setFitZoom(Math.max(0.2, (wrapRef.current.clientWidth - 24) / paperPx));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [paperPx]);

  useEffect(() => {
    const node = sheetRef.current;
    if (!node) return;
    setSheetH(node.offsetHeight || 1100);
    const ro = new ResizeObserver(() => setSheetH(node.offsetHeight || 1100));
    ro.observe(node);
    return () => ro.disconnect();
  }, [paperPx]);

  // Kunci scroll body + Escape saat modal terbuka.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  });

  const z = zoom ?? fitZoom;
  const stepIn = () => setZoom((p) => Math.min(3, +( ((p ?? fitZoom) + 0.25).toFixed(2) )));
  const stepOut = () => setZoom((p) => Math.max(0.25, +( ((p ?? fitZoom) - 0.25).toFixed(2) )));

  const fail = notify || ((m) => alert(m));
  const doPrintModal = async () => {
    const node = sheetRef.current;
    await waitForPrintReady(node);
    const meta2 = TEMPLATES.find((x) => x.id === settings.template);
    const w2 = PAPER_WIDTH[meta2?.paper || "A4"];
    // offsetHeight = tinggi TANPA transform scale (getBoundingClientRect ikut ke-zoom → nota terpotong).
    const h2 = node ? node.offsetHeight : 0;
    if (h2 > 0) setPrintPageSize(w2, h2);
    window.print();
  };

  const doPng = async (share) => {
    if (!sheetRef.current) return;
    setBusy(share ? "share" : "png");
    // Sheet di-zoom via transform scale — lepas dulu biar PNG full-res, lalu kembalikan.
    const node = sheetRef.current;
    const prevTransform = node.style.transform;
    try {
      node.style.transform = "none";
      if (share) {
        await nativeSharePng(node, inv);
      } else {
        const url = await invoiceToPng(node);
        downloadPng(url, `${inv.number || "nota"}.png`);
      }
    } catch (e) {
      if (e?.name !== "AbortError") fail("Gagal: " + (e.message || e));
    } finally {
      node.style.transform = prevTransform;
      setBusy("");
    }
  };

  const text = invoiceText(inv, profile);

  return (
    <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Pratinjau nota" className="no-print fixed inset-0 z-[80] bg-neutral-950 flex flex-col lg:hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 shrink-0 border-b border-white/10">
        <button onClick={handleClose} className="text-white text-sm font-bold px-2 py-1.5">✕ Tutup</button>
        <span className="text-white/70 text-xs font-semibold truncate">{meta?.name || "Pratinjau"}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={stepOut} className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold">−</button>
          <button onClick={() => setZoom(null)} title="Pas layar" className="h-8 px-2 rounded-lg bg-white/10 text-white text-[11px] font-bold min-w-[52px]">
            {Math.round(z * 100)}%
          </button>
          <button onClick={stepIn} className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold">+</button>
        </div>
      </div>
      {/* Kertas — bisa di-zoom & digeser */}
      <div ref={wrapRef} className="flex-1 overflow-auto p-3" style={{ WebkitOverflowScrolling: "touch" }}>
        <div style={{ width: paperPx * z, height: sheetH * z, margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div ref={sheetRef} style={{ width: paperPx, transform: `scale(${z})`, transformOrigin: "top left" }}>
            <InvoiceSheet inv={inv} profile={profile} settings={settings} />
          </div>
        </div>
        <p className="text-center text-white/40 text-[11px] mt-3">Geser untuk baca · gunakan +/− untuk zoom</p>
      </div>
      {/* Ekspor */}
      <div className="p-3 shrink-0 border-t border-white/10 bg-neutral-900">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => doPng(false)}
            disabled={busy === "png"}
            className="rounded-xl bg-teal-600 text-white text-sm font-bold py-3 disabled:opacity-50"
          >
            {busy === "png" ? "⏳" : "🖼️ PNG"}
          </button>
          <button onClick={doPrintModal} className="rounded-xl bg-white/10 text-white text-sm font-bold py-3">
            🖨️ PDF
          </button>
          <a
            href={waShareUrl(text)}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#25d366] text-white text-sm font-bold py-3 text-center"
          >
            💬 WA
          </a>
        </div>
      </div>
    </div>
  );
}
