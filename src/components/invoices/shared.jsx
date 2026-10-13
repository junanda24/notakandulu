// Bagian bersama antar template nota.
import { fmtMoney, terbilang, fmtDate } from "../../lib/format.js";

export const Money = ({ v, cur, className = "", style = {} }) => (
  <span className={className} style={{ whiteSpace: "nowrap", ...style }}>
    {fmtMoney(v, cur)}
  </span>
);

export function PaymentBlock({ inv, profile, cur, dark = false, accent = "#1e3a5f" }) {
  const pays = (profile.payments || []).filter((p) => (inv.paymentIds || []).includes(p.id));
  if (!pays.length) return null;
  const sub = dark ? "#a8a29e" : "#78716c";
  return (
    <div style={{ marginTop: 14 }}>
      <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: dark ? accent : sub, fontWeight: 700 }}>
        Pembayaran
      </p>
      <div style={{ marginTop: 6, display: "grid", gap: 4 }}>
        {pays.map((p) => (
          <p key={p.id} style={{ fontSize: 12, color: dark ? "#e7e5e4" : "#292524" }}>
            <b>{p.label}</b> · <span style={{ fontFamily: "monospace" }}>{p.number}</span>
            {p.holder ? <span style={{ color: sub }}> a.n. {p.holder}</span> : null}
          </p>
        ))}
      </div>
    </div>
  );
}

export function TotalsTable({ inv, totals, cur, dark = false, accent = "#1e3a5f", minimal = false }) {
  const row = { display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" };
  const label = { color: dark ? "#a8a29e" : "#78716c" };
  const border = minimal ? {} : { borderTop: `1px solid ${dark ? "#292524" : "#e7e5e4"}` };
  return (
    <div style={{ marginTop: 12, ...border, paddingTop: minimal ? 0 : 8 }}>
      <div style={row}><span style={label}>Subtotal</span><Money v={totals.subtotal} cur={cur} /></div>
      {totals.discountAmt > 0 && (
        <div style={row}><span style={label}>Diskon</span><Money v={-totals.discountAmt} cur={cur} /></div>
      )}
      {totals.taxAmt > 0 && (
        <div style={row}><span style={label}>Pajak ({inv.tax}%)</span><Money v={totals.taxAmt} cur={cur} /></div>
      )}
      {totals.shipping > 0 && (
        <div style={row}><span style={label}>Ongkir</span><Money v={totals.shipping} cur={cur} /></div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8, paddingTop: 8, borderTop: `2px solid ${accent}` }}>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: label.color }}>Total</span>
        <Money v={totals.total} cur={cur} style={{ fontSize: 22, fontWeight: 800, color: dark ? "#fafaf9" : "#1c1917" }} />
      </div>
      <p style={{ fontSize: 11, fontStyle: "italic", color: label.color, marginTop: 4 }}>
        {terbilang(totals.total, cur)}
      </p>
    </div>
  );
}

export function NotesBlock({ inv, dark = false }) {
  if (!inv.notes) return null;
  return (
    <p style={{ fontSize: 11.5, color: dark ? "#a8a29e" : "#57534e", marginTop: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
      {inv.notes}
    </p>
  );
}

export function SignatureBlock({ dark = false, left = "Hormat kami,", right = "Penerima," }) {
  const c = dark ? "#a8a29e" : "#57534e";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, fontSize: 11, color: c }}>
      <div style={{ textAlign: "center" }}>
        <p>{left}</p>
        <div style={{ height: 56 }} />
        <p style={{ borderTop: `1px solid ${c}`, paddingTop: 4, minWidth: 130 }}>( .................... )</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p>{right}</p>
        <div style={{ height: 56 }} />
        <p style={{ borderTop: `1px solid ${c}`, paddingTop: 4, minWidth: 130 }}>( .................... )</p>
      </div>
    </div>
  );
}

export const fmtD = fmtDate;

// Logo toko — data URL dari localStorage (diresize ≤512px saat upload).
// chip: bungkus putih (untuk template gelap / aksen penuh); grayscale: cetak hitam-putih.
export function ShopLogo({ logo, size = 56, radius = 12, chip = false, grayscale = false, style }) {
  if (!logo) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        flexShrink: 0,
        background: chip ? "#ffffff" : "transparent",
        padding: chip ? 6 : 0,
        border: chip ? "1px solid #e5e5e5" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(style || {}),
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: "100%", height: "100%", objectFit: "contain", filter: grayscale ? "grayscale(1)" : "none" }}
      />
    </div>
  );
}
