// Template A — Faktur Formal (nyontek Adobe + GitHub).
// Hierarki dari kapitalisasi & bold, tanpa warna. GRAND TOTAL di blok hitam.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const lbl = { fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 };

export default function FakturFormal({ inv, profile, totals, accent, showSignature }) {
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const inter = "'Inter', system-ui, sans-serif";
  const meta = [
    ["Invoice No.", inv.number || "—"],
    ["Date", fmtDate(inv.date)],
    inv.dueDate ? ["Due Date", fmtDate(inv.dueDate)] : null,
    inv.poNumber ? ["PO Number", inv.poNumber] : null,
  ].filter(Boolean);
  return (
    <div style={{ fontFamily: inter, fontSize: 12, lineHeight: 1.6, color: "#111827", padding: 52, background: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <ShopLogo logo={profile.logo} size={52} radius={8} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{profile.shopName || "Nama Usaha"}</div>
            {(profile.address || profile.contact) && (
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4, whiteSpace: "pre-line" }}>
                {[profile.address, profile.contact].filter(Boolean).join("\n")}
              </div>
            )}
            {profile.npwp && <div style={{ color: "#6b7280", fontSize: 11 }}>NPWP {profile.npwp}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11 }}>
          <div style={{ ...lbl, color: "#111827", marginBottom: 6 }}>Invoice Information</div>
          {meta.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "flex-end", gap: 14, padding: "2px 0" }}>
              <span style={{ ...lbl }}>{k}</span>
              <span style={{ fontWeight: 600, minWidth: 130, textAlign: "left", fontVariantNumeric: "tabular-nums" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, marginTop: 26, paddingBottom: 14, borderBottom: "3px solid #111827" }}>
        INVOICE
      </div>

      {/* Bill to */}
      <div style={{ display: "flex", gap: 40, margin: "22px 0" }}>
        <div>
          <div style={lbl}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{inv.customerName || "—"}</div>
          {inv.customerInfo && <div style={{ color: "#6b7280", fontSize: 11, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
        </div>
        <div>
          <div style={lbl}>Ship To</div>
          <div style={{ fontWeight: 600, fontSize: 12, marginTop: 4 }}>{inv.customerName || "—"}</div>
          {inv.customerNpwp && <div style={{ color: "#6b7280", fontSize: 11 }}>NPWP {inv.customerNpwp}</div>}
        </div>
      </div>

      {/* Tabel */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#111827", color: "#fff" }}>
            {["Deskripsi", "Qty", "Harga Satuan", "Pajak", "Jumlah"].map((h, i) => (
              <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "10px 12px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={5} style={{ padding: "20px 0", color: "#9ca3af", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {items.map((it, idx) => (
            <tr key={it.id} style={{ background: idx % 2 ? "#f9fafb" : "#fff", borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "11px 12px" }}>{it.name || <span style={{ color: "#9ca3af" }}>Tanpa nama</span>}</td>
              <td style={{ padding: "11px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#4b5563" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</td>
              <td style={{ padding: "11px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#4b5563" }}><Money v={Number(it.price) || 0} cur={cur} /></td>
              <td style={{ padding: "11px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#4b5563" }}>{inv.tax ? `${inv.tax}%` : "—"}</td>
              <td style={{ padding: "11px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <div style={{ width: 300 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563", fontSize: 12 }}>
              <span>{k}</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ background: "#111827", color: "#fff", borderRadius: 8, padding: "14px 18px", marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.2em", fontWeight: 700, opacity: 0.75 }}>GRAND TOTAL</span>
            <span style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
          </div>
          {dpi && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#4b5563", fontSize: 12 }}>
                <span>Uang muka (DP)</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={-dpi.dp} cur={cur} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 4 }}>
                <span style={lbl}>Sisa dibayar</span>
                <span style={{ fontSize: 17, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}><Money v={dpi.sisa} cur={cur} /></span>
              </div>
            </>
          )}
          {cur === "IDR" && (
            <div style={{ fontStyle: "italic", color: "#6b7280", fontSize: 11, textAlign: "right", marginTop: 6, textTransform: "capitalize" }}>
              {terbilang(dpi ? dpi.sisa : totals.total)} rupiah
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 32, paddingTop: 18, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}><PaymentBlock inv={inv} profile={profile} cur={cur} /></div>
        <div style={{ flex: 1, minWidth: 220 }}><NotesBlock inv={inv} /></div>
      </div>
      <div style={{ marginTop: 20, fontSize: 9.5, color: "#9ca3af", display: "flex", justifyContent: "space-between" }}>
        <span>This invoice is provided by {profile.shopName || "Nama Usaha"}.</span>
        <span>Halaman 1 dari 1</span>
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
