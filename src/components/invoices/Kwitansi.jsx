// Style 4 — Elegant Kwitansi (A5). Formal Indonesia: "Sudah diterima dari",
// terbilang serif italic, jumlah dalam bingkai, zona materai ≥ Rp5jt (UU 10/2020),
// stempel LUNAS, logo kecil di atas, signature tempat & tanggal.
import { Money, ShopLogo, fmtD } from "./shared.jsx";
import { terbilang, fmtDate } from "../../lib/format.js";

export default function Kwitansi({ inv, profile, totals, bodyFont, accent }) {
  const a = accent || "#0d9488";
  const cur = inv.currency || "IDR";
  const needsMaterai = cur === "IDR" && totals.total >= 5000000;
  const serif = "'Fraunces', Georgia, serif";
  return (
    <div style={{ fontFamily: bodyFont, width: "100%", padding: "28px 32px", color: "#1c1917", background: "#fff", fontSize: 12, lineHeight: 1.7 }}>
      {/* Kop */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <ShopLogo logo={profile.logo} size={54} radius={12} style={{ margin: "0 auto 10px" }} />
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.02em" }}>{profile.shopName || "Nama Usaha"}</div>
        {(profile.address || profile.contact) && (
          <div style={{ color: "#78716c", fontSize: 10.5, marginTop: 3, whiteSpace: "pre-line" }}>
            {[profile.address, profile.contact].filter(Boolean).join("  ·  ")}
          </div>
        )}
      </div>
      <div style={{ borderTop: "2px solid #1c1917", borderBottom: "1px solid #d6d3d1", height: 4, margin: "10px 0 18px" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.18em" }}>KWITANSI</span>
        <span style={{ fontSize: 11, color: "#78716c" }}>
          No. <b style={{ color: "#1c1917", fontVariantNumeric: "tabular-nums" }}>{inv.number || "—"}</b>
        </span>
      </div>

      <div style={{ marginTop: 18 }}>
        <p>
          <span style={{ color: "#78716c" }}>Sudah diterima dari</span><br />
          <b style={{ fontSize: 13.5 }}>{inv.customerName || "…………………………………"}</b>
        </p>
        <p style={{ marginTop: 12 }}><span style={{ color: "#78716c" }}>Uang sejumlah</span></p>
        <div style={{ border: "1px solid #d6d3d1", borderRadius: 8, background: "#fafaf9", padding: "10px 16px", marginTop: 4 }}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 14, textTransform: "capitalize" }}>
            “{terbilang(totals.total, cur)}”
          </p>
        </div>
        <p style={{ marginTop: 12 }}>
          <span style={{ color: "#78716c" }}>Untuk pembayaran</span><br />
          {(inv.items || []).filter((i) => i.name).map((i) => `${i.name} (${i.qty}×)`).join(", ") || "…………………………………"}
        </p>
        {inv.notes && (
          <p style={{ marginTop: 8, color: "#57534e", whiteSpace: "pre-wrap", fontSize: 11.5 }}>{inv.notes}</p>
        )}
      </div>

      {/* Jumlah + LUNAS + materai */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 22, gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#78716c", fontWeight: 600 }}>Jumlah</div>
          <Money v={totals.total} cur={cur} style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: "tabular-nums" }} />
          {needsMaterai && (
            <div style={{ marginTop: 10, border: "1px dashed #a8a29e", borderRadius: 8, padding: "8px 10px", maxWidth: 190, textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#78716c", fontWeight: 600 }}>Zona materai</div>
              <div style={{ fontSize: 10, color: "#57534e", marginTop: 2 }}>Rp10.000: tempel & tanda tangan di sini</div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              border: `2.5px solid ${a}`,
              color: a,
              borderRadius: 8,
              padding: "6px 18px",
              fontWeight: 800,
              letterSpacing: "0.28em",
              fontSize: 15,
              transform: "rotate(-8deg)",
              opacity: 0.92,
            }}
          >
            LUNAS
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 11.5, color: "#57534e", minWidth: 130 }}>
          <p>{fmtDate(inv.date)}</p>
          <p style={{ marginTop: 4 }}>{profile.shopName || "Hormat kami,"}</p>
          <div style={{ height: 60 }} />
          <p style={{ borderTop: "1px solid #a8a29e", paddingTop: 4 }}>( ………………………… )</p>
        </div>
      </div>

      <p style={{ fontSize: 10, color: "#a8a29e", marginTop: 20, fontStyle: "italic", textAlign: "center" }}>
        Simpan kwitansi ini sebagai bukti pembayaran yang sah.
      </p>
    </div>
  );
}
