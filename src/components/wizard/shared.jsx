// Helper bersama untuk step-step wizard pembuatan nota.
import { useState } from "react";
import { Collapse } from "../ui.jsx";
import { blankItem } from "../../lib/calc.js";
import { uid } from "../../lib/format.js";

export const UNITS = ["pcs", "box", "dus", "pak", "lusin", "kodi", "kg", "gram", "liter", "meter", "m2", "jam", "hari", "minggu", "sesi", "kali", "orang", "porsi", "lot", "paket", "set", "unit"];
export const TERMS = ["Net 7", "Net 14", "Net 30", "Dibayar saat terima"];

export const STEP_IDS = ["data", "item", "gaya", "kirim"];
const STEP_TITLES = {
  data: "Data Toko & Pelanggan",
  item: "Item & Hitungan",
  gaya: "Gaya Nota",
  kirim: "Bayar & Kirim",
};
const STEP_SHORT = {
  data: "Data",
  item: "Item",
  gaya: "Gaya",
  kirim: "Kirim",
};

// Toko & Pelanggan digabung dalam satu step "Data" (dipisah section) — 4 step lebih lega.
export function getSteps() {
  return STEP_IDS.map((id) => ({ id, title: STEP_TITLES[id], short: STEP_SHORT[id] }));
}

// 4 persona data contoh — tiap klik tombol "Isi data contoh" bergilir ke persona
// berikutnya, biar user bisa lihat nota dari jenis usaha berbeda. Semua persona
// mengisi SEMUA field (sesuai permintaan: NPWP, no. PO, pajak, diskon, ongkir, DP).
const SAMPLE_PERSONAS = [
  {
    shopName: "Kopi Junan",
    shopInfo: "Jl. Ruko No. 12, Batam\n0812-0000-1111",
    payLabel: "BCA",
    payNumber: "8210123456",
    payHolder: "Kopi Junan",
    customerName: "Budi Santoso",
    customerInfo: "Jl. Kenangan No. 5, Batam\n0812-3456-7890",
    customerNpwp: "01.234.567.8-901.000",
    poNumber: "PO-2026-042",
    tax: 11,
    discount: { type: "percent", value: 5 },
    shipping: 15000,
    dp: 50000,
    terms: "Net 14",
    notes: "Terima kasih atas kepercayaan Anda!\nPembayaran maksimal 14 hari setelah invoice diterbitkan.",
    items: [
      ["Kopi Arabika 200g", 2, "pak", 85000],
      ["Kopi Robusta 500g", 1, "pak", 120000],
      ["Jasa roasting", 3, "jam", 45000],
      ["Tumbler stainless 500ml", 4, "pcs", 95000],
    ],
  },
  {
    shopName: "FreshWash Laundry",
    shopInfo: "Ruko Batam Center Blok B No. 8\n0812-7777-8888",
    payLabel: "GoPay",
    payNumber: "0822-1111-2222",
    payHolder: "FreshWash Laundry",
    customerName: "Siti Rahma",
    customerInfo: "Perumahan Griya Asri Blok C/14, Batam\n0857-1234-5678",
    customerNpwp: "03.456.789.0-215.000",
    poNumber: "PO/LND-2026-011",
    tax: 0,
    discount: { type: "flat", value: 10000 },
    shipping: 20000,
    dp: 30000,
    terms: "Net 7",
    notes: "Pakaian diambil maksimal 3 hari setelah pemberitahuan.\nKlaim kerusakan maksimal 24 jam setelah pengambilan.",
    items: [
      ["Cuci setrika reguler", 5, "kg", 9000],
      ["Karpet 2x3 meter", 1, "m2", 45000],
      ["Boneka besar", 1, "pcs", 35000],
      ["Setrika satuan", 8, "pcs", 4000],
    ],
  },
  {
    shopName: "Bengkel Berkah Motor",
    shopInfo: "Jl. Raya Tiban No. 45, Batam\n0813-9999-0000",
    payLabel: "BNI",
    payNumber: "8123456789",
    payHolder: "Bengkel Berkah Motor",
    customerName: "Agus Wijaya",
    customerInfo: "Jl. Pembangunan No. 22, Batam\n0821-4567-8910",
    customerNpwp: "04.567.890.1-216.000",
    poNumber: "PO/BKM-2026-023",
    tax: 11,
    discount: { type: "percent", value: 5 },
    shipping: 25000,
    dp: 100000,
    terms: "Net 14",
    notes: "Garansi servis 7 hari untuk pekerjaan yang sama.\nSparepart original, struk pembelian tersedia.",
    items: [
      ["Ganti oli + filter", 1, "paket", 95000],
      ["Tune up mesin", 1, "kali", 150000],
      ["Kampas rem depan", 1, "set", 85000],
      ["Lampu depan LED", 2, "pcs", 60000],
    ],
  },
  {
    shopName: "Dapur Ibu Rina",
    shopInfo: "Jl. Hang Lekiu Km 4, Batam\n0812-3333-4444",
    payLabel: "DANA",
    payNumber: "0812-3333-4444",
    payHolder: "Rina Marlina",
    customerName: "PT Maju Bersama",
    customerInfo: "Kawasan Industri Batamindo Blok F No. 3\n0778-612345",
    customerNpwp: "02.345.678.9-214.000",
    poNumber: "PO/MB/2026/118",
    tax: 11,
    discount: { type: "percent", value: 10 },
    shipping: 50000,
    dp: 500000,
    terms: "Net 30",
    notes: "Harga sudah termasuk box & sendok.\nPengiriman H-1 acara, konfirmasi ulang jumlah porsi.",
    items: [
      ["Nasi kotak ayam bakar", 120, "porsi", 25000],
      ["Snack box reguler", 120, "paket", 12000],
      ["Air mineral dus 600ml", 10, "dus", 48000],
      ["Tumpeng tampah", 2, "paket", 350000],
    ],
  },
];

