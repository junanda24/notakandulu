// Template B — SaaS Paywall (nyontek Stripe + Paper.id).
// Invoice = halaman bayar: total hero + info bayar statis + baris "Sisa Tagihan".
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { fmtDate } from "../../lib/format.js";
import { paymentStatus, STATUS_META } from "../../lib/calc.js";

const PILL = {
  lunas: { bg: "#dcfce7", fg: "#166534", dot: "#16a34a" },
  belum: { bg: "#fef3c7", fg: "#92400e", dot: "#d97706" },
  lewat: { bg: "#fee2e2", fg: "#991b1b", dot: "#dc2626" },
};

export default function SaasPaywall({ inv, profile, totals, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const st = paymentStatus(inv) || "belum";
  const pill = PILL[st] || PILL.belum;
  const sm = STATUS_META[st] || STATUS_META.belum;
  const jakarta = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
  const pays = (profile.payments || []).filter((p) => (inv.paymentIds || []).includes(p.id));
  const tagih = dpi ? dpi.sisa : totals.total;
  return (
    <div style={{ fontFamily: jakarta, fontSize: 12.5, lineHeight: 1.6, color: "#111827", background: "#fff" }}>
      {/* Top bar */}
      <div style={{ height: 64, borderBottom: "1px solid #eef0f3", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShopLogo logo={profile.logo} size={30} radius={8} />
          <span style={{ fontWeight: 800, fontSize: 14 }}>{profile.shopName || "Nama Usaha"}</span>
        </div>
        <span style={{ background: pill.bg, color: pill.fg, fontWeight: 700, fontSize: 10.5, padding: "6px 14px", borderRadius: 999 }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: pill.dot, marginRight: 7, verticalAlign: "1px" }} />
          {sm.label.toUpperCase()}
        </span>
      </div>

      <div style={{ padding: "36px 40px 40px" }}>
        <div style={{ fontSize: 11, color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
          {inv.number || "—"} · untuk {inv.customerName || "—"}
        </div>
        {inv.customerNpwp && (
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>NPWP {inv.customerNpwp}</div>
        )}
        <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-0.02em", marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
          <Money v={totals.total} cur={cur} />
        </div>
        <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
          Diterbitkan {fmtDate(inv.date)}{inv.dueDate ? ` · Jatuh tempo ${fmtDate(inv.dueDate)}` : ""}
          {inv.poNumber ? ` · PO ${inv.poNumber}` : ""}
        </div>

        {/* Item cards */}
        <div style={{ border: "1px solid #eef0f3", borderRadius: 12, marginTop: 22, overflow: "hidden" }}>
          {items.length === 0 && (
            <div style={{ padding: 18, color: "#9ca3af", textAlign: "center" }}>Belum ada item</div>
          )}
          {items.map((it, i) => (
            <div key={it.id} style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", gap: 12, borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none", fontVariantNumeric: "tabular-nums" }}>
              <span>{it.name || <span style={{ color: "#9ca3af" }}>Tanpa nama</span>}{it.unit ? <span style={{ color: "#9ca3af" }}> · {it.qty} {it.unit}</span> : <span style={{ color: "#9ca3af" }}> · {it.qty}x</span>}</span>
              <span style={{ fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
            </div>
          ))}
        </div>

        {/* Rincian */}
        <div style={{ marginTop: 14, display: "grid", gap: 3, fontSize: 12, color: "#4b5563" }}>
          {[
            totals.discountAmt > 0 ? ["Diskon", -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{k}</span><span style={{ fontVariantNumeric: "tabular-nums" }}><Money v={v} cur={cur} /></span>
            </div>
          ))}
        </div>

        {/* Sisa tagihan */}
        <div style={{ background: "#fef3c7", borderRadius: 12, marginTop: 12, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: 700 }}>
          <span>Sisa Tagihan</span>
          <span style={{ fontSize: 19, fontVariantNumeric: "tabular-nums" }}><Money v={tagih} cur={cur} /></span>
        </div>
        {dpi && (
          <div style={{ fontSize: 11, color: "#92400e", marginTop: 6, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            Total <Money v={totals.total} cur={cur} /> − Uang muka (DP) <Money v={dpi.dp} cur={cur} />
          </div>
        )}

        {/* Info bayar statis (bukan tombol — invoice itu dokumen mati) */}
        {pays.length > 0 && (
          <div style={{ border: `1.5px solid ${a}`, borderRadius: 12, marginTop: 16, padding: "14px 18px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", fontWeight: 800, color: a }}>BAYAR KE</div>
            {pays.map((p) => (
              <div key={p.id} style={{ marginTop: 8, fontSize: 13 }}>
                <b>{p.label}</b> · <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{p.number}</span>
                {p.holder ? <span style={{ color: "#6b7280", fontSize: 11 }}> a.n. {p.holder}</span> : null}
              </div>
            ))}
            <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 8 }}>Transfer · QRIS · VA · Kartu</div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <NotesBlock inv={inv} />
        </div>
        {(profile.address || profile.contact || profile.npwp) && (
          <div style={{ marginTop: 14, fontSize: 10.5, color: "#9ca3af", whiteSpace: "pre-line" }}>
            {[profile.address, profile.contact, profile.npwp ? `NPWP ${profile.npwp}` : null].filter(Boolean).join(" · ")}
          </div>
        )}
        {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
      </div>
    </div>
  );
}
