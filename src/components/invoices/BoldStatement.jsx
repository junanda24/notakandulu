// Template I — Bold Statement (budaya Behance).
// Background ungu full, angka hero, kartu putih overlap. Tanpa tombol.
import { Money, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtDate } from "../../lib/format.js";

export default function BoldStatement({ inv, profile, totals, accent, showSignature }) {
  const a = accent || "#7c3aed";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const inter = "'Inter', system-ui, sans-serif";
  const pays = (profile.payments || []).filter((p) => (inv.paymentIds || []).includes(p.id));
  return (
    <div style={{ fontFamily: inter, fontSize: 12, lineHeight: 1.6, color: "#fff", background: a }}>
      <div style={{ padding: "40px 36px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShopLogo logo={profile.logo} size={34} radius={10} />
          <span style={{ fontWeight: 800, fontSize: 14 }}>{profile.shopName || "Nama Usaha"}</span>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 10, fontWeight: 700, opacity: 0.85, marginTop: 26 }}>INVOICE</div>
        <div style={{ fontWeight: 800, fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
          <Money v={dpi ? dpi.sisa : totals.total} cur={cur} />
        </div>
        {dpi && (
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
            Total <Money v={totals.total} cur={cur} /> − Uang muka (DP) <Money v={dpi.dp} cur={cur} /> = sisa
          </div>
        )}
        <div style={{ fontSize: 10.5, opacity: 0.8, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
          {inv.number || "—"} · {inv.customerName || "—"}{inv.customerNpwp ? ` · NPWP ${inv.customerNpwp}` : ""} · jatuh tempo {inv.dueDate ? fmtDate(inv.dueDate) : "—"}{inv.poNumber ? ` · PO ${inv.poNumber}` : ""}
        </div>
      </div>

      <div style={{ background: "#fff", color: "#18181b", borderRadius: "16px 16px 0 0", marginTop: 26, padding: "24px 28px 30px" }}>
        <div style={{ fontVariantNumeric: "tabular-nums" }}>
          {items.length === 0 && <div style={{ color: "#9ca3af", textAlign: "center", padding: 10 }}>Belum ada item</div>}
          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span>{it.name || "Item"} <span style={{ color: "#9ca3af" }}>· {it.qty}{it.unit ? ` ${it.unit}` : ""}</span></span>
              <span style={{ fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
            </div>
          ))}
          {totals.discountAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#4b5563" }}><span>Diskon</span><span>-<Money v={totals.discountAmt} cur={cur} /></span></div>}
          {totals.taxAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#4b5563" }}><span>Pajak</span><span><Money v={totals.taxAmt} cur={cur} /></span></div>}
          {totals.shipping > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#4b5563" }}><span>Ongkir</span><span><Money v={totals.shipping} cur={cur} /></span></div>}
        </div>

        {pays.length > 0 && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Bayar ke sini 👇</div>
            {pays.map((p) => (
              <div key={p.id} style={{ marginTop: 8, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                <b>{p.label}</b> · <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{p.number}</span>
                {p.holder ? <span style={{ color: "#6b7280", fontSize: 11 }}> a.n. {p.holder}</span> : null}
              </div>
            ))}
          </div>
        )}
        {inv.terms && <div style={{ marginTop: 14, fontSize: 11.5, color: "#57534e" }}><b>Syarat:</b> {inv.terms}</div>}
        {inv.notes && <div style={{ marginTop: 6, fontSize: 11.5, color: "#57534e", whiteSpace: "pre-wrap" }}>{inv.notes}</div>}
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#a1a1aa", marginTop: 18 }}>Dibuat dengan ☕ dan begadang.</div>
        {showSignature && (
          <div style={{ marginTop: 16, color: "#18181b" }}>
            <SignatureBlock left={profile.shopName || "Hormat kami,"} />
          </div>
        )}
      </div>
    </div>
  );
}
