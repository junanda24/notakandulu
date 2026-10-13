// Style 1 — Minimal SaaS Card (ala Stripe). Paling profesional: hairline,
// label uppercase ber-spasi, angka tabular rata kanan, total sebagai destinasi.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtMoney } from "../../lib/format.js";
import { fmtDate } from "../../lib/format.js";

const lbl = { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 };
const hair = { borderTop: "1px solid #e5e7eb" };

export default function SaasCard({ inv, profile, totals, bodyFont, accent, showSignature }) {
  const a = accent || "#4f46e5";
  const cur = inv.currency;
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6, color: "#111827", padding: 56 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <ShopLogo logo={profile.logo} size={52} radius={12} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>{profile.shopName || "Nama Usaha"}</div>
            {(profile.address || profile.contact || profile.npwp) && (
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>
                {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: a, letterSpacing: "0.02em" }}>INVOICE</div>
          <div style={{ ...lbl, marginTop: 6 }}>{inv.number}</div>
          {inv.poNumber && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>PO: {inv.poNumber}</div>}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 48, marginBottom: 32 }}>
        <div>
          <div style={lbl}>Ditagih kepada</div>
          <div style={{ fontWeight: 600, marginTop: 4 }}>{inv.customerName || "—"}</div>
          {inv.customerInfo && <div style={{ color: "#6b7280", fontSize: 11, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
          {inv.customerNpwp && <div style={{ color: "#6b7280", fontSize: 11 }}>NPWP: {inv.customerNpwp}</div>}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={lbl}>Tanggal terbit</div>
          <div style={{ marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.date)}</div>
          {inv.dueDate && (
            <>
              <div style={{ ...lbl, marginTop: 12 }}>Jatuh tempo</div>
              <div style={{ marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.dueDate)}</div>
            </>
          )}
        </div>
      </div>

      {/* Tabel */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
        <thead>
          <tr>
            <th style={{ ...lbl, textAlign: "left", padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>Deskripsi</th>
            <th style={{ ...lbl, textAlign: "right", padding: "10px 0", borderBottom: "1px solid #e5e7eb", width: 60 }}>Qty</th>
            <th style={{ ...lbl, textAlign: "right", padding: "10px 0", borderBottom: "1px solid #e5e7eb", width: 110 }}>Harga</th>
            <th style={{ ...lbl, textAlign: "right", padding: "10px 0", borderBottom: "1px solid #e5e7eb", width: 120 }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: "20px 0", color: "#9ca3af", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "13px 0", paddingRight: 16 }}>{it.name || <span style={{ color: "#9ca3af" }}>Tanpa nama</span>}</td>
              <td style={{ padding: "13px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#4b5563" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</td>
              <td style={{ padding: "13px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#4b5563" }}>{fmtMoney(it.price, cur)}</td>
              <td style={{ padding: "13px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total — destinasi visual */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <div style={{ width: 260 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563", fontSize: 12 }}>
              <span>{k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ ...hair, display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, marginTop: 6 }}>
            <span style={{ ...lbl }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
              <Money v={totals.total} cur={cur} />
            </span>
          </div>
          {dpi && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563", fontSize: 12 }}>
                <span>Uang muka (DP)</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={-dpi.dp} cur={cur} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 8 }}>
                <span style={{ ...lbl }}>Sisa dibayar</span>
                <span style={{ fontSize: 17, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  <Money v={dpi.sisa} cur={cur} />
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ ...hair, marginTop: 36, paddingTop: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <NotesBlock inv={inv} />
        </div>
      </div>
      <div style={{ marginTop: 24, color: "#9ca3af", fontSize: 10.5, textAlign: "center" }}>
        Terima kasih atas kepercayaan Anda.
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
