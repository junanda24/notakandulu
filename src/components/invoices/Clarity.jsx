// Template — Clarity: putih bersih, hairline, angka hero besar.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const micro = { fontSize: 9, letterSpacing: "0.22em", fontWeight: 700, color: "#a8a29e" };

export default function Clarity({ inv, profile, totals, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const inter = "'Inter', system-ui, sans-serif";
  return (
    <div style={{ fontFamily: inter, fontSize: 12.5, lineHeight: 1.6, color: "#1c1917", background: "#fff", padding: "52px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShopLogo logo={profile.logo} size={40} radius={10} />
            <span style={{ fontSize: 16, fontWeight: 800 }}>{profile.shopName || "Nama Usaha"}</span>
          </div>
          {(profile.address || profile.contact || profile.npwp) && (
            <div style={{ fontSize: 10.5, color: "#78716c", marginTop: 8, lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join("\n")}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={micro}>INVOICE</div>
          <div style={{ fontSize: 14, fontWeight: 800, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{inv.number || "—"}</div>
          <div style={{ fontSize: 11, color: "#78716c", marginTop: 4, lineHeight: 1.8, fontVariantNumeric: "tabular-nums" }}>
            {fmtDate(inv.date)}<br />Jatuh tempo {inv.dueDate ? fmtDate(inv.dueDate) : "—"}{inv.poNumber ? <><br />{inv.poNumber}</> : null}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.035em", marginTop: 30, fontVariantNumeric: "tabular-nums" }}>
        <Money v={totals.total} cur={cur} />
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 26 }}>
        <div style={{ flex: 1 }}>
          <div style={micro}>DITAGIHKAN KEPADA</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, lineHeight: 1.65 }}>
            {inv.customerName || "—"}
            {(inv.customerInfo || inv.customerNpwp) && (
              <span style={{ display: "block", fontWeight: 400, color: "#78716c", fontSize: 11, whiteSpace: "pre-line" }}>
                {[inv.customerInfo, inv.customerNpwp ? `NPWP ${inv.customerNpwp}` : null].filter(Boolean).join("\n")}
              </span>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={micro}>SYARAT</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{inv.terms || "—"}</div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 28 }}>
        <thead>
          <tr>
            {["Deskripsi", "Qty", "Harga", "Jumlah"].map((h, i) => (
              <th key={h} style={{ ...micro, textAlign: i === 0 ? "left" : "right", padding: "10px 0", borderBottom: "1px solid #1c1917" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: "20px 0", color: "#a8a29e", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f3", verticalAlign: "top" }}>
                {it.name || <span style={{ color: "#a8a29e" }}>Tanpa nama</span>}
                <span style={{ display: "block", color: "#a8a29e", fontSize: 11 }}>{it.qty} {it.unit || "pcs"}</span>
              </td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f3", textAlign: "right", color: "#57534e" }}>{it.qty}</td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f3", textAlign: "right", color: "#57534e" }}><Money v={Number(it.price) || 0} cur={cur} /></td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f3", textAlign: "right", fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></td>
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
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#57534e", fontVariantNumeric: "tabular-nums" }}>
              <span>{k}</span><span><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, paddingTop: 14, borderTop: "1px solid #1c1917" }}>
            <span style={{ ...micro, color: "#78716c" }}>TOTAL TAGIHAN</span>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: a, fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
          </div>
          {dpi && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#57534e", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                <span>Uang muka (DP)</span><span><Money v={dpi.dp} cur={cur} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                <span>Sisa dibayar</span><span><Money v={dpi.sisa} cur={cur} /></span>
              </div>
            </>
          )}
          {cur === "IDR" && (
            <div style={{ fontStyle: "italic", color: "#a8a29e", fontSize: 11, textAlign: "right", marginTop: 8, textTransform: "capitalize" }}>
              {terbilang(dpi ? dpi.sisa : totals.total)}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 30, paddingTop: 20, borderTop: "1px solid #f0efed" }}>
        <div style={{ flex: 1 }}><PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} /></div>
        <div style={{ flex: 1 }}><NotesBlock inv={inv} /></div>
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
