// Template C — Receipt Minimal (nyontek Spotify + Uber).
// Tanpa tabel: maks 8 baris label:nilai, total di tengah.
import { Money, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtDate } from "../../lib/format.js";

export default function ReceiptMinimal({ inv, profile, totals, accent, showSignature }) {
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const inter = "'Inter', system-ui, sans-serif";
  const rows = [];
  rows.push(["Tanggal", fmtDate(inv.date)]);
  rows.push(["No. invoice", inv.number || "—"]);
  rows.push(["Pelanggan", inv.customerName || "—"]);
  if (inv.customerNpwp) rows.push(["NPWP", inv.customerNpwp]);
  items.slice(0, 3).forEach((it) => {
    rows.push([`${it.name || "Item"} × ${it.qty}${it.unit ? ` ${it.unit}` : ""}`, null, (Number(it.qty) || 0) * (Number(it.price) || 0)]);
  });
  if (inv.poNumber) rows.push(["No. PO", inv.poNumber]);
  if (inv.dueDate) rows.push(["Jatuh tempo", fmtDate(inv.dueDate)]);
  const pays = (profile.payments || []).filter((p) => (inv.paymentIds || []).includes(p.id));
  if (pays[0]) rows.push(["Bayar ke", `${pays[0].label} ${pays[0].number}`]);
  const shown = rows.slice(0, 10);
  return (
    <div style={{ fontFamily: inter, fontSize: 13, lineHeight: 1.6, color: "#111827", background: "#fff", padding: "48px 40px", maxWidth: 460, margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <ShopLogo logo={profile.logo} size={44} radius={10} style={{ margin: "0 auto 10px" }} />
        <div style={{ fontWeight: 800, fontSize: 17 }}>{profile.shopName || "Nama Usaha"}</div>
        <div style={{ fontWeight: 800, fontSize: 40, marginTop: 16, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
          <Money v={dpi ? dpi.sisa : totals.total} cur={cur} />
        </div>
        {dpi && (
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
            Total <Money v={totals.total} cur={cur} /> · Uang muka (DP) <Money v={dpi.dp} cur={cur} /> · Sisa
          </div>
        )}
      </div>
      <div style={{ borderTop: "2px dashed #d4d4d8", margin: "22px 0" }} />
      <div>
        {shown.map(([k, v, amt], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "6px 0", fontVariantNumeric: "tabular-nums" }}>
            <span style={{ color: "#71717a" }}>{k}</span>
            <span style={{ textAlign: "right" }}>{amt != null ? <Money v={amt} cur={cur} /> : v}</span>
          </div>
        ))}
      </div>
      {inv.notes && (
        <div style={{ marginTop: 14, fontSize: 12, color: "#71717a", whiteSpace: "pre-wrap" }}>{inv.notes}</div>
      )}
      {inv.terms && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#71717a" }}><b>Syarat:</b> {inv.terms}</div>
      )}
      <div style={{ marginTop: 24, textAlign: "center", fontSize: 13 }}>Terima kasih 🙏</div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
