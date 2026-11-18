import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Receipt, Wallet, Package, CalendarClock } from 'lucide-react';
import type { Purchase } from '../types';
import { CATEGORIES } from '../lib/units';
import { buildRangeRows, spendByBrand, spendByCategory, totalSpend } from '../lib/analytics';
import { formatDate, formatUnitPrice, formatVND } from '../lib/format';
import { normalizedUnitPrice } from '../lib/units';

const PALETTE = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b', '#14b8a6'];

interface Props {
  purchases: Purchase[];
}

export function AnalyticsView({ purchases }: Props) {
  const [rangeBy, setRangeBy] = useState<'product' | 'brand'>('product');
  const [trendKey, setTrendKey] = useState('');

  const kpis = useMemo(() => {
    const spend = totalSpend(purchases);
    const countByCat = new Map<string, number>();
    for (const p of purchases) {
      countByCat.set(p.categoryId, (countByCat.get(p.categoryId) ?? 0) + 1);
    }
    const topCat = [...countByCat.entries()].sort((a, b) => b[1] - a[1])[0];
    // average monthly spend over the span of data
    const dates = purchases.map((p) => p.date).sort();
    let months = 1;
    if (dates.length > 1) {
      const first = new Date(dates[0] + 'T00:00:00');
      const last = new Date(dates[dates.length - 1] + 'T00:00:00');
      months = Math.max(
        1,
        (last.getFullYear() - first.getFullYear()) * 12 +
          (last.getMonth() - first.getMonth()) +
          1,
      );
    }
    return {
      spend,
      count: purchases.length,
      topCategory: topCat ? CATEGORIES[topCat[0] as keyof typeof CATEGORIES].label : '—',
      avgMonthly: spend / months,
    };
  }, [purchases]);

  const rangeRows = useMemo(() => buildRangeRows(purchases, rangeBy), [purchases, rangeBy]);
  const catSpend = useMemo(() => spendByCategory(purchases), [purchases]);
  const brandSpend = useMemo(() => spendByBrand(purchases), [purchases]);

  // Trend selector options: "brand::product" for each product, or "brand:X"
  const trendOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const p of purchases) {
      const pv = `${p.brand}::${p.product}`;
      if (!seen.has(pv)) {
        seen.add(pv);
        opts.push({ value: pv, label: `${p.product} — ${p.brand}` });
      }
      const bv = `brand:${p.brand}`;
      if (!seen.has(bv)) {
        seen.add(bv);
        opts.push({ value: bv, label: `Toàn bộ ${p.brand}` });
      }
    }
    return opts.sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  }, [purchases]);

  const trendData = useMemo(() => {
    const key = trendKey || trendOptions[0]?.value || '';
    const [brand, product] = key.includes('::')
      ? key.split('::')
      : [key.replace('brand:', ''), ''];
    const items = purchases
      .filter(
        (p) =>
          p.brand === brand &&
          (!key.includes('::') || p.product === product),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    const unit = items[0] ? CATEGORIES[items[0].categoryId].standardUnit : '';
    return items.map((p) => ({
      date: formatDate(p.date),
      price: Math.round(normalizedUnitPrice(p)),
      unit,
    }));
  }, [purchases, trendKey, trendOptions]);

  const kpiCards = [
    { label: 'Tổng chi tiêu', value: formatVND(kpis.spend), Icon: Wallet },
    { label: 'Số giao dịch', value: kpis.count.toLocaleString('vi-VN'), Icon: Receipt },
    { label: 'Danh mục mua nhiều nhất', value: kpis.topCategory, Icon: Package },
    { label: 'Chi tiêu TB/tháng', value: formatVND(kpis.avgMonthly), Icon: CalendarClock },
  ];

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiCards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Icon size={16} className="text-emerald-600" />
              <p className="text-xs font-medium">{label}</p>
            </div>
            <p className="mt-1 truncate text-lg font-bold text-slate-800 md:text-xl">{value}</p>
          </div>
        ))}
      </div>

      {/* Min-Avg-Max range table */}
      <section className="rounded-2xl bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
          <h2 className="mr-auto text-base font-semibold text-slate-800">
            Khoảng giá Min – Avg – Max
          </h2>
          <div className="flex rounded-lg border border-slate-200 p-0.5 text-sm">
            {(['product', 'brand'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setRangeBy(b)}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  rangeBy === b ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {b === 'product' ? 'Theo sản phẩm' : 'Theo thương hiệu'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Sản phẩm / Brand</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Thương hiệu</th>
                <th className="px-4 py-3 text-center">SL lần</th>
                <th className="px-4 py-3 text-right">Giá Min</th>
                <th className="px-4 py-3 text-right">Giá Avg</th>
                <th className="px-4 py-3 text-right">Giá Max</th>
                <th className="px-4 py-3 text-right">Lần cuối trả</th>
                <th className="px-4 py-3 w-44">Vị trí giá</th>
              </tr>
            </thead>
            <tbody>
              {rangeRows.map((r) => {
                const span = r.max - r.min || 1;
                const lastPos = Math.min(100, Math.max(0, ((r.last - r.min) / span) * 100));
                const avgPos = Math.min(100, Math.max(0, ((r.avg - r.min) / span) * 100));
                return (
                  <tr key={r.key} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{r.label}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {CATEGORIES[r.categoryId].label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{r.brand}</td>
                    <td className="px-4 py-2.5 text-center text-slate-700">{r.count}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">
                      {formatVND(r.min)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-800">
                      {formatVND(r.avg)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-700">
                      {formatVND(r.max)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                        {formatUnitPrice(r.last, r.unit)}
                      </span>
                      <span className="ml-1 text-xs text-slate-400">{formatDate(r.lastDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="relative h-2 rounded-full bg-slate-100">
                        {/* avg tick */}
                        <div
                          className="absolute top-[-3px] h-3.5 w-0.5 bg-slate-400"
                          style={{ left: `${avgPos}%` }}
                          title="Avg"
                        />
                        {/* last-price marker */}
                        <div
                          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500 shadow"
                          style={{ left: `${lastPos}%` }}
                          title={`Lần cuối: ${formatVND(r.last)}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-base font-semibold text-slate-800">
              Xu hướng đơn giá chuẩn
            </h2>
            <select
              className="max-w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800"
              value={trendKey || trendOptions[0]?.value || ''}
              onChange={(e) => setTrendKey(e.target.value)}
            >
              {trendOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => [
                    `${Number(v).toLocaleString('vi-VN')} ₫${trendData[0]?.unit ? '/' + trendData[0].unit : ''}`,
                    'Đơn giá',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-800">
            Chi tiêu theo danh mục
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catSpend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}tr`}
                />
                <Tooltip formatter={(v) => [formatVND(Number(v)), 'Chi tiêu']} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {catSpend.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-slate-800">
            Chi tiêu theo thương hiệu
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandSpend}
                  dataKey="total"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  label={(props) => {
                    const { payload, percent } = props as {
                      payload?: { label?: string };
                      percent?: number;
                    };
                    const name = payload?.label ?? '';
                    return `${name} ${((percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {brandSpend.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [formatVND(Number(v)), 'Chi tiêu']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
