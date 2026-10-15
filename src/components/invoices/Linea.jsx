// Template — Linea: satu garis aksen, minimal berkarakter.
import { Money, PaymentBlock, ShopLogo, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const micro = { fontSize: 9, letterSpacing: "0.22em", fontWeight: 700, color: "#a8a29e" };

export default function Linea({ inv, profile, totals, bodyFont, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
    return (
    <div style={{ fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.6, color: "#1c1917", background: "#fff" }}>
      <div style={{ height: 5, background: a }} />
      <div style={{ padding: "42px 44px 46px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShopLogo logo={profile.logo} size={40} radius={10} />
              <div>
                <span style={{ fontSize: 16, fontWeight: 800 }}>{profile.shopName || "Nama Usaha"}</span>
                <ShopTagline profile={profile} />
              </div>
            </div>
            {(profile.address || profile.contact || profile.npwp) && (
              <div style={{ fontSize: 10.5, color: "#78716c", marginTop: 8, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join("\n")}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#78716c", lineHeight: 1.9, fontVariantNumeric: "tabular-nums" }}>
            <b style={{ color: "#1c1917", fontSize: 13 }}>{inv.number || "—"}</b><br />
            {fmtDate(inv.date)}<br />Jatuh tempo {inv.dueDate ? fmtDate(inv.dueDate) : "—"}{inv.poNumber ? <><br />{inv.poNumber}</> : null}
          </div>
        </div>

        <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.035em", marginTop: 28, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ color: a }}><Money v={totals.total} cur={cur} /></span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {[
            inv.customerName,
            inv.customerNpwp ? `NPWP ${inv.customerNpwp}` : null,
            inv.terms,
          ].filter(Boolean).map((c, i) => (
            <span key={"chip-" + i} style={{ fontSize: 10.5, fontWeight: 600, color: "#57534e", border: "1px solid #e7e5e4", padding: "7px 13px", borderRadius: 999 }}>{c}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 32, marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={micro}>PELANGGAN</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, lineHeight: 1.65, whiteSpace: "pre-line" }}>
              {inv.customerName || "—"}
              {inv.customerInfo && <span style={{ display: "block", fontWeight: 400, color: "#78716c", fontSize: 11 }}>{inv.customerInfo}</span>}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={micro}>CATATAN</div>
            <div style={{ fontSize: 12, color: "#57534e", marginTop: 6, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{inv.notes || "—"}</div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          {items.length === 0 && <div style={{ color: "#a8a29e", textAlign: "center", padding: 12 }}>Belum ada item</div>}
          {items.map((it) => (
            <div key={it.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 16px", padding: "12px 0", borderBottom: "1px solid #f4f4f3", fontVariantNumeric: "tabular-nums" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{it.name || <span style={{ color: "#a8a29e" }}>Tanpa nama</span>}</span>
              <span style={{ fontSize: 13, fontWeight: 700, gridRow: "1 / 3", alignSelf: "center" }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
              <span style={{ fontSize: 11, color: "#a8a29e", gridColumn: 1 }}>{it.qty} {it.unit || "pcs"} × <Money v={Number(it.price) || 0} cur={cur} /></span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? [`Diskon${inv.discount?.type === "percent" ? ` (${inv.discount.value}%)` : ""}`, -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([kk, v]) => (
            <div key={kk} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#57534e", maxWidth: 300, marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
              <span>{kk}</span><span><Money v={v} cur={cur} /></span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, border: `1.5px solid ${a}`, borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 700, color: "#78716c" }}>TOTAL TAGIHAN</span>
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: a, fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
          </div>
        </div>
        {dpi && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#57534e", marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
            <span>Uang muka (DP) · <b style={{ color: "#1c1917" }}>Sisa dibayar</b></span>
            <span><span style={{ color: "#a8a29e" }}><Money v={dpi.dp} cur={cur} /></span> · <b><Money v={dpi.sisa} cur={cur} /></b></span>
          </div>
        )}
        {cur === "IDR" && (
          <div style={{ fontStyle: "italic", color: "#a8a29e", fontSize: 11, textAlign: "right", marginTop: 8, textTransform: "capitalize" }}>
            {terbilang(dpi ? dpi.sisa : totals.total)}
          </div>
        )}

        <div style={{ display: "flex", gap: 32, marginTop: 26 }}>
          <div style={{ flex: 1 }}><PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} /></div>
          <div style={{ flex: 1, textAlign: "right" }}>
            {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
          </div>
        </div>
      </div>
    </div>
  );
}
