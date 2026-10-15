// Template — Noir & Gold: header charcoal + body ivory + aksen emas.
// Kemewahan dari kontras nilai + satu aksen metalik yang terkendali.
import { Money, PaymentBlock, NotesBlock, ShopLogo, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";
import { paymentStatus, STATUS_META } from "../../lib/calc.js";

const GOLD = "#C6A15B";

export default function NoirGold({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || GOLD;
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const st = paymentStatus(inv) || "belum";
  const sm = STATUS_META[st];
  const micro = { fontSize: 9, letterSpacing: "0.22em", fontWeight: 700, color: a };

  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.6, color: "#1c1917", background: "#FAF7F0" }}>
      {/* Header charcoal */}
      <div style={{ background: "#1A1A1A", color: "#FAF7F0", padding: "44px 52px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ShopLogo logo={profile.logo} size={44} radius={10} />
            <div>
              <div style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700 }}>{profile.shopName || "Nama Usaha"}</div>
              <ShopTagline profile={profile} style={{ color: "#a8a29e" }} />
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
          <div style={micro}>INVOICE</div>
          <div style={{ fontFamily: displayFont, fontSize: 20, marginTop: 6 }} className="tnum">{inv.number || "—"}</div>
          <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 4 }}>
            {fmtDate(inv.date)}{inv.dueDate ? ` · Tempo ${fmtDate(inv.dueDate)}` : ""}
          </div>
          <div style={{ marginTop: 8, display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 999, border: `1px solid ${a}`, color: a }}>
            {sm.label.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "36px 52px 40px" }}>
        <div style={{ display: "flex", gap: 40, marginBottom: 28 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...micro, color: "#a8a29e" }}>DITAGIHKAN KEPADA</div>
            <div style={{ fontWeight: 700, marginTop: 8, fontSize: 14 }}>{inv.customerName || "—"}</div>
            {inv.customerInfo && <div style={{ fontSize: 11.5, color: "#78716c", marginTop: 4, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
            {inv.customerNpwp && <div style={{ fontSize: 11.5, color: "#78716c" }}>NPWP {inv.customerNpwp}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...micro, color: "#a8a29e" }}>DETAIL</div>
            <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.8, color: "#57534e" }}>
              {inv.poNumber ? <>No. PO: <b style={{ color: "#1c1917" }}>{inv.poNumber}</b><br /></> : null}
              {inv.terms ? <>Syarat: <b style={{ color: "#1c1917" }}>{inv.terms}</b><br /></> : null}
              {inv.paymentIds?.length ? <>Metode: <b style={{ color: "#1c1917" }}>{inv.paymentIds.length} opsi</b></> : null}
            </div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", fontSize: 10, letterSpacing: "0.16em", color: "#78716c", fontWeight: 600, padding: "10px 8px", borderBottom: `1px solid ${a}` }}>DESKRIPSI</th>
              <th style={{ textAlign: "right", fontSize: 10, letterSpacing: "0.16em", color: "#78716c", fontWeight: 600, padding: "10px 8px", borderBottom: `1px solid ${a}` }}>QTY</th>
              <th style={{ textAlign: "right", fontSize: 10, letterSpacing: "0.16em", color: "#78716c", fontWeight: 600, padding: "10px 8px", borderBottom: `1px solid ${a}` }}>HARGA</th>
              <th style={{ textAlign: "right", fontSize: 10, letterSpacing: "0.16em", color: "#78716c", fontWeight: 600, padding: "10px 8px", borderBottom: `1px solid ${a}` }}>JUMLAH</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: "13px 8px", borderBottom: "1px solid #e7e0d2", fontSize: 13 }}>
                  <b>{it.name || "—"}</b>
                  {it.unit && it.unit !== "pcs" && <span style={{ color: "#a8a29e", fontSize: 11.5 }}> · {it.unit}</span>}
                </td>
                <td style={{ padding: "13px 8px", borderBottom: "1px solid #e7e0d2", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.qty}</td>
                <td style={{ padding: "13px 8px", borderBottom: "1px solid #e7e0d2", textAlign: "right", fontVariantNumeric: "tabular-nums" }}><Money v={it.price} cur={cur} /></td>
                <td style={{ padding: "13px 8px", borderBottom: "1px solid #e7e0d2", textAlign: "right", fontVariantNumeric: "tabular-nums" }}><b><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></b></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <div style={{ background: "#1A1A1A", color: "#FAF7F0", padding: "22px 28px", minWidth: 290, borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", color: "#d6d3d1" }}>
              <span>Subtotal</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.subtotal} cur={cur} /></span>
            </div>
            {totals.discountAmt > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", color: "#d6d3d1" }}>
                <span>Diskon</span><span style={{ fontVariantNumeric: "tabular-nums" }}>−<Money v={totals.discountAmt} cur={cur} /></span>
              </div>
            )}
            {totals.taxAmt > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", color: "#d6d3d1" }}>
                <span>Pajak ({inv.tax}%)</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.taxAmt} cur={cur} /></span>
              </div>
            )}
            {totals.shipping > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", color: "#d6d3d1" }}>
                <span>Ongkir</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={totals.shipping} cur={cur} /></span>
              </div>
            )}
            {dpi && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", color: "#d6d3d1" }}>
                <span>Uang muka (DP)</span><span style={{ fontVariantNumeric: "tabular-nums" }}>−<Money v={dpi.dp} cur={cur} /></span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `1px solid ${a}`, marginTop: 10, paddingTop: 12 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.2em", color: a, fontWeight: 700 }}>{dpi ? "SISA" : "TOTAL"}</span>
              <span style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, color: a, fontVariantNumeric: "tabular-nums" }}>
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

      {/* Footer */}
      <div style={{ background: "#1A1A1A", color: "#a8a29e", padding: "22px 52px", fontSize: 11, textAlign: "center", lineHeight: 1.8 }}>
        <b style={{ color: "#FAF7F0" }}>Terima kasih atas kepercayaan Anda.</b><br />
        Syarat &amp; ketentuan berlaku <span style={{ color: a, margin: "0 8px" }}>◆</span> Denda 2%/bulan untuk keterlambatan
      </div>
    </div>
  );
}
