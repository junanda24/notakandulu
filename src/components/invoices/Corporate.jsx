// Style 2 — Corporate Clean (ala Wave/FreshBooks). Format yang diharapkan
// perusahaan Indonesia: logo kiri, meta kanan, band total aksen, baris PPN.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtMoney, fmtDate } from "../../lib/format.js";

const lbl = { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 };

export default function Corporate({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || "#1e3a5f";
  const cur = inv.currency;
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6, color: "#1f2937", padding: 52 }}>
      {/* Header dua kolom */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 24, borderBottom: `3px solid ${a}` }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <ShopLogo logo={profile.logo} size={56} radius={10} />
          <div>
            <div style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700 }}>{profile.shopName || "Nama Usaha"}</div>
            <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4, whiteSpace: "pre-line" }}>
              {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join("\n")}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: a, letterSpacing: "0.04em" }}>INVOICE</div>
          <table style={{ marginLeft: "auto", marginTop: 8, borderCollapse: "collapse", fontSize: 11.5 }}>
            <tbody>
              <tr><td style={{ ...lbl, paddingRight: 12, paddingBottom: 4 }}>Nomor</td><td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{inv.number}</td></tr>
              <tr><td style={{ ...lbl, paddingRight: 12, paddingBottom: inv.dueDate ? 4 : 0 }}>Tanggal</td><td style={{ fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.date)}</td></tr>
              {inv.dueDate && (
                <tr><td style={{ ...lbl, paddingRight: 12, paddingBottom: inv.poNumber ? 4 : 0 }}>Jatuh tempo</td><td style={{ fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.dueDate)}</td></tr>
              )}
              {inv.poNumber && (
                <tr><td style={{ ...lbl, paddingRight: 12 }}>No. PO</td><td style={{ fontVariantNumeric: "tabular-nums" }}>{inv.poNumber}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill to */}
      <div style={{ margin: "24px 0" }}>
        <div style={lbl}>Ditagih kepada</div>
        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{inv.customerName || "—"}</div>
        {inv.customerInfo && <div style={{ color: "#6b7280", fontSize: 11, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
        {inv.customerNpwp && <div style={{ color: "#6b7280", fontSize: 11 }}>NPWP: {inv.customerNpwp}</div>}
      </div>

      {/* Tabel */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>Deskripsi</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563", width: 60 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563", width: 110 }}>Harga Satuan</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563", width: 130 }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 20, color: "#9ca3af", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px" }}>{it.name || <span style={{ color: "#9ca3af" }}>Tanpa nama</span>}</td>
              <td style={{ padding: "12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</td>
              <td style={{ padding: "12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(it.price, cur)}</td>
              <td style={{ padding: "12px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total band */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 0 }}>
        <div style={{ width: 300, background: "#f9fafb", border: "1px solid #e5e7eb", borderTop: "none", padding: "16px 20px" }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`PPN${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkos kirim", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, color: "#4b5563" }}>
              <span>{k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `2px solid ${a}` }}>
            <span style={{ fontWeight: 700, color: a, letterSpacing: "0.06em", fontSize: 12 }}>TOTAL</span>
            <span style={{ fontSize: 19, fontWeight: 800, color: a, fontVariantNumeric: "tabular-nums" }}>
              <Money v={totals.total} cur={cur} />
            </span>
          </div>
          {dpi && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, color: "#4b5563" }}>
                <span>Uang muka (DP)</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={-dpi.dp} cur={cur} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6 }}>
                <span style={{ fontWeight: 700, color: a, letterSpacing: "0.06em", fontSize: 12 }}>SISA DIBAYAR</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: a, fontVariantNumeric: "tabular-nums" }}>
                  <Money v={dpi.sisa} cur={cur} />
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 32, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
        <div style={{ flex: 1 }}><PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} /></div>
        <div style={{ flex: 1 }}><NotesBlock inv={inv} /></div>
      </div>
      <div style={{ marginTop: 28, textAlign: "center", color: "#6b7280", fontSize: 11 }}>
        Terima kasih atas bisnis Anda.
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
