// SSR render test untuk 29 template nota (normal / edge / empty).
import React from "react";
import { renderToString } from "react-dom/server";
import { calcTotals } from "./src/lib/calc.js";
import SaasCard from "./src/components/invoices/SaasCard.jsx";
import Corporate from "./src/components/invoices/Corporate.jsx";
import Editorial from "./src/components/invoices/Editorial.jsx";
import Kwitansi from "./src/components/invoices/Kwitansi.jsx";
import AccentBlock from "./src/components/invoices/AccentBlock.jsx";
import ExecutiveDark from "./src/components/invoices/ExecutiveDark.jsx";
import MonoPrint from "./src/components/invoices/MonoPrint.jsx";
import Struk58 from "./src/components/invoices/Struk58.jsx";
import Struk80 from "./src/components/invoices/Struk80.jsx";
import FakturFormal from "./src/components/invoices/FakturFormal.jsx";
import SaasPaywall from "./src/components/invoices/SaasPaywall.jsx";
import ReceiptMinimal from "./src/components/invoices/ReceiptMinimal.jsx";
import Thermal58 from "./src/components/invoices/Thermal58.jsx";
import Marketplace from "./src/components/invoices/Marketplace.jsx";
import Studio from "./src/components/invoices/Studio.jsx";
import FakturPajak from "./src/components/invoices/FakturPajak.jsx";
import BoldStatement from "./src/components/invoices/BoldStatement.jsx";
import KwitansiKlasik from "./src/components/invoices/KwitansiKlasik.jsx";
import Clarity from "./src/components/invoices/Clarity.jsx";
import Noir from "./src/components/invoices/Noir.jsx";
import Ivory from "./src/components/invoices/Ivory.jsx";
import Linea from "./src/components/invoices/Linea.jsx";
import Porcelain from "./src/components/invoices/Porcelain.jsx";
import Atelier from "./src/components/invoices/Atelier.jsx";
import NoirGold from "./src/components/invoices/NoirGold.jsx";
import EmeraldLedger from "./src/components/invoices/EmeraldLedger.jsx";
import WarmClay from "./src/components/invoices/WarmClay.jsx";
import KwitansiLuhur from "./src/components/invoices/KwitansiLuhur.jsx";
import KwitansiKontemporer from "./src/components/invoices/KwitansiKontemporer.jsx";

const TPL = { saas: SaasCard, corporate: Corporate, editorial: Editorial, kwitansi: Kwitansi, accent: AccentBlock, dark: ExecutiveDark, mono: MonoPrint, "struk-58": Struk58, "struk-80": Struk80, "faktur-formal": FakturFormal, "saas-paywall": SaasPaywall, "receipt-minimal": ReceiptMinimal, "thermal-58": Thermal58, marketplace: Marketplace, studio: Studio, "faktur-pajak": FakturPajak, "bold-statement": BoldStatement, "kwitansi-klasik": KwitansiKlasik, clarity: Clarity, noir: Noir, ivory: Ivory, linea: Linea, porcelain: Porcelain, atelier: Atelier, "noir-gold": NoirGold, "emerald-ledger": EmeraldLedger, "warm-clay": WarmClay, "kwitansi-luhur": KwitansiLuhur, "kwitansi-kontemporer": KwitansiKontemporer };

const profile = {
  shopName: "Kopi Senja",
  tagline: "Ngopi santai tiap hari",
  address: "Jl. Merdeka No. 1, Batam",
  contact: "0812-3456-7890",
  logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  payments: [{ id: "p1", type: "bank", label: "BCA", number: "1234567890", holder: "Junan" }],
};

const normal = {
  number: "INV-2026-001",
  date: "2026-10-13",
  dueDate: "2026-10-27",
  status: "belum",
  dp: 50000,
  terms: "Net 14",
  poNumber: "PO-2026-118",
  currency: "IDR",
  customerName: "Budi Santoso",
  customerInfo: "Jl. Kenangan No. 5",
  customerNpwp: "01.234.567.8-901.000",
  tax: 11,
  discount: { type: "percent", value: 10 },
  shipping: 15000,
  items: [
    { id: "a", name: "Kopi Arabika 200g", qty: 2, unit: "pcs", price: 85000 },
    { id: "b", name: "Jasa roasting", qty: 3, unit: "jam", price: 45000 },
  ],
  notes: "Terima kasih!",
};

