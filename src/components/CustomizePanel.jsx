// Panel kustomisasi: template, font, aksen, pola nomor.
import { useState } from "react";
import { Field, Select, TextInput, Card, Collapse } from "./ui.jsx";
import { TEMPLATES, FONTS, ACCENT_PRESETS, PAPER_WIDTH } from "../data/options.js";
import { NUMBER_PATTERNS, expandNumber, todayIso } from "../lib/format.js";
import { peekCounter } from "../lib/storage.js";

function Accordion({ title, sticker, summary, summaryStyle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="brutal">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between gap-2 p-4 sm:p-5 text-left">
        <h2 className="text-sm font-bold tracking-tight shrink-0">{title}</h2>
        <span className="flex items-center gap-2 min-w-0">
          {!open && summary && (
            <span className="truncate text-[11px] text-neutral-500 max-w-[150px]" style={summaryStyle}>{summary}</span>
          )}
          {sticker && (
            <span className="rounded-md bg-teal-600 px-2 py-0.5 font-mono2 text-[10px] font-bold text-white dark:bg-teal-500 shrink-0">
              {sticker}
            </span>
          )}
          <span className={`text-neutral-400 text-[11px] transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>▼</span>
        </span>
      </button>
      <Collapse open={open}>
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">{children}</div>
      </Collapse>
    </section>
  );
}

export default function CustomizePanel({ settings, setSettings }) {
  const set = (patch) => setSettings((p) => ({ ...p, ...patch }));
  const curTpl = TEMPLATES.find((t) => t.id === settings.template);
  const curFont = FONTS.find((f) => f.id === settings.font);
  return (
    <div className="space-y-4">
      <Accordion title="Template Nota" sticker={`${TEMPLATES.length} gaya`} summary={curTpl?.name}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPLATES.map((t) => {
            const active = settings.template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => set({ template: t.id })}
                className={`rounded-lg border-2 p-3 text-left transition ${active ? "border-teal-600 ring-2 ring-teal-600/20 bg-teal-50 dark:bg-teal-950" : "border-line hover:border-neutral-400"}`}
              >
                <p className="text-xs font-bold">{t.name}</p>
                <p className="font-mono2 text-[10px] text-neutral-500 mt-0.5">{t.desc} · {PAPER_WIDTH[t.paper]}</p>
              </button>
            );
          })}
        </div>
      </Accordion>

      <Accordion
        title="Font Nota"
        sticker={`${FONTS.length} font`}
        summary={curFont?.name}
        summaryStyle={curFont ? { fontFamily: curFont.body } : undefined}
      >
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => {
            const active = settings.font === f.id;
            return (
              <button
                key={f.id}
                onClick={() => set({ font: f.id })}
                style={{ fontFamily: f.body }}
                className={`rounded-lg border-2 p-3 text-left text-sm transition ${active ? "border-teal-600 ring-2 ring-teal-600/20 bg-teal-50 dark:bg-teal-950" : "border-line hover:border-neutral-400"}`}
              >
                {f.name}
                <span className="block text-lg font-bold" style={{ fontFamily: f.display }}>Ag</span>
              </button>
            );
          })}
        </div>
      </Accordion>

      <Card title="Warna Aksen">
        <div className="flex flex-wrap gap-2 items-center">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => set({ accent: c })}
              title={c}
              className={`h-9 w-9 rounded-lg border-2 transition ${settings.accent === c ? "border-ink shadow-[2px_2px_0_#141414] scale-110" : "border-line"}`}
              style={{ background: c }}
            />
          ))}
          <label className="brutal-sm rounded-lg bg-white dark:bg-neutral-800 px-2 py-1.5 font-mono2 text-[10px] font-bold cursor-pointer flex items-center gap-1.5">
            <input type="color" value={settings.accent} onChange={(e) => set({ accent: e.target.value })} className="h-6 w-8 cursor-pointer bg-transparent border-none p-0" />
          </label>
        </div>
      </Card>

      <Card title="Tanda Tangan">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm">Tampilkan kolom tanda tangan di nota <span className="text-neutral-500">(kecuali struk & kwitansi)</span></span>
          <input
            type="checkbox"
            checked={!!settings.showSignature}
            onChange={(e) => set({ showSignature: e.target.checked })}
            className="h-5 w-5 accent-teal-600"
          />
        </label>
      </Card>

      <Card title="Pola Nomor Nota">
        <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mb-3">
          Pola untuk <b>nomor otomatis</b>: tiap bikin nota baru, kolom "Nomor nota" langsung terisi
          mengikuti pola ini. Kamu tetap bisa ubah manual di langkah Isi Data.
        </p>
        <p className="mb-3 rounded-lg bg-cream dark:bg-neutral-800 px-3 py-2 font-mono2 text-[12px] font-bold">
          Nota berikutnya: <span className="text-teal-700 dark:text-teal-300">{expandNumber(settings.numberPattern || "INV-{YYYY}-{NNN}", peekCounter(), todayIso())}</span>
        </p>
        <Field label="Pilih pola">
          <Select value={settings.numberPattern} onChange={(e) => set({ numberPattern: e.target.value })}>
            {NUMBER_PATTERNS.map((p) => (
              <option key={p.id} value={p.pattern}>{p.label}</option>
            ))}
            {!NUMBER_PATTERNS.some((p) => p.pattern === settings.numberPattern) && (
              <option value={settings.numberPattern}>Kustom</option>
            )}
          </Select>
        </Field>
        <Field label="Atau tulis pola sendiri: {YYYY} tahun, {MM} bulan, {N…} nomor urut" className="mt-3">
          <TextInput value={settings.numberPattern} onChange={(e) => set({ numberPattern: e.target.value })} placeholder="INV-{YYYY}-{NNN}" className="font-mono2 text-xs" />
        </Field>
      </Card>
    </div>
  );
}
