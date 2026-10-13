// Invoice math: subtotal, discount, tax, shipping, total.

export function calcTotals(inv) {
  const items = inv.items || [];
  const subtotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
  const d = inv.discount || { type: "percent", value: 0 };
  const discountAmt =
    d.type === "percent" ? (subtotal * (Number(d.value) || 0)) / 100 : Number(d.value) || 0;
  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const taxAmt = (afterDiscount * (Number(inv.tax) || 0)) / 100;
  const shipping = Number(inv.shipping) || 0;
  const total = Math.max(0, Math.round(afterDiscount + taxAmt + shipping));
  return {
    subtotal: Math.round(subtotal),
    discountAmt: Math.round(discountAmt),
    taxAmt: Math.round(taxAmt),
    shipping: Math.round(shipping),
    total,
  };
}

export const blankItem = () => ({
  id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  qty: 1,
  price: 0,
});

export function blankInvoice(overrides = {}) {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    number: "",
    date: new Date().toISOString().slice(0, 10),
    customerName: "",
    customerInfo: "",
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
