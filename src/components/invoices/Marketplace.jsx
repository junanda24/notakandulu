// Template E — Marketplace (nyontek Tokopedia + Shopee).
// Rincian biaya berlapis + total tagihan + "diproses oleh komputer".
import { Money, PaymentBlock, NotesBlock, ShopLogo, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtDate, terbilang } from "../../lib/format.js";

export default function Marketplace({ inv, profile, totals, bodyFont, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
    return (
    <div style={{ fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6, color: "#111827", background: "#fff", padding: "44px 40px" }}>
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 20, letterSpacing: 8, marginRight: -8 }}>INVOICE</div>
      <div style={{ textAlign: "center", fontSize: 10.5, color: "#6b7280", marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
        {inv.number || "—"} · {fmtDate(inv.date)}
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 22 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "#6b7280" }}>DITERBITKAN ATAS NAMA</div>
          <div style={{ fontWeight: 700, marginTop: 4, display: "flex", gap: 8, alignItems: "center" }}>
            <ShopLogo logo={profile.logo} size={28} radius={8} />
            <div>
              <div>{profile.shopName || "Nama Usaha"}</div>
              <ShopTagline profile={profile} />
            </div>
          </div>
          {(profile.address || profile.contact) && (
            <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 4, whiteSpace: "pre-line" }}>
              {[profile.address, profile.contact].filter(Boolean).join("\n")}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "#6b7280" }}>UNTUK</div>
          <div style={{ fontWeight: 700, marginTop: 4 }}>{inv.customerName || "—"}</div>
          {inv.customerInfo && <div style={{ fontSize: 10.5, color: "#6b7280", whiteSpace: "pre-line" }}>{inv.customerInfo}</div>}
          {inv.customerNpwp && <div style={{ fontSize: 10.5, color: "#6b7280" }}>NPWP {inv.customerNpwp}</div>}
        </div>
      </div>

      {/* Blok biaya berlapis */}
      <div style={{ marginTop: 20, border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", fontVariantNumeric: "tabular-nums" }}>
        {items.length === 0 && <div style={{ color: "#9ca3af", textAlign: "center", padding: 8 }}>Belum ada item</div>}
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0" }}>
            <span>{it.name || "Item"} <span style={{ color: "#9ca3af" }}>× {it.qty}{it.unit ? ` ${it.unit}` : ""}</span></span>
            <span><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
          </div>
        ))}
        {totals.discountAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563" }}><span>Diskon</span><span>-<Money v={totals.discountAmt} cur={cur} /></span></div>}
        {totals.taxAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563" }}><span>Pajak</span><span><Money v={totals.taxAmt} cur={cur} /></span></div>}
        {totals.shipping > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#4b5563" }}><span>Ongkir</span><span><Money v={totals.shipping} cur={cur} /></span></div>}
      </div>

      {/* Total tagihan */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, marginTop: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#065f46" }}>TOTAL TAGIHAN</span>
        <span style={{ fontWeight: 800, fontSize: 22, color: "#065f46", fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
      </div>
      {dpi && (
        <div style={{ fontSize: 11, color: "#065f46", marginTop: 6, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          Uang muka (DP) <Money v={dpi.dp} cur={cur} /> · Sisa <Money v={dpi.sisa} cur={cur} />
        </div>
      )}
          {cur === "IDR" && (
            <div style={{ fontStyle: "italic", color: "#065f46", textAlign: "right", fontSize: 11, marginTop: 6, textTransform: "capitalize" }}>
              {terbilang(dpi ? dpi.sisa : totals.total)}
            </div>
          )}
      {(inv.dueDate || inv.poNumber) && (
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {[inv.dueDate ? `Jatuh tempo ${fmtDate(inv.dueDate)}` : null, inv.poNumber ? `PO ${inv.poNumber}` : null].filter(Boolean).join(" · ")}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} />
        <NotesBlock inv={inv} />
      </div>
      <div style={{ textAlign: "center", fontSize: 9.5, color: "#9ca3af", marginTop: 20 }}>
        Invoice ini sah dan diproses oleh komputer.
      </div>
      <div style={{ textAlign: "center", fontSize: 9.5, color: "#9ca3af", marginTop: 8, letterSpacing: "0.2em" }}>— END OF RECEIPT —</div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
