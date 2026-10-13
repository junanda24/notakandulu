// Style 3 — Elegant Editorial Serif (ala HoneyBook). Serif untuk nama usaha &
// total + sans untuk data. Small caps ber-spasi, hairline saja, tanpa fill.
import { Money, PaymentBlock, NotesBlock, ShopLogo } from "./shared.jsx";
import { fmtMoney, fmtDate, terbilang } from "../../lib/format.js";

const lbl = { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#78716c", fontWeight: 600 };

export default function Editorial({ inv, profile, totals, bodyFont, accent }) {
  const a = accent || "#4f46e5";
  const cur = inv.currency;
  const items = inv.items || [];
  const serif = "'Fraunces', Georgia, serif";
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.7, color: "#1c1917", padding: "60px 64px" }}>
      {/* Masthead */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <ShopLogo logo={profile.logo} size={64} radius={16} style={{ margin: "0 auto 16px" }} />
        <div style={{ fontFamily: serif, fontSize: 34, fontWeight: 600, letterSpacing: "0.01em" }}>
          {profile.shopName || "Nama Usaha"}
        </div>
        {(profile.address || profile.contact) && (
          <div style={{ color: "#78716c", fontSize: 11, marginTop: 6 }}>
            {[profile.address, profile.contact].filter(Boolean).join("  ·  ")}
          </div>
        )}
      </div>
      <div style={{ borderTop: "1px solid #1c1917", borderBottom: "1px solid #d6d3d1", padding: "10px 0", margin: "24px 0 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...lbl, fontSize: 13, color: "#1c1917", letterSpacing: "0.3em" }}>Invoice</span>
        <span style={{ fontSize: 11, color: "#78716c", fontVariantNumeric: "tabular-nums" }}>
          {inv.number} &nbsp;·&nbsp; {fmtDate(inv.date)}
        </span>
      </div>

      {/* Bill to */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={lbl}>Ditagih kepada</div>
          <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, marginTop: 6 }}>{inv.customerName || "—"}</div>
          {inv.customerInfo && <div style={{ color: "#78716c", fontSize: 11, whiteSpace: "pre-line", marginTop: 2 }}>{inv.customerInfo}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={lbl}>Tanggal</div>
          <div style={{ marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.date)}</div>
        </div>
      </div>

      {/* Tabel hairline saja */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderTop: "1px solid #1c1917", borderBottom: "1px solid #1c1917" }}>
            <th style={{ ...lbl, textAlign: "left", padding: "12px 0" }}>Deskripsi</th>
            <th style={{ ...lbl, textAlign: "right", padding: "12px 0", width: 70 }}>Jml</th>
            <th style={{ ...lbl, textAlign: "right", padding: "12px 0", width: 120 }}>Harga</th>
            <th style={{ ...lbl, textAlign: "right", padding: "12px 0", width: 130 }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 24, color: "#a8a29e", textAlign: "center", fontStyle: "italic", fontFamily: serif }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #e7e5e4" }}>
              <td style={{ padding: "14px 16px 14px 0" }}>{it.name || <span style={{ color: "#a8a29e", fontStyle: "italic" }}>Tanpa nama</span>}</td>
              <td style={{ padding: "14px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#57534e" }}>{it.qty}</td>
              <td style={{ padding: "14px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#57534e" }}>{fmtMoney(it.price, cur)}</td>
              <td style={{ padding: "14px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total serif */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <div style={{ width: 280 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#57534e" }}>
              <span style={lbl}>{k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #1c1917", marginTop: 8, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={lbl}>Total</span>
            <span style={{ fontFamily: serif, fontSize: 26, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              <Money v={totals.total} cur={cur} />
            </span>
          </div>
          {cur === "IDR" && (
            <div style={{ fontFamily: serif, fontStyle: "italic", color: "#78716c", fontSize: 11.5, textAlign: "right", marginTop: 4, textTransform: "capitalize" }}>
              {terbilang(totals.total)} rupiah
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 40, marginTop: 44, paddingTop: 24, borderTop: "1px solid #e7e5e4" }}>
        <div style={{ flex: 1 }}><PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} /></div>
        <div style={{ flex: 1 }}><NotesBlock inv={inv} /></div>
      </div>
      <div style={{ marginTop: 36, textAlign: "center", fontFamily: serif, fontStyle: "italic", color: "#78716c", fontSize: 12 }}>
        Terima kasih atas kepercayaan Anda.
      </div>
    </div>
  );
}
