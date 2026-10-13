// Template J — Kwitansi Klasik Indonesia.
// "Sudah terima dari", terbilang gaya #…#, kotak materai, cap LUNAS.
import { Money, ShopLogo, dpInfo } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";
import { paymentStatus } from "../../lib/calc.js";

export default function KwitansiKlasik({ inv, profile, totals, accent }) {
  const a = accent || "#1c1917";
  const cur = inv.currency || "IDR";
  const dpi = dpInfo(inv, totals);
  const nominal = dpi ? dpi.sisa : totals.total;
  const needsMaterai = cur === "IDR" && totals.total >= 5000000;
  const st = paymentStatus(inv);
  const serif = "'Georgia', 'Times New Roman', serif";
  const mono = "'IBM Plex Mono', monospace";
  return (
    <div style={{ background: "#fffef7", color: "#1c1917", padding: 14, fontSize: 12, lineHeight: 1.7 }}>
      <div style={{ border: "3px double #1c1917", padding: "30px 28px", position: "relative" }}>
        <div style={{ textAlign: "center" }}>
          <ShopLogo logo={profile.logo} size={46} radius={10} style={{ margin: "0 auto 8px" }} />
          <div style={{ fontWeight: 800, fontSize: 15 }}>{profile.shopName || "Nama Usaha"}</div>
          {(profile.address || profile.contact) && (
            <div style={{ fontSize: 10, color: "#57534e", marginTop: 2, whiteSpace: "pre-line", fontFamily: mono }}>
              {[profile.address, profile.contact].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", fontWeight: 800, fontSize: 24, letterSpacing: 4, marginTop: 18, color: a }}>KWITANSI</div>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#57534e", marginTop: 4, fontFamily: mono, fontVariantNumeric: "tabular-nums" }}>
          No. {(inv.number || "—").replace(/^INV/i, "KWT")} · {fmtDate(inv.date)}
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", gap: 8 }}><span style={{ color: "#57534e" }}>Sudah terima dari:</span><b>{inv.customerName || "—"}</b></div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <span style={{ color: "#57534e" }}>Uang sejumlah:</span>
            <b style={{ fontFamily: mono, fontVariantNumeric: "tabular-nums" }}><Money v={nominal} cur={cur} /></b>
          </div>
          {cur === "IDR" && (
            <div style={{ fontFamily: serif, fontStyle: "italic", marginTop: 6 }}>
              Terbilang: <b># {terbilang(nominal)} #</b>
            </div>
          )}
          <div style={{ marginTop: 6 }}>
            <span style={{ color: "#57534e" }}>Untuk pembayaran:</span>{" "}
            <b>{(inv.items || []).map((it) => it.name).filter(Boolean).join(", ") || "—"}</b>
          </div>
          {dpi && (
            <div style={{ marginTop: 4, fontSize: 11, color: "#57534e", fontVariantNumeric: "tabular-nums", fontFamily: mono }}>
              (Total <Money v={totals.total} cur={cur} /> − DP <Money v={dpi.dp} cur={cur} />)
            </div>
          )}
          {inv.notes && <div style={{ marginTop: 6, fontSize: 11, color: "#57534e", whiteSpace: "pre-wrap" }}>{inv.notes}</div>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, gap: 12 }}>
          {needsMaterai ? (
            <div style={{ border: "1.5px dashed #a8a29e", width: 80, height: 104, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#a8a29e", textAlign: "center", fontFamily: mono }}>
              MATERAI<br />10.000
            </div>
          ) : <div style={{ width: 80 }} />}
          {st === "lunas" && (
            <div style={{ border: "2.5px solid #dc2626", color: "#dc2626", fontWeight: 800, letterSpacing: "0.12em", padding: "8px 24px", transform: "rotate(-8deg)", fontSize: 16, fontFamily: mono }}>
              LUNAS
            </div>
          )}
          <div style={{ textAlign: "center", fontSize: 10.5 }}>
            {fmtDate(inv.date).split(" ").slice(1).join(" ") || ""}, {fmtDate(inv.date)}<br /><br /><br />
            ( {profile.shopName || "................"} )
          </div>
        </div>
      </div>
    </div>
  );
}
