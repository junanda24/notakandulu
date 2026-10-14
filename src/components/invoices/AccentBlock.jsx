// Style 5 — Accent Header Block. Pita aksen penuh di atas dengan judul INVOICE
// putih, logo dalam chip putih, sisa halaman putih dengan hairline netral.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, fmtD, dpInfo } from "./shared.jsx";
import { fmtMoney, terbilang } from "../../lib/format.js";

const lbl = { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 };

export default function AccentBlock({ inv, profile, totals, bodyFont, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency;
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6, color: "#111827" }}>
      {/* Pita aksen */}
      <div style={{ background: a, color: "#fff", padding: "40px 52px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <ShopLogo logo={profile.logo} size={52} radius={12} chip />
            <div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{profile.shopName || "Nama Usaha"}</div>
              {(profile.contact || profile.npwp) && (
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                  {[profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, letterSpacing: "0.24em", fontWeight: 700, opacity: 0.9 }}>INVOICE</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
              {inv.number} · {fmtD(inv.date)}
            </div>
            {inv.dueDate && (
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
                Jatuh tempo: {fmtD(inv.dueDate)}
              </div>
            )}
            {inv.poNumber && (
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
                No. PO: {inv.poNumber}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", opacity: 0.75 }}>TOTAL TAGIHAN</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
              <Money v={totals.total} cur={cur} />
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11.5, opacity: 0.9 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", opacity: 0.75 }}>DITAGIH KEPADA</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{inv.customerName || "—"}</div>
            {inv.customerInfo && <div style={{ fontSize: 11, opacity: 0.85, whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
            {inv.customerNpwp && <div style={{ fontSize: 11, opacity: 0.85 }}>NPWP: {inv.customerNpwp}</div>}
          </div>
        </div>
      </div>

      {/* Isi */}
      <div style={{ padding: "32px 52px 48px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...lbl, textAlign: "left", padding: "10px 0", borderBottom: `2px solid ${a}` }}>Deskripsi</th>
              <th style={{ ...lbl, textAlign: "right", padding: "10px 0", borderBottom: `2px solid ${a}`, width: 60 }}>Qty</th>
              <th style={{ ...lbl, textAlign: "right", padding: "10px 0", borderBottom: `2px solid ${a}`, width: 110 }}>Harga</th>
              <th style={{ ...lbl, textAlign: "right", padding: "10px 0", borderBottom: `2px solid ${a}`, width: 120 }}>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 20, color: "#9ca3af", textAlign: "center" }}>Belum ada item</td></tr>
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

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 260 }}>
            {[
              ["Subtotal", totals.subtotal],
              totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
              totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
              totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563" }}>
                <span>{k}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
              </div>
            ))}
            {dpi && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563" }}>
                  <span>Uang muka (DP)</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={-dpi.dp} cur={cur} /></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", borderTop: "1px solid #e5e7eb", marginTop: 4 }}>
                  <span style={{ fontWeight: 700 }}>Sisa dibayar</span>
                  <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}><Money v={dpi.sisa} cur={cur} /></span>
                </div>
              </>
            )}
            {cur === "IDR" && (
              <div style={{ fontStyle: "italic", color: "#6b7280", fontSize: 11, marginTop: 8, textAlign: "right", textTransform: "capitalize" }}>
                {terbilang(dpi ? dpi.sisa : totals.total)}
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 28, paddingTop: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
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
    </div>
  );
}
