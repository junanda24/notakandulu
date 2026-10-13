// Style 6 — Executive Dark. Charcoal (#141414, bukan hitam pekat), satu aksen
// metalik emas, padding lebih lega, tabel di atas panel terang. Opt-in untuk
// usaha premium — jangan dipakai untuk cetak hitam-putih.
import { Money, PaymentBlock, NotesBlock, ShopLogo } from "./shared.jsx";
import { fmtMoney, fmtDate, terbilang } from "../../lib/format.js";

const lbl = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a8a", fontWeight: 600 };
const gold = "#c9a227";

export default function ExecutiveDark({ inv, profile, totals, bodyFont }) {
  const cur = inv.currency;
  const items = inv.items || [];
  const bg = "#141414";
  const panel = "#1e1e1e";
  const txt = "#f2f2f2";
  const muted = "#9c9c9c";
  const line = "#2c2c2c";
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6, color: txt, background: bg, padding: "56px 60px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <ShopLogo logo={profile.logo} size={56} radius={14} chip />
          <div>
            <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em" }}>{profile.shopName || "Nama Usaha"}</div>
            {(profile.address || profile.contact) && (
              <div style={{ color: muted, fontSize: 11, marginTop: 4 }}>
                {[profile.address, profile.contact].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: gold, letterSpacing: "0.06em" }}>INVOICE</div>
          <div style={{ ...lbl, marginTop: 6 }}>{inv.number}</div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 48, marginBottom: 36 }}>
        <div>
          <div style={lbl}>Ditagih kepada</div>
          <div style={{ fontWeight: 600, marginTop: 4, fontSize: 13 }}>{inv.customerName || "—"}</div>
          {inv.customerInfo && <div style={{ color: muted, fontSize: 11, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={lbl}>Tanggal terbit</div>
          <div style={{ marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{fmtDate(inv.date)}</div>
        </div>
      </div>

      {/* Tabel di panel terang */}
      <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 12, padding: "8px 20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...lbl, textAlign: "left", padding: "12px 0", borderBottom: `1px solid ${line}` }}>Deskripsi</th>
              <th style={{ ...lbl, textAlign: "right", padding: "12px 0", borderBottom: `1px solid ${line}`, width: 60 }}>Qty</th>
              <th style={{ ...lbl, textAlign: "right", padding: "12px 0", borderBottom: `1px solid ${line}`, width: 110 }}>Harga</th>
              <th style={{ ...lbl, textAlign: "right", padding: "12px 0", borderBottom: `1px solid ${line}`, width: 120 }}>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 20, color: muted, textAlign: "center" }}>Belum ada item</td></tr>
            )}
            {items.map((it) => (
              <tr key={it.id} style={{ borderBottom: `1px solid ${line}` }}>
                <td style={{ padding: "15px 0", paddingRight: 16 }}>{it.name || <span style={{ color: muted }}>Tanpa nama</span>}</td>
                <td style={{ padding: "15px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: muted }}>{it.qty}</td>
                <td style={{ padding: "15px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: muted }}>{fmtMoney(it.price, cur)}</td>
                <td style={{ padding: "15px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                  <Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <div style={{ width: 270 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: muted }}>
              <span>{k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
          <div style={{ borderTop: `2px solid ${gold}`, marginTop: 10, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ ...lbl, color: gold }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: gold, fontVariantNumeric: "tabular-nums" }}>
              <Money v={totals.total} cur={cur} />
            </span>
          </div>
          {cur === "IDR" && (
            <div style={{ color: muted, fontSize: 11, fontStyle: "italic", textAlign: "right", marginTop: 4, textTransform: "capitalize" }}>
              {terbilang(totals.total)} rupiah
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${line}`, marginTop: 40, paddingTop: 24, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <PaymentBlock inv={inv} profile={profile} cur={cur} dark accent={gold} />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <NotesBlock inv={inv} dark />
        </div>
      </div>
      <div style={{ marginTop: 28, color: muted, fontSize: 10.5, textAlign: "center" }}>
        Terima kasih atas kepercayaan Anda.
      </div>
    </div>
  );
}
