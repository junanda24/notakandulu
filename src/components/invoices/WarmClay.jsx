// Template — Warm Clay: kertas hangat + terakota, artisan tapi presisi.
// Invoice-nya studio keramik: crafted, bukan corporate.
import { Money, PaymentBlock, NotesBlock, ShopLogo, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";
import { paymentStatus, STATUS_META } from "../../lib/calc.js";

const PAPER = "#F4EFE8";
const ESPRESSO = "#2E2620";

export default function WarmClay({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || "#B4654A";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const st = paymentStatus(inv) || "belum";
  const sm = STATUS_META[st];
  const lbl = { fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: a, fontWeight: 700 };

  return (
    <div style={{ fontFamily: bodyFont, background: PAPER, color: ESPRESSO, padding: "52px 56px", fontSize: 12.5, lineHeight: 1.6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ShopLogo logo={profile.logo} size={44} radius={12} />
            <div>
              <div style={{ fontFamily: displayFont, fontSize: 25, fontWeight: 600 }}>{profile.shopName || "Nama Usaha"}</div>
              <ShopTagline profile={profile} />
            </div>
          </div>
          {(profile.address || profile.contact) && (
            <div style={{ color: "#a8a29e", fontSize: 11, marginTop: 10, lineHeight: 1.6 }}>
              {[profile.address, profile.contact].filter(Boolean).join(" · ")}
              {profile.npwp ? ` · NPWP ${profile.npwp}` : ""}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.24em", color: a, fontWeight: 700 }}>INVOICE</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }} className="tnum">{inv.number || "—"}</div>
          <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 4 }}>{fmtDate(inv.date)}</div>
          <div style={{ marginTop: 8, display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 999, background: "#fff", border: `1px solid ${a}`, color: a }}>
            {sm.label.toUpperCase()}
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: `1px solid ${a}`, margin: "22px 0 26px", opacity: 0.45 }} />

      <div style={{ display: "flex", gap: 40, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <div style={lbl}>Untuk</div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 14 }}>{inv.customerName || "—"}</div>
          {inv.customerInfo && <div style={{ fontSize: 11.5, color: "#78716c", marginTop: 4, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
          {inv.customerNpwp && <div style={{ fontSize: 11.5, color: "#78716c" }}>NPWP {inv.customerNpwp}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={lbl}>Pembayaran</div>
          <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.8, color: "#57534e" }}>
            {inv.dueDate ? <>Jatuh tempo <b style={{ color: ESPRESSO }}>{fmtDate(inv.dueDate)}</b><br /></> : null}
            {inv.poNumber ? <>No. PO <b style={{ color: ESPRESSO }}>{inv.poNumber}</b><br /></> : null}
            {inv.terms ? <>Syarat <b style={{ color: ESPRESSO }}>{inv.terms}</b></> : null}
          </div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", ...lbl, padding: "10px 8px", borderBottom: "1px solid #d9cfc0" }}>Item</th>
            <th style={{ textAlign: "right", ...lbl, padding: "10px 8px", borderBottom: "1px solid #d9cfc0" }}>Qty</th>
            <th style={{ textAlign: "right", ...lbl, padding: "10px 8px", borderBottom: "1px solid #d9cfc0" }}>Harga</th>
            <th style={{ textAlign: "right", ...lbl, padding: "10px 8px", borderBottom: "1px solid #d9cfc0" }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: "13px 8px", borderBottom: "1px solid #e9e1d3", fontSize: 13 }}>
                <b>{it.name || "—"}</b>
                {it.unit && it.unit !== "pcs" && <span style={{ color: "#a8a29e", fontSize: 11.5 }}> · {it.unit}</span>}
              </td>
              <td style={{ padding: "13px 8px", borderBottom: "1px solid #e9e1d3", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.qty}</td>
              <td style={{ padding: "13px 8px", borderBottom: "1px solid #e9e1d3", textAlign: "right", fontVariantNumeric: "tabular-nums" }}><Money v={it.price} cur={cur} /></td>
              <td style={{ padding: "13px 8px", borderBottom: "1px solid #e9e1d3", textAlign: "right", fontVariantNumeric: "tabular-nums" }}><b><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></b></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, borderLeft: `4px solid ${a}`, padding: "22px 28px", minWidth: 290, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#78716c" }}>
            <span>Subtotal</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.subtotal} cur={cur} /></span>
          </div>
          {totals.discountAmt > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#78716c" }}>
              <span>Diskon</span><span style={{ fontVariantNumeric: "tabular-nums" }}>−<Money v={totals.discountAmt} cur={cur} /></span>
            </div>
          )}
          {totals.taxAmt > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#78716c" }}>
              <span>Pajak ({inv.tax}%)</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.taxAmt} cur={cur} /></span>
            </div>
          )}
          {totals.shipping > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#78716c" }}>
              <span>Ongkir</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.shipping} cur={cur} /></span>
            </div>
          )}
          {dpi && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#78716c" }}>
              <span>Uang muka (DP)</span><span style={{ fontVariantNumeric: "tabular-nums" }}>−<Money v={dpi.dp} cur={cur} /></span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, paddingTop: 12, borderTop: "1px solid #f0e9dc" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.14em", fontWeight: 700 }}>{dpi ? "SISA" : "TOTAL"}</span>
            <span style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              <Money v={dpi ? dpi.sisa : totals.total} cur={cur} />
            </span>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 18, fontStyle: "italic", color: "#78716c", fontSize: 12 }}>
        Terbilang: “{terbilang(dpi ? dpi.sisa : totals.total, cur)}”
      </p>

      <PaymentBlock inv={inv} profile={profile} />
      <NotesBlock inv={inv} />
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}

      <p style={{ textAlign: "center", marginTop: 34, color: a, fontSize: 13, fontStyle: "italic", fontFamily: displayFont }}>
        — Terima kasih sudah mendukung kerajinan lokal —
      </p>
    </div>
  );
}
