// Template — Noir: hitam pekat, tipografi dramatis tapi rapi.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const micro = { fontSize: 9, letterSpacing: "0.22em", fontWeight: 700, color: "#636366" };

export default function Noir({ inv, profile, totals, accent, showSignature }) {
  const a = accent || "#2dd4bf";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const inter = "'Inter', system-ui, sans-serif";
  return (
    <div style={{ fontFamily: inter, fontSize: 12.5, lineHeight: 1.6, color: "#f5f5f4", background: "#0b0b0c", padding: "52px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShopLogo logo={profile.logo} size={40} radius={10} />
            <span style={{ fontSize: 15, fontWeight: 700 }}>{profile.shopName || "Nama Usaha"}</span>
          </div>
          {(profile.address || profile.contact || profile.npwp) && (
            <div style={{ fontSize: 10.5, color: "#8e8e93", marginTop: 8, lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join("\n")}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={micro}>INVOICE</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{inv.number || "—"}</div>
        </div>
      </div>

      <div style={{ fontSize: 58, fontWeight: 300, letterSpacing: "-0.04em", marginTop: 34, fontVariantNumeric: "tabular-nums", color: a }}>
        <Money v={totals.total} cur={cur} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px", marginTop: 28 }}>
        {[
          ["UNTUK", <>{inv.customerName || "—"}<span style={{ display: "block", color: "#8e8e93", fontWeight: 400, fontSize: 11, whiteSpace: "pre-line" }}>{[inv.customerInfo, inv.customerNpwp ? `NPWP ${inv.customerNpwp}` : null].filter(Boolean).join("\n")}</span></>],
          ["TANGGAL / TEMPO / PO", <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.date)}<br />{inv.dueDate ? fmtDate(inv.dueDate) : "—"}<br />{inv.poNumber || "—"}</span>],
          ["SYARAT", inv.terms || "—"],
          ["STATUS", "Belum bayar"],
        ].map(([k, v]) => (
          <div key={k}><div style={micro}>{k}</div><div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.65 }}>{v}</div></div>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 30 }}>
        <thead>
          <tr>
            {["Deskripsi", "Qty", "Jumlah"].map((h, i) => (
              <th key={h} style={{ ...micro, textAlign: i === 0 ? "left" : "right", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
          {items.length === 0 && (
            <tr><td colSpan={3} style={{ padding: "20px 0", color: "#636366", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", verticalAlign: "top" }}>
                {it.name || <span style={{ color: "#636366" }}>Tanpa nama</span>}
                <span style={{ display: "block", color: "#636366", fontSize: 11 }}>{it.qty} {it.unit || "pcs"} × <Money v={Number(it.price) || 0} cur={cur} /></span>
              </td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "right", color: "#a1a1aa" }}>{it.qty}</td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "right", fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <div style={{ width: 280 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? [`Diskon${inv.discount?.type === "percent" ? ` (${inv.discount.value}%)` : ""}`, -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#a1a1aa", fontVariantNumeric: "tabular-nums" }}>
              <span>{k}</span><span><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <span style={micro}>TOTAL</span>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: a, fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
          </div>
          {dpi && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#a1a1aa", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                <span>Uang muka (DP)</span><span><Money v={dpi.dp} cur={cur} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                <span>Sisa dibayar</span><span><Money v={dpi.sisa} cur={cur} /></span>
              </div>
            </>
          )}
          {cur === "IDR" && (
            <div style={{ fontStyle: "italic", color: "#636366", fontSize: 11, textAlign: "right", marginTop: 8, textTransform: "capitalize" }}>
              {terbilang(dpi ? dpi.sisa : totals.total)}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 30, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.09)" }}>
        <div style={{ flex: 1 }}><PaymentBlock inv={inv} profile={profile} cur={cur} dark accent={a} /></div>
        <div style={{ flex: 1 }}><NotesBlock inv={inv} dark /></div>
      </div>
      {showSignature && <SignatureBlock dark left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
