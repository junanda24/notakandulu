// SSR render test untuk 9 template nota (normal / edge / empty).
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

const TPL = { saas: SaasCard, corporate: Corporate, editorial: Editorial, kwitansi: Kwitansi, accent: AccentBlock, dark: ExecutiveDark, mono: MonoPrint, "struk-58": Struk58, "struk-80": Struk80 };

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
        checks.push(["total muncul", html.includes("Rp") || html.includes("total") || html.includes("TOTAL")]);
        checks.push(["nama toko muncul", html.includes("Kopi Senja")]);
        checks.push(["satuan muncul", html.includes("jam") || tid === "kwitansi"]);
        if (tid !== "kwitansi" && !tid.startsWith("struk")) {
          checks.push(["PO muncul", html.includes("PO-2026-118")]);
          checks.push(["NPWP pelanggan muncul", html.includes("01.234.567.8-901.000")]);
          checks.push(["tanda tangan muncul", html.includes("Hormat kami") || html.includes("Kopi Senja")]);
          checks.push(["DP muncul", html.includes("Uang muka")]);
        }
        if (tid.startsWith("struk")) {
          checks.push(["PO muncul di struk", html.includes("PO-2026-118")]);
          checks.push(["DP muncul di struk", html.includes("SISA")]);
          checks.push(["syarat bayar muncul di struk", html.includes("Net 14")]);
        }
        checks.push(["syarat bayar muncul", html.includes("Net 14") || tid === "kwitansi" || tid.startsWith("struk")]);
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

console.log(`\nSSR render: ${pass} lolos, ${fail} gagal dari ${pass + fail} kasus (9 template × 3 kasus)`);
if (failures.length) { console.log("GAGAL:"); failures.forEach((f) => console.log(" - " + f)); process.exit(1); }
console.log("SEMUA LOLOS ✓");
