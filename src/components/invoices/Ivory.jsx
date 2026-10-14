// Template — Ivory: kertas hangat, serif, quiet luxury.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const k = { fontSize: 9, letterSpacing: "0.22em", color: "#a8a29e", fontWeight: 700 };

export default function Ivory({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || "#b45309";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
    return (
    <div style={{ fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.6, color: "#292524", background: "#faf7f1", padding: "52px 48px" }}>
      <div style={{ textAlign: "center" }}>
        <ShopLogo logo={profile.logo} size={46} radius={10} style={{ margin: "0 auto 10px" }} />
        <div style={{ fontSize: 12, letterSpacing: "0.32em", textIndent: "0.32em", fontWeight: 600, color: "#78716c" }}>{(profile.shopName || "NAMA USAHA").toUpperCase()}</div>
        {(profile.address || profile.contact || profile.npwp) && (
          <div style={{ fontSize: 10.5, color: "#a8a29e", marginTop: 8, lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join("\n")}
          </div>
        )}
      </div>
      <div style={{ width: 44, height: 2, background: a, margin: "22px auto" }} />
      <div style={{ textAlign: "center", fontSize: 10.5, letterSpacing: "0.16em", color: "#78716c", lineHeight: 2, fontVariantNumeric: "tabular-nums" }}>
        INVOICE · {inv.number || "—"}<br />{fmtDate(inv.date)} · JATUH TEMPO {inv.dueDate ? fmtDate(inv.dueDate) : "—"}{inv.poNumber ? ` · ${inv.poNumber}` : ""}
      </div>
      <div style={{ fontFamily: displayFont, textAlign: "center", fontSize: 50, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>
        <Money v={totals.total} cur={cur} />
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 30 }}>
        <div style={{ flex: 1 }}>
          <div style={k}>DITAGIHKAN KEPADA</div>
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
          <div style={k}>SYARAT PEMBAYARAN</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{inv.terms || "—"}</div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 26 }}>
        <thead>
          <tr>
            {["Uraian", "Qty", "Jumlah"].map((h, i) => (
              <th key={h} style={{ ...k, textAlign: i === 0 ? "left" : "right", padding: "10px 0", borderBottom: "1px solid #292524" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
          {items.length === 0 && (
            <tr><td colSpan={3} style={{ padding: "20px 0", color: "#a8a29e", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: "11px 0", borderBottom: "1px solid #e9e2d4", verticalAlign: "top" }}>
                {it.name || <span style={{ color: "#a8a29e" }}>Tanpa nama</span>}
                <span style={{ color: "#a8a29e", fontSize: 11 }}> · {it.qty} {it.unit || "pcs"}</span>
              </td>
              <td style={{ padding: "11px 0", borderBottom: "1px solid #e9e2d4", textAlign: "right", color: "#57534e" }}>{it.qty}</td>
              <td style={{ padding: "11px 0", borderBottom: "1px solid #e9e2d4", textAlign: "right", fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <div style={{ width: 270 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? [`Diskon${inv.discount?.type === "percent" ? ` (${inv.discount.value}%)` : ""}`, -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([kk, v]) => (
            <div key={kk} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#57534e", fontVariantNumeric: "tabular-nums" }}>
              <span>{kk}</span><span><Money v={v} cur={cur} /></span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 26 }}>
        <div style={k}>TOTAL TAGIHAN</div>
        <div style={{ fontFamily: displayFont, fontSize: 38, marginTop: 8, color: a, fontVariantNumeric: "tabular-nums" }}>
          <Money v={totals.total} cur={cur} />
        </div>
        {dpi && (
          <div style={{ fontSize: 12, color: "#57534e", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
            Uang muka (DP) <Money v={dpi.dp} cur={cur} /> · <b>Sisa <Money v={dpi.sisa} cur={cur} /></b>
          </div>
        )}
      </div>
      {cur === "IDR" && (
        <div style={{ textAlign: "center", fontStyle: "italic", fontFamily: displayFont, color: "#a8a29e", fontSize: 11, marginTop: 8, textTransform: "capitalize" }}>
          {terbilang(dpi ? dpi.sisa : totals.total)}
        </div>
      )}

      <div style={{ display: "flex", gap: 32, marginTop: 30 }}>
        <div style={{ flex: 1 }}><PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} /></div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <NotesBlock inv={inv} />
          {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
        </div>
      </div>
    </div>
  );
}
