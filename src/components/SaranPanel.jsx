// Tab Saran: form kritik & saran (Google Form) + donasi GoPay.
import { useState } from "react";
import { Card } from "./ui.jsx";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe5svN3Phkm9psM7a3MkoyV9Nlrn8m25RmuUW5wITlhQlMgeg/viewform?embedded=true";
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
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          Ada yang kurang, ada ide fitur, atau nemu bug? Isi form di bawah, pasti dibaca developer.
        </p>
        <div className="rounded-xl overflow-hidden border border-line bg-white" style={{ height: 560 }}>
          <iframe
            src={FORM_URL}
            title="Form Kritik dan Saran TagihkanDulu"
            className="w-full h-full"
            frameBorder="0"
            loading="lazy"
          >
            Memuat form…
          </iframe>
        </div>
        <a
          href={FORM_OPEN}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Buka form di tab baru →
        </a>
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
