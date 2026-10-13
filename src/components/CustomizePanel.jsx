// Panel kustomisasi: template, font, aksen, pola nomor.
import { Field, Select, TextInput, Card } from "./ui.jsx";
import { TEMPLATES, FONTS, ACCENT_PRESETS, PAPER_WIDTH } from "../data/options.js";
import { NUMBER_PATTERNS } from "../lib/format.js";

export default function CustomizePanel({ settings, setSettings }) {
  const set = (patch) => setSettings((p) => ({ ...p, ...patch }));
  return (
    <div className="space-y-4">
      <Card title="🎨 Template Nota" sticker="6 gaya">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPLATES.map((t) => {
            const active = settings.template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => set({ template: t.id })}
                className={`rounded-lg border-2 p-3 text-left transition ${active ? "border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50 dark:bg-indigo-950" : "border-line hover:border-neutral-400"}`}
              >
                <p className="text-xs font-bold">{t.name}</p>
                <p className="font-mono2 text-[10px] text-neutral-500 mt-0.5">{t.desc} · {PAPER_WIDTH[t.paper]}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="✒️ Font Nota">
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => {
            const active = settings.font === f.id;
            return (
              <button
                key={f.id}
                onClick={() => set({ font: f.id })}
                style={{ fontFamily: f.body }}
                className={`rounded-lg border-2 p-3 text-left text-sm transition ${active ? "border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50 dark:bg-indigo-950" : "border-line hover:border-neutral-400"}`}
              >
                {f.name}
                <span className="block text-lg font-bold">Ag</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="🌈 Warna Aksen">
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
            🎨
            <input type="color" value={settings.accent} onChange={(e) => set({ accent: e.target.value })} className="h-6 w-8 cursor-pointer bg-transparent border-none p-0" />
          </label>
        </div>
      </Card>

      <Card title="✒️ Tanda Tangan">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm">Tampilkan kolom tanda tangan di nota <span className="text-neutral-500">(kecuali struk & kwitansi)</span></span>
          <input
            type="checkbox"
            checked={!!settings.showSignature}
            onChange={(e) => set({ showSignature: e.target.checked })}
            className="h-5 w-5 accent-indigo-600"
          />
        </label>
      </Card>

      <Card title="🔢 Pola Nomor Nota">
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
        <Field label="Atau tulis pola sendiri — {YYYY} tahun, {MM} bulan, {N…} nomor urut" className="mt-3">
          <TextInput value={settings.numberPattern} onChange={(e) => set({ numberPattern: e.target.value })} placeholder="INV-{YYYY}-{NNN}" className="font-mono2 text-xs" />
        </Field>
      </Card>
    </div>
  );
}
