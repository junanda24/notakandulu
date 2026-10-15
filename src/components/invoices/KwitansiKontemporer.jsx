// Template — Kwitansi Kontemporer: minimal modern tanpa bingkai.
// Aksen emerald, terbilang di pita tint, stempel pill DINAMIS ikut status.
import { Money, ShopLogo, ShopTagline, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";
import { paymentStatus } from "../../lib/calc.js";

const INK = "#10201A";
const TINT = "#E4EFE9";

const STAMPS = {
  lunas: { text: "LUNAS", color: "#0F6B4F" },
  belum: { text: "BELUM LUNAS", color: "#b45309" },
  lewat: { text: "LEWAT TEMPO", color: "#dc2626" },
};

export default function KwitansiKontemporer({ inv, profile, totals, bodyFont, displayFont, accent, showSignature }) {
  const a = accent || "#0F6B4F";
  const cur = inv.currency || "IDR";
  const dpi = dpInfo(inv, totals);
  const nominal = dpi ? dpi.sisa : totals.total;
  const needsMaterai = cur === "IDR" && totals.total >= 5000000;
  // Stempel mengikuti status pembayaran aktual.
  const st = paymentStatus(inv) || "belum";
  const stamp = STAMPS[st] || STAMPS.belum;
  const stampColor = st === "lunas" ? a : stamp.color;

  return (
    <div style={{ fontFamily: bodyFont, background: "#fff", padding: "48px 56px", color: INK, fontSize: 12.5, lineHeight: 1.65 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ShopLogo logo={profile.logo} size={44} radius={10} />
            <div>
              <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 18 }}>{profile.shopName || "Nama Usaha"}</div>
              <ShopTagline profile={profile} />
            </div>
          </div>
          {(profile.address || profile.contact) && (
            <div style={{ fontSize: 11, color: "#78716c", marginTop: 8 }}>
              {[profile.address, profile.contact].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: "0.3em", fontWeight: 700 }}>KWITANSI</div>
          <div style={{ fontSize: 11.5, color: "#78716c", marginTop: 6, lineHeight: 1.7 }} className="tnum">
            No. <b style={{ color: INK }}>{inv.number || "—"}</b><br />{fmtDate(inv.date)}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 6 }}>
        {[
          ["Diterima dari", inv.customerName || "…………………………………", true],
          ["Untuk pembayaran", (inv.items || []).filter((i) => i.name).map((i) => `${i.name} (${i.qty}×)`).join(", ") || "…………………………………", false],
        ].map(([k, v, bold]) => (
          <div key={k} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid #f0eeea", fontSize: 13 }}>
            <span style={{ width: 160, flexShrink: 0, color: "#78716c", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, paddingTop: 2 }}>{k}</span>
            <span style={{ fontWeight: bold ? 700 : 500 }}>{v}</span>
          </div>
        ))}
        {inv.notes && (
          <p style={{ marginTop: 10, color: "#57534e", whiteSpace: "pre-wrap", fontSize: 11.5 }}>{inv.notes}</p>
        )}
      </div>

      <div style={{ margin: "26px 0 4px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#78716c", fontWeight: 600 }}>Jumlah diterima</div>
        <div style={{ fontFamily: displayFont, fontSize: 35, fontWeight: 700, marginTop: 4 }} className="tnum">
          <Money v={nominal} cur={cur} />
        </div>
        {dpi && (
          <div style={{ marginTop: 4, fontSize: 11, color: "#57534e" }} className="tnum">
            (Total <Money v={totals.total} cur={cur} /> − DP <Money v={dpi.dp} cur={cur} />)
          </div>
        )}
      </div>

      <div style={{ background: TINT, borderRadius: 10, padding: "15px 20px", margin: "16px 0 28px" }}>
        <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a7263", fontWeight: 700, marginBottom: 5 }}>Terbilang</div>
        <div style={{ fontStyle: "italic", fontSize: 14.5, color: INK }}>“{terbilang(nominal, cur)}”</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        {needsMaterai ? (
          <div style={{ border: "1.5px dashed #d6d3d1", borderRadius: 8, padding: "12px 16px", fontSize: 10.5, color: "#a8a29e", textAlign: "center", lineHeight: 1.6 }}>
            Zona materai<br />Rp10.000
          </div>
        ) : <div />}
        <div style={{
          display: "inline-block", border: `2.5px solid ${stampColor}`, color: stampColor,
          borderRadius: 999, padding: "9px 26px", fontWeight: 800, letterSpacing: "0.2em",
          fontSize: 13, transform: "rotate(-6deg)", fontFamily: displayFont,
        }}>
          {stamp.text}
        </div>
        {showSignature ? (
          <div style={{ textAlign: "center", fontSize: 12, color: "#57534e" }}>
            {fmtDate(inv.date)}
            <div style={{ borderTop: "1px solid #d6d3d1", marginTop: 56, paddingTop: 6, minWidth: 150 }}>( Penerima )</div>
          </div>
        ) : <div />}
      </div>
    </div>
  );
}
