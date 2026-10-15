// Template — Kwitansi Klasik Luhur: heritage-elegan ala sertifikat.
// Bingkai double-rule, terbilang serif italic sebagai centerpiece,
// stempel DINAMIS mengikuti status pembayaran (tidak hardcoded).
import { Money, ShopLogo, ShopTagline, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";
import { paymentStatus } from "../../lib/calc.js";

const INK = "#1F1B16";
const CREAM = "#FAF6EC";
const FRAME_GOLD = "#B08D3E";

const STAMPS = {
  lunas: { text: "LUNAS", color: "#2e7d4f" },
  belum: { text: "BELUM LUNAS", color: "#b45309" },
  lewat: { text: "LEWAT TEMPO", color: "#9E2B25" },
};

export default function KwitansiLuhur({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const frameColor = accent || FRAME_GOLD;
  const cur = inv.currency || "IDR";
  const dpi = dpInfo(inv, totals);
  const nominal = dpi ? dpi.sisa : totals.total;
  const needsMaterai = cur === "IDR" && totals.total >= 5000000;
  // Stempel mengikuti status pembayaran aktual.
  const st = paymentStatus(inv) || "belum";
  const stamp = STAMPS[st] || STAMPS.belum;

  return (
    <div style={{ fontFamily: bodyFont, background: CREAM, padding: 36, color: INK, fontSize: 12.5, lineHeight: 1.7 }}>
      <div style={{ border: `3px double ${frameColor}`, padding: "40px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <ShopLogo logo={profile.logo} size={52} radius={12} style={{ margin: "0 auto 10px" }} />
          <div style={{ fontFamily: displayFont, fontSize: 29, fontWeight: 600 }}>{profile.shopName || "Nama Usaha"}</div>
          <ShopTagline profile={profile} />
          {(profile.address || profile.contact) && (
            <div style={{ fontSize: 11, color: "#78716c", marginTop: 6 }}>
              {[profile.address, profile.contact].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", fontSize: 14, letterSpacing: "0.42em", textIndent: "0.42em", fontWeight: 700, margin: "22px 0 4px" }}>
          KWITANSI
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: "#78716c", marginBottom: 26 }}>
          No. <b style={{ color: INK }} className="tnum">{inv.number || "—"}</b> &nbsp;·&nbsp; {fmtDate(inv.date)}
        </div>

        <div style={{ marginBottom: 16 }}>
          <span style={{ color: "#78716c", fontSize: 11.5, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>Sudah diterima dari</span>
          <b style={{ fontSize: 14.5 }}>{inv.customerName || "…………………………………"}</b>
        </div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: "#78716c", fontSize: 11.5, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>Untuk pembayaran</span>
          <span style={{ fontSize: 13.5 }}>
            {(inv.items || []).filter((i) => i.name).map((i) => `${i.name} (${i.qty}×)`).join(", ") || "…………………………………"}
          </span>
        </div>
        {inv.notes && (
          <p style={{ marginTop: 8, color: "#57534e", whiteSpace: "pre-wrap", fontSize: 11.5 }}>{inv.notes}</p>
        )}

        <div style={{ borderTop: "1px solid #d9cfc0", borderBottom: "1px solid #d9cfc0", padding: "15px 4px", margin: "20px 0", textAlign: "center" }}>
          <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#78716c", marginBottom: 6 }}>Terbilang</div>
          <div style={{ fontFamily: displayFont, fontStyle: "italic", fontSize: 20, lineHeight: 1.5 }}>
            “{terbilang(nominal, cur)}”
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "8px 0 24px" }}>
          <div style={{ fontSize: 33, fontWeight: 800, letterSpacing: "-0.01em" }} className="tnum">
            <Money v={nominal} cur={cur} />
          </div>
          {dpi && (
            <div style={{ marginTop: 4, fontSize: 11, color: "#57534e" }} className="tnum">
              (Total <Money v={totals.total} cur={cur} /> − DP <Money v={dpi.dp} cur={cur} />)
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginTop: 8 }}>
          {needsMaterai ? (
            <div style={{ border: "1.5px dashed #a8a29e", borderRadius: 6, width: 124, height: 148, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#a8a29e", textAlign: "center", lineHeight: 1.7 }}>
              ZONA<br />MATERAI<br /><br />Rp10.000
            </div>
          ) : <div style={{ width: 124 }} />}
          <div style={{
            border: `3px double ${stamp.color}`, color: stamp.color, borderRadius: "50%",
            width: 128, height: 128, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, letterSpacing: "0.14em", fontSize: st === "lunas" ? 17 : 12,
            transform: "rotate(-8deg)", textAlign: "center", lineHeight: 1.4, padding: 8,
          }}>
            {stamp.text}
          </div>
          {showSignature ? (
            <div style={{ textAlign: "center", fontSize: 12, color: "#57534e" }}>
              {fmtDate(inv.date)}
              <div style={{ borderTop: "1px solid #a8a29e", marginTop: 60, paddingTop: 6, minWidth: 160 }}>( Penerima )</div>
            </div>
          ) : <div style={{ width: 160 }} />}
        </div>
      </div>
    </div>
  );
}
