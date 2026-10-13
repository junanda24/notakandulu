// SSR smoke test untuk wizard: semua step render tanpa crash, stepper kanonis benar.
import React from "react";
import { renderToString } from "react-dom/server";
import Wizard, { Stepper } from "./src/components/wizard/Wizard.jsx";
import { getSteps } from "./src/components/wizard/shared.jsx";
import { blankInvoice } from "./src/lib/calc.js";

const noop = () => {};
const inv = blankInvoice({ number: "INV-2026-001", date: "2026-10-13", currency: "IDR" });
const profileFull = { shopName: "Kopi Senja", address: "Jl. Merdeka", contact: "0812", payments: [] };
const profileEmpty = { shopName: "", address: "", contact: "", payments: [] };
const settings = { template: "saas", font: "jakarta", accent: "#0d9488", showSignature: true, numberPattern: "INV-{YYYY}-{NNN}" };

let pass = 0, fail = 0;
const check = (name, cond) => { cond ? pass++ : (fail++, console.log("FAIL:", name)); };

// 1. getSteps: 4 step — data, item, gaya, kirim
{
  const steps = getSteps();
  check("getSteps -> 4 steps", steps.length === 4);
  check("urutan step benar", steps.map((s) => s.id).join(",") === "data,item,gaya,kirim");
  check("step punya short label", steps.every((s) => s.short && s.title));
}

// 2. Stepper kanonis: <ol>, 4 tombol, indikator + konektor + aria-current
try {
  const steps = getSteps();
  const html = renderToString(<Stepper steps={steps} idx={1} onJump={noop} />);
  const btnCount = (html.match(/<button/g) || []).length;
  check("Stepper 4 tombol step", btnCount === 4);
  check("Stepper ada <ol> + aria-current", html.includes("<ol") && html.includes('aria-current="step"'));
  check("Stepper ada konektor", html.includes("rounded-full") && html.includes("Langkah"));
} catch (e) { check("Stepper render", false); console.log("  error:", e.message); }

// 3. tiap step wizard render tanpa crash
const STEP_MARKERS = { data: "Toko Saya", item: "Tambah item", gaya: "Template Nota", kirim: "Ringkasan Nota" };
for (const s of getSteps()) {
  try {
    const html = renderToString(
      <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
        settings={settings} persistSettings={noop} stepId={s.id} setStepId={noop}
        onSave={noop} onNew={noop} onGotoToko={noop} onGotoRiwayat={noop} />
    );
    check(`render step ${s.id}`, html.length > 500 && html.includes(STEP_MARKERS[s.id]));
  } catch (e) {
    check(`render step ${s.id}`, false);
    console.log("  error:", e.message);
  }
}

// 4. step data: section toko terbuka kalau profil kosong, tertutup (ada subtitle) kalau sudah isi
try {
  const htmlEmpty = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileEmpty} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="data" setStepId={noop}
      onSave={noop} onNew={noop} onGotoToko={noop} onGotoRiwayat={noop} />
  );
  const htmlFull = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="data" setStepId={noop}
      onSave={noop} onNew={noop} onGotoToko={noop} onGotoRiwayat={noop} />
  );
  check("step data profil kosong -> form toko terbuka", htmlEmpty.includes("Nama toko / usaha"));
  check("step data profil isi -> ada subtitle nama toko", htmlFull.includes("Kopi Senja"));
  check("step data ada field pelanggan", htmlEmpty.includes("Nama pelanggan") && htmlFull.includes("Nama pelanggan"));
} catch (e) { check("step data sections", false); console.log("  error:", e.message); }

// 5. step kirim memuat ringkasan + ekspor
try {
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="kirim" setStepId={noop}
      onSave={noop} onNew={noop} onGotoToko={noop} onGotoRiwayat={noop} />
  );
  check("step kirim ada ringkasan + simpan", html.includes("Ringkasan Nota") && html.includes("Simpan Nota"));
  check("step kirim ada ekspor & bagikan", html.includes("Ekspor &amp; Bagikan") && html.includes("Unduh PNG"));
} catch (e) { check("step kirim ada ringkasan + simpan", false); console.log("  error:", e.message); }

// 5b. step kirim: payment radio-rows + tombol simpan informatif
try {
  const profPay = { ...profileFull, payments: [{ id: "p1", label: "BCA", number: "8210123456", holder: "Kopi Senja" }] };
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profPay} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="kirim" setStepId={noop}
      onSave={noop} onNew={noop} onClearInv={noop} onGotoToko={noop} onGotoRiwayat={noop} />
  );
  check("payment rows: checkbox + holder", html.includes("a.n. Kopi Senja") && html.includes("aria-pressed"));
  check("tombol simpan informatif: nomor + total", html.includes("Simpan Nota") && html.includes("item ·"));
} catch (e) { check("payment rows + save informatif", false); console.log("  error:", e.message); }

// 6. stepId tak valid -> fallback ke step pertama, bukan crash
try {
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="ngawur" setStepId={noop}
      onSave={noop} onNew={noop} onGotoToko={noop} onGotoRiwayat={noop} />
  );
  check("invalid stepId fallback", html.includes("Toko Saya"));
} catch (e) { check("invalid stepId fallback", false); }

// 7. data contoh: semua field terisi + variatif; tombol Kosongkan ada
try {
  const { sampleInvoice, sampleAll } = require("./src/components/wizard/shared.jsx");
  const s = sampleInvoice();
  const fields = ["number","date","dueDate","status","currency","customerName","customerInfo","customerNpwp","poNumber","tax","discount","shipping","dp","terms","notes","paymentIds","items"];
  const allFilled = fields.every((f) => {
    const v = s[f];
    if (f === "items") return Array.isArray(v) && v.length >= 3;
    if (f === "paymentIds") return Array.isArray(v);
    if (f === "discount") return v && typeof v.value === "number";
    return v !== "" && v !== undefined && v !== null;
  });
  check("sample: semua field terisi", allFilled);
  check("sample: npwp/po/ongkir/dp/diskon terisi", s.customerNpwp && s.poNumber && s.shipping > 0 && s.dp > 0 && s.discount.value > 0);
  check("sample: 4 item variatif", s.items.length === 4 && new Set(s.items.map((i) => i.unit)).size >= 3);
  const { inv: si, profilePatch } = sampleAll({ shopName: "", payments: [] });
  check("sampleAll: profil kosong -> toko & pembayaran contoh", profilePatch.shopName && profilePatch.payments.length === 1 && si.paymentIds.length === 1);
  const kept = sampleAll({ shopName: "Tokoku", shopInfo: "x", payments: [{ id: "p1", label: "QRIS", number: "1" }] });
  check("sampleAll: data toko user tidak ditimpa", !kept.profilePatch.shopName && kept.inv.paymentIds[0] === "p1");
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="data" setStepId={noop}
      onSave={noop} onNew={noop} onClearInv={noop} onGotoToko={noop} onGotoRiwayat={noop} />
  );
  check("step data ada tombol Isi data contoh + Kosongkan", html.includes("Isi data contoh") && html.includes("Kosongkan"));
} catch (e) { check("sample data", false); console.log("  error:", e.message); }

console.log(`\nWizard SSR: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
