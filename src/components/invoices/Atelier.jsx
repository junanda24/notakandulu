// Template — Atelier: editorial, margin lega, serif.
import { Money, PaymentBlock, NotesBlock, ShopTagline, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

const k = { fontSize: 9, letterSpacing: "0.22em", color: "#a8a29e", fontWeight: 700 };

export default function Atelier({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
    return (
    <div style={{ fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.6, color: "#1c1917", background: "#fff", padding: "52px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, letterSpacing: "0.24em", color: "#a8a29e", fontWeight: 600 }}>
        <span>{(profile.shopName || "NAMA USAHA").toUpperCase()}{profile.npwp ? ` · NPWP ${profile.npwp}` : ""}</span>
        <span>Nº {inv.number || "—"}</span>
      </div>
      <ShopTagline profile={profile} />

      <h2 style={{ fontFamily: displayFont, fontWeight: 400, fontSize: 40, marginTop: 30 }}>
        Invoice <i style={{ color: a, fontStyle: "normal" }}>№{(inv.number || "").replace(/\D/g, "").slice(-3) || "—"}</i>
      </h2>
      <p style={{ fontSize: 12.5, color: "#78716c", marginTop: 10, lineHeight: 1.75, maxWidth: 440 }}>
        Diterbitkan {fmtDate(inv.date)} untuk {inv.customerName || "—"}{inv.customerNpwp ? ` (NPWP ${inv.customerNpwp})` : ""}.
        Jatuh tempo {inv.dueDate ? fmtDate(inv.dueDate) : "—"}{inv.poNumber ? ` · ${inv.poNumber}` : ""}{inv.terms ? ` · Syarat ${inv.terms}` : ""}.
      </p>

      <div style={{ display: "flex", gap: 32, marginTop: 26 }}>
        <div style={{ flex: 1 }}>
          <div style={k}>DARI</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, lineHeight: 1.65, whiteSpace: "pre-line" }}>
            {profile.shopName || "—"}
            {(profile.address || profile.contact) && (
              <span style={{ display: "block", fontWeight: 400, color: "#78716c", fontSize: 11 }}>{[profile.address, profile.contact].filter(Boolean).join("\n")}</span>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={k}>UNTUK</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, lineHeight: 1.65, whiteSpace: "pre-line" }}>
            {inv.customerName || "—"}
            {inv.customerInfo && <span style={{ display: "block", fontWeight: 400, color: "#78716c", fontSize: 11 }}>{inv.customerInfo}</span>}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 110px", padding: "12px 0", ...k, borderBottom: "1px solid #1c1917" }}>
          <span>DESKRIPSI</span><span style={{ textAlign: "right" }}>QTY</span><span style={{ textAlign: "right" }}>JUMLAH</span>
        </div>
        {items.length === 0 && <div style={{ color: "#a8a29e", textAlign: "center", padding: 16 }}>Belum ada item</div>}
        {items.map((it) => (
          <div key={it.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 110px", padding: "12px 0", borderBottom: "1px solid #f0eeeb", fontVariantNumeric: "tabular-nums" }}>
            <span>{it.name || <span style={{ color: "#a8a29e" }}>Tanpa nama</span>} <span style={{ color: "#a8a29e", fontSize: 11 }}>· {it.qty} {it.unit || "pcs"} × <Money v={Number(it.price) || 0} cur={cur} /></span></span>
            <span style={{ textAlign: "right" }}>{it.qty}</span>
            <span style={{ textAlign: "right", fontWeight: 600 }}><Money v={(Number(it.qty) || 0) * (Number(it.price) || 0)} cur={cur} /></span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <div style={{ width: 270 }}>
          {[
            ["Subtotal", totals.subtotal],
            totals.discountAmt > 0 ? [`Diskon${inv.discount?.type === "percent" ? ` (${inv.discount.value}%)` : ""}`, -totals.discountAmt] : null,
            totals.taxAmt > 0 ? [`Pajak${inv.tax ? ` (${inv.tax}%)` : ""}`, totals.taxAmt] : null,
            totals.shipping > 0 ? ["Ongkir", totals.shipping] : null,
          ].filter(Boolean).map(([kk, v]) => (
            <div key={kk} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#57534e", fontVariantNumeric: "tabular-nums" }}>
              <span>{kk}</span><span><Money v={v} cur={cur} /></span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 22, paddingTop: 18, borderTop: "1px solid #1c1917" }}>
        <span style={k}>TOTAL TAGIHAN</span>
        <span style={{ fontFamily: displayFont, fontSize: 42, color: a, fontVariantNumeric: "tabular-nums" }}><Money v={totals.total} cur={cur} /></span>
      </div>
      {dpi && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, color: "#57534e", fontVariantNumeric: "tabular-nums" }}>
          <span>Uang muka (DP) <Money v={dpi.dp} cur={cur} /> · <b style={{ color: "#1c1917" }}>Sisa <Money v={dpi.sisa} cur={cur} /></b></span>
        </div>
      )}
      {cur === "IDR" && (
        <div style={{ fontStyle: "italic", fontFamily: displayFont, color: "#a8a29e", fontSize: 11, textAlign: "right", marginTop: 8, textTransform: "capitalize" }}>
          {terbilang(dpi ? dpi.sisa : totals.total)}
        </div>
      )}

      <div style={{ marginTop: 36, paddingTop: 18, borderTop: "1px solid #f0eeeb", display: "flex", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} />
        </div>
        {(inv.notes || inv.terms) && (
          <div style={{ flex: 1 }}>
            <div style={k}>CATATAN</div>
            <NotesBlock inv={inv} />
          </div>
        )}
        {showSignature && (
          <div style={{ textAlign: "right" }}>
            <div style={k}>HORMAT KAMI</div>
            <SignatureBlock left={profile.shopName || "Hormat kami,"} />
          </div>
        )}
      </div>
    </div>
  );
}
