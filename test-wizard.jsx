// SSR smoke test untuk wizard: semua step render tanpa crash, step kondisional benar.
import React from "react";
import { renderToString } from "react-dom/server";
import Wizard from "./src/components/wizard/Wizard.jsx";
import { getSteps } from "./src/components/wizard/shared.jsx";
import { blankInvoice } from "./src/lib/calc.js";

const noop = () => {};
const inv = blankInvoice({ number: "INV-2026-001", date: "2026-10-13", currency: "IDR" });
const profileFull = { shopName: "Kopi Senja", address: "Jl. Merdeka", contact: "0812", payments: [] };
const profileEmpty = { shopName: "", address: "", contact: "", payments: [] };
const settings = { template: "saas", font: "jakarta", accent: "#0d9488", showSignature: true, numberPattern: "INV-{YYYY}-{NNN}" };

let pass = 0, fail = 0;
const check = (name, cond) => { cond ? pass++ : (fail++, console.log("FAIL:", name)); };

// 1. getSteps: selalu 5 step, diawali toko
check("getSteps -> 5 steps mulai dari toko", getSteps(profileEmpty).length === 5 && getSteps(profileEmpty)[0].id === "toko");
check("getSteps profil isi -> tetap 5 steps", getSteps(profileFull).length === 5 && getSteps(profileFull)[0].id === "toko");

// 2. tiap step render tanpa crash (profil penuh)
for (const s of getSteps(profileFull)) {
  try {
    const html = renderToString(
      <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
        settings={settings} persistSettings={noop} stepId={s.id} setStepId={noop}
        onSave={noop} onGotoToko={noop} />
    );
    check(`render step ${s.id} (${html.length} chars)`, html.length > 500 && html.includes(s.title.replace(/ & /g, " &amp; ")));
  } catch (e) {
    check(`render step ${s.id}`, false);
    console.log("  error:", e.message);
  }
}

// 3. step toko render (profil kosong)
try {
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileEmpty} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="toko" setStepId={noop}
      onSave={noop} onGotoToko={noop} />
  );
  check("render step toko", html.includes("Profil Toko"));
} catch (e) { check("render step toko", false); console.log("  error:", e.message); }

// 4. step kirim memuat ringkasan total
try {
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="kirim" setStepId={noop}
      onSave={noop} onGotoToko={noop} />
  );
  check("step kirim ada ringkasan + simpan", html.includes("Ringkasan Nota") && html.includes("Simpan Nota"));
  check("step kirim ada ekspor & bagikan", html.includes("Ekspor &amp; Bagikan") && html.includes("Unduh PNG"));
} catch (e) { check("step kirim ada ringkasan + simpan", false); console.log("  error:", e.message); }

// 5. stepId tak valid -> fallback ke step pertama, bukan crash
try {
  const html = renderToString(
    <Wizard inv={inv} setInv={noop} profile={profileFull} persistProfile={noop}
      settings={settings} persistSettings={noop} stepId="ngawur" setStepId={noop}
      onSave={noop} onGotoToko={noop} />
  );
  check("invalid stepId fallback", html.includes("Pelanggan"));
} catch (e) { check("invalid stepId fallback", false); }

console.log(`\nWizard SSR: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
