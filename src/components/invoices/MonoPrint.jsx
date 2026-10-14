// Style 7 — Monochrome Print. Murni hitam-putih untuk cetak hemat tinta.
// Semua aksen diabaikan (force hitam), logo di-grayscale, hairline abu-abu.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, fmtD, dpInfo } from "./shared.jsx";
import { fmtMoney, terbilang } from "../../lib/format.js";

const lbl = { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 };

export default function MonoPrint({ inv, profile, totals, bodyFont, showSignature }) {
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6, color: "#000", background: "#fff", padding: 52 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #000" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <ShopLogo logo={profile.logo} size={52} radius={10} grayscale />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile.shopName || "Nama Usaha"}</div>
            {(profile.address || profile.contact || profile.npwp) && (
              <div style={{ fontSize: 11, color: "#444", marginTop: 4, whiteSpace: "pre-line" }}>
                {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.04em" }}>INVOICE</div>
          <div style={{ ...lbl, marginTop: 6 }}>{inv.number}</div>
          <div style={{ fontSize: 11, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{fmtD(inv.date)}</div>
          {inv.dueDate && (
            <div style={{ fontSize: 11, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>Jt. tempo: {fmtD(inv.dueDate)}</div>
          )}
          {inv.poNumber && (
            <div style={{ fontSize: 11, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>No. PO: {inv.poNumber}</div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={lbl}>Ditagih kepada</div>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 4 }}>{inv.customerName || "—"}</div>
        {inv.customerInfo && <div style={{ fontSize: 11, color: "#444", whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
        {inv.customerNpwp && <div style={{ fontSize: 11, color: "#444" }}>NPWP: {inv.customerNpwp}</div>}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...lbl, color: "#000", textAlign: "left", padding: "10px 0", borderTop: "2px solid #000", borderBottom: "1px solid #000" }}>Deskripsi</th>
            <th style={{ ...lbl, color: "#000", textAlign: "right", padding: "10px 0", borderTop: "2px solid #000", borderBottom: "1px solid #000", width: 60 }}>Qty</th>
            <th style={{ ...lbl, color: "#000", textAlign: "right", padding: "10px 0", borderTop: "2px solid #000", borderBottom: "1px solid #000", width: 110 }}>Harga</th>
            <th style={{ ...lbl, color: "#000", textAlign: "right", padding: "10px 0", borderTop: "2px solid #000", borderBottom: "1px solid #000", width: 120 }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 20, color: "#666", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px 0", paddingRight: 16 }}>{it.name || "Tanpa nama"}</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(it.price, cur)}</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <div style={{ width: 270 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#333" }}>
              <span>{k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ borderTop: "2px solid #000", marginTop: 8, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ ...lbl, color: "#000" }}>Total</span>
            <span style={{ fontSize: 21, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              <Money v={totals.total} cur={cur} />
            </span>
          </div>
          {dpi && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#333" }}>
                <span>Uang muka (DP)</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={-dpi.dp} cur={cur} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 6 }}>
                <span style={{ ...lbl, color: "#000" }}>Sisa dibayar</span>
                <span style={{ fontSize: 17, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                  <Money v={dpi.sisa} cur={cur} />
                </span>
              </div>
            </>
          )}
          {cur === "IDR" && (
            <div style={{ fontStyle: "italic", color: "#333", textAlign: "right", fontSize: 11, marginTop: 6, textTransform: "capitalize" }}>
              {terbilang(dpi ? dpi.sisa : totals.total)}
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #bbb", marginTop: 32, paddingTop: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <PaymentBlock inv={inv} profile={profile} cur={cur} accent="#000" />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <NotesBlock inv={inv} />
        </div>
      </div>
      <div style={{ marginTop: 24, color: "#666", fontSize: 10.5, textAlign: "center" }}>
        Terima kasih atas kepercayaan Anda.
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
