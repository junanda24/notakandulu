// Template — Emerald Ledger: hijau hutan + krem, divider lengkung organik.
// Botanical, tenang, premium — seperti tagihan hotel butik.
import { Money, PaymentBlock, NotesBlock, ShopLogo, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";
import { paymentStatus, STATUS_META } from "../../lib/calc.js";

const FOREST = "#1E3A2F";
const SAGE = "#DCE5DC";
const CREAM = "#FBFAF6";

export default function EmeraldLedger({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || FOREST;
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const st = paymentStatus(inv) || "belum";
  const sm = STATUS_META[st];

  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.6, color: "#2A2A2A", background: CREAM }}>
      {/* Header hijau */}
      <div style={{ background: a, color: "#FBFAF6", padding: "42px 52px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, paddingBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ShopLogo logo={profile.logo} size={44} radius={10} />
              <div>
                <div style={{ fontFamily: displayFont, fontSize: 27 }}>{profile.shopName || "Nama Usaha"}</div>
                <ShopTagline profile={profile} style={{ color: "#a8c4b5" }} />
              </div>
            </div>
            {(profile.address || profile.contact) && (
              <div style={{ color: "#a8c4b5", fontSize: 11, marginTop: 10, lineHeight: 1.6 }}>
                {[profile.address, profile.contact].filter(Boolean).join(" · ")}
                {profile.npwp ? ` · NPWP ${profile.npwp}` : ""}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", color: SAGE, fontWeight: 600 }}>INVOICE</div>
            <div style={{ fontSize: 15, marginTop: 8, fontWeight: 600 }} className="tnum">{inv.number || "—"}</div>
            <div style={{ marginTop: 8, display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 999, background: "rgba(255,255,255,0.14)", color: "#fff" }}>
              {sm.label.toUpperCase()}
            </div>
          </div>
        </div>
        <svg viewBox="0 0 900 36" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 32, marginBottom: -1 }}>
          <path d="M0,36 C240,0 660,0 900,36 L900,36 L0,36 Z" fill={CREAM} />
        </svg>
      </div>

      {/* Body */}
      <div style={{ padding: "32px 52px 40px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ background: SAGE, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
            <b style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a7263", marginBottom: 3 }}>Tanggal</b>
            {fmtDate(inv.date)}
          </div>
          {inv.dueDate && (
            <div style={{ background: SAGE, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
              <b style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a7263", marginBottom: 3 }}>Jatuh tempo</b>
              {fmtDate(inv.dueDate)}
            </div>
          )}
          <div style={{ background: SAGE, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
            <b style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a7263", marginBottom: 3 }}>Pelanggan</b>
            {inv.customerName || "—"}
          </div>
          {inv.poNumber && (
            <div style={{ background: SAGE, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
              <b style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a7263", marginBottom: 3 }}>No. PO</b>
              {inv.poNumber}
            </div>
          )}
        </div>

        {inv.customerInfo && <p style={{ fontSize: 12, color: "#78716c", marginBottom: 20, whiteSpace: "pre-line" }}>{inv.customerInfo}</p>}
        {inv.customerNpwp && <p style={{ fontSize: 12, color: "#78716c", marginBottom: 20 }}>NPWP {inv.customerNpwp}</p>}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Layanan", "Qty", "Harga", "Jumlah"].map((h, i) => (
                <th key={h} style={{
                  background: SAGE, textAlign: i === 0 ? "left" : "right",
                  fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: a, padding: 12, fontWeight: 600,
                  borderRadius: i === 0 ? "8px 0 0 8px" : i === 3 ? "0 8px 8px 0" : 0,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: "13px 12px", borderBottom: "1px solid #e8e4da", fontSize: 13 }}>
                  <b>{it.name || "—"}</b>
                  {it.unit && it.unit !== "pcs" && <span style={{ color: "#a8a29e", fontSize: 11.5 }}> · {it.unit}</span>}
                </td>
                <td style={{ padding: "13px 12px", borderBottom: "1px solid #e8e4da", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.qty}</td>
                <td style={{ padding: "13px 12px", borderBottom: "1px solid #e8e4da", textAlign: "right", fontVariantNumeric: "tabular-nums" }}><Money v={it.price} cur={cur} /></td>
                <td style={{ padding: "13px 12px", borderBottom: "1px solid #e8e4da", textAlign: "right", fontVariantNumeric: "tabular-nums" }}><b><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></b></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <div style={{ minWidth: 290, border: `1px solid ${SAGE}`, borderTop: `3px double ${a}`, borderRadius: "0 0 8px 8px", padding: "20px 24px", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#57534e" }}>
              <span>Subtotal</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.subtotal} cur={cur} /></span>
            </div>
            {totals.discountAmt > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#57534e" }}>
                <span>Diskon</span><span style={{ fontVariantNumeric: "tabular-nums" }}>−<Money v={totals.discountAmt} cur={cur} /></span>
              </div>
            )}
            {totals.taxAmt > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#57534e" }}>
                <span>Pajak ({inv.tax}%)</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.taxAmt} cur={cur} /></span>
              </div>
            )}
            {totals.shipping > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#57534e" }}>
                <span>Ongkir</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.shipping} cur={cur} /></span>
              </div>
            )}
            {dpi && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#57534e" }}>
                <span>Uang muka (DP)</span><span style={{ fontVariantNumeric: "tabular-nums" }}>−<Money v={dpi.dp} cur={cur} /></span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, paddingTop: 12, borderTop: `1px solid ${SAGE}` }}>
              <span style={{ fontSize: 11, letterSpacing: "0.16em", fontWeight: 700 }}>{dpi ? "SISA" : "TOTAL"}</span>
              <span style={{ fontFamily: displayFont, fontSize: 26, color: a, fontVariantNumeric: "tabular-nums" }}>
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
      </div>

      <div style={{ background: a, color: "#c9d8ce", padding: "18px 52px", fontSize: 11, display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span>Terima kasih — semoga harimu tenang.</span>
        {inv.terms && <span>Syarat: {inv.terms}</span>}
      </div>
    </div>
  );
}
