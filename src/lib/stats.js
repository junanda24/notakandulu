// Statistik lokal (privacy-first): dihitung dari riwayat di perangkat,
// tanpa tracking pihak ketiga, tanpa network call.
import { calcTotals } from "./calc.js";
import { TEMPLATES } from "../data/options.js";

export function computeStats(history, settings) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let totalNominal = 0;
  let monthCount = 0;
  let monthNominal = 0;
  const tplCount = {};
  const perMonth = {};

  for (const h of history || []) {
    const t = calcTotals(h);
    // Nominal digabung apa adanya (campur mata uang dijumlah mentah — ditandai di UI)
    totalNominal += t.total;
    const mk = (h.date || "").slice(0, 7);
    perMonth[mk] = (perMonth[mk] || 0) + 1;
    if (mk === thisMonth) {
      monthCount += 1;
      monthNominal += t.total;
    }
    const tpl = h.templateUsed || settings.template;
    tplCount[tpl] = (tplCount[tpl] || 0) + 1;
  }

  let favTpl = null;
  let favN = 0;
  for (const [k, v] of Object.entries(tplCount)) {
    if (v > favN) { favN = v; favTpl = k; }
  }
  const favName = TEMPLATES.find((t) => t.id === favTpl)?.name || "—";

  // 6 bulan terakhir untuk mini bar
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key: k, label: d.toLocaleDateString("id-ID", { month: "short" }), count: perMonth[k] || 0 });
  }
  const maxBar = Math.max(1, ...months.map((m) => m.count));

  return {
    totalInvoices: (history || []).length,
    totalNominal,
    monthCount,
    monthNominal,
    favTplName: favName,
    months,
    maxBar,
  };
}
