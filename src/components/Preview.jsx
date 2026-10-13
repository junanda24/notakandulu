// Preview live + ekspor (cetak/PDF/PNG) + bagikan (WA/email/native).
import { useEffect, useRef, useState } from "react";
import { Card, Btn } from "./ui.jsx";
import { TEMPLATES, FONTS, PAPER_WIDTH } from "../data/options.js";
import { calcTotals, paymentStatus, STATUS_META } from "../lib/calc.js";
import {
  invoiceText, waShareUrl, mailtoUrl, canNativeShareFile,
  invoiceToPng, nativeSharePng, downloadPng,
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
};

export function InvoiceSheet({ inv, profile, settings, id }) {
  const Tpl = TPL_COMPONENTS[settings.template] || SaasCard;
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
}

export default function Preview({ inv, profile, settings }) {
  const sheetRef = useRef(null);
  const [busy, setBusy] = useState("");
  const [nativeOk] = useState(() => canNativeShareFile());

  // @page size mengikuti template saat cetak
  useEffect(() => {
    const meta = TEMPLATES.find((x) => x.id === settings.template);
    const w = PAPER_WIDTH[meta?.paper || "A4"];
    let el = document.getElementById("nd-page-size");
    if (!el) {
      el = document.createElement("style");
      el.id = "nd-page-size";
      document.head.appendChild(el);
    }
    el.textContent = `@media print { @page { size: ${w} auto; margin: 0; } }`;
  }, [settings.template]);

  const doPrint = () => window.print();

  const doPng = async (share) => {
    if (!sheetRef.current) return;
    setBusy(share ? "share" : "png");
    try {
      if (share) {
        await nativeSharePng(sheetRef.current, inv);
      } else {
        const url = await invoiceToPng(sheetRef.current);
        downloadPng(url, `${inv.number || "nota"}.png`);
      }
    } catch (e) {
      if (e?.name !== "AbortError") alert("Gagal: " + (e.message || e));
    } finally {
      setBusy("");
    }
  };

  const text = invoiceText(inv, profile, settings);
  const st = paymentStatus(inv);
  const sm = st ? STATUS_META[st] : null;

  return (
    <div className="space-y-4">
      <Card title="👁️ Preview Live" sticker={TEMPLATES.find((t) => t.id === settings.template)?.name}>
        {sm && (
          <div className="mb-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${sm.badge}`}>● {sm.label}</span>
            {st === "lewat" && inv.dueDate && (
              <span className="ml-2 text-xs text-neutral-500">jatuh tempo {inv.dueDate}</span>
            )}
          </div>
        )}
        <div className="invoice-stage -m-4 sm:-m-5 rounded-b-xl p-4 sm:p-8 overflow-x-auto">
          <div ref={sheetRef} style={{ width: "fit-content", margin: "0 auto", maxWidth: "100%" }}>
            <InvoiceSheet inv={inv} profile={profile} settings={settings} />
          </div>
        </div>
      </Card>

      <Card title="📤 Ekspor & Bagikan" sticker="gratis">
        <div className="grid grid-cols-2 gap-2">
          <Btn onClick={doPrint} primary>🖨️ Cetak / PDF</Btn>
          <Btn onClick={() => doPng(false)} primary disabled={busy === "png"}>
            {busy === "png" ? "⏳ ..." : "🖼️ Unduh PNG"}
          </Btn>
          <a href={waShareUrl(text)} target="_blank" rel="noreferrer" className="brutal-btn rounded-lg bg-[#25d366] border-[#1da851] text-white px-4 py-2.5 text-sm font-semibold text-center">
            💬 WA (teks)
          </a>
          <a href={mailtoUrl(inv, profile, settings)} className="brutal-btn rounded-lg bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 px-4 py-2.5 text-sm font-semibold text-center">
            ✉️ Email
          </a>
        </div>
        {nativeOk && (
          <Btn onClick={() => doPng(true)} color="bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" className="w-full mt-2" disabled={busy === "share"}>
            {busy === "share" ? "⏳ Menyiapkan..." : "📲 Bagikan gambar (WA / aplikasi lain)"}
          </Btn>
        )}
        <p className="mt-2 font-mono2 text-[10px] text-neutral-500">
          Cetak/PDF memakai dialog bawaan browser. Hasilnya sama persis dengan preview.
          {nativeOk ? "" : " Tombol ini cuma muncul di HP."}
        </p>
      </Card>
    </div>
  );
}
