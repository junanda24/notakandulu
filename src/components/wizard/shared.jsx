// Helper bersama untuk step-step wizard pembuatan nota.
import { useState } from "react";
import { Collapse } from "../ui.jsx";
import { blankItem } from "../../lib/calc.js";
import { uid } from "../../lib/format.js";

export const UNITS = ["pcs", "box", "pak", "lusin", "kodi", "kg", "gram", "liter", "meter", "m2", "jam", "hari", "minggu", "sesi", "kali", "orang", "porsi", "lot", "paket", "set", "unit"];
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

export function sampleInvoice() {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);
  const iso = (d) => d.toISOString().slice(0, 10);
  return {
    number: "INV-2026-001",
    date: iso(today),
    dueDate: iso(due),
    status: "belum",
    currency: "IDR",
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
    paymentIds: [],
    items: [
      { id: uid(), name: "Kopi Arabika 200g", qty: 2, unit: "pak", price: 85000 },
      { id: uid(), name: "Kopi Robusta 500g", qty: 1, unit: "pak", price: 120000 },
      { id: uid(), name: "Jasa roasting", qty: 3, unit: "jam", price: 45000 },
      { id: uid(), name: "Tumbler stainless 500ml", qty: 4, unit: "pcs", price: 95000 },
    ],
  };
}

// Data contoh lengkap: semua field invoice terisi + patch profil (toko & pembayaran
// contoh hanya diisi kalau masih kosong — data asli user tidak ditimpa).
export function sampleAll(profile) {
  const inv = sampleInvoice();
  const p = profile || {};
  const profilePatch = {};
  if (!p.shopName?.trim()) {
    profilePatch.shopName = "Kopi Junan";
    profilePatch.shopInfo = "Jl. Ruko No. 12, Batam\n0812-0000-1111";
  }
  if (!(p.payments || []).length) {
    profilePatch.payments = [{ id: "pay-sample", label: "BCA", number: "8210123456", holder: "Kopi Junan" }];
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
