// Style 9 — Struk 80mm (thermal). Konten 76mm: header tegas, item berkolom,
// jumlah rata kanan, TOTAL tebal besar, footer singkat. Direkomendasikan saat
// ada QR / detail pajak.
import { Money, ShopLogo, fmtD, dpInfo } from "./shared.jsx";
import { fmtMoney, terbilang } from "../../lib/format.js";

export default function Struk80({ inv, profile, totals, bodyFont }) {
  const cur = inv.currency || "IDR";
  const dpi = dpInfo(inv, totals);
  const dash = { borderTop: "1px dashed #a8a29e", margin: "10px 0" };
    return (
    <div style={{ fontFamily: bodyFont, width: "76mm", margin: "0 auto", padding: "10px 2mm", fontSize: 11.5, color: "#111", lineHeight: 1.55 }}>
      <div style={{ textAlign: "center" }}>
        <ShopLogo logo={profile.logo} size={44} radius={10} grayscale style={{ margin: "0 auto 8px" }} />
        <p style={{ fontWeight: 800, fontSize: 16, letterSpacing: "0.06em" }}>{profile.shopName || "TOKO"}</p>
        {profile.tagline?.trim() && <p style={{ fontSize: 10.5, color: "#444", fontStyle: "italic" }}>{profile.tagline.trim()}</p>}
        {(profile.address || profile.contact) && (
          <p style={{ fontSize: 10, color: "#444", whiteSpace: "pre-line" }}>{[profile.address, profile.contact].filter(Boolean).join(" · ")}</p>
        )}
      </div>
      <div style={dash} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span><b>No:</b> {inv.number}</span>
        <span>{fmtD(inv.date)}</span>
      </div>
      {inv.dueDate && <p><b>Jt. tempo:</b> {fmtD(inv.dueDate)}</p>}
      {inv.poNumber && <p><b>PO:</b> {inv.poNumber}</p>}
      {inv.customerName && <p><b>Pelanggan:</b> {inv.customerName}</p>}
      <div style={dash} />
      <div style={{ display: "flex", fontWeight: 700, fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        <span style={{ flex: 1 }}>Item</span>
        <span style={{ width: 36, textAlign: "right" }}>Qty</span>
        <span style={{ width: 92, textAlign: "right" }}>Jumlah</span>
      </div>
      {(inv.items || []).map((it) => (
        <div key={it.id} style={{ margin: "4px 0" }}>
          <p style={{ overflowWrap: "break-word" }}>{it.name || "—"}</p>
          <div style={{ display: "flex", color: "#333" }}>
            <span style={{ flex: 1 }}>{fmtMoney(it.price, cur)} /pcs</span>
            <span style={{ width: 36, textAlign: "right" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</span>
            <span style={{ width: 92, textAlign: "right", fontWeight: 600 }}>
              <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
            </span>
          </div>
        </div>
      ))}
      <div style={dash} />
      {[
        ["Subtotal", totals.subtotal],
        totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
        totals.taxAmt > 0 ? [`Pajak (${inv.tax || 0}%)`, totals.taxAmt] : null,
        totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
      ].filter(Boolean).map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{k}</span><Money v={v} cur={cur} />
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8, borderTop: "1px dashed #a8a29e", paddingTop: 8 }}>
        <span style={{ fontWeight: 800 }}>TOTAL</span>
        <span style={{ fontWeight: 800, fontSize: 24 }}><Money v={totals.total} cur={cur} /></span>
      </div>
      {dpi && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span><b>DP:</b></span><Money v={-dpi.dp} cur={cur} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
            <span style={{ fontWeight: 800 }}>SISA BAYAR</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}><Money v={dpi.sisa} cur={cur} /></span>
          </div>
        </>
      )}
          {cur === "IDR" && (
            <div style={{ fontStyle: "italic", color: "#444", textAlign: "center", fontSize: 11, marginTop: 6, textTransform: "capitalize" }}>
              {terbilang(dpi ? dpi.sisa : totals.total)}
            </div>
          )}
      <div style={dash} />
      {inv.terms && <p style={{ fontSize: 10.5, marginBottom: 4 }}><b>Syarat:</b> {inv.terms}</p>}
      {inv.notes && <p style={{ fontSize: 10.5, marginBottom: 8, whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{inv.notes}</p>}
      <p style={{ textAlign: "center", fontSize: 10.5, color: "#444" }}>— Terima kasih atas kunjungan Anda —</p>
    </div>
  );
}
