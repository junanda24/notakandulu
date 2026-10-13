// Template H — Faktur Pajak Ganda (nyontek Telkomsel + Adobe).
// Satu dokumen = invoice + faktur pajak. Kolom DPP & PPN terpisah.
import { Money, PaymentBlock, NotesBlock, ShopLogo, SignatureBlock, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

/** No. faktur pajak deterministik dari nomor invoice (sesuaikan di e-Faktur). */
function noFaktur(number) {
  const s = String(number || "0");
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return `010.000-26.${String(h % 100000000).padStart(8, "0")}`;
}

export default function FakturPajak({ inv, profile, totals, accent, showSignature }) {
  const a = accent || "#1e3a8a";
  const cur = inv.currency || "IDR";
  const items = inv.items || [];
  const dpi = dpInfo(inv, totals);
  const taxRate = Number(inv.tax) || 0;
  const inter = "'Inter', system-ui, sans-serif";
  let sumDpp = 0, sumPpn = 0;
  const lines = items.map((it) => {
    const amt = (Number(it.qty) || 0) * (Number(it.price) || 0);
    const dpp = taxRate > 0 ? amt / (1 + taxRate / 100) : amt;
    const ppn = amt - dpp;
    sumDpp += dpp; sumPpn += ppn;
    return { it, amt, dpp, ppn };
  });
  return (
    <div style={{ fontFamily: inter, fontSize: 12, lineHeight: 1.6, color: "#1e293b", background: "#fff", padding: "48px 44px" }}>
      {/* Kop */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <ShopLogo logo={profile.logo} size={48} radius={8} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: a }}>{profile.shopName || "Nama Usaha"}</div>
            {(profile.address || profile.contact) && (
              <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 4, whiteSpace: "pre-line" }}>
                {[profile.address, profile.contact].filter(Boolean).join("\n")}
              </div>
            )}
            <div style={{ fontSize: 10.5, color: "#64748b" }}>NPWP: {profile.npwp || "—"} · PKP</div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: a, letterSpacing: 2 }}>INVOICE</div>
          <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 1 }}>FAKTUR PAJAK</div>
        </div>
      </div>

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, marginTop: 18, padding: "10px 16px", fontSize: 10.5, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontVariantNumeric: "tabular-nums" }}>
        <span>No. Faktur Pajak: <b>{noFaktur(inv.number)}</b></span>
        <span>{inv.number || "—"} · {fmtDate(inv.date)}{inv.dueDate ? ` · Tempo ${fmtDate(inv.dueDate)}` : ""}</span>
      </div>
      <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 12 }}>
        Pembeli: <b style={{ color: "#1e293b" }}>{inv.customerName || "—"}</b>
        {inv.customerInfo && <span> · {String(inv.customerInfo).split("\n")[0]}</span>}
        {" · "}NPWP: {inv.customerNpwp || "—"}
        {inv.poNumber ? ` · PO ${inv.poNumber}` : ""}
      </div>

      {/* Tabel DPP/PPN */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ background: a, color: "#fff" }}>
            {["Uraian", "DPP", `PPN ${taxRate || 11}%`, "Jumlah"].map((h, i) => (
              <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "9px 12px", fontSize: 9.5, letterSpacing: "0.08em", fontWeight: 700 }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
          {lines.length === 0 && (
            <tr><td colSpan={4} style={{ padding: "18px 0", color: "#94a3b8", textAlign: "center" }}>Belum ada item</td></tr>
          )}
          {lines.map(({ it, amt, dpp, ppn }) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 12px" }}>{it.name || "Item"} <span style={{ color: "#94a3b8" }}>× {it.qty}{it.unit ? ` ${it.unit}` : ""}</span></td>
              <td style={{ padding: "10px 12px", textAlign: "right", color: "#475569" }}><Money v={Math.round(dpp)} cur={cur} /></td>
              <td style={{ padding: "10px 12px", textAlign: "right", color: "#475569" }}><Money v={Math.round(ppn)} cur={cur} /></td>
              <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}><Money v={amt} cur={cur} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 14, fontVariantNumeric: "tabular-nums" }}>
        <div style={{ fontSize: 11, color: "#64748b" }}>
          DPP <Money v={Math.round(sumDpp)} cur={cur} /> · PPN <Money v={Math.round(sumPpn)} cur={cur} />
          {totals.shipping > 0 && <span> · Ongkir <Money v={totals.shipping} cur={cur} /></span>}
        </div>
        <div style={{ fontWeight: 800, fontSize: 21, color: a, marginTop: 4 }}><Money v={totals.total} cur={cur} /></div>
        {dpi && (
          <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
            Uang muka (DP) <Money v={dpi.dp} cur={cur} /> · Sisa dibayar <b style={{ color: a }}><Money v={dpi.sisa} cur={cur} /></b>
          </div>
        )}
        {cur === "IDR" && (
          <div style={{ fontStyle: "italic", fontSize: 11, color: "#64748b", marginTop: 6, textTransform: "capitalize" }}>
            Terbilang: {terbilang(dpi ? dpi.sisa : totals.total)} rupiah
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <PaymentBlock inv={inv} profile={profile} cur={cur} accent={a} />
        <NotesBlock inv={inv} />
      </div>
      <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 18, borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
        Sesuai UU PPN &amp; PER-16/PJ/2021 · Faktur pajak ini sah sebagai bukti pungut PPN. Nomor faktur di atas digenerate dari nomor invoice — sesuaikan dengan e-Faktur Anda.
      </div>
      {showSignature && <SignatureBlock left={profile.shopName || "Hormat kami,"} />}
    </div>
  );
}
