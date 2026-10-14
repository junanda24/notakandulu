// Share: WhatsApp text, email, and native Web Share API (image file).
import { toPng } from "html-to-image";
import { fmtMoney, terbilang, fmtDate } from "./format.js";
import { calcTotals } from "./calc.js";

export function invoiceText(inv, profile) {
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

// Batas aman panjang URL mailto (bervariasi antar browser; 1800 konservatif & umum).
const MAX_MAILTO_LEN = 1800;
export function mailtoUrl(inv, profile, settings) {
  const subject = `Nota ${inv.number || ""} dari ${profile.shopName || "TagihkanDulu"}`.trim();
  const head = `mailto:?subject=${encodeURIComponent(subject)}&body=`;
  let body = invoiceText(inv, profile);
  if (head.length + encodeURIComponent(body).length > MAX_MAILTO_LEN) {
    // Nota super panjang: rangkas daftar item di tengah, tapi baris Total ke bawah
    // (total, pembayaran, catatan, terima kasih) SELALU dipertahankan utuh.
    const lines = body.split("\n");
    const totalIdx = lines.findIndex((l) => l.startsWith("*Total:"));
    const headLines = totalIdx > 0 ? lines.slice(0, totalIdx) : lines.slice(0, 6);
    const tailLines = totalIdx > 0 ? lines.slice(totalIdx) : [];
    // headLines = header + "----" + item-item; simpan 8 baris pertama, rangkas sisanya
    const itemStart = headLines.findIndex((l) => l.startsWith("• "));
    let kept = headLines;
    if (itemStart >= 0 && headLines.length > itemStart + 8) {
      const hidden = headLines.length - itemStart - 8;
      kept = [...headLines.slice(0, itemStart + 8), `…(${hidden} item lain disembunyikan)`];
    }
    body = [...kept, ...tailLines].join("\n");
    // Masih kepanjangan (item super banyak)? Potong aman dari tengah, Total tetap utuh.
    const note = "\n\n…(teks dipotong — kirim via WhatsApp atau PNG untuk versi lengkap)";
    let guard = 2000;
    while (head.length + encodeURIComponent(body).length > MAX_MAILTO_LEN - encodeURIComponent(note).length && guard-- > 0) {
      const ls = body.split("\n");
      const ti = ls.findIndex((l) => l.startsWith("…(") || l.startsWith("• "));
      if (ti < 0 || ls.length - ti < 3) break;
      ls.splice(ti, Math.max(1, Math.floor((ls.length - ti) / 2)));
      body = ls.join("\n");
    }
    body += note;
  }
  return head + encodeURIComponent(body);
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
  // Nota super panjang di pixelRatio 3 bisa bikin HP kentang freeze/OOM:
  // turunkan resolusi bertahap mengikuti tinggi konten.
  const h = node?.getBoundingClientRect?.().height || 0;
  const pixelRatio = h > 9000 ? 1 : h > 4500 ? 1.5 : h > 2200 ? 2 : 3;
  return toPng(node, { pixelRatio, cacheBust: true });
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