let sampleIdx = 0;
function nextPersona() {
  const persona = SAMPLE_PERSONAS[sampleIdx % SAMPLE_PERSONAS.length];
  sampleIdx += 1;
  return persona;
}

function buildSampleInvoice(persona) {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + (persona.terms === "Net 30" ? 30 : persona.terms === "Net 7" ? 7 : persona.terms === "Net 14" ? 14 : 0));
  const iso = (d) => d.toISOString().slice(0, 10);
  return {
    number: "INV-2026-001",
    date: iso(today),
    dueDate: iso(due),
    status: "belum",
    currency: "IDR",
    customerName: persona.customerName,
    customerInfo: persona.customerInfo,
    customerNpwp: persona.customerNpwp,
    poNumber: persona.poNumber,
    tax: persona.tax,
    discount: { ...persona.discount },
    shipping: persona.shipping,
    dp: persona.dp,
    terms: persona.terms,
    notes: persona.notes,
    paymentIds: [],
    items: persona.items.map(([name, qty, unit, price]) => ({ id: uid(), name, qty, unit, price })),
  };
}

export function sampleInvoice() {
  return buildSampleInvoice(nextPersona());
}

// Data contoh lengkap: semua field invoice terisi + patch profil (toko & pembayaran
// contoh hanya diisi kalau masih kosong — data asli user tidak ditimpa).
export function sampleAll(profile) {
  const persona = nextPersona();
  const inv = buildSampleInvoice(persona);
  const p = profile || {};
  const profilePatch = {};
  if (!p.shopName?.trim()) {
    profilePatch.shopName = persona.shopName;
    profilePatch.shopInfo = persona.shopInfo;
  }
  if (!(p.payments || []).length) {
    profilePatch.payments = [{ id: "pay-sample", label: persona.payLabel, number: persona.payNumber, holder: persona.payHolder }];
    inv.paymentIds = ["pay-sample"];
  } else {
    inv.paymentIds = [p.payments[0].id];
  }
  return { inv, profilePatch };
}

export function useInvSet(setInv) {
  const set = (patch) => setInv((p) => ({ ...p, ...patch }));
  const setItem = (id, patch) =>
    setInv((p) => ({ ...p, items: p.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  const addItem = () => setInv((p) => ({ ...p, items: [...p.items, blankItem()] }));
  const delItem = (id) =>
    setInv((p) => ({ ...p, items: p.items.length > 1 ? p.items.filter((it) => it.id !== id) : p.items }));
  return { set, setItem, addItem, delItem };
}

export function Advanced({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-3">
      <button onClick={() => setOpen(!open)} className="text-[12px] font-bold text-teal-600 dark:text-teal-400 hover:underline">
        {open ? "▾" : "▸"} {title}
      </button>
      <Collapse open={open}>
        <div className="mt-2">{children}</div>
      </Collapse>
    </div>
  );
}
