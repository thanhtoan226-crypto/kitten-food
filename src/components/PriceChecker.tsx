import { useMemo, useState } from 'react';
import { BadgeCheck, CircleAlert, Search, TrendingDown, TrendingUp } from 'lucide-react';
import type { CategoryId, Purchase } from '../types';
import { CATEGORIES, getUnit } from '../lib/units';
import { evaluateDeal, historicalStats } from '../lib/analytics';
import { formatPercent, formatUnitPrice } from '../lib/format';

interface Props {
  purchases: Purchase[];
  brandsFor: (c: CategoryId) => string[];
  productsFor: (c: CategoryId, b: string) => string[];
}

const selectCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none';
const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none';

export function PriceChecker({ purchases, brandsFor, productsFor }: Props) {
  const [categoryId, setCategoryId] = useState<CategoryId>('kibble');
  const [brand, setBrand] = useState('');
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState('');
  const [unitId, setUnitId] = useState('kg');
  const [price, setPrice] = useState('');

  const category = CATEGORIES[categoryId];
  const brands = brandsFor(categoryId);
  const products = brand ? productsFor(categoryId, brand) : [];

  const history = useMemo(() => {
    const filtered = purchases.filter(
      (p) =>
        p.categoryId === categoryId &&
        (!brand || p.brand === brand) &&
        (!product || p.product === product),
    );
    return historicalStats(filtered);
  }, [purchases, categoryId, brand, product]);

  const qtyNum = parseFloat(qty) || 0;
  const priceNum = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
  const factor = getUnit(categoryId, unitId).factor;
  const normalizedQty = qtyNum * factor;
  const prospectiveUnitPrice = normalizedQty > 0 ? priceNum / normalizedQty : 0;
  const { verdict, diffVsAvg } = evaluateDeal(prospectiveUnitPrice, history);

  const verdictUi = {
    good: {
      label: 'Giá tốt',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Icon: TrendingDown,
    },
    normal: {
      label: 'Giá bình thường',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
      Icon: BadgeCheck,
    },
    overpriced: {
      label: 'Giá cao',
      cls: 'bg-rose-50 text-rose-700 border-rose-200',
      Icon: TrendingUp,
    },
    'no-data': {
      label: 'Chưa có dữ liệu',
      cls: 'bg-slate-50 text-slate-600 border-slate-200',
      Icon: CircleAlert,
    },
  }[verdict];

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800">
        <Search size={18} className="text-emerald-600" />
        Kiểm tra giá nhanh
      </h2>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        <select
          className={selectCls}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value as CategoryId);
            setBrand('');
            setProduct('');
            setUnitId(CATEGORIES[e.target.value as CategoryId].units[0].id);
          }}
        >
          {Object.values(CATEGORIES).map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className={selectCls}
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setProduct('');
          }}
        >
          <option value="">— Chọn thương hiệu —</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          className={selectCls}
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          disabled={!brand}
        >
          <option value="">{brand ? '— TB của ' + brand + ' —' : '— Sản phẩm —'}</option>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          className={inputCls}
          type="number"
          min="0"
          step="any"
          placeholder="Số lượng"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <select className={selectCls} value={unitId} onChange={(e) => setUnitId(e.target.value)}>
          {category.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>

        <input
          className={inputCls}
          type="text"
          inputMode="numeric"
          placeholder="Giá đề xuất (₫)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {(qtyNum > 0 || priceNum > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prospectiveUnitPrice > 0 && (
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              {formatUnitPrice(prospectiveUnitPrice, category.standardUnit)}
              <span className="ml-1 text-xs font-normal text-slate-500">
                ({normalizedQty.toLocaleString('vi-VN')} {category.standardUnit})
              </span>
            </span>
          )}

          <span
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold ${verdictUi.cls}`}
          >
            <verdictUi.Icon size={15} />
            {verdictUi.label}
            {verdict === 'overpriced' && (
              <span className="font-normal">(+{formatPercent(diffVsAvg)} so với TB)</span>
            )}
            {verdict === 'good' && diffVsAvg < -0.001 && (
              <span className="font-normal">({formatPercent(diffVsAvg)} so với TB)</span>
            )}
          </span>

          {history && (
            <span className="text-xs text-slate-500">
              Lịch sử {history.count} lần: {formatUnitPrice(history.min, category.standardUnit)} –{' '}
              {formatUnitPrice(history.max, category.standardUnit)} (TB{' '}
              {formatUnitPrice(history.avg, category.standardUnit)})
            </span>
          )}
        </div>
      )}
      {!history && brand && (
        <p className="mt-2 text-xs text-slate-400">
          Chưa có lịch sử cho {product || brand} — hãy thêm giao dịch đầu tiên để so sánh.
        </p>
      )}
    </section>
  );
}
