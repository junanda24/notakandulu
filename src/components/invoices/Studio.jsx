// Template G — Studio / Agency (nyontek invoice studio asli).
// Total di header, meta 3 kolom, kolom jam, diskon terbuka. Tanpa kotak warning.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtDate } from "../../lib/format.js";

const grotesk = "'Space Grotesk', 'Inter', system-ui, sans-serif";
const inter = "'Inter', system-ui, sans-serif";

export default function Studio({ inv, profile, totals, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  return (
    <div style={{ fontFamily: grotesk, fontSize: 12, lineHeight: 1.6, color: "#111827", background: "#fff", padding: "48px 44px" }}>
      {/* Header: brand kiri, total kanan */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ShopLogo logo={profile.logo} size={44} radius={10} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 19 }}>{profile.shopName || "Nama Usaha"}<sup style={{ fontSize: 9 }}>®</sup></div>
            </div>
          </div>
          {(profile.address || profile.contact) && (
            <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 8, fontFamily: inter, whiteSpace: "pre-line" }}>
              {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#6b7280", fontFamily: inter }}>TOTAL DUE</div>
          <div style={{ fontWeight: 700, fontSize: 22, fontVariantNumeric: "tabular-nums", color: a }}><Money v={totals.total} cur={cur} /></div>
        </div>
      </div>

      {/* Meta 3 kolom */}
      <div style={{ display: "flex", gap: 14, marginTop: 22, fontSize: 10.5, fontFamily: inter }}>
        {[
          ["INVOICE #", inv.number || "—"],
          ["NO. PO", inv.poNumber || "—"],
          ["JATUH TEMPO", inv.dueDate ? fmtDate(inv.dueDate) : "—"],
        ].map(([k, v]) => (
          <div key={k} style={{ flex: 1, background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ color: "#6b7280", fontSize: 9, letterSpacing: "0.08em" }}>{k}</div>
            <div style={{ fontWeight: 700, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontFamily: inter }}>
        Kepada: <b>{inv.customerName || "—"}</b>
        {inv.customerInfo && <span style={{ color: "#6b7280" }}> · {String(inv.customerInfo).split("\n")[0]}</span>}
        {inv.customerNpwp && <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2 }}>NPWP {inv.customerNpwp}</div>}
      </div>

      {/* Tabel */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #111827" }}>
            {["Service", "Hrs/Qty", "Rate", "Subtotal"].map((h, i) => (
              <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "8px 0", fontSize: 9.5, letterSpacing: "0.1em", color: "#6b7280", fontWeight: 600 }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: "18px 0", color: "#9ca3af", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "10px 0", paddingRight: 12 }}>{it.name || <span style={{ color: "#9ca3af" }}>Tanpa nama</span>}</td>
              <td style={{ padding: "10px 0", textAlign: "right", color: "#4b5563" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</td>
              <td style={{ padding: "10px 0", textAlign: "right", color: "#4b5563" }}><Money v={Number(it.price) || 0} cur={cur} /></td>
              <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></td>
            </tr>
          ))}
          {totals.discountAmt > 0 && (
            <tr>
              <td style={{ padding: "10px 0", color: "#16a34a" }}>Diskon{inv.discount?.type === "percent" ? ` ${inv.discount.value}%` : ""}</td>
              <td /><td />
              <td style={{ padding: "10px 0", textAlign: "right", color: "#16a34a" }}>-<Money v={totals.discountAmt} cur={cur} /></td>
            </tr>
          )}
          {totals.taxAmt > 0 && (
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "10px 0", color: "#4b5563" }}>Pajak{inv.tax ? ` (${inv.tax}%)` : ""}</td>
              <td /><td />
              <td style={{ padding: "10px 0", textAlign: "right", color: "#4b5563" }}><Money v={totals.taxAmt} cur={cur} /></td>
            </tr>
          )}
          {totals.shipping > 0 && (
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "10px 0", color: "#4b5563" }}>Ongkir</td>
              <td /><td />
              <td style={{ padding: "10px 0", textAlign: "right", color: "#4b5563" }}><Money v={totals.shipping} cur={cur} /></td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 20, fontVariantNumeric: "tabular-nums", color: a }}>
          Total <Money v={totals.total} cur={cur} />
        </div>
        {dpi && (
          <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
            Uang muka (DP) <Money v={dpi.dp} cur={cur} /> · Sisa dibayar <b style={{ color: "#111827" }}><Money v={dpi.sisa} cur={cur} /></b>
          </div>
        )}
      </div>

      {/* Note simple, tanpa warning */}
      <div style={{ marginTop: 18, fontFamily: inter }}>
        <NotesBlock inv={inv} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontSize: 10.5, color: "#6b7280", fontFamily: inter }}>
        <div>Hormat kami,<br /><br /><br /><b style={{ color: "#111827" }}>{profile.shopName || "Nama Usaha"}</b></div>
        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          <PaymentBlock inv={inv} profile={profile} cur={cur} />
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 10.5, color: "#9ca3af", fontStyle: "italic", fontFamily: inter }}>
        Thank you for the creative partnership.
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
