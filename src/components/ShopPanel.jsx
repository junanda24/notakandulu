// Profil toko + kelola metode pembayaran.
import { useState } from "react";
import { Field, TextInput, Select, Card, Btn } from "./ui.jsx";
import { BANK_PRESETS, EWALLET_PRESETS, PAYMENT_TYPES } from "../data/options.js";
import { uid } from "../lib/format.js";

export default function ShopPanel({ profile, setProfile }) {
  const [showPay, setShowPay] = useState(false);
  const [logoErr, setLogoErr] = useState("");
  const set = (patch) => setProfile((p) => ({ ...p, ...patch }));

  // Upload logo: resize ke ≤512px di canvas, simpan data URL (PNG; JPEG 0.85 bila >400KB).
  const onLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLogoErr("");
    if (!file.type.startsWith("image/")) {
      setLogoErr("File harus gambar (PNG/JPG).");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const max = 512;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        let data = c.toDataURL("image/png");
        if (data.length > 400 * 1024) data = c.toDataURL("image/jpeg", 0.85);
        set({ logo: data });
      } catch {
        setLogoErr("Gagal memproses gambar.");
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setLogoErr("Gagal membaca gambar.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const [ptype, setPtype] = useState("bank");
  const [plabel, setPlabel] = useState(BANK_PRESETS[0]);
  const [pnumber, setPnumber] = useState("");
  const [pholder, setPholder] = useState("");
  const presets = ptype === "bank" ? BANK_PRESETS : ptype === "ewallet" ? EWALLET_PRESETS : [];

  const addPayment = () => {
    if (!pnumber.trim()) return;
    setProfile((p) => ({
      ...p,
      payments: [...(p.payments || []), { id: uid(), type: ptype, label: plabel, number: pnumber.trim(), holder: pholder.trim() }],
    }));
    setPnumber("");
    setPholder("");
  };
  const delPayment = (id) =>
    setProfile((p) => ({ ...p, payments: (p.payments || []).filter((x) => x.id !== id) }));

  return (
    <div className="space-y-4">
      <Card title="🏪 Profil Toko" sticker="sekali isi">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Nama toko / usaha">
            <TextInput value={profile.shopName} onChange={(e) => set({ shopName: e.target.value })} placeholder="cth: Kopi Senja" />
          </Field>
          <Field label="Tagline">
            <TextInput value={profile.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="cth: Ngopi santai tiap hari" />
          </Field>
        </div>
        <Field label="Alamat" className="mt-3">
          <TextInput value={profile.address} onChange={(e) => set({ address: e.target.value })} placeholder="Jl. ..." />
        </Field>
        <Field label="Kontak (HP / email / IG)" className="mt-3">
          <TextInput value={profile.contact} onChange={(e) => set({ contact: e.target.value })} placeholder="0812-... / @..." />
        </Field>
        <Field label="NPWP usaha (opsional)" className="mt-3">
          <TextInput value={profile.npwp || ""} onChange={(e) => set({ npwp: e.target.value })} placeholder="cth: 01.234.567.8-901.000" />
        </Field>
        <Field label="Logo usaha" className="mt-3">
          <div className="flex items-center gap-3">
            {profile.logo && (
              <img src={profile.logo} alt="Logo" className="h-14 w-14 rounded-xl object-contain border border-line bg-white p-1" />
            )}
            <div className="flex-1">
              <label className="inline-block cursor-pointer rounded-lg border border-line bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 px-3 py-2 text-sm font-medium hover:border-neutral-400">
                {profile.logo ? "Ganti logo" : "Upload logo"}
                <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
              </label>
              {profile.logo && (
                <button onClick={() => set({ logo: "" })} className="ml-2 text-sm text-red-600 underline">
                  hapus
                </button>
              )}
              <p className="mt-1 text-xs text-neutral-500">PNG/JPG, otomatis diresize ke ≤512px. Muncul di semua template nota.</p>
              {logoErr && <p className="mt-1 text-xs text-red-600">{logoErr}</p>}
            </div>
          </div>
        </Field>
      </Card>

      <Card title="💳 Metode Pembayaran" sticker={`${(profile.payments || []).length} tersimpan`}>
        <div className="space-y-2">
          {(profile.payments || []).map((p) => (
            <div key={p.id} className="brutal-sm rounded-lg bg-cream px-3 py-2 flex items-center justify-between gap-2">
              <div className="text-sm">
                <b>{p.label}</b> <span className="font-mono2 text-xs">· {p.number}</span>
                {p.holder && <span className="text-xs text-neutral-500"> a.n. {p.holder}</span>}
              </div>
              <button onClick={() => delPayment(p.id)} className="font-mono2 text-[10px] font-bold text-red-600 hover:underline shrink-0">
                hapus
              </button>
            </div>
          ))}
          {(profile.payments || []).length === 0 && (
            <p className="text-sm text-neutral-500">Belum ada. Tambahkan rekening bank / e-wallet di bawah.</p>
          )}
        </div>
        <button onClick={() => setShowPay(!showPay)} className="mt-3 font-mono2 text-xs font-bold underline">
          {showPay ? "− tutup form" : "+ tambah pembayaran"}
        </button>
        {showPay && (
          <div className="mt-3 space-y-2 border-t-2 border-dashed border-line pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Jenis">
                <Select value={ptype} onChange={(e) => { setPtype(e.target.value); setPlabel(e.target.value === "bank" ? BANK_PRESETS[0] : e.target.value === "ewallet" ? EWALLET_PRESETS[0] : ""); }}>
                  {PAYMENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
              </Field>
              <Field label="Nama">
                {presets.length ? (
                  <Select value={plabel} onChange={(e) => setPlabel(e.target.value)}>
                    {presets.map((x) => <option key={x} value={x}>{x}</option>)}
                  </Select>
                ) : (
                  <TextInput value={plabel} onChange={(e) => setPlabel(e.target.value)} placeholder="cth: Tunai" />
                )}
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nomor">
                <TextInput value={pnumber} onChange={(e) => setPnumber(e.target.value)} placeholder="1234567890" />
              </Field>
              <Field label="Atas nama">
                <TextInput value={pholder} onChange={(e) => setPholder(e.target.value)} placeholder="Nama pemilik" />
              </Field>
            </div>
            <Btn onClick={addPayment} primary className="w-full">Simpan pembayaran</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}
