// Style 8 — Struk 58mm (thermal). Konten 54mm, monospace, pemisah dashed,
// jumlah rata kanan, TOTAL tebal dua kali lipat, logo kecil di atas.
import { Money, ShopLogo, fmtD, dpInfo } from "./shared.jsx";
import { fmtMoney } from "../../lib/format.js";

export default function Struk58({ inv, profile, totals, bodyFont }) {
  const cur = inv.currency;
  const dpi = dpInfo(inv, totals);
  const dash = { borderTop: "1px dashed #a8a29e", margin: "8px 0" };
  const mono = "'IBM Plex Mono', 'Courier New', monospace";
  return (
    <div style={{ fontFamily: mono, width: "54mm", margin: "0 auto", padding: "8px 2mm", fontSize: 10.5, color: "#111", lineHeight: 1.5 }}>
      <div style={{ textAlign: "center" }}>
        <ShopLogo logo={profile.logo} size={38} radius={8} grayscale style={{ margin: "0 auto 6px" }} />
        <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.04em" }}>{profile.shopName || "TOKO"}</p>
        {(profile.address || profile.contact) && (
          <p style={{ fontSize: 9, color: "#444", whiteSpace: "pre-line" }}>{[profile.address, profile.contact].filter(Boolean).join(" · ")}</p>
        )}
      </div>
      <div style={dash} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.number}</span>
        <span>{fmtD(inv.date)}</span>
      </div>
      {inv.dueDate && <p>Jt. tempo: {fmtD(inv.dueDate)}</p>}
      {inv.poNumber && <p>PO: {inv.poNumber}</p>}
      {inv.customerName && <p>Plg: {inv.customerName}</p>}
      <div style={dash} />
      {(inv.items || []).map((it) => (
        <div key={it.id} style={{ marginBottom: 4 }}>
          <p style={{ fontWeight: 600, overflowWrap: "break-word" }}>{it.name || "—"}</p>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#333" }}>
            <span>{it.qty}{it.unit ? ` ${it.unit}` : ""} × {fmtMoney(it.price, cur)}</span>
            <span style={{ fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
          </div>
        </div>
      ))}
      <div style={dash} />
      {[
        ["Subtotal", totals.subtotal],
        totals.discountAmt > 0 ? [`Diskon`, -totals.discountAmt] : null,
        totals.taxAmt > 0 ? [`Pajak (${inv.tax || 0}%)`, totals.taxAmt] : null,
        totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
      ].filter(Boolean).map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{k}</span><Money v={v} cur={cur} />
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6, borderTop: "1px dashed #a8a29e", paddingTop: 6 }}>
        <span style={{ fontWeight: 800 }}>TOTAL</span>
        <span style={{ fontWeight: 800, fontSize: 20 }}><Money v={totals.total} cur={cur} /></span>
      </div>
      {dpi && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>DP</span><Money v={-dpi.dp} cur={cur} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
            <span style={{ fontWeight: 800 }}>SISA</span>
            <span style={{ fontWeight: 800, fontSize: 16 }}><Money v={dpi.sisa} cur={cur} /></span>
          </div>
        </>
      )}
      <div style={dash} />
      {inv.terms && <p style={{ fontSize: 9.5, marginBottom: 4 }}>Syarat: {inv.terms}</p>}
      {inv.notes && <p style={{ fontSize: 9.5, marginBottom: 6, whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{inv.notes}</p>}
      <p style={{ textAlign: "center", fontSize: 9.5, color: "#444" }}>Terima kasih 🙏</p>
    </div>
  );
}
