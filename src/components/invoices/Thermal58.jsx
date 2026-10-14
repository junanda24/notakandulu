// Template D — Struk Thermal 58mm gaya PLN/BCA.
// Monospace full kapital, dot leaders, barcode, "bukti pembayaran yang sah".
import { Money, ShopLogo, ShopTagline, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const dash = { borderTop: "1px dashed #999", margin: "10px 0" };

export default function Thermal58({ inv, profile, totals, bodyFont }) {
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
    return (
    <div style={{ fontFamily: bodyFont, fontSize: 11, lineHeight: 1.55, color: "#111", background: "#fff", padding: "22px 16px", textTransform: "uppercase" }}>
      <div style={{ textAlign: "center", fontWeight: 700 }}>
        <ShopLogo logo={profile.logo} size={36} radius={6} grayscale style={{ margin: "0 auto 6px" }} />
        {profile.shopName || "TOKO"}
        <ShopTagline profile={profile} />
        {profile.address && <div style={{ fontWeight: 400, fontSize: 9, whiteSpace: "pre-line" }}>{profile.address}</div>}
        {profile.contact && <div style={{ fontWeight: 400, fontSize: 9 }}>{profile.contact}</div>}
      </div>
      <div style={dash} />
      <div style={{ fontVariantNumeric: "tabular-nums" }}>
        <div>NO....: {inv.number || "-"}</div>
        <div>TGL...: {fmtDate(inv.date)}</div>
        {inv.dueDate && <div>TEMPO.: {fmtDate(inv.dueDate)}</div>}
        <div>PLG...: {(inv.customerName || "-").toUpperCase().slice(0, 24)}</div>
        {inv.customerNpwp && <div>NPWP..: {String(inv.customerNpwp).toUpperCase()}</div>}
        {inv.poNumber && <div>PO....: {String(inv.poNumber).toUpperCase()}</div>}
      </div>
      <div style={dash} />
      <div style={{ fontVariantNumeric: "tabular-nums" }}>
        {items.length === 0 && <div style={{ textAlign: "center", color: "#666" }}>BELUM ADA ITEM</div>}
        {items.map((it) => (
          <div key={it.id} style={{ marginBottom: 6 }}>
            <div>{(it.name || "ITEM").toUpperCase().slice(0, 32)}</div>
            <div style={{ display: "flex" }}>
              <span>{it.qty} X {(Number(it.price) || 0).toLocaleString("id-ID")}{it.unit ? `/${it.unit.toUpperCase()}` : ""}</span>
              <span style={{ borderBottom: "1px dotted #111", flex: 1, margin: "0 4px" }} />
              <span><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
            </div>
          </div>
        ))}
      </div>
      <div style={dash} />
      <div style={{ fontVariantNumeric: "tabular-nums" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>SUBTOTAL</span><span><Money v={totals.subtotal} cur={cur} /></span></div>
        {totals.discountAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>DISKON</span><span>-<Money v={totals.discountAmt} cur={cur} /></span></div>}
        {totals.taxAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>PAJAK</span><span><Money v={totals.taxAmt} cur={cur} /></span></div>}
        {totals.shipping > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>ONGKIR</span><span><Money v={totals.shipping} cur={cur} /></span></div>}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginTop: 4 }}>
          <span>TOTAL</span><span><Money v={totals.total} cur={cur} /></span>
        </div>
        {dpi && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>DP</span><span>-<Money v={dpi.dp} cur={cur} /></span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>SISA</span><span><Money v={dpi.sisa} cur={cur} /></span></div>
          </>
        )}
      </div>
      {cur === "IDR" && (
        <div style={{ fontSize: 10, marginTop: 8 }}>TERBILANG: {terbilang(dpi ? dpi.sisa : totals.total).toUpperCase()}</div>
      )}
      {inv.terms && <div style={{ fontSize: 10, marginTop: 4 }}>SYARAT: {inv.terms.toUpperCase()}</div>}
      {inv.notes && <div style={{ fontSize: 10, marginTop: 4, whiteSpace: "pre-wrap" }}>{inv.notes.toUpperCase()}</div>}
      <div style={{ margin: "12px auto 6px", width: 170, height: 40, background: "repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 5px,#111 5px 6px,transparent 6px 10px,#111 10px 13px,transparent 13px 15px)" }} />
      <div style={{ textAlign: "center", fontSize: 9 }}>
        *{(inv.number || "-").toUpperCase()}*<br />
        STRUK INI BUKTI PEMBAYARAN YANG SAH
      </div>
    </div>
  );
}