const empty = { number: "", date: "2026-10-13", currency: "IDR", customerName: "", items: [], tax: 0, discount: { type: "percent", value: 0 }, shipping: 0, notes: "" };

// Edge: nama super panjang, qty 0, harga 0, karakter HTML/JS (uji XSS escape), nominal ≥ Rp5jt (zona materai)
const edge = {
  number: "INV-2026-999",
  date: "2026-10-13",
  currency: "IDR",
  customerName: "<script>alert('xss')</script> & \"Toko\" 'Jaya'",
  items: [
    { id: "e1", name: "A".repeat(300), qty: 0, price: 0 },
    { id: "e2", name: "<img src=x onerror=alert(1)> Layanan", qty: 3, price: 2500000 },
  ],
  tax: 0, discount: { type: "nominal", value: 0 }, shipping: 0,
  notes: "<b>bold</b> & <i>italic</i>",
};

const cases = { normal, empty, edge };
const fonts = { bodyFont: '"Inter", sans-serif', accent: "#4f46e5" };
let pass = 0, fail = 0;
const failures = [];

for (const [tid, Cmp] of Object.entries(TPL)) {
  for (const [cname, inv] of Object.entries(cases)) {
    try {
      const totals = calcTotals(inv);
      const html = renderToString(React.createElement(Cmp, { inv, profile, totals, showSignature: true, ...fonts }));
      const checks = [];
      if (cname === "normal") {
        const lc = html.toLowerCase();
        const isKwitansi = tid === "kwitansi" || tid === "kwitansi-klasik" || tid === "kwitansi-luhur" || tid === "kwitansi-kontemporer";
        const isThermal58 = tid === "thermal-58";
        checks.push(["total muncul", html.includes("Rp") || html.includes("total") || html.includes("TOTAL")]);
        checks.push(["nama toko muncul", html.includes("Kopi Senja")]);
        checks.push(["satuan muncul", lc.includes("jam") || isKwitansi]);
        if (!isKwitansi && !tid.startsWith("struk") && !isThermal58) {
          checks.push(["PO muncul", html.includes("PO-2026-118")]);
          checks.push(["NPWP pelanggan muncul", html.includes("01.234.567.8-901.000")]);
          checks.push(["tanda tangan muncul", html.includes("Hormat kami") || html.includes("Kopi Senja")]);
          checks.push(["DP muncul", html.includes("Uang muka")]);
        }
        if (isThermal58) {
          checks.push(["PO muncul di thermal", lc.includes("po-2026-118")]);
          checks.push(["NPWP pelanggan muncul di thermal", lc.includes("01.234.567.8-901.000")]);
          checks.push(["DP muncul di thermal", lc.includes("sisa")]);
          checks.push(["syarat bayar muncul di thermal", lc.includes("net 14")]);
        }
        if (tid.startsWith("struk")) {
          checks.push(["PO muncul di struk", html.includes("PO-2026-118")]);
          checks.push(["DP muncul di struk", html.includes("SISA")]);
          checks.push(["syarat bayar muncul di struk", html.includes("Net 14")]);
        }
        checks.push(["syarat bayar muncul", html.includes("Net 14") || lc.includes("net 14") || isKwitansi || tid.startsWith("struk") || isThermal58]);
      }
      if (cname === "edge") {
        checks.push(["script tidak lolos mentah", !html.includes("<script>alert")]);
        checks.push(["img onerror tidak lolos mentah", !html.includes("<img src=x")]);
        if (tid === "kwitansi") checks.push(["zona materai muncul (≥Rp5jt)", html.toLowerCase().includes("materai")]);
      }
      if (cname === "empty") {
        checks.push(["tidak crash saat kosong", html.length > 200]);
      }
      const bad = checks.filter(([, ok]) => !ok);
      if (bad.length) { fail++; failures.push(`${tid}/${cname}: ${bad.map(([n]) => n).join(", ")}`); }
      else pass++;
    } catch (err) {
      fail++;
      failures.push(`${tid}/${cname}: CRASH — ${err.message}`);
    }
  }
}

console.log(`\nSSR render: ${pass} lolos, ${fail} gagal dari ${pass + fail} kasus (29 template × 3 kasus)`);
if (failures.length) { console.log("GAGAL:"); failures.forEach((f) => console.log(" - " + f)); process.exit(1); }
console.log("SEMUA LOLOS ✓");
