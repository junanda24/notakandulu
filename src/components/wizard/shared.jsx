// Helper bersama untuk step-step wizard pembuatan nota.
import { useState } from "react";
import { blankItem } from "../../lib/calc.js";
import { uid } from "../../lib/format.js";

export const UNITS = ["pcs", "box", "pak", "lusin", "kodi", "kg", "gram", "liter", "meter", "m2", "jam", "hari", "minggu", "sesi", "kali", "orang", "porsi", "lot", "paket", "set", "unit"];
export const TERMS = ["Net 7", "Net 14", "Net 30", "Dibayar saat terima"];

export const STEP_IDS = ["toko", "pelanggan", "item", "gaya", "kirim"];
const STEP_TITLES = {
  toko: "Data Toko",
  pelanggan: "Pelanggan",
  item: "Item & Hitungan",
  gaya: "Gaya Nota",
  kirim: "Bayar & Kirim",
};

// Toko selalu jadi langkah pertama — user baru wajib lewat sini, user lama bisa klik untuk ubah.
export function getSteps(profile) {
  return STEP_IDS.map((id) => ({ id, title: STEP_TITLES[id] }));
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
    customerNpwp: "",
    poNumber: "",
    tax: 11,
    discount: { type: "percent", value: 0 },
    shipping: 0,
    dp: 0,
    terms: "Net 14",
    notes: "Terima kasih atas kepercayaan Anda!",
    paymentIds: [],
    items: [
      { id: uid(), name: "Kopi Arabika 200g", qty: 2, unit: "pcs", price: 85000 },
      { id: uid(), name: "Jasa roasting", qty: 3, unit: "jam", price: 45000 },
    ],
  };
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
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}
