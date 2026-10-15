// Invoice math: subtotal, discount, tax, shipping, total.

export function calcTotals(inv) {
  const items = inv.items || [];
  const subtotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
  const d = inv.discount || { type: "percent", value: 0 };
  // Clamp diskon persen 0–100 biar baris "Diskon −RpX" tidak melebihi subtotal.
  const discVal = d.type === "percent" ? Math.min(100, Math.max(0, Number(d.value) || 0)) : Math.max(0, Number(d.value) || 0);
  const discountAmt =
    d.type === "percent" ? (subtotal * discVal) / 100 : discVal;
  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const taxAmt = (afterDiscount * (Number(inv.tax) || 0)) / 100;
  const shipping = Number(inv.shipping) || 0;
  const total = Math.max(0, Math.round(afterDiscount + taxAmt + shipping));
  // Clamp DP 0–total biar tidak tampil "Uang muka −RpX" negatif.
  const dpRaw = Math.max(0, Number(inv.dp) || 0);
  const dp = Math.min(dpRaw, total);
  return {
    subtotal: Math.round(subtotal),
    discountAmt: Math.round(discountAmt),
    taxAmt: Math.round(taxAmt),
    shipping: Math.round(shipping),
    total,
    dp,
  };
}

export const blankItem = () => ({
  id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
  name: "",
  qty: 1,
  unit: "pcs",
  price: 0,
});

/** Status pembayaran nota: "lunas" | "lewat" (lewat tempo) | "belum" | null (nota lama tanpa status). */
export function paymentStatus(inv) {
  if (!inv || !("status" in inv) || !inv.status) return null;
  if (inv.status === "lunas") return "lunas";
  const today = new Date().toISOString().slice(0, 10);
  if (inv.dueDate && inv.dueDate < today) return "lewat";
  return "belum";
}

export const STATUS_META = {
  lunas: { label: "Lunas", badge: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200" },
  belum: { label: "Belum bayar", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200" },
  lewat: { label: "Lewat tempo", badge: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200" },
};

export function blankInvoice(overrides = {}) {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    number: "",
    date: new Date().toISOString().slice(0, 10),
    dueDate: "",
    status: "belum",
    dp: 0,
    terms: "",
    poNumber: "",
    customerName: "",
    customerInfo: "",
    customerNpwp: "",
    items: [blankItem()],
    discount: { type: "percent", value: 0 },
    tax: 0,
    shipping: 0,
    notes: "",
    currency: "IDR",
    paymentIds: [],
    ...overrides,
  };
}
