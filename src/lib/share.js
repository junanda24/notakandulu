// Share: WhatsApp text, email, and native Web Share API (image file).
import { toPng } from "html-to-image";
import { fmtMoney, terbilang, fmtDate } from "./format.js";
import { calcTotals } from "./calc.js";

export function invoiceText(inv, profile, settings) {
  const t = calcTotals(inv);
  const cur = inv.currency || "IDR";
  const lines = [];
  lines.push(`*${inv.number || "NOTA"}* — ${profile.shopName || "TagihkanDulu"}`);
  lines.push(`Tanggal: ${fmtDate(inv.date)}`);
  if (inv.customerName) lines.push(`Pelanggan: ${inv.customerName}`);
  lines.push("------------------------");
  for (const it of inv.items || []) {
    if (!it.name && !it.price) continue;
    const amt = (Number(it.qty) || 0) * (Number(it.price) || 0);
    lines.push(`• ${it.name} ×${it.qty} = ${fmtMoney(amt, cur)}`);
  }
  lines.push("------------------------");
  if (t.discountAmt > 0) lines.push(`Diskon: -${fmtMoney(t.discountAmt, cur)}`);
  if (t.taxAmt > 0) lines.push(`Pajak: ${fmtMoney(t.taxAmt, cur)}`);
  if (t.shipping > 0) lines.push(`Ongkir: ${fmtMoney(t.shipping, cur)}`);
  lines.push(`*Total: ${fmtMoney(t.total, cur)}*`);
  lines.push(`_${terbilang(t.total, cur)}_`);
  const pays = (profile.payments || []).filter((p) => (inv.paymentIds || []).includes(p.id));
  if (pays.length) {
    lines.push("------------------------");
    lines.push("Pembayaran:");
    for (const p of pays) lines.push(`• ${p.label}: ${p.number}${p.holder ? ` a.n. ${p.holder}` : ""}`);
  }
  if (inv.notes) {
    lines.push("------------------------");
    lines.push(inv.notes);
  }
  lines.push("");
  lines.push("Terima kasih 🙏");
  return lines.join("\n");
}

export const waShareUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export function mailtoUrl(inv, profile, settings) {
  const subject = `Nota ${inv.number || ""} dari ${profile.shopName || "TagihkanDulu"}`.trim();
  const body = invoiceText(inv, profile, settings);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const canNativeShareFile = () =>
  typeof navigator !== "undefined" &&
  !!navigator.canShare &&
  (() => {
    try {
      return navigator.canShare({ files: [new File(["x"], "x.png", { type: "image/png" })] });
    } catch {
      return false;
    }
  })();

/** Render invoice node -> PNG blob. Tunggu font siap dulu biar akurat. */
export async function invoiceToPng(node) {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch { /* abaikan */ }
  }
  return toPng(node, { pixelRatio: 3, cacheBust: true });
}

export async function nativeSharePng(node, inv) {
  const dataUrl = await invoiceToPng(node);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `${inv.number || "nota"}.png`, { type: "image/png" });
  await navigator.share({ files: [file], title: `Nota ${inv.number || ""}` });
}

// Ukur tinggi konten nota lalu kunci @page size eksplisit sebelum print.
// (CSS "size: 210mm auto" itu invalid — Chrome mengabaikannya sehingga halaman
// jadi full A4 dan nota pendek menyisakan ruang putih di bawah.)
export function setPrintPageSize(widthCss, heightPx) {
  // ceil ke 0.01mm: garansi tak kepotong, sisa putih tak terlihat (~0.004px)
  const hMm = Math.max(10, Math.ceil(((heightPx * 25.4) / 96) * 100) / 100);
  let el = document.getElementById("nd-page-size");
  if (!el) {
    el = document.createElement("style");
    el.id = "nd-page-size";
    document.head.appendChild(el);
  }
  el.textContent = `@media print { @page { size: ${widthCss} ${hMm}mm; margin: 0; } }`;
}

// Tunggu font + gambar selesai dimuat sebelum ukur tinggi & print,
// biar pengukuran presisi dan tidak ada konten telat yang kepotong.
export async function waitForPrintReady(node) {
  try { await document.fonts?.ready; } catch { /* abaikan */ }
  const imgs = node ? [...node.querySelectorAll("img")] : [];
  await Promise.all(
    imgs.map((img) => (img.complete ? null : new Promise((res) => { img.onload = img.onerror = res; })))
  );
}

export function downloadPng(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Salin PNG nota ke clipboard — user tinggal tempel (Ctrl+V) di chat WhatsApp Web/aplikasi.
export async function copyPngToClipboard(node) {
  const dataUrl = await invoiceToPng(node);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export const canCopyPng = () =>
  typeof navigator !== "undefined" &&
  !!navigator.clipboard?.write &&
  typeof ClipboardItem !== "undefined";
