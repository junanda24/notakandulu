// Tab Saran: form kritik & saran (Google Form) + donasi GoPay.
import { useState } from "react";
import { Card } from "./ui.jsx";

const FORM_OPEN = "https://forms.gle/4kzKHM1BRZ5dNZA79";
const GOPAY_NUMBER = "0857-6362-2979";

export default function SaranPanel() {
  const [copied, setCopied] = useState(false);
  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(GOPAY_NUMBER);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = GOPAY_NUMBER;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-4">
      <Card title="💬 Kritik & Saran" sticker="bantu kami">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Ada yang kurang, ada ide fitur, atau nemu bug? Klik tombol di bawah, isi formnya, pasti dibaca developer.
        </p>
        <a
          href={FORM_OPEN}
          target="_blank"
          rel="noreferrer"
          className="block w-full rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-center font-bold py-3.5 text-[15px] transition"
        >
          📝 Isi Form Kritik & Saran
        </a>
        <p className="text-[11px] text-neutral-400 mt-3 text-center">Dibuka di tab baru · Google Form</p>
      </Card>

      <Card title="☕ Dukung TagihkanDulu" sticker="sukarela">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          TagihkanDulu gratis, tanpa iklan, tanpa login. Kalau terbantu, traktir kopi via GoPay:
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-extrabold text-white"
            style={{ background: "#00aed6" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.25" />
              <path d="M7 10.5h10a3.5 3.5 0 0 1 0 7H9a3.5 3.5 0 0 1 0-7h8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            GoPay
          </span>
          <code className="font-mono2 text-base font-bold tracking-wide">{GOPAY_NUMBER}</code>
          <button
            onClick={copyNumber}
            className="brutal-btn rounded-lg px-3 py-1.5 text-xs font-bold"
          >
            {copied ? "✓ Tersalin!" : "Salin nomor"}
          </button>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-3">
          berapapun sangat berarti. Terima kasih 🙏
        </p>
      </Card>
    </div>
  );
}
