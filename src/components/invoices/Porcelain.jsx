// Template — Porcelain: kartu lembut di atas abu, rasa Apple.
import { Money, PaymentBlock, NotesBlock, ShopLogo, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const k = { fontSize: 8.5, letterSpacing: "0.18em", color: "#94a3b8", fontWeight: 700 };

export default function Porcelain({ inv, profile, totals, bodyFont, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
    const ink = "#0f1f33";
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.6, color: ink, background: "#eef2f7", padding: "26px 22px" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "38px 36px", boxShadow: "0 4px 24px rgba(30,58,90,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShopLogo logo={profile.logo} size={38} radius={10} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{profile.shopName || "Nama Usaha"}</div>
              <ShopTagline profile={profile} />
              <div style={{ ...k, marginTop: 3 }}>INVOICE · {inv.number || "—"}</div>
            </div>
          </div>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: a, boxShadow: `0 0 0 5px ${a}22` }} />
        </div>

        <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.035em", marginTop: 20, fontVariantNumeric: "tabular-nums" }}>
          <Money v={totals.total} cur={cur} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px", marginTop: 24, background: "#f6f8fb", borderRadius: 14, padding: "18px 20px" }}>
          {[
            ["DARI", <>{profile.shopName || "—"}<span style={{ display: "block", fontWeight: 400, color: "#64748b" }}>{[profile.address, profile.contact].filter(Boolean).join(" · ")}{profile.npwp ? ` · NPWP ${profile.npwp}` : ""}</span></>],
            ["UNTUK", <>{inv.customerName || "—"}<span style={{ display: "block", fontWeight: 400, color: "#64748b" }}>{[inv.customerInfo, inv.customerNpwp ? `NPWP ${inv.customerNpwp}` : null].filter(Boolean).join(" · ")}</span></>],
            ["TANGGAL / JATUH TEMPO", <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.date)} / {inv.dueDate ? fmtDate(inv.dueDate) : "—"}</span>],
            ["PO / SYARAT", `${inv.poNumber || "—"} / ${inv.terms || "—"}`],
          ].map(([kk, v]) => (
            <div key={kk}><div style={k}>{kk}</div><div style={{ fontSize: 12, fontWeight: 600, marginTop: 3, lineHeight: 1.6 }}>{v}</div></div>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 22 }}>
          <thead>
            <tr>
              {["Item", "Qty", "Jumlah"].map((h, i) => (
                <th key={h} style={{ ...k, textAlign: i === 0 ? "left" : "right", padding: "10px 0", borderBottom: "1px solid #eef2f7" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
            {items.length === 0 && (
              <tr><td colSpan={3} style={{ padding: "20px 0", color: "#94a3b8", textAlign: "center" }}>Belum ada item</td></tr>
            )}
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #f6f8fb", verticalAlign: "top" }}>
                  {it.name || <span style={{ color: "#94a3b8" }}>Tanpa nama</span>}
                  <span style={{ color: "#94a3b8", fontSize: 11 }}> · {it.qty} {it.unit || "pcs"} × <Money v={Number(it.price) || 0} cur={cur} /></span>
                </td>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #f6f8fb", textAlign: "right", color: "#64748b" }}>{it.qty}</td>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #f6f8fb", textAlign: "right", fontWeight: 700 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? [`Diskon${inv.discount?.type === "percent" ? ` (${inv.discount.value}%)` : ""}`, -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([kk, v]) => (
            <div key={kk} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
              <span>{kk}</span><span><Money v={v} cur={cur} /></span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 14, borderTop: `2px solid ${ink}` }}>
          <span style={k}>TOTAL TAGIHAN</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: a, fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
        </div>
        {dpi && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
            <span>Uang muka (DP) / Sisa</span><span><span style={{ color: "#94a3b8" }}><Money v={dpi.dp} cur={cur} /></span> / <b style={{ color: ink }}><Money v={dpi.sisa} cur={cur} /></b></span>
          </div>
        )}
        {cur === "IDR" && (
          <div style={{ fontStyle: "italic", color: "#94a3b8", fontSize: 11, textAlign: "right", marginTop: 8, textTransform: "capitalize" }}>
            {terbilang(dpi ? dpi.sisa : totals.total)}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px", marginTop: 24 }}>
          <div><PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} /></div>
          {(inv.notes || inv.terms) && (<div><div style={k}>CATATAN</div><NotesBlock inv={inv} /></div>)}
        </div>
        {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
      </div>
    </div>
  );
}
